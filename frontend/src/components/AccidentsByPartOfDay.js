import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './AccidentsByPartOfDay.css';

function AccidentsByPartOfDay() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/accidents/time_of_day')
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
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>;
    }

    const COLORS = [
        '#5bb57c', '#83bc94', '#a6c1ad', '#c6c6c6',
        '#dcb1a8', '#ec9a8a', '#f7816d'
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const name = payload[0].name;
            const value = payload[0].value.toLocaleString();
            const percent = ((payload[0].value / payload[0].payload.total) * 100).toFixed(2) + '%';
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${name} : ${value} Accidents`}</p>
                    <p className="intro">{percent}</p>
                </div>
            );  
        }
        return null;
    };

    const totalAccidents = accidentData.reduce((acc, cur) => acc + cur.AccidentCount, 0);

    return (
        <div className="AccidentsByPartOfDay">
            <h2>Accidents by Parts of the Day</h2>
            <PieChart width={400} height={250}>
                <Pie
                    data={accidentData.map(data => ({ ...data, total: totalAccidents }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ payload, percent }) => `${payload.PartOfDay} (${(percent * 100).toFixed(2)}%)` }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="AccidentCount"
                    nameKey="PartOfDay"
                >
                    {accidentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </div>
    );
}

export default AccidentsByPartOfDay;



