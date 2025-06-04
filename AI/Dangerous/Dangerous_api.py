from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load trained model
with open("X:\\Graduation Project\\Project\\AI\\Dangerous\\Pet_Status.pkl", "rb") as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input as JSON and convert to DataFrame
        data = request.get_json()
        input_df = pd.DataFrame([data])

        # Predict
        prediction = model.predict(input_df)[0]
        result = 'Dangerous' if prediction == 1 else 'Not Dangerous'

        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
