import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid} from 'recharts';
import './CasualtyAndInjuryStatistics.css'; 

const severityLabels = {
  1: 'Minimal',
  2: 'Minor',
  3: 'Moderate',
  4: 'Significant'
};

function CasualtyAndInjuryStatistics() {
    const [severityData, setSeverityData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accidents/severity_distribution')
            .then(response => {
                // Map severity numbers to labels
                const labeledData = response.data.map(item => ({
                    ...item,
                    Severity: severityLabels[item.Severity]
                }));
                setSeverityData(labeledData);
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

    // Custom Tooltip content
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{` ${payload[0].value.toLocaleString()} Accidents`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="severity-chart-container">
            <h2>Accident Severity Distribution</h2>
            <ResponsiveContainer width={400} height={250}>
                <BarChart 
                  data={severityData}
                  margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Severity" tick={{fontSize:10}} />
                    <YAxis tickFormatter={(tick) => new Intl.NumberFormat('en-US').format(tick)} tick={{fontSize:10}}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Accident_Count" fill="#82ca9d">
                        {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CasualtyAndInjuryStatistics;
