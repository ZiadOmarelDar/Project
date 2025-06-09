from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load model
with open("Pet_Status.pkl", "rb") as f:
    model = pickle.load(f)

# Load label encoders
with open("label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)

# Define the categorical columns you used during training
categorical_columns = list(label_encoders.keys())

@app.route("/")
def home():
    return "Pet Status Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the input JSON and convert it to a DataFrame
        data = request.get_json()
        input_df = pd.DataFrame([data])

        # Encode categorical features using loaded label encoders
        for col in categorical_columns:
            if col in input_df.columns:
                le = label_encoders[col]
                val = input_df.at[0, col]
                if val not in le.classes_:
                    valid_values = list(le.classes_)
                    return jsonify({
                        "error": f"Invalid value '{val}' for '{col}'. Valid options: {valid_values}"
                    }), 400
                input_df[col] = le.transform([val])
            else:
                return jsonify({"error": f"Missing required field: {col}"}), 400

        # Predict
        prediction = model.predict(input_df)[0]
        result = 'Dangerous' if prediction == 1 else 'Not Dangerous'

        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5003)
