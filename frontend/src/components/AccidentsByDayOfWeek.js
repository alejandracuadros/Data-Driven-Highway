import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  BarChart,   Bar,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  ResponsiveContainer,  Cell,} from 'recharts';
import './AccidentsByDayOfWeek.css';

function AccidentsByDayOfWeek() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/accidents/by_day_of_week');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getColor = (count) => {
    // Define thresholds for color changes here
    const thresholds = [
      500000, 550000, 600000, 1000000, 1200000, 1250000, 1300000, 1350000, 1400000,
    ];
    const colors = [
      '#caebcc', '#b6ddb9', '#a1d0a5', '#8dc292',
      '#79b580', '#64a86e', '#4f9a5c', '#388d4a',
      '#1b8039'
    ];

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) {
        return colors[i];
      }
    }
    // Default color if none of the thresholds are met
    return colors[0];
  };

  return (
    <div className="AccidentsByDayOfWeek-container">
      <h2>Accidents by Day of Week</h2>
      <ResponsiveContainer width={480} height={230}>
        <BarChart
          data={data}
          margin={{
            top: 5, right: 30, left: 15, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="DayOfWeek" tick={{fontSize:10}} />
          <YAxis 
            name="Count of Accidents"
            tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value) }
            tick={{fontSize:10}}

          />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en-US').format(value)} />
          <Bar dataKey="AccidentCount">
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.AccidentCount)} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AccidentsByDayOfWeek;