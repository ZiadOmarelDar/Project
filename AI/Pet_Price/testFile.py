import pickle
import numpy as np

# Step 1: Load model and preprocessing tools
with open("pet_price_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Step 2: List of features expected by the model
categorical_columns = [
    "Animal", "Breed", "Gender", "Health Condition", 
    "Size", "Color", "Location", "Training", "Popularity"
]
numerical_columns = ["Age"]  # Add other numerical ones if any

# Step 3: Input preprocessing
def preprocess_input(input_dict):
    features = []

    for col in categorical_columns:
        le = label_encoders[col]
        val = input_dict[col]
        encoded_val = le.transform([val])[0]  # Convert "Dog" => 1
        features.append(encoded_val)

    for col in numerical_columns:
        features.append(input_dict[col])

    features = np.array([features])  # shape: (1, n_features)
    features_scaled = scaler.transform(features)
    return features_scaled

# Step 4: Prediction function
def predict_price(input_dict):
    X_input = preprocess_input(input_dict)
    prediction = model.predict(X_input)
    return prediction[0]

test_data = {
    "Animal": "Dog",
    "Breed": "Golden Retriever",
    "Gender": "Male",
    "Health Condition": "Healthy",
    "Size": "Large",
    "Color": "Golden",
    "Location": "India",
    "Training": "Basic Training",
    "Popularity": "High",
    "Age": 3,
}

price = predict_price(test_data)
print(f"Predicted price: {price:2f}")
