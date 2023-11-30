import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './AccidentsByWeatherCondition.css';

function AccidentsByWeather() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accidents/count_by_weather')
            .then(response => {
                // Filter out null weather conditions
                const filteredData = response.data.filter(item => item.Weather_Condition);
                setAccidentData(filteredData);
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

    const COLORS = [
        '#5bb57c', '#83bc94', '#a6c1ad', '#c6c6c6',
        '#dcb1a8', '#ec9a8a', '#f7816d'
    ];

    // Custom Tooltip content
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].payload.Weather_Condition}: ${payload[0].value.toLocaleString()} Accidents`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="WeatherCondition-container">
            <h2>Top Accidents by Weather Condition</h2>
            <ResponsiveContainer width={400} height={300}>
                <BarChart layout="vertical" data={accidentData}
                          margin={{ top: 25, right: 25, left: 15, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} tick={{fontSize:10}} />
                    <YAxis dataKey="Weather_Condition" type="category" tick={{ fontSize: 10}}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="AccidentCount" fill="#82ca9d">
                        {
                            accidentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default AccidentsByWeather;

