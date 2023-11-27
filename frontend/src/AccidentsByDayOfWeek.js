import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccidentsByDayOfWeek() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch accidents by day of week from the API
        axios.get('/api/accidents/by_day_of_week')
            .then(response => {
                setAccidentData(response.data);
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
            <h2>Accidents by Day of Week</h2>
            <ul>
                {accidentData.map((day, index) => (
                    <li key={index}>{day.DayOfWeek}: {day.AccidentCount} accidents</li>
                ))}
            </ul>
        </div>
    );
}

export default AccidentsByDayOfWeek;
