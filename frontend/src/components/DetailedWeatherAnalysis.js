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
            setWeatherData(response.data.map(item => ({
              ...item,
              average_visibility_mi: Number(item.average_visibility_mi).toFixed(2), // Two decimals
              average_wind_speed_mph: Number(item.average_wind_speed_mph).toFixed(2), // Two decimals
              accident_count: Number(item.accident_count).toLocaleString() // Thousand Separator
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
                            <td>{weather.average_visibility_mi}</td>
                            <td>{weather.average_wind_speed_mph}</td>
                            <td>{weather.accident_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DetailedWeatherAnalysis;
