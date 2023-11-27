import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccidentFrequencyByZipCode() {
    const [accidentData, setAccidentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch accident frequency data by zip code from the API
        axios.get('/api/accidents/frequency_by_zipcode')
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Accident Frequency by Zip Code</h2>
            <ul>
                {accidentData.map((item, index) => (
                    <li key={index}>Zip Code {item.Zipcode}: {item.AccidentCount} accidents</li>
                ))}
            </ul>
        </div>
    );
}

export default AccidentFrequencyByZipCode;
