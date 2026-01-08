import { useState, useEffect } from 'react'
// import type { Module } from './types/module.types'
import './App.css'
import ModuleList from './ModuleList.tsx'
import TimetableDisplay from './TimetableDisplay.tsx'
 
function App() {
    const [timetableData, setTimetableData] = useState<any | null>(null);

    return (
    <>
        <h1>Timetable Builder</h1>
        <h3>Build a timetable by simply selecting the modules you need</h3>
        {!timetableData ? (
            <ModuleList onTimetableGenerated={(data) => setTimetableData(data)}/>
        ) : (
            <div>
                <button onClick={() => setTimetableData(null)}>
                    Back to Selection
                </button>
                <TimetableDisplay data={timetableData} />
            </div>
      )}
    </>
    )
}

export default App
