import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeverityByRoadCondition() {
    const [roadConditionData, setRoadConditionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch severity by road condition data from the API
        axios.get('/api/accidents/severity_by_road_condition')
            .then(response => {
                setRoadConditionData(response.data);
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
            <h2>Accident Severity by Road Condition</h2>
            <table>
                <thead>
                    <tr>
                        <th>Crossing</th>
                        <th>Junction</th>
                        <th>Traffic Signal</th>
                        <th>Severity</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {roadConditionData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Crossing ? 'Yes' : 'No'}</td>
                            <td>{item.Junction ? 'Yes' : 'No'}</td>
                            <td>{item.Traffic_Signal ? 'Yes' : 'No'}</td>
                            <td>{item.Severity}</td>
                            <td>{item.AccidentCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SeverityByRoadCondition;
