import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopDangerousCities() {
    const [topCitiesData, setTopCitiesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch top dangerous cities data from the API
        axios.get('/api/accidents/top_dangerous_cities')
            .then(response => {
                setTopCitiesData(response.data.map(item => ({
                    ...item,
                    AccidentCount: Number(item.AccidentCount).toLocaleString() // Thousand Separator
                  })));
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
            <h2>Top Dangerous Cities for Driving</h2>
            <table>
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Accident Count</th>
                    </tr>
                </thead>
                <tbody>
                    {topCitiesData.map((city, index) => (
                        <tr key={index}>
                            <td>{city.City}</td>
                            <td>{city.AccidentCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TopDangerousCities;
