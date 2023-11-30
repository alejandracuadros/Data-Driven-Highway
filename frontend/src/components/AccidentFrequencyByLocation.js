import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import './AccidentFrequencyByLocation.css';

const geoUrl = process.env.PUBLIC_URL + '/maps/us-states-10m.json';

const idToStatePostalCode = {
  "01": "AL", // Alabama
  "02": "AK", // Alaska
  "04": "AZ", // Arizona
  "05": "AR", // Arkansas
  "06": "CA", // California
  "08": "CO", // Colorado
  "09": "CT", // Connecticut
  "10": "DE", // Delaware
  "11": "DC", // District of Columbia
  "12": "FL", // Florida
  "13": "GA", // Georgia
  "15": "HI", // Hawaii
  "16": "ID", // Idaho
  "17": "IL", // Illinois
  "18": "IN", // Indiana
  "19": "IA", // Iowa
  "20": "KS", // Kansas
  "21": "KY", // Kentucky
  "22": "LA", // Louisiana
  "23": "ME", // Maine
  "24": "MD", // Maryland
  "25": "MA", // Massachusetts
  "26": "MI", // Michigan
  "27": "MN", // Minnesota
  "28": "MS", // Mississippi
  "29": "MO", // Missouri
  "30": "MT", // Montana
  "31": "NE", // Nebraska
  "32": "NV", // Nevada
  "33": "NH", // New Hampshire
  "34": "NJ", // New Jersey
  "35": "NM", // New Mexico
  "36": "NY", // New York
  "37": "NC", // North Carolina
  "38": "ND", // North Dakota
  "39": "OH", // Ohio
  "40": "OK", // Oklahoma
  "41": "OR", // Oregon
  "42": "PA", // Pennsylvania
  "44": "RI", // Rhode Island
  "45": "SC", // South Carolina
  "46": "SD", // South Dakota
  "47": "TN", // Tennessee
  "48": "TX", // Texas
  "49": "UT", // Utah
  "50": "VT", // Vermont
  "51": "VA", // Virginia
  "53": "WA", // Washington
  "54": "WV", // West Virginia
  "55": "WI", // Wisconsin
  "56": "WY", // Wyoming
};


const statePostalToFullName = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

const Legend = ({ colorScale, maxAccidents }) => {
  const range = colorScale.range();
  const domain = colorScale.domain();
  const increment = (domain[1] - domain[0]) / (range.length - 1);

  return (
    <div className="legend">
      <div className="legend-title">Total Frequency</div>
      <div className="legend-scale">
        {range.map((color, i) => {
          const value = Math.round(domain[0] + increment * i);
          return (
            <div key={i} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: color }}
              />
              <div className="legend-value">{value.toLocaleString()}k</div>
            </div>
          );
        }).reverse()}
      </div>
    </div>
  );
};

const AccidentFrequencyByLocation = () => {
  const [accidentData, setAccidentData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');

  useEffect(() => {
    fetch('/api/accidents/frequency_by_location')
      .then((response) => response.json())
      .then((data) => {
        setAccidentData(data);
      })
      .catch((error) => console.error("Error fetching accident data: ", error));
  }, []);

  const maxAccidents = Math.max(...accidentData.map((d) => d.Accident_Count));
  const colorScale = scaleQuantize()
  .domain([0, maxAccidents])
  .range([
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618"
  ]);

  
  const onMouseEnter = (geo) => {
    return () => {
      const statePostalCode = idToStatePostalCode[geo.id];
      const cur = accidentData.find((s) => s.State === statePostalCode);
      const stateFullName = statePostalToFullName[statePostalCode] || 'Unknown';
      
      setTooltipContent(`${stateFullName}: ${cur ? cur.Accident_Count.toLocaleString() : 'No data'} accidents`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };
 
  return (
    <div className="dashboard">
      <div className="map-container">
      <h1 className="map-title">US Accidents Frequency Map</h1>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const statePostalCode = idToStatePostalCode[geo.id];
                const cur = accidentData.find((s) => s.State === statePostalCode);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={cur ? colorScale(cur.Accident_Count) : "#EEE"}
                    onMouseEnter={onMouseEnter(geo)}
                    onMouseLeave={onMouseLeave}
                    style={{
                      default: {
                        outline: "none",
                        stroke: "#000",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        outline: "none",
                        stroke: "#555",
                        strokeWidth: 1,
                      },
                      pressed: {
                        outline: "none",
                        stroke: "#555",
                        strokeWidth: 1,
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {tooltipContent && <div className="tooltip">{tooltipContent}</div>}
      </div>
      <Legend colorScale={colorScale} maxAccidents={maxAccidents} />
    </div>
  );
};

export default AccidentFrequencyByLocation;
