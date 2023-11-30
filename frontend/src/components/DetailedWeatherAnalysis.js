import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import './DetailedWeatherAnalysis.css';

function DetailedWeatherAnalysis() {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accidents/weather_detailed')
            .then(response => {
                setWeatherData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    const COLORS = ['#5bb57c', '#83bc94', '#a6c1ad', '#c6c6c6', '#dcb1a8', '#ec9a8a', '#f7816d'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Check for null and provide a default value before calling toFixed
            const averageVisibility = payload[0].payload.average_visibility_mi;
            const averageWindSpeed = payload[0].payload.average_wind_speed_mph;

            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label} - Accidents: ${payload[0].value.toLocaleString()}`}</p>
                    <p className="desc">{`Avg. Visibility: ${averageVisibility ? averageVisibility.toFixed(2) : 'N/A'} mi`}</p>
                    <p className="desc">{`Avg. Wind Speed: ${averageWindSpeed ? averageWindSpeed.toFixed(2) : 'N/A'} mph`}</p>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="weather-chart-container">
            <h2>Weather Conditions Detailed</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weatherData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Weather_Condition" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(tick) => new Intl.NumberFormat('en-US').format(tick)} tick={{ fontSize: 12 }} />

                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="accident_count" name="Accidents">
                        {weatherData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DetailedWeatherAnalysis;
