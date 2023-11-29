import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CasualtyAndInjuryStatistics() {
    const [injuryData, setInjuryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch casualty and injury statistics from the API
        axios.get('/api/accidents/severity_distribution')
            .then(response => {
                setInjuryData(response.data.map(item => ({
                    ...item,
                    Accident_Count: Number(item.Accident_Count).toLocaleString() // Thousand Separator
                  })));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Casualty and Injury Statistics</h2>
            <ul>
                {injuryData.map((severityItem, index) => (
                    <li key={index}>
                        Severity Level {severityItem.Severity}: {severityItem.Accident_Count} accidents
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CasualtyAndInjuryStatistics;
