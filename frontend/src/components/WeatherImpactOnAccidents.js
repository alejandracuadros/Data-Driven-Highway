import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherImpactOnAccidents() {
    const [weatherImpactData, setWeatherImpactData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch weather impact on accidents data from the API
        axios.get('/api/accidents/weather_impact')
            .then(response => {
                setWeatherImpactData(response.data.map(item => ({
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
            <h2>Weather Impact on Accidents</h2>
            <table>
                <thead>
                    <tr>
                        <th>Weather Condition</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {weatherImpactData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Weather_Condition}</td>
                            <td>{item.Accident_Count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WeatherImpactOnAccidents;
