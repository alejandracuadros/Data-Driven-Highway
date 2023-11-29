import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeverityOverTime() {
    const [severityOverTimeData, setSeverityOverTimeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch severity over time data from the API
        axios.get('/api/accidents/severity_over_time')
            .then(response => {
                setSeverityOverTimeData(response.data.map(item => ({
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
            <h2>Accident Severity Over Time</h2>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Severity</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {severityOverTimeData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Year}</td>
                            <td>{item.Severity}</td>
                            <td>{item.Accident_Count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SeverityOverTime;

