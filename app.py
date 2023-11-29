from flask import Flask, jsonify, request
from google.cloud import bigquery
import pandas as pd
import joblib

# Initialize Flask app
app = Flask(__name__)

# Initialize BigQuery client
client = bigquery.Client()

# Load the trained model
model_columns = ['Start_Lat', 'Start_Lng', 'Temperature_F_', 'Visibility_mi_', 'DayOfWeek', 'HourOfDay', 'Weather_Condition']
model = joblib.load('traffic_severity_predictor.joblib')

@app.route('/')
def index():
    return "Flask app is running!"

# Route for Accident Frequency by Location
@app.route('/api/accidents/frequency_by_location', methods=['GET'])
def get_accidents_by_location():
    query = """
    SELECT State, COUNT(*) as Accident_Count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY State
    ORDER BY Accident_Count DESC
    """
    try:
        query_job = client.query(query)  # Make an API request.
        result = query_job.result()  # Wait for the job to complete.
        
         # Convert the results to a list of dictionaries to jsonify the response
        accidents_by_location = [dict(row) for row in result]
        return jsonify(accidents_by_location)
    except Exception as e:
            return jsonify({"error": str(e)}), 500
    
# Route for Accident Severity Over Time
@app.route('/api/accidents/severity_over_time', methods=['GET'])
def get_severity_over_time():
    query = """
    SELECT EXTRACT(YEAR FROM Start_Time) as Year, Severity, COUNT(*) as Accident_Count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Year, Severity
    ORDER BY Year, Severity
    """
    try:
        query_job = client.query(query)
        results = query_job.result() 

        severity_over_time = [dict(row) for row in results]
        return jsonify(severity_over_time)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route for Weather Impact on Accidents
@app.route('/api/accidents/weather_impact', methods=['GET'])
def get_weather_impact():
    query = """
    SELECT Weather_Condition, COUNT(*) as Accident_Count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    WHERE Weather_Condition IS NOT NULL
    GROUP BY Weather_Condition
    ORDER BY Accident_Count DESC
    """
    try:
        query_job = client.query(query)
        results = query_job.result()  

        weather_impact = [dict(row) for row in results]
        return jsonify(weather_impact)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for Time-Based Accident Analysis
