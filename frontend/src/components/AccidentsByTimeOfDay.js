import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import './AccidentsByTimeOfDay.css'; // Make sure this file exists and is in the correct path

function AccidentsByTimeOfDay() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accidents/by_time_of_day')
            .then(response => {
                setAccidentData(response.data);
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].payload.HourOfDay} hours : ${payload[0].value.toLocaleString()} Accidents`}</p>
                </div>
            );
        }
        return null;
    };

    // Define the dimensions of the chart. Adjust these values as needed.
    const chartWidth = 400;
    const chartHeight = 250;

    return (
        <div className="AccidentsByTimeOfDay-container">
            <h2>Accidents by Time of Day</h2>
            <BarChart 
                width={chartWidth} 
                height={chartHeight} 
                data={accidentData} 
                margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="HourOfDay" tick={{fontSize:10}} />
                <YAxis tickFormatter={(value) => value.toLocaleString()} tick={{fontSize:10}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="AccidentCount" fill="#82ca9d">
                    {accidentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </div>
    );
}

export default AccidentsByTimeOfDay;
