import { useState, useEffect } from 'react'
import type { Module } from './types/module.types'
import './App.css'
import ModuleList from './ModuleList.tsx'
 
function App() {
  const [modules, setModules] = useState<Module[]>([]);



  return (
    <>
      <h1>Timetable Builder</h1>
      <h3>Build a timetable by simply selecting the modules you need</h3>
      <ModuleList/>
    </>
  )
}

export default App
