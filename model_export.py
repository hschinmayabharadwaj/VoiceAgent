# Add this cell to your notebook to save the model properly
import os
import torch

# Save the model and tokenizer
model_save_path = "./suicide_detection_model"
os.makedirs(model_save_path, exist_ok=True)

# Save the trained model
trainer.save_model(model_save_path)
tokenizer.save_pretrained(model_save_path)

print(f"✅ Model saved to {model_save_path}")

# Test the saved model
from transformers import pipeline

# Create inference pipeline
classifier = pipeline(
    "text-classification",
    model=model_save_path,
    tokenizer=model_save_path,
    device=0 if torch.cuda.is_available() else -1
)

# Test cases
test_texts = [
    "I feel really sad today",  # Should be low risk
    "I don't want to live anymore", # Should be high risk  
    "Everything is fine",  # Should be safe
    "I want to kill myself",  # Should be critical
    "I'm having a great day"  # Should be safe
]

print("\n🧪 Testing the model:")
for text in test_texts:
    result = classifier(text)
    risk_score = result[0]['score'] if result[0]['label'] == 'LABEL_1' else 1 - result[0]['score']
    print(f"Text: '{text}'")
    print(f"Risk Score: {risk_score:.3f}")
    print(f"Prediction: {'High Risk' if risk_score > 0.5 else 'Low Risk'}")
    print("-" * 50)