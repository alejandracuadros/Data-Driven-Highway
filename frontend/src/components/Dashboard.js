import React from 'react';
import './DashboardGrid.css';
import AccidentFrequencyByLocation from './AccidentFrequencyByLocation';
import AccidentsByDayOfWeek from './AccidentsByDayOfWeek';
import AccidentsByPartOfDay from './AccidentsByPartOfDay';
import AccidentsByTimeOfDay from './AccidentsByTimeOfDay';
import AccidentsByWeatherCondition from './AccidentsByWeatherCondition';
import CasualtyAndInjuryStatistics from './CasualtyAndInjuryStatistics';
import SeverityOverTime from './SeverityOverTime';
import TopDangerousCities from './TopDangerousCities';
import MLModelPrediction from './MLModelPrediction';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-item frequency"><AccidentFrequencyByLocation /></div>
      <div className="dashboard-item dayofweek"><AccidentsByDayOfWeek /></div>
      <div className="dashboard-item partofday"><AccidentsByPartOfDay /></div>
      <div className="dashboard-item timeofday"><AccidentsByTimeOfDay /></div>
      <div className="dashboard-item weather"><AccidentsByWeatherCondition /></div>
      <div className="dashboard-item casualty"><CasualtyAndInjuryStatistics /></div>
      <div className="dashboard-item severity"><SeverityOverTime /></div>
      <div className="dashboard-item cities"><TopDangerousCities /></div>
      <div className="dashboard-item prediction full-width"><MLModelPrediction /></div>
    </div>
  );
}

export default Dashboard;


