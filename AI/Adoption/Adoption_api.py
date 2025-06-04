from flask import Flask, request, jsonify
import pickle
import numpy as np

# Initialize the Flask app
app = Flask(__name__)

# Load the trained model
with open('X:\\Graduation Project\\Project\\AI\\Adoption\\Pet_adoption.pkl', 'rb') as f:
   model = pickle.load(f)

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
   try:
      # Expect JSON data
      data = request.get_json()

      # Extract features from the JSON
      features = [
            data['PetType'],
            data['Breed'],
            data['AgeMonths'],
            data['Color'],
            data['Size'],
            data['WeightKg'],
            data['Vaccinated'],
            data['HealthCondition'],
            data['TimeInShelterDays'],
            data['AdoptionFee'],
            data['PreviousOwner']
      ]

      # Convert to NumPy array and reshape for single prediction
      input_array = np.array(features).reshape(1, -1)
      # Predict
      prediction = model.predict(input_array)[0]

      # Return result
      return jsonify({'adoption_likelihood': int(prediction)})

   except Exception as e:
      return jsonify({'error': str(e)})

# Run the app
if __name__ == '__main__':
   app.run(debug=True)
