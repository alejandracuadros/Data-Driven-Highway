import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './TopDangerousCities.css';

function TopDangerousCities() {
    const [cityData, setCityData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accidents/top_dangerous_cities')
            .then(response => {
                setCityData(response.data);
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

    const colors = ['#5bb57c', '#83bc94', '#a6c1ad', '#c6c6c6', '#dcb1a8', '#ec9a8a', '#f7816d'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].value.toLocaleString()} Accidents`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="top-cities-chart-container">
            <h2>Top 10 Cities by Accident Count</h2>
            <ResponsiveContainer width={300} height={280}>
                <BarChart data={cityData} layout="vertical" margin={{ top: 5, right: 15, left: 15, bottom: 5 }}>
                    <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} tick={{fontSize:10}} />
                    <YAxis dataKey="City" type="category" tick={{fontSize:10}}  />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="AccidentCount">
                        {
                            cityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TopDangerousCities;


