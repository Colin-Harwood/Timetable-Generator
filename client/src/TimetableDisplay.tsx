interface TimetableDisplayProps {
    data: any;
}

const TimetableDisplay = ({ data }: TimetableDisplayProps) => {
    return (
        <div className="p-4 border rounded shadow">
            <h2>Your Generated Timetable</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default TimetableDisplay;