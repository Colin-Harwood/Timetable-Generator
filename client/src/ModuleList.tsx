import { useState, useEffect } from 'react'
import './ModuleList.css'

interface ModuleListProps {
    onTimetableGenerated: (data: any) => void; // replace any with actual type later
}

const ModuleList = ({ onTimetableGenerated }: ModuleListProps) => {
    const [codes, setCodes] = useState<string[]>([]);
    const [selectedModules, setSelectedModules] = useState<string[]>([]) 
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //fetch the module names from the backend to display
    useEffect(() => {

        const fetchCodes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/modules/list`);

                if (!response.ok) {
                    throw new Error('Failed to fetch modules list');
                }

                const data = await response.json();
                setCodes(data.moduleList);

            } catch (error) {
                console.error("Error loading modules: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCodes();

    }, [])

    // when checkBoxes are updated add module to list or remove
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const code = e.target.name;
        const isChecked = e.target.checked;

        if (isChecked) {
            if (!selectedModules.includes(code)) {
                setSelectedModules([...selectedModules, code]);
            }
        } else {
            setSelectedModules(selectedModules.filter(item => item !== code));
        }
        
    }

    // submit the module codes to the timetable generator url and get the timetable
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // send modules to backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/modules/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({ modules: selectedModules }), 
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Success:", result);

            onTimetableGenerated(result);

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (isLoading) return <p>Loading...</p>

    return (
        <div>
            <h2>Available Modules</h2>
            <form onSubmit={handleSubmit}>
                <div className="checkBoxes">
                {codes.map((code) => (
                    <div key={code}>
                    <input type="checkbox" id={code} name={code} onChange={handleToggle}
                        checked={selectedModules.includes(code)} 
                    />
                        <label htmlFor={code}>
                            {code}
                        </label>
                    </div>
                ))}
                </div>
                <input type="submit" value="Create" id="formSubmit"/>
            </form>
        </div>
    );

};

export default ModuleList;