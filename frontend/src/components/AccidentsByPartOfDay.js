import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccidentsByPartOfDay() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch accidents by part of day from the API
        axios.get('/api/accidents/time_of_day')
            .then(response => {
                setAccidentData(response.data.map(item => ({
                    ...item,
                    AccidentCount: Number(item.AccidentCount).toLocaleString() // Thousand Separator
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
            <h2>Accidents by Parts of the Day</h2>
            <ul>
                {accidentData.map((part, index) => (
                    <li key={index}>{part.PartOfDay}: {part.AccidentCount} accidents</li>
                ))}
            </ul>
        </div>
    );
}

export default AccidentsByPartOfDay;
