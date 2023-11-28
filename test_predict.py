import requests

url = 'http://127.0.0.1:5000/predict'

# Example values

data = {
    'Start_Lat': 34.0,  
    'Start_Lng': -118.0,
    'Temperature_F_': 65.0,
    'Visibility_mi_': 10.0,
    'DayOfWeek': 3,
    'HourOfDay': 14,
    'Weather_Condition': 'Clear'
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.text}")

if response.status_code == 200:
    print(response.json())
else:
    print("Error occurred during the request.")
