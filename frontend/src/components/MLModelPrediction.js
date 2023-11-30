import React, { useState } from 'react';
import axios from 'axios';
import './MLModelPrediction.css';

function MLModelPrediction() {
    const [inputData, setInputData] = useState({
        Start_Lat: '', 
        Start_Lng: '', 
        Temperature_F_: '', 
        Visibility_mi_: '',
        DayOfWeek: '', 
        HourOfDay: '', 
        Weather_Condition: ''
    });
    const [prediction, setPrediction] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setInputData({ ...inputData, [e.target.name]: value });
    };

    const handleRestart = () => {
        setInputData({
            Start_Lat: '', 
            Start_Lng: '', 
            Temperature_F_: '', 
            Visibility_mi_: '',
            DayOfWeek: '', 
            HourOfDay: '', 
            Weather_Condition: ''
        });
        setPrediction('');
        setError('');
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPrediction('');

        try {
            const response = await axios.post('/predict', inputData);
            setPrediction(getSeverityDescription(response.data.prediction));
        } catch (err) {
            setError('Error while predicting. Please try again.');
            console.error(err);
        }
    };

    const getSeverityDescription = (value) => {
        const severity = {
            '1.0': '1.0 - This accident would produce minimal impact on traffic, not significant impact on normal traffic flow.',
            '2.0': '2.0 - This accident would produce minor impact on traffic, slight disruptions, but traffic will still flows relatively smoothly.',
            '3.0': '3.0 - This accident would produce moderate impact on traffic, noticeable disruptions causing delays and congestion.',
            '4.0': '4.0 - This accident would produce significant impact on traffic, severe disruptions, heavy congestion, and major traffic jams.',
        };
        return severity[value] || value;
    };

    return (
        <div className="ml-model-prediction">
            <h2 className="title">Forecasting Traffic Accident Severity</h2>
            <form onSubmit={handleSubmit} className="form">
                <input 
                    type="number" 
                    name="Start_Lat" 
                    value={inputData.Start_Lat} 
                    onChange={handleChange} 
                    placeholder="Insert Latitude" 
                    className="input-half"
                    step="0.0001"
                    min="-90"
                    max="90"
                />
                <input
                    type="number"
                    name="Start_Lng"
                    value={inputData.Start_Lng}
                    onChange={handleChange}
                    placeholder="Insert Longitude"
                    className="input-half"
                    step="0.0001"
                    min="-180"
                    max="180"
                />
                <input type="number" 
                    name="Temperature_F_" 
                    value={inputData.Temperature_F_} 
                    onChange={handleChange} 
                    placeholder="Insert Temperature (°F)"
                    className="input-quarter"
                    step="0.01"
                    min="-459.67"
                    max="100" 
                />
                <input type="number" 
                    name="Visibility_mi_" 
                    value={inputData.Visibility_mi_} 
                    onChange={handleChange} 
                    placeholder="Insert Visibility (mi)"
                    className="input-quarter"
                    step="0.1"
                    min="0"
                    max="140" 
                />
                <select
                    name="DayOfWeek"
                    value={inputData.DayOfWeek}
                    onChange={handleChange}
                    placeholder="Select Day of the Week"
                    className="input-full"
                >
                    <option value="">Select Day of the Week</option>
                    <option value="1">Sunday</option>
                    <option value="2">Monday</option>
                    <option value="3">Tuesday</option>
                    <option value="4">Wednesday</option>
                    <option value="5">Thursday</option>
                    <option value="6">Friday</option>
                    <option value="7">Saturday</option>
                </select>
                
                <select
                    name="HourOfDay"
                    value={inputData.HourOfDay}
                    onChange={handleChange}
                    placeholder="Select Hour of Day(0-24)"
                    className="input-full"
                >
                    <option value="">Select Hour</option>
                    {Array.from({ length: 24 }, (_, hour) => (
                        <option key={hour} value={hour}>
                        {hour}
                        </option>
                    ))}
                </select>
                <select
                    name="Weather_Condition"
                    value={inputData.Weather_Condition}
                    onChange={handleChange}
                    placeholder="Choose Weather Condition"
                    className="input-full"
                >
                    <option value="">Choose Weather Condition</option>
                    <option value="Blowing Dust">Blowing Dust</option>
                    <option value="Blowing Dust / Windy">Blowing Dust / Windy</option>
                    <option value="Blowing Sand">Blowing Sand</option>
                    <option value="Blowing Snow">Blowing Snow</option>
                    <option value="Blowing Snow / Windy">Blowing Snow / Windy</option>
                    <option value="Blowing Snow Nearby">Blowing Snow Nearby</option>
                    <option value="Clear">Clear</option>
                    <option value="Cloudy">Cloudy</option>
                    <option value="Cloudy / Windy">Cloudy / Windy</option>
                    <option value="Drifting Snow">Drifting Snow</option>
                    <option value="Drifting Snow / Windy">Drifting Snow / Windy</option>
                    <option value="Drizzle">Drizzle</option>
                    <option value="Drizzle / Windy">Drizzle / Windy</option>
                    <option value="Drizzle and Fog">Drizzle and Fog</option>
                    <option value="Dust Whirls">Dust Whirls</option>
                    <option value="Duststorm">Duststorm</option>
                    <option value="Fair">Fair</option>
                    <option value="Fair / Windy">Fair / Windy</option>
                    <option value="Fog">Fog</option>
                    <option value="Fog / Windy">Fog / Windy</option>
                    <option value="Freezing Drizzle">Freezing Drizzle</option>
                    <option value="Freezing Rain">Freezing Rain</option>
                    <option value="Freezing Rain / Windy">Freezing Rain / Windy</option>
                    <option value="Funnel Cloud">Funnel Cloud</option>
                    <option value="Hail">Hail</option>
                    <option value="Haze">Haze</option>
                    <option value="Haze / Windy">Haze / Windy</option>
                    <option value="Heavy Blowing Snow">Heavy Blowing Snow</option>
                    <option value="Heavy Drizzle">Heavy Drizzle</option>
                    <option value="Heavy Freezing Drizzle">Heavy Freezing Drizzle</option>
                    <option value="Heavy Freezing Rain">Heavy Freezing Rain</option>
                    <option value="Heavy Freezing Rain / Windy">Heavy Freezing Rain / Windy</option>
                    <option value="Heavy Ice Pellets">Heavy Ice Pellets</option>
                    <option value="Heavy Rain">Heavy Rain</option>
                    <option value="Heavy Rain / Windy">Heavy Rain / Windy</option>
                    <option value="Heavy Rain Shower">Heavy Rain Shower</option>
                    <option value="Heavy Rain Shower / Windy">Heavy Rain Shower / Windy</option>
                    <option value="Heavy Rain Showers">Heavy Rain Showers</option>
                    <option value="Heavy Sleet">Heavy Sleet</option>
                    <option value="Heavy Sleet / Windy">Heavy Sleet / Windy</option>
                    <option value="Heavy Sleet and Thunder">Heavy Sleet and Thunder</option>
                    <option value="Heavy Smoke">Heavy Smoke</option>
                    <option value="Heavy Snow">Heavy Snow</option>
                    <option value="Heavy Snow / Windy">Heavy Snow / Windy</option>
                    <option value="Heavy Snow with Thunder">Heavy Snow with Thunder</option>
                    <option value="Heavy Thunderstorms and Rain">Heavy Thunderstorms and Rain</option>
                    <option value="Heavy Thunderstorms and Snow">Heavy Thunderstorms and Snow</option>
                    <option value="Heavy Thunderstorms with Small Hail">Heavy Thunderstorms with Small Hail</option>
                    <option value="Heavy T-Storm">Heavy T-Storm</option>
                    <option value="Heavy T-Storm / Windy">Heavy T-Storm / Windy</option>
                    <option value="Ice Pellets">Ice Pellets</option>
                    <option value="Light Blowing Snow">Light Blowing Snow</option>
                    <option value="Light Drizzle">Light Drizzle</option>
                    <option value="Light Drizzle / Windy">Light Drizzle / Windy</option>
                    <option value="Light Fog">Light Fog</option>
                    <option value="Light Freezing Drizzle">Light Freezing Drizzle</option>
                    <option value="Light Freezing Fog">Light Freezing Fog</option>
                    <option value="Light Freezing Rain">Light Freezing Rain</option>
                    <option value="Light Freezing Rain / Windy">Light Freezing Rain / Windy</option>
                    <option value="Light Hail">Light Hail</option>
                    <option value="Light Haze">Light Haze</option>
                    <option value="Light Ice Pellets">Light Ice Pellets</option>
                    <option value="Light Rain">Light Rain</option>
                    <option value="Light Rain / Windy">Light Rain / Windy</option>
                    <option value="Light Rain Shower">Light Rain Shower</option>
                    <option value="Light Rain Shower / Windy">Light Rain Shower / Windy</option>
                    <option value="Light Rain Showers">Light Rain Showers</option>
                    <option value="Light Rain with Thunder">Light Rain with Thunder</option>
                    <option value="Light Sleet">Light Sleet</option>
                    <option value="Light Sleet / Windy">Light Sleet / Windy</option>
                    <option value="Light Snow">Light Snow</option>
                    <option value="Light Snow / Windy">Light Snow / Windy</option>
                    <option value="Light Snow and Sleet">Light Snow and Sleet</option>
                    <option value="Light Snow and Sleet / Windy">Light Snow and Sleet / Windy</option>
                    <option value="Light Snow Grains">Light Snow Grains</option>
                    <option value="Light Snow Shower">Light Snow Shower</option>
                    <option value="Light Snow Shower / Windy">Light Snow Shower / Windy</option>
                    <option value="Light Snow Showers">Light Snow Showers</option>
                    <option value="Light Snow with Thunder">Light Snow with Thunder</option>
                    <option value="Light Thunderstorm">Light Thunderstorm</option>
                    <option value="Light Thunderstorms and Rain">Light Thunderstorms and Rain</option>
                    <option value="Light Thunderstorms and Snow">Light Thunderstorms and Snow</option>
                    <option value="Low Drifting Snow">Low Drifting Snow</option>
                    <option value="Mist">Mist</option>
                    <option value="Mist / Windy">Mist / Windy</option>
                    <option value="Mostly Cloudy">Mostly Cloudy</option>
                    <option value="Mostly Cloudy / Windy">Mostly Cloudy / Windy</option>
                    <option value="N/A Precipitation">N/A Precipitation</option>
                    <option value="Overcast">Overcast</option>
                    <option value="Partial Fog">Partial Fog</option>
                    <option value="Partial Fog / Windy">Partial Fog / Windy</option>
                    <option value="Partly Cloudy">Partly Cloudy</option>
                    <option value="Partly Cloudy / Windy">Partly Cloudy / Windy</option>
                    <option value="Patches of Fog">Patches of Fog</option>
                    <option value="Patches of Fog / Windy">Patches of Fog / Windy</option>
                    <option value="Rain">Rain</option>
                    <option value="Rain / Windy">Rain / Windy</option>
                    <option value="Rain and Sleet">Rain and Sleet</option>
                    <option value="Rain Shower">Rain Shower</option>
                    <option value="Rain Shower / Windy">Rain Shower / Windy</option>
                    <option value="Rain Showers">Rain Showers</option>
                    <option value="Sand">Sand</option>
                    <option value="Sand / Dust Whirls Nearby">Sand / Dust Whirls Nearby</option>
                    <option value="Sand / Dust Whirlwinds">Sand / Dust Whirlwinds</option>
                    <option value="Sand / Dust Whirlwinds / Windy">Sand / Dust Whirlwinds / Windy</option>
                    <option value="Sand / Windy">Sand / Windy</option>
                    <option value="Scattered Clouds">Scattered Clouds</option>
                    <option value="Shallow Fog">Shallow Fog</option>
                    <option value="Shallow Fog / Windy">Shallow Fog / Windy</option>
                    <option value="Showers in the Vicinity">Showers in the Vicinity</option>
                    <option value="Sleet">Sleet</option>
                    <option value="Sleet / Windy">Sleet / Windy</option>
                    <option value="Sleet and Thunder">Sleet and Thunder</option>
                    <option value="Small Hail">Small Hail</option>
                    <option value="Smoke">Smoke</option>
                    <option value="Smoke / Windy">Smoke / Windy</option>
                    <option value="Snow">Snow</option>
                    <option value="Snow / Windy">Snow / Windy</option>
                    <option value="Snow and Sleet">Snow and Sleet</option>
                    <option value="Snow and Sleet / Windy">Snow and Sleet / Windy</option>
                    <option value="Snow and Thunder">Snow and Thunder</option>
                    <option value="Snow and Thunder / Windy">Snow and Thunder / Windy</option>
                    <option value="Snow Grains">Snow Grains</option>
                    <option value="Snow Showers">Snow Showers</option>
                    <option value="Squalls">Squalls</option>
                    <option value="Squalls / Windy">Squalls / Windy</option>
                    <option value="Thunder">Thunder</option>
                    <option value="Thunder / Windy">Thunder / Windy</option>
                    <option value="Thunder / Wintry Mix">Thunder / Wintry Mix</option>
                    <option value="Thunder / Wintry Mix / Windy">Thunder / Wintry Mix / Windy</option>
                    <option value="Thunder and Hail">Thunder and Hail</option>
                    <option value="Thunder and Hail / Windy">Thunder and Hail / Windy</option>
                    <option value="Thunder in the Vicinity">Thunder in the Vicinity</option>
                    <option value="Thunderstorm">Thunderstorm</option>
                    <option value="Thunderstorms and Rain">Thunderstorms and Rain</option>
                    <option value="Thunderstorms and Snow">Thunderstorms and Snow</option>
                    <option value="Tornado">Tornado</option>
                    <option value="T-Storm">T-Storm</option>
                    <option value="T-Storm / Windy">T-Storm / Windy</option>
                    <option value="Volcanic Ash">Volcanic Ash</option>
                    <option value="Widespread Dust">Widespread Dust</option>
                    <option value="Widespread Dust / Windy">Widespread Dust / Windy</option>
                    <option value="Wintry Mix">Wintry Mix</option>
                    <option value="Wintry Mix / Windy">Wintry Mix / Windy</option>
  
                </select>
                <div className="button-container">
                    <button type="submit" className="submit-button">Predict</button>
                    <button type="button" className="restart-button" onClick={handleRestart}>Restart</button>
                </div>
            </form>
            {prediction && <div className="prediction-result">Prediction: {prediction}</div>}
            {error && <div className="error-message">Error: {error}</div>}
        </div>
    );
}

export default MLModelPrediction;
