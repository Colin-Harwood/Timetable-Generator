import './TimetableDisplay.css'

interface TimetableDisplayProps {
    data: any;
}

const TimetableDisplay = ({ data }: TimetableDisplayProps) => {

    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const flatSessions = data.timetable.flatMap((module: any) => 
        module.sessions.map((session: any) => ({
            moduleCode: module.moduleCode,
            type: module.activityType,
            day: session.day,
            startTime: session.startTime,
            location: session.location,
            duration: session.duration,
            id: session._id
        }))
    );

    const groupedByDay: Record<string, any[]> = {};

    flatSessions.forEach((session: any) => {
        const day = session.day;
        
        if (!groupedByDay[day]) {
            groupedByDay[day] = [];
        }
        
        groupedByDay[day].push(session);
    });

    Object.keys(groupedByDay).forEach((day) => {
        
        const daySessions = groupedByDay[day];

        daySessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });


    return (
        <div className="timetable-container">
            <h2>Your Generated Timetable</h2>
            
            <div className="days-wrapper">
                {DAYS.map((day) => {
                    
                    const sessions = groupedByDay[day];
                    
                    if (!sessions) return null;

                    return (
                        <div key={day} className="day-column">
                            <h3 className="day-header">{day}</h3>

                            <div className="sessions-list">
                                {sessions.map((session: any) => (
                                    <div key={session.id} className="session-card">
                                        <div className="time">
                                            {session.startTime} - {session.duration} mins
                                        </div>
                                        <div className="details">
                                            <strong>{session.moduleCode}</strong>
                                            <span> - {session.type}</span>
                                        </div>
                                        <div className="location">
                                            {session.location}
                                        </div>
                                        <br />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimetableDisplay;