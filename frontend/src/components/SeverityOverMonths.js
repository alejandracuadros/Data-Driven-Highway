import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeverityOverMonths() {
    const [severityData, setSeverityData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch severity over months data from the API
        axios.get('/api/accidents/severity_over_months')
            .then(response => {
                setSeverityData(response.data);
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
            <h2>Accident Severity Over Months</h2>
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Severity</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {severityData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Month}</td>
                            <td>{item.Severity}</td>
                            <td>{item.AccidentCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SeverityOverMonths;
