from flask import Flask, request, jsonify
import pickle
import numpy as np

# Load model and preprocessing tools
with open("Pet_adoption.pkl", "rb") as f:
    model = pickle.load(f)

with open("pet_adoption_label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)

with open("pet_adoption_scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Define features
categorical_columns = ['PetType', 'Breed', 'Color', 'Size']
numerical_columns = ["AgeMonths","WeightKg","Vaccinated","HealthCondition","TimeInShelterDays","AdoptionFee","PreviousOwner"]

def preprocess_input(input_dict):
    features = []

    # Encode categorical features
    for col in categorical_columns:
        le = label_encoders[col]
        val = input_dict.get(col, "")
        if val not in le.classes_:
            raise ValueError(f"Invalid value '{val}' for '{col}'")
        encoded = le.transform([val])[0]
        features.append(encoded)

    # Add numerical if any
    for col in numerical_columns:
        features.append(float(input_dict.get(col, 0)))

    arr = np.array([features])
    scaled = scaler.transform(arr)
    return scaled

# Flask App
app = Flask(__name__)
from flask_cors import CORS
CORS(app)
@app.route("/")
def home():
    return "Pet Adoption Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        processed = preprocess_input(data)
        prediction = model.predict(processed)[0]
        return jsonify({"adoption_likelihood": int(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
