import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './SeverityOverTime.css';

function SeverityOverTime() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accidents/severity_over_time')
            .then(response => {
                setData(response.data);
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

    // Custom formatter for the YAxis and Tooltip
    const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

    // Severity labels map
    const severityLabels = {
        1: 'Minimal',
        2: 'Minor',
        3: 'Moderate',
        4: 'Significant'
    };

    // Group data by year
    const groupedData = data.reduce((acc, d) => {
        const year = d.Year;
        const severity = severityLabels[d.Severity];
        const count = d.Accident_Count;

        acc[year] = acc[year] || { Year: year };
        acc[year][severity] = count;

        return acc;
    }, {});

    const chartData = Object.values(groupedData);

    const COLORS = ['#5bb57c', '#a6c1ad', '#dcb1a8', '#f7816d'];

    return (
        <div className="severity-over-time-chart-container">
            <h2>Accident Severity Over Time</h2>
            <ResponsiveContainer width={350} height={250} >
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Year" tick={{fontSize:10}}  />
                    <YAxis tickFormatter={formatNumber} tick={{fontSize:10}} />
                    <Tooltip formatter={formatNumber} />
                    <Bar dataKey="Minimal" stackId="a" fill={COLORS[0]} />
                    <Bar dataKey="Minor" stackId="a" fill={COLORS[1]} />
                    <Bar dataKey="Moderate" stackId="a" fill={COLORS[2]} />
                    <Bar dataKey="Significant" stackId="a" fill={COLORS[3]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SeverityOverTime;


