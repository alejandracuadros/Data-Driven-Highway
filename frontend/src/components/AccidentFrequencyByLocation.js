import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccidentFrequencyByLocation() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch accident frequency data from the API
        axios.get('/api/accidents/frequency_by_location')
            .then(response => {
                setAccidentData(response.data.map(item => ({
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
            <h2>Accident Frequency by Location</h2>
            <ul>
                {accidentData.map((location, index) => (
                    <li key={index}>{location.State}: {location.Accident_Count} accidents</li>
                ))}
            </ul>
        </div>
    );
}

export default AccidentFrequencyByLocation;