@app.route('/api/accidents/time_based_analysis', methods=['GET'])
def get_time_based_analysis():
    query = """
    SELECT EXTRACT(HOUR FROM Start_Time) as Hour, COUNT(*) as Accident_Count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Hour
    ORDER BY Hour
    """
    try:
        query_job = client.query(query)
        results = query_job.result()
        time_based_analysis = [dict(row) for row in results]
        return jsonify(time_based_analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route for Casualty and Injury Statistics
@app.route('/api/accidents/severity_distribution', methods=['GET'])
def get_severity_distribution():
    query = """
    SELECT Severity, COUNT(*) as Accident_Count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Severity
    ORDER BY Severity
    """
    try:
        query_job = client.query(query)
        results = query_job.result()
        severity_distribution = [dict(row) for row in results]
        return jsonify(severity_distribution)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for Top Dangerous Cities for Driving
@app.route('/api/accidents/top_dangerous_cities', methods=['GET'])
def get_top_dangerous_cities():
    query = """
    SELECT City, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    WHERE City IS NOT NULL
    GROUP BY City
    ORDER BY AccidentCount DESC
    LIMIT 10
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        top_dangerous_cities = [dict(row) for row in result]
        return jsonify(top_dangerous_cities)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for Accidents by Weather Conditions
@app.route('/api/accidents/count_by_weather', methods=['GET'])
def get_count_by_weather():
    query = """
    SELECT Weather_Condition, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Weather_Condition
    HAVING AccidentCount > 1000  -- Only include significant weather conditions
    ORDER BY AccidentCount DESC
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        accidents_by_weather = [dict(row) for row in result]
        return jsonify(accidents_by_weather)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Route for Accidents by Day of Week
@app.route('/api/accidents/by_day_of_week', methods=['GET'])
def get_accidents_by_day_of_week():
    query = """
    SELECT FORMAT_DATE('%A', DATE(Start_Time)) as DayOfWeek, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY DayOfWeek
    ORDER BY 
        CASE DayOfWeek
            WHEN 'Sunday' THEN 1
            WHEN 'Monday' THEN 2
            WHEN 'Tuesday' THEN 3
            WHEN 'Wednesday' THEN 4
            WHEN 'Thursday' THEN 5
            WHEN 'Friday' THEN 6
            WHEN 'Saturday' THEN 7
        END
    """
    try:
        query_job = client.query(query)
        result = query_job.result()
        accidents_by_day = [dict(row) for row in result]
        return jsonify(accidents_by_day)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    

# Route for Accidents by Time of Day
@app.route('/api/accidents/by_time_of_day', methods=['GET'])
def get_accidents_by_time_of_day():
    query = """
    SELECT EXTRACT(HOUR FROM Start_Time) as HourOfDay, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY HourOfDay
    ORDER BY HourOfDay
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        accidents_by_Time = [dict(row) for row in result]
        return jsonify(accidents_by_Time)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route for Accident Severity Over Time - Monthly Severity Trends
@app.route('/api/accidents/severity_over_months', methods=['GET'])
def get_severity_over_months():
    query = """
    SELECT FORMAT_TIMESTAMP('%Y-%m', Start_Time) as Month, Severity, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Month, Severity
    ORDER BY Month, Severity
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        severity_over_months = [dict(row) for row in result]
        return jsonify(severity_over_months)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 

# Route for Weather Impact on Accidents - Detailed Weather Analysis
@app.route('/api/accidents/weather_detailed', methods=['GET'])
def get_weather_detailed():
    query = """
    SELECT 
        Weather_Condition, 
        AVG(Visibility_mi_) as average_visibility_mi, 
        AVG(Wind_Speed_mph_) as average_wind_speed_mph, 
        COUNT(*) as accident_count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Weather_Condition
    ORDER BY accident_count DESC
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        weather_detailed = [dict(row) for row in result]
        return jsonify(weather_detailed)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
# Route for Time-Based Accident Analysis - Accidents by Part of Day
@app.route('/api/accidents/time_of_day', methods=['GET'])
def get_accidents_time_of_day():
    query = """
    SELECT CASE 
             WHEN EXTRACT(HOUR FROM Start_Time) BETWEEN 6 AND 12 THEN 'Morning'
             WHEN EXTRACT(HOUR FROM Start_Time) BETWEEN 13 AND 17 THEN 'Afternoon'
             WHEN EXTRACT(HOUR FROM Start_Time) BETWEEN 18 AND 23 THEN 'Evening'
             ELSE 'Night'
           END as PartOfDay, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY PartOfDay
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        accidents_time_of_day = [dict(row) for row in result]
        return jsonify(accidents_time_of_day)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 

# Route for Severity Distribution - Severity by Road Conditions
@app.route('/api/accidents/severity_by_road_condition', methods=['GET'])
def get_severity_by_road_condition():
    query = """
    SELECT Crossing, Junction, Traffic_Signal, Severity, COUNT(*) as AccidentCount
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Crossing, Junction, Traffic_Signal, Severity
    ORDER BY AccidentCount DESC
    """
    try:
        query_job = client.query(query)
        result = query_job.result() 
        severity_by_road_condition = [dict(row) for row in result]
        return jsonify(severity_by_road_condition)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
    
# Route to integrate Machine Learning Model to Flask App
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            json_input = request.get_json()
            input_data = pd.DataFrame([json_input], columns=model_columns)

            print("DataFrame shape:", input_data.shape)
            print("DataFrame content:", input_data)

            # Check if the DataFrame has the expected shape
            if input_data.ndim != 2:
                return jsonify({'error': f'Input data has {input_data.ndim} dimensions, expected 2 dimensions'}), 400

            prediction = model.predict(input_data)
            return jsonify({'prediction': str(prediction[0])})
        except KeyError as e:
            return jsonify({'error': f'Missing key in input data: {str(e)}'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
