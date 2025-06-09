from flask import Flask, request, jsonify
import pickle
import numpy as np

# Load model and preprocessing tools
with open("pet_price_model.pkl", "rb") as f:
   model = pickle.load(f)

with open("label_encoders.pkl", "rb") as f:
   label_encoders = pickle.load(f)

with open("scaler.pkl", "rb") as f:
   scaler = pickle.load(f)

# Define feature names
categorical_columns = [
   "Animal", "Breed", "Gender", "Health Condition", 
   "Size", "Color", "Location", "Training", "Popularity"
]

numerical_columns = ["Age"]  # Add more if needed

# Preprocessing function
def preprocess_input(input_dict):
   features = []

   # Encode categorical features
   for col in categorical_columns:
      le = label_encoders[col]
      val = input_dict.get(col, "")
      if val not in le.classes_:
            raise ValueError(f"Invalid value '{val}' for feature '{col}'")
      encoded_val = le.transform([val])[0]
      features.append(encoded_val)

   # Add numerical features
   for col in numerical_columns:
      features.append(float(input_dict.get(col, 0)))

   # Scale
   features = np.array([features])
   features_scaled = scaler.transform(features)
   return features_scaled

# Predict price
def predict_price(input_dict):
   X_input = preprocess_input(input_dict)
   prediction = model.predict(X_input)
   return prediction[0]

# Initialize Flask
app = Flask(__name__)
from flask_cors import CORS
CORS(app)

@app.route("/")
def home():
   return "Pet Price Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():
   try:
      data = request.json
      print(data)
      price = predict_price(data)
      return jsonify({"predicted_price": round(float(price), 2)})
   except Exception as e:
      return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
   app.run(debug=True, port=5001)
