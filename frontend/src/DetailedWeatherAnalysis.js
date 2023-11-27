import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DetailedWeatherAnalysis() {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch detailed weather analysis data from the API
        axios.get('/api/accidents/weather_detailed')
            .then(response => {
                setWeatherData(response.data);
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
            <h2>Detailed Weather Analysis</h2>
            <table>
                <thead>
                    <tr>
                        <th>Weather Condition</th>
                        <th>Average Visibility (mi)</th>
                        <th>Average Wind Speed (mph)</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {weatherData.map((weather, index) => (
                        <tr key={index}>
                            <td>{weather.Weather_Condition}</td>
                            <td>{weather.AVG_Visibility_mi_}</td>
                            <td>{weather.AVG_Wind_Speed_mph_}</td>
                            <td>{weather.AccidentCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DetailedWeatherAnalysis;
