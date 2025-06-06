from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models

app = Flask(__name__)

# First, recreate the model architecture
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

model = models.Sequential([
   base_model,
   layers.GlobalAveragePooling2D(),
   layers.Dense(1, activation='sigmoid')
])

# Then load the weights
model.load_weights("dog_cat_classifier.keras")

# Compile the model
model.compile(optimizer='adam',
             loss='binary_crossentropy',
             metrics=['accuracy'])

# Preprocessing function
def prepare_image(img, target_size=(224, 224)):
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(target_size)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    try:
        img = Image.open(io.BytesIO(file.read()))
        processed_img = prepare_image(img)
        prediction = model.predict(processed_img)

        result = "Dog" if prediction[0][0] > 0.5 else "Cat"
        confidence = float(prediction[0][0])

        return jsonify({
            "prediction": result,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
