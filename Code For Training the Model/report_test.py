import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics import classification_report

# Paste your classification report text here
report_text = """
precision    recall  f1-score   support

A       0.92      0.98      0.95       100
B       0.86      0.95      0.90       100
Bye       0.92      0.96      0.94       100
C       0.94      0.97      0.96       100
D       0.91      0.97      0.94       100
Deaf       0.96      0.96      0.96       100
E       0.92      0.95      0.94       100
F       0.95      0.91      0.93       100
G       0.94      0.97      0.96       100
H       0.96      0.99      0.98       100
Hello       0.93      0.92      0.92       100
I       0.91      0.95      0.93       100
ILoveYou       0.91      0.96      0.94       100
J       0.91      0.99      0.95       100
K       0.90      0.94      0.92       100
L       0.91      0.95      0.93       100
Learn       0.96      0.99      0.98       100
M       0.90      0.52      0.66       100
Me       0.96      0.97      0.97       100
Meet       0.89      0.93      0.91       100
N       0.94      0.95      0.95       100
Name       0.94      0.94      0.94       100
No       0.91      0.98      0.94       100
NotOk       0.89      0.97      0.93       100
O       0.91      0.92      0.92       100
Ok       0.95      0.95      0.95       100
P       0.92      0.65      0.76       100
Pen       0.93      0.97      0.95       100
Please       0.92      0.98      0.95       100
Q       0.91      0.63      0.75       100
R       0.92      0.94      0.93       100
S       0.94      0.92      0.93       100
T       0.91      0.96      0.94       100
Tell       0.89      0.91      0.90       100
Thankyou       0.91      0.95      0.93       100
U       0.91      0.95      0.93       100
V       0.93      0.95      0.94       100
W       0.95      0.93      0.94       100
X       0.89      0.62      0.73       100
Y       0.93      1.00      0.97       100
Yes       0.90      0.94      0.92       100
none       0.92      0.98      0.95       100
"""

# Convert report into DataFrame
report_data = []
for line in report_text.strip().split("\n")[2:]:
    parts = line.split()
    label = parts[0]
    precision = float(parts[1])
    recall = float(parts[2])
    f1 = float(parts[3])
    support = int(parts[4])
    report_data.append([label, precision, recall, f1, support])

df = pd.DataFrame(report_data, columns=["Label", "Precision", "Recall", "F1 Score", "Support"])

# ---- Graph: Precision, Recall, F1 ----
df.plot(x="Label", y=["Precision", "Recall", "F1 Score"], kind="bar", figsize=(18,8))
plt.title("Precision, Recall, and F1 Score per Class")
plt.xticks(rotation=90)
plt.ylabel("Score")
plt.show()

# ---- Graph: Support distribution ----
df.plot(x="Label", y="Support", kind="bar", figsize=(18,6))
plt.title("Support per Class")
plt.xticks(rotation=90)
plt.ylabel("Support Count")
plt.show()
