import React from 'react';
import './App.css';
// Import all your components
import AccidentFrequencyByLocation from './components/AccidentFrequencyByLocation';
import AccidentFrequencyByZipCode from './components/AccidentFrequencyByZipCode';
import AccidentsByDayOfWeek from './components/AccidentsByDayOfWeek';
import AccidentsByPartOfDay from './components/AccidentsByPartOfDay';
import AccidentsByTimeOfDay from './components/AccidentsByTimeOfDay';
import AccidentsByWeatherCondition from './components/AccidentsByWeatherCondition';
import CasualtyAndInjuryStatistics from './components/CasualtyAndInjuryStatistics';
import DetailedWeatherAnalysis from './components/DetailedWeatherAnalysis';
import SeverityByRoadCondition from './components/SeverityByRoadCondition';
import SeverityOverMonths from './components/SeverityOverMonths';
import SeverityOverTime from './components/SeverityOverTime';
import TimeBasedAccidentAnalysis from './components/TimeBasedAccidentAnalysis';
import TopDangerousCities from './components/TopDangerousCities';
import WeatherImpactOnAccidents from './components/WeatherImpactOnAccidents';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Accident Data Dashboard</h1>
      </header>
      <main>
        <AccidentFrequencyByLocation />
        <AccidentFrequencyByZipCode />
        <AccidentsByDayOfWeek />
        <AccidentsByPartOfDay />
        <AccidentsByTimeOfDay />
        <AccidentsByWeatherCondition />
        <CasualtyAndInjuryStatistics />
        <DetailedWeatherAnalysis />
        <SeverityByRoadCondition />
        <SeverityOverMonths />
        <SeverityOverTime />
        <TimeBasedAccidentAnalysis />
        <TopDangerousCities />
        <WeatherImpactOnAccidents />
      </main>
    </div>
  );
}

export default App;


