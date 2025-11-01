"""
FastAPI backend to serve the suicide detection model
Run with: uvicorn model_server:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Suicide Detection API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:9002"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variables
model = None
tokenizer = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class TextInput(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    confidence: float
    text: str

@app.on_event("startup")
async def load_model():
    """Load the trained model on startup"""
    global model, tokenizer
    
    try:
        model_path = "./suicide_detection_model"  # Adjust path as needed
        
        # Check if model exists
        if not os.path.exists(model_path):
            logger.error(f"Model not found at {model_path}")
            logger.info("Please run your notebook and save the model first")
            return
        
        # Load tokenizer and model
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        model.to(device)
        model.eval()
        
        logger.info(f"✅ Model loaded successfully on {device}")
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")

def predict_risk(text: str) -> dict:
    """Predict suicide risk from text"""
    if not model or not tokenizer:
        # Fallback to keyword-based detection
        return keyword_based_detection(text)
    
    try:
        # Tokenize input
        inputs = tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=256,
            return_tensors="pt"
        )
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Get prediction
        with torch.no_grad():
            outputs = model(**inputs)
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
        logger.error(f"Prediction failed: {e}")
        return keyword_based_detection(text)

def keyword_based_detection(text: str) -> dict:
    """Fallback keyword-based detection"""
    critical_keywords = [
        'kill myself', 'end my life', 'commit suicide', 'want to die',
        'better off dead', 'take my own life', 'end it all'
    ]
    
    high_risk_keywords = [
        'suicidal', 'hurt myself', 'self harm', 'not worth living',
        'want to disappear', 'pain too much', 'can\'t go on'
    ]
    
    moderate_keywords = [
        'hopeless', 'worthless', 'burden', 'empty inside',
        'nothing matters', 'why bother', 'give up'
    ]
    
    text_lower = text.lower()
    
    if any(keyword in text_lower for keyword in critical_keywords):
        return {"risk_score": 0.9, "risk_level": "critical", "confidence": 0.85}
    elif any(keyword in text_lower for keyword in high_risk_keywords):
        return {"risk_score": 0.7, "risk_level": "high", "confidence": 0.75}
    elif any(keyword in text_lower for keyword in moderate_keywords):
        return {"risk_score": 0.4, "risk_level": "moderate", "confidence": 0.65}
    else:
        return {"risk_score": 0.1, "risk_level": "safe", "confidence": 0.9}

@app.post("/predict", response_model=PredictionResponse)
async def predict_suicide_risk(input_data: TextInput):
    """Predict suicide risk from text input"""
    try:
        if not input_data.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
        
        prediction = predict_risk(input_data.text)
        
        return PredictionResponse(
            risk_score=prediction["risk_score"],
            risk_level=prediction["risk_level"],
            confidence=prediction["confidence"],
            text=input_data.text
        )
        
    except Exception as e:
        logger.error(f"Prediction endpoint failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not_loaded"
    return {
        "status": "healthy",
        "model_status": model_status,
        "device": str(device)
    }

@app.get("/test")
async def test_model():
    """Test the model with sample inputs"""
    test_cases = [
        "I feel really sad today",
        "I don't want to live anymore", 
        "Everything is fine",
        "I want to kill myself",
        "I'm having a great day"
    ]
    
    results = []
    for text in test_cases:
        prediction = predict_risk(text)
        results.append({
            "text": text,
            "risk_score": prediction["risk_score"],
            "risk_level": prediction["risk_level"],
            "confidence": prediction["confidence"]
        })
    
    return {"test_results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)