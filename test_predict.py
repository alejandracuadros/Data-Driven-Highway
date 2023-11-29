import requests

url = 'http://127.0.0.1:5000/predict'

# Example values

data = {
    'Start_Lat': 55.0,  
    'Start_Lng': 18.0,
    'Temperature_F_': 70.0,
    'Visibility_mi_': 100.0,
    'DayOfWeek': 7,
    'HourOfDay': 10,
    'Weather_Condition': 'Clear'
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.text}")

if response.status_code == 200:
    print(response.json())
else:
    print("Error occurred during the request.")
