# 🚀 ManasMitra ML Model Integration Guide

## **Complete Setup Process**

### **Step 1: Install Python Dependencies**

```powershell
# Create virtual environment (optional but recommended)
python -m venv ml_env
ml_env\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

### **Step 2: Train and Export Your Model**

1. **Run your Jupyter notebook** with the DistilBERT training code
2. **Export the trained model** using the provided `model_export.py`:

```powershell
python model_export.py
```

This will create a `suicide_detection_model/` folder with your trained model.

### **Step 3: Start the ML Model Server**

```powershell
# Start the FastAPI server
uvicorn model_server:app --host 0.0.0.0 --port 8000

# Or with auto-reload for development
uvicorn model_server:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```
✅ Model loaded successfully on cpu
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### **Step 4: Test ML Model API**

Open http://localhost:8000/docs in your browser to see the API documentation, or test directly:

```powershell
# Test the health endpoint
curl http://localhost:8000/health

# Test with sample data
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d '{"text": "I feel really sad today"}'
```

### **Step 5: Start Your Next.js Application**

```powershell
# In a new terminal, navigate to your project root
cd d:\mitra\Manas_Mitra_Chatbot

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

## **Testing the Voice Agent**

### **🟢 Safe Conversations (Should work normally)**
- "Hi, how are you today?"
- "I'm feeling a bit stressed about work"
- "Can you help me with some breathing exercises?"
- "I had a difficult day but I'm managing"
- "I'm looking forward to the weekend"

### **🟡 Moderate Risk Scenarios (Should show gentle support)**
- "I feel so hopeless about everything"
- "Nothing seems to matter anymore"
- "I feel like such a burden to everyone"
- "I'm so tired of everything"
- "Why do I even bother trying?"

### **🟠 High Risk Scenarios (Should show increased concern)**
- "I don't think I'm worth living"
- "I want to hurt myself"
- "I can't go on like this anymore"
- "Life is too painful"
- "I wish I could just disappear"

### **🔴 Critical Risk Scenarios (Should trigger crisis intervention)**
- "I want to kill myself"
- "I'm going to end my life"
- "I want to die"
- "I'm planning to commit suicide"
- "I'm better off dead"

## **What to Look For During Testing**

### **1. Console Logs**
Watch the browser console and terminal for:
```
🤖 ML Risk Analysis: { risk_score: 0.85, risk_level: "high", confidence: 0.92 }
🔍 Final Risk Assessment: { riskScore: 0.85, riskLevel: "high", confidence: 0.92 }
```

### **2. Response Types**
- **Safe**: Normal empathetic conversation
- **Moderate**: Gentle support and coping suggestions
- **High**: More concerned tone, offers resources
- **Critical**: Immediate crisis intervention with helpline numbers

### **3. Crisis Intervention UI**
For critical risk, you should see:
- Emergency helpline numbers
- "Talk to Someone Now" button
- Immediate professional help recommendations
- Elevated concern in the AI's response

## **Troubleshooting**

### **ML API Not Working?**
- Check if Python server is running on port 8000
- Verify model file exists in `./suicide_detection_model/`
- Check console for API connection errors

### **Model Not Loading?**
- Ensure you've run the Jupyter notebook and saved the model
- Check file permissions on the model directory
- Verify PyTorch and transformers versions match

### **Voice Agent Not Responding?**
- Check browser console for JavaScript errors
- Verify microphone permissions
- Ensure Genkit is properly configured

## **File Structure After Setup**

```
Manas_Mitra_Chatbot/
├── suicide_detection_model/           # Your trained ML model
│   ├── config.json
│   ├── model.safetensors
│   ├── tokenizer.json
│   └── ...
├── model_server.py                    # FastAPI server for ML model
├── model_export.py                    # Script to export trained model
├── requirements.txt                   # Python dependencies
├── safety-detector.py                 # Original model training code
└── src/
    ├── ai/flows/enhanced-voice-agent-flow.ts  # Enhanced with ML
    ├── lib/actions.ts                         # ML API integration
    └── components/crisis-intervention.tsx      # Crisis UI
```

## **Production Deployment Notes**

### **For Production:**
1. **Deploy ML API** to cloud service (AWS/GCP/Azure)
2. **Update API URL** in `actions.ts` from localhost to production URL
3. **Add authentication** and rate limiting to ML API
4. **Monitor model performance** and retrain as needed
5. **Set up logging** for safety incidents and interventions

### **Security Considerations:**
- Encrypt sensitive conversation data
- Implement proper crisis escalation procedures
- Ensure HIPAA compliance if handling health data
- Add audit trails for safety interventions

---

## **Ready to Test! 🎉**

1. ✅ Start Python ML server: `uvicorn model_server:app --host 0.0.0.0 --port 8000`
2. ✅ Start Next.js app: `npm run dev`
3. ✅ Navigate to http://localhost:3000/voice-agent
4. ✅ Test with the sample phrases above
5. ✅ Monitor console logs for ML predictions

Your voice agent now has **advanced ML-powered suicide detection** with **real-time crisis intervention capabilities**! 🧠💙