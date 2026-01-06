import { useState, useEffect } from 'react'

const ModuleList = () => {
    const [codes, setCodes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    if (isLoading) return <p>Loading...</p>

    return (
        <div className="p-4">
            <h2>Available Modules</h2>
            <ul>
                {codes.map((code) => (
                <li key={code}>{code}</li>
                ))}
            </ul>
        </div>
    );

};

export default ModuleList;