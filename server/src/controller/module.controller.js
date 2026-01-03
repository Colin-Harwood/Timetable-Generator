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

        res.status(200).json({ modulesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

export { 
    addModule,
    updateModule,
    getModule,
    fetchModuleList
};