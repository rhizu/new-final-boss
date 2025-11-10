import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    ConfusionMatrixDisplay,
    precision_recall_fscore_support,
    precision_recall_curve,
    average_precision_score
)
import random

# --- 1. Define ASL gesture labels ---
labels = [
    "A", "B", "Bye", "C", "D", "Deaf", "E", "F", "G", "H", "Hello", "I", "ILoveYou",
    "J", "K", "L", "Learn", "M", "Me", "Meet", "Name", "N", "No", "NotOk", "O", "Ok",
    "P", "Pen", "Please", "Q", "R", "S", "T", "Tell", "Thankyou", "U", "V", "W", "X",
    "Y", "Yes", "none"
]

# --- 2. Generate dummy dataset ---
samples_per_class = 100
y_true, y_pred_probs = [], []

low_accuracy_letters = ["M", "P", "Q", "X"]
high_accuracy_prob = 0.95
low_accuracy_prob = 0.65

for label in labels:
    for _ in range(samples_per_class):
        y_true.append(label)
        correct_prob = low_accuracy_prob if label in low_accuracy_letters else high_accuracy_prob
        # Simulate predicted probabilities
        prob_vector = np.random.rand(len(labels)) * 0.2  # small random noise
        idx = labels.index(label)
        if random.random() < correct_prob:
            prob_vector[idx] = 0.9 + 0.1 * np.random.rand()  # high probability for correct class
        else:
            prob_vector[idx] = 0.1 * np.random.rand()  # low probability for correct class
        prob_vector = prob_vector / np.sum(prob_vector)  # normalize to sum=1
        y_pred_probs.append(prob_vector)

y_pred_probs = np.array(y_pred_probs)

# --- 3. Classification Report ---
y_pred_labels = [labels[np.argmax(p)] for p in y_pred_probs]
print("\n=== Classification Report ===\n")
print(classification_report(y_true, y_pred_labels, zero_division=0))

# --- 4. Mean Metrics ---
precisions, recalls, fscores, _ = precision_recall_fscore_support(
    y_true, y_pred_labels, labels=labels, zero_division=0
)
mean_average_precision = np.mean(precisions)
mean_average_recall = np.mean(recalls)
mean_f1_score = np.mean(fscores)

print(f"\nMean Average Precision (mAP): {mean_average_precision:.4f}")
print(f"Mean Average Recall (mAR): {mean_average_recall:.4f}")
print(f"Mean F1 Score (mF1): {mean_f1_score:.4f}")

# --- 5. Confusion Matrix ---
cm = confusion_matrix(y_true, y_pred_labels, labels=labels)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)

plt.figure(figsize=(14, 10))
disp.plot(cmap='Blues', xticks_rotation=45, colorbar=True)
plt.title("Confusion Matrix - ASL Gesture Recognition", fontsize=16)
plt.tight_layout()
plt.savefig("dummy_confusion_matrix.png", dpi=300)
plt.show()

# --- 6. Mean Average Precision Bar Chart ---
plt.figure(figsize=(5, 4))
plt.bar(['mAP'], [mean_average_precision], color='#2E8B57')
plt.title("Mean Average Precision (mAP)")
plt.ylabel("Score")
plt.ylim(0, 1.0)
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.text(0, mean_average_precision + 0.03, f"{mean_average_precision:.2f}",
         ha='center', va='bottom', fontsize=12, fontweight='bold')
plt.tight_layout()
plt.savefig("mean_average_precision_bar.png", dpi=300)
plt.show()

# --- 7. One-hot encode y_true using NumPy ---
y_true_indices = [labels.index(lbl) for lbl in y_true]
y_true_onehot = np.zeros((len(y_true_indices), len(labels)))
for i, idx in enumerate(y_true_indices):
    y_true_onehot[i, idx] = 1

# --- 8. Precision-Recall Curves per Class ---
AP_scores = []
plt.figure(figsize=(14, 10))

for i, label in enumerate(labels):
    precision, recall, _ = precision_recall_curve(y_true_onehot[:, i], y_pred_probs[:, i])
    ap = average_precision_score(y_true_onehot[:, i], y_pred_probs[:, i])
    AP_scores.append(ap)
    plt.plot(recall, precision, label=f"{label} (AP={ap:.2f})")

plt.title("Precision-Recall Curve per ASL Gesture", fontsize=16)
plt.xlabel("Recall", fontsize=14)
plt.ylabel("Precision", fontsize=14)
plt.xlim(0, 1)
plt.ylim(0, 1)
plt.legend(bbox_to_anchor=(1.05, 1), loc="upper left", fontsize=8)
plt.tight_layout()
plt.savefig("precision_recall_curve_per_class.png", dpi=300)
plt.show()

# --- 9. Overall mAP ---
mAP = np.mean(AP_scores)
print(f"\n✅ Mean Average Precision (mAP) across all classes: {mAP:.4f}")
