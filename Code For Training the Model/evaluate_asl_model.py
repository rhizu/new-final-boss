# File: Code For Training the Model/evaluate_asl_model_dummy.py

import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    ConfusionMatrixDisplay,
    precision_recall_fscore_support,
)
import random

# --- 1. Define ASL gesture labels ---
labels = [
    "A", "B", "Bye", "C", "D", "Deaf", "E", "F", "G", "H", "Hello",
    "I", "ILoveYou", "J", "K", "L", "Learn", "M", "Me", "Meet",
    "Name", "N", "No", "NotOk", "O", "Ok", "P", "Pen", "Please",
    "Q", "R", "S", "T", "Tell", "Thankyou", "U", "V", "W", "X",
    "Y", "Yes", "none"
]

# --- 2. Generate dummy test dataset (20 samples per class) ---
samples_per_class = 20  # updated to 20 for test data
y_true, y_pred = [], []

low_accuracy_letters = ["M", "P", "Q", "X"]
high_accuracy_prob = 0.95
low_accuracy_prob = 0.65

for label in labels:
    for _ in range(samples_per_class):
        y_true.append(label)
        correct_prob = low_accuracy_prob if label in low_accuracy_letters else high_accuracy_prob
        if random.random() < correct_prob:
            y_pred.append(label)
        else:
            y_pred.append(random.choice([l for l in labels if l != label]))

# --- 3. Classification Report ---
print("\n=== Classification Report ===\n")
print(classification_report(y_true, y_pred, zero_division=0))

# --- 4. Mean Metrics ---
precisions, recalls, fscores, _ = precision_recall_fscore_support(
    y_true, y_pred, labels=labels, zero_division=0
)
mean_average_precision = np.mean(precisions)
mean_average_recall = np.mean(recalls)
mean_f1_score = np.mean(fscores)

print(f"\nMean Average Precision (mAP): {mean_average_precision:.4f}")
print(f"Mean Average Recall (mAR): {mean_average_recall:.4f}")
print(f"Mean F1 Score (mF1): {mean_f1_score:.4f}")

# --- 5. Confusion Matrix ---
cm = confusion_matrix(y_true, y_pred, labels=labels)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
plt.figure(figsize=(12, 10))
disp.plot(cmap='Blues', xticks_rotation=45, colorbar=True)
plt.title("Confusion Matrix - ASL Gesture Recognition")
plt.tight_layout()
plt.savefig("dummy_confusion_matrix_variable.png", dpi=300)
plt.show()

# --- 6. mAP per Gesture Bar Chart ---
plt.figure(figsize=(14, 6))
plt.bar(labels, precisions, color='#2E8B57')
plt.title("Mean Average Precision (mAP) per ASL Gesture")
plt.ylabel("Precision")
plt.ylim(0, 1.0)
plt.xticks(rotation=45, ha='right')
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Annotate each bar with its value
for i, val in enumerate(precisions):
    plt.text(i, val + 0.02, f"{val:.2f}", ha='center', va='bottom', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig("map_per_gesture_bar_variable.png", dpi=300)
plt.show()
