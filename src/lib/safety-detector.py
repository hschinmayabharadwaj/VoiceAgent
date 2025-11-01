"""
Safety Detection Service for ManasMitra
Integrates the trained suicidal ideation detection model with the voice agent
"""

import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import Dict, Tuple
import logging

class SuicidalIdeationDetector:
    def __init__(self, model_path: str = "out_model"):
        """
        Initialize the suicidal ideation detection model
        
        Args:
            model_path: Path to the trained model directory
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_name = "distilbert-base-uncased"
        self.max_length = 256
        
        # Load tokenizer and model
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(
                model_path if model_path else self.model_name
            )
            self.model.to(self.device)
            self.model.eval()
            logging.info(f"✅ Suicidal ideation detector loaded on {self.device}")
        except Exception as e:
            logging.error(f"❌ Failed to load model: {e}")
            raise
    
    def predict(self, text: str) -> Dict[str, float]:
        """
        Predict suicidal ideation risk from text
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dictionary with risk_score (0-1) and confidence
        """
        if not text or not text.strip():
            return {"risk_score": 0.0, "confidence": 0.0, "risk_level": "safe"}
        
        try:
            # Tokenize input
            inputs = self.tokenizer(
                text,
                truncation=True,
                padding="max_length",
                max_length=self.max_length,
                return_tensors="pt"
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Get prediction
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.softmax(logits, dim=-1)
                
            # Extract scores
            risk_score = probabilities[0][1].item()  # Probability of suicidal class
            confidence = torch.max(probabilities).item()
            
            # Determine risk level
            if risk_score > 0.8:
                risk_level = "critical"
            elif risk_score > 0.6:
                risk_level = "high"
            elif risk_score > 0.3:
                risk_level = "moderate"
            else:
                risk_level = "safe"
            
            return {
                "risk_score": risk_score,
                "confidence": confidence,
                "risk_level": risk_level
            }
            
        except Exception as e:
            logging.error(f"❌ Prediction failed: {e}")
            return {"risk_score": 0.0, "confidence": 0.0, "risk_level": "safe"}
    
    def get_crisis_response(self, risk_level: str) -> Dict[str, str]:
        """
        Get appropriate crisis response based on risk level
        
        Args:
            risk_level: Risk level from prediction
            
        Returns:
            Dictionary with response message and actions
        """
        crisis_responses = {
            "critical": {
                "message": "I'm really concerned about what you're sharing with me. Your life has value and there are people who want to help. Please reach out to a crisis helpline immediately.",
                "helplines": [
                    "National Suicide Prevention Lifeline: 988 (US)",
                    "Crisis Text Line: Text HOME to 741741",
                    "Vandrevala Foundation: 9999666555 (India)",
                    "Aasra: 9820466726 (India)"
                ],
                "immediate_action": True
            },
            "high": {
                "message": "I hear that you're going through a really difficult time. These feelings can be overwhelming, but you don't have to face them alone. Please consider reaching out to a professional.",
                "helplines": [
                    "National Suicide Prevention Lifeline: 988 (US)",
                    "Vandrevala Foundation: 9999666555 (India)",
                    "iCall: 9152987821 (India)"
                ],
                "immediate_action": False
            },
            "moderate": {
                "message": "It sounds like you're struggling right now. It's important to talk to someone who can provide proper support. Consider reaching out to a counselor or trusted person.",
                "helplines": [
                    "National Suicide Prevention Lifeline: 988 (US)",
                    "Vandrevala Foundation: 9999666555 (India)"
                ],
                "immediate_action": False
            },
            "safe": {
                "message": "I'm here to listen and support you. It takes courage to share your feelings.",
                "helplines": [],
                "immediate_action": False
            }
        }
        
        return crisis_responses.get(risk_level, crisis_responses["safe"])

# Singleton instance
_detector_instance = None

def get_safety_detector() -> SuicidalIdeationDetector:
    """Get singleton instance of the safety detector"""
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = SuicidalIdeationDetector()
    return _detector_instance