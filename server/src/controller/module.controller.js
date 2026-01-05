import { Module } from "../models/module.model.js"

const addModule = async (req, res) => {
    try {
        const newModule = new Module(req.body);
        await newModule.save();
        res.status(201).json(newModule);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error" });
    }
}

const updateModule = async (req, res) => {
    try {
        const { code, name, activityGroups } = req.body;

        // 1. Check if it exists and capture the document
        const existingModule = await Module.findOne({ code: code });
        if (!existingModule) {
            return res.status(404).json({ message: "No module found with that code" });
        }

        // 2. Validation Logic
        if (!code || !name) {
            return res.status(400).json({ message: "Code or name not entered" });
        }

        // Validate Nested Groups
        for (let i = 0; i < activityGroups.length; i++) {
            let activityGroup = activityGroups[i];

            if (!activityGroup.type || !activityGroup.groupName) {
                return res.status(400).json({ message: `Group at index ${i} entered incorrectly` });
            }

            // Corrected loop: iterate over the sessions array
            for (let l = 0; l < activityGroup.sessions.length; l++) {
                let session = activityGroup.sessions[l];

                if (!session.day || !session.startTime || !session.duration || !session.location) {
                    return res.status(400).json({ message: `Session ${l} in group ${i} entered incorrectly` });
                }
            }
        }

        // 3. Perform the Update
        const updatedDoc = await Module.findOneAndUpdate(
            { code: code }, 
            req.body, 
            { new: true, runValidators: true } 
        );

        res.status(200).json({ message: "Updated successfully", data: updatedDoc });

    } catch (error) {
        // 'error.message' extract the text from the Error object
        res.status(500).json({ message: error.message || error });
    }
}

const getModule = async (req, res) => {
    try {
        const { modules } = req.body;

        // Find all modules where the name is "IN" the provided array
        const modulesList = await Module.find({ 
            code: { $in: modules } 
        });

        // check if all modules were found
        if (modules.length !== modulesList.length) {

            //see which modules are missing
            const foundCodes = modulesList.map(m => m.code);
            const missing = modules.filter(code => !foundCodes.includes(code));

            return res.status(404).json({ 
                message: "One or more modules were not found",
                missingModules: missing 
            });

        }

        res.status(200).json({ modulesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteModule = async (req, res) => {
    try {
        const { code } = req.body

        if (!code) {
            return res.status(400).json({ message: "Module code is required for deletion." });
        }

        const deletedModule = await Module.findOneAndDelete({code: code});

        if (!deletedModule) {
            return res.status(404).json({ message: "Module not found. Nothing was deleted." });
        }

        res.status(200).json({ 
            message: "Successfully deleted", 
            data: deletedModule 
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

const fetchModuleList = async (req, res) => {
    try {
        const moduleList = await Module.distinct('code');

        res.status(200).json({moduleList});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//
// helpers
//

const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return (hours * 60) + minutes;
};

const doSessionsClash = (sessionA, sessionB) => {
    if (sessionA.day !== sessionB.day) return false;

    const startA = timeToMinutes(sessionA.startTime);
    const endA = startA + sessionA.duration; 

    const startB = timeToMinutes(sessionB.startTime);
    const endB = startB + sessionB.duration;

    return (startA < endB && endA > startB);
};

const checkClash = (currentSchedule, newGroup) => {
    for (const newSession of newGroup.sessions) {
        for (const scheduledItem of currentSchedule) {
            for (const existingSession of scheduledItem.sessions) {
                if (doSessionsClash(newSession, existingSession)) {
                    return true; // true if clash found
                }
            }
        }
    }
    return false; // no clash
};

// calculate scores to find best timetable
const calculateScore = (schedule) => {
    let score = 0;
    
    // The schedule is a list of Groups. We need a list of individual Sessions.
    let allSessions = [];
    schedule.forEach(group => {
        if (group.sessions) {
            allSessions.push(...group.sessions);
        }
    });

    // Now we map over the flattened sessions, which actually have a .day property
    const uniqueDays = new Set(allSessions.map(s => s.day));
    const daysFree = 5 - uniqueDays.size;
    score += (daysFree * 1000); 

    const sessionsByDay = {};
    
    // Group individual sessions by day
    allSessions.forEach(session => {
        if (!sessionsByDay[session.day]) sessionsByDay[session.day] = [];
        sessionsByDay[session.day].push(session);
    });

    for (const day in sessionsByDay) {
        const dailySessions = sessionsByDay[day];
        
        dailySessions.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

        // Calculate gaps
        for (let i = 0; i < dailySessions.length - 1; i++) {
            const currentSession = dailySessions[i];
            const nextSession = dailySessions[i+1];

            const currentEnd = timeToMinutes(currentSession.startTime) + currentSession.duration;
            const nextStart = timeToMinutes(nextSession.startTime);

            const gapMinutes = nextStart - currentEnd;
            
            if (gapMinutes > 0) {
                score -= gapMinutes; 
            }
        }
    }

    return score;
};

//
// MAIN CONTROLLER
//

const makeTimetable = async (req, res) => {
    try {
        const { modules } = req.body;

        // Fetch all data in one go
        // Use .lean() to get plain JS objects (faster than Mongoose docs)
        const dbModules = await Module.find({ code: { $in: modules } }).lean();

        // Validation if find everything
        if (dbModules.length !== modules.length) {
            return res.status(404).json({ message: "One or more modules not found." });
        }

        // Restructure Data into "Slots to Fill"
        let slotsToFill = [];

        dbModules.forEach(mod => {
            // Group this module's groups by their type
            const groupsByType = {};
            
            mod.activityGroups.forEach(group => {
                if (!groupsByType[group.type]) {
                    groupsByType[group.type] = [];
                }
                groupsByType[group.type].push(group);
            });

            // Convert these into slots
            for (const [type, options] of Object.entries(groupsByType)) {
                slotsToFill.push({
                    moduleCode: mod.code,
                    activityType: type,
                    options: options // Array of possible ActivityGroups
                });
            }
        });

        // Recursive Solver
        let validTimetables = [];

        const solve = (slotIndex, currentSchedule) => {
            // have filled every slot then BASE CASE
            if (slotIndex === slotsToFill.length) {
                validTimetables.push([...currentSchedule]);
                return;
            }

            // Get the current slot we need to fill
            const currentSlot = slotsToFill[slotIndex];

            // Loop through all options
            for (const option of currentSlot.options) {
                // Check for clashes
                if (!checkClash(currentSchedule, option)) {
                    // add if no clash
                    const entry = { 
                        moduleCode: currentSlot.moduleCode,
                        activityType: currentSlot.activityType,
                        ...option 
                    };
                    
                    solve(slotIndex + 1, [...currentSchedule, entry]);
                }
                // if clash we just do nothing
            }
        };

        // Start the solver
        solve(0, []);

        const scoredTimetables = validTimetables.map(schedule => {
            return {
                schedule: schedule,
                score: calculateScore(schedule)
            };
        });

        // sort to get highest score
        scoredTimetables.sort((a, b) => b.score - a.score);


        res.status(200).json({ 
            count: validTimetables.length,
            bestScore: scoredTimetables[0].score,
            timetable: scoredTimetables[0].schedule // highest score
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export { 
    addModule,
    updateModule,
    getModule,
    fetchModuleList,
    deleteModule,
    makeTimetable
};