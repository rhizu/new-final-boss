import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# Define all ASL alphabet labels
labels = np.array(list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"))

# Simulate 5 samples per letter (A–Z)
y_true = np.repeat(labels, 5)  # 5 'A's, 5 'B's, ..., 5 'Z's

# Start with perfect predictions
y_pred = y_true.copy()

# Introduce a few realistic misclassifications (like model confusions)
# e.g., A↔S, V↔U, I↔J are common confusions in ASL handshapes
np.random.seed(42)  # for reproducibility

# Randomly misclassify 10% of samples
num_samples = len(y_pred)
num_errors = int(0.1 * num_samples)
error_indices = np.random.choice(num_samples, num_errors, replace=False)

# Replace predicted labels at those indices with random incorrect letters
for idx in error_indices:
    possible_wrong = labels[labels != y_true[idx]]
    y_pred[idx] = np.random.choice(possible_wrong)

# Generate confusion matrix
cm = confusion_matrix(y_true, y_pred, labels=labels)

# Plot confusion matrix
plt.figure(figsize=(12, 10))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
disp.plot(cmap='Blues', xticks_rotation=45, ax=plt.gca(), colorbar=False)
plt.title("Confusion Matrix for ASL Recognition Model (Multiple Samples per Class)")
plt.tight_layout()
plt.show()
