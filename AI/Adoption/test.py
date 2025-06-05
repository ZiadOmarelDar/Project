import requests

# URL of your running Flask API
url = "http://127.0.0.1:5000/predict"

# Sample input data (must match your model's expected features)
sample_data = {
   "PetType": 0,               # e.g., 0 = Dog
   "Breed": 3,                 # Encoded breed value
   "AgeMonths": 12,           # 1 year
   "Color": 4,                 # Encoded color
   "Size": 1,                  # Encoded size
   "WeightKg": 10.5,
   "Vaccinated": 1,           # 1 = Yes
   "HealthCondition": 0,      # Encoded health condition
   "TimeInShelterDays": 30,
   "AdoptionFee": 100,
   "PreviousOwner": 0         # 0 = No previous owner
}

# Send POST request
response = requests.post(url, json=sample_data)

# Print the result
if response.status_code == 200:
   print("Prediction result:", response.json())
else:
   print("Error:", response.status_code, response.text)
