# -*- coding: utf-8 -*-
"""Pet_adoption.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/13_gZY_HQD5MCIZYXxaIYa9AX6UnRM2OS
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC

df = pd.read_excel("pet_adoption_data.xlsx")

df.head(20)

df.isnull().sum()

print (df.columns)

df = df.rename (columns = {"Vaccinated/تطعيم" : "Vaccinated"})

print (df.columns)

df.info()

print(df.duplicated().sum())

label_encoders = {}
for col in ['PetType', 'Breed', 'Color', 'Size']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

X = df.drop(columns=['PetID', 'AdoptionLikelihood'])
y = df['AdoptionLikelihood']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

df.head()

df.info()

print(df.describe())

df.head(50)

model = DecisionTreeClassifier(max_depth=8, min_samples_split=10, random_state=42)
model.fit(X_train, y_train)

y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

train_acc = accuracy_score(y_train, y_train_pred) * 100
test_acc = accuracy_score(y_test, y_test_pred) * 100

print(f"==== Decision Tree ====")
print(f"Train Accuracy: {train_acc:.2f}%")
print(f"Test Accuracy: {test_acc:.2f}%")
print("Confusion Matrix:\n", confusion_matrix(y_test, y_test_pred))

plt.figure(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_test_pred), annot=True, fmt='d', cmap="Blues")
plt.title("Decision Tree - Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.show()

model = RandomForestClassifier(n_estimators=100, max_depth=6, min_samples_split=10, random_state=42)
model.fit(X_train, y_train)

y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

train_acc = accuracy_score(y_train, y_train_pred) * 100
test_acc = accuracy_score(y_test, y_test_pred) * 100

print(f"==== Random Forest ====")
print(f"Train Accuracy: {train_acc:.2f}%")
print(f"Test Accuracy: {test_acc:.2f}%")
print("Confusion Matrix:\n", confusion_matrix(y_test, y_test_pred))

plt.figure(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_test_pred), annot=True, fmt='d', cmap="Blues")
plt.title("Random Forest - Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.show()

model = SVC(random_state=42)
model.fit(X_train_scaled, y_train)

y_train_pred = model.predict(X_train_scaled)
y_test_pred = model.predict(X_test_scaled)

train_acc = accuracy_score(y_train, y_train_pred) * 100
test_acc = accuracy_score(y_test, y_test_pred) * 100

print(f"==== SVM ====")
print(f"Train Accuracy: {train_acc:.2f}%")
print(f"Test Accuracy: {test_acc:.2f}%")
print("Confusion Matrix:\n", confusion_matrix(y_test, y_test_pred))

plt.figure(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_test_pred), annot=True, fmt='d', cmap="Blues")
plt.title("SVM - Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.show()

model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_train_scaled, y_train)

y_train_pred = model.predict(X_train_scaled)
y_test_pred = model.predict(X_test_scaled)

train_acc = accuracy_score(y_train, y_train_pred) * 100
test_acc = accuracy_score(y_test, y_test_pred) * 100

print(f"==== Logistic Regression ====")
print(f"Train Accuracy: {train_acc:.2f}%")
print(f"Test Accuracy: {test_acc:.2f}%")
print("Confusion Matrix:\n", confusion_matrix(y_test, y_test_pred))

plt.figure(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_test_pred), annot=True, fmt='d', cmap="Blues")
plt.title("Logistic Regression - Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.show()

import matplotlib.pyplot as plt
import numpy as np

algorithms = ['Decision Tree', 'Random Forest', 'SVM', 'Logistic Regression']
train_accuracy = [95.14, 93.58, 89.91, 73.83]
test_accuracy = [93.28, 91.79, 86.57, 71.64]

x = np.arange(len(algorithms))
width = 0.35

fig, ax = plt.subplots(figsize=(12, 6))

rects1 = ax.bar(x - width/2, train_accuracy, width, label='Train', color='#1f77b4')
rects2 = ax.bar(x + width/2, test_accuracy, width, label='Test', color='#ff7f0e')

ax.set_ylabel('Accuracy (%)', fontsize=12)
ax.set_title('Model Performance Comparison', fontsize=14, pad=20)
ax.set_xticks(x)
ax.set_xticklabels(algorithms, fontsize=11)
ax.legend(fontsize=12)

ax.bar_label(rects1, padding=3, fmt='%.2f%%')
ax.bar_label(rects2, padding=3, fmt='%.2f%%')

plt.ylim(60, 100)
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()

import pickle

with open('Pet_adoption.pkl', 'wb') as f:
    pickle.dump(DecisionTreeClassifier, f)

from google.colab import files
files.download('Pet_adoption.pkl')