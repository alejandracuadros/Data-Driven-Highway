import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimeBasedAccidentAnalysis() {
    const [timeBasedData, setTimeBasedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch time-based accident analysis data from the API
        axios.get('/api/accidents/time_based_analysis')
            .then(response => {
                setTimeBasedData(response.data.map(item => ({
                    ...item,
                    Accident_Count: Number(item.Accident_Count).toLocaleString() // Thousand Separator
                  })));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Time-Based Accident Analysis</h2>
            <table>
                <thead>
                    <tr>
                        <th>Hour of the Day</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {timeBasedData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Hour}</td>
                            <td>{item.Accident_Count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TimeBasedAccidentAnalysis;
