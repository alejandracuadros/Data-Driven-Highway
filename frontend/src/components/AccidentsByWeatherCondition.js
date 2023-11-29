import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccidentsByWeatherCondition() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch accidents by weather condition from the API
        axios.get('/api/accidents/count_by_weather')
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
            <h2>Accidents by Weather Condition</h2>
            <ul>
                {accidentData.map((weather, index) => (
                    <li key={index}>{weather.Weather_Condition}: {weather.AccidentCount} accidents</li>
                ))}
            </ul>
        </div>
    );
}

export default AccidentsByWeatherCondition;
