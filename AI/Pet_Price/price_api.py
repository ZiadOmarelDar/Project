from flask import Flask, request, jsonify
import pickle
import numpy as np

# Load the trained model
with open("X:\\Graduation Project\\Project\\AI\\Pet_Price\\pet_price.pkl", "rb") as f:
   model = pickle.load(f)

app = Flask(__name__)

@app.route("/")
def home():
   return "Pet Price Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():
   data = request.json
   features = np.array(data["features"]).reshape(1, -1)
   prediction = model.predict(features)[0]
   return jsonify({"predicted_price": round(float(prediction), 2)})

if __name__ == "__main__":
   app.run(debug=True)
