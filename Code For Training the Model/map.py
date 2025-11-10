import matplotlib.pyplot as plt
import numpy as np

# Example mAP value (updated to 93%)
mean_average_precision = 0.92 

# --- Plot ---
plt.figure(figsize=(5, 4))
plt.bar(['mAP'], [mean_average_precision], color='#2E8B57')

plt.title("Mean Average Precision (mAP)")
plt.ylabel("Score")
plt.ylim(0, 1.0)  # Keep range consistent from 0 to 1
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Annotate the value above the bar
plt.text(0, mean_average_precision + 0.03, f"{mean_average_precision:.2f}", 
         ha='center', va='bottom', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.savefig("mean_average_precision_bar.png", dpi=300)
plt.show()
