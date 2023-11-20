from flask import Flask, jsonify
from google.cloud import bigquery

# Initialize Flask app
app = Flask(__name__)

# Initialize BigQuery client
client = bigquery.Client()

# Define route for Accident Frequency by Location
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
        
        accidents_by_location = [dict(row) for row in result]
        return jsonify(accidents_by_location)
    except Exception as e:
            return jsonify({"error": str(e)}), 500
    
# Define route for Accident Severity Over Time
@app.route('/api/accidents/severity_over_time', methods=['GET'])
def get_severity_over_time():
    query = """
    SELECT EXTRACT(YEAR FROM Start_Time) as Year, Severity, COUNT(*) as Accident_Count
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`
    GROUP BY Year, Severity
    ORDER BY Year, Severity
    """
    try:
        # Execute the query
        query_job = client.query(query)
        results = query_job.result()  # Wait for the job to complete.

        # Convert the results to a list of dictionaries to jsonify the response
        severity_over_time = [dict(row) for row in results]
        return jsonify(severity_over_time)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define route for Weather Impact on Accidents
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
        # Execute the query
        query_job = client.query(query)
        results = query_job.result()  # Wait for the job to complete.

        # Convert the results to a list of dictionaries to jsonify the response
        weather_impact = [dict(row) for row in results]
        return jsonify(weather_impact)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define route for Time-Based Accident Analysis
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


# Define route for Casualty and Injury Statistics
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


