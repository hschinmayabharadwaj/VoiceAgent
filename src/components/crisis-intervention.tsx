'use client';

import React from 'react';
import { AlertTriangle, Phone, MessageCircle, Heart, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CrisisInterventionProps {
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  mlPrediction?: {
    risk_score: number;
    risk_level: string;
    confidence: number;
  } | null;
  onDismiss?: () => void;
}

const CRISIS_HELPLINES = {
  india: [
    { name: "Vandrevala Foundation", number: "9999666555", available: "24/7" },
    { name: "iCall", number: "9152987821", available: "Mon-Sat, 8AM-10PM" },
    { name: "Aasra", number: "9820466726", available: "24/7" },
    { name: "Sneha", number: "044-24640050", available: "24/7" }
  ],
  international: [
    { name: "National Suicide Prevention Lifeline (US)", number: "988", available: "24/7" },
    { name: "Crisis Text Line (US)", number: "Text HOME to 741741", available: "24/7" },
    { name: "Samaritans (UK)", number: "116 123", available: "24/7" }
  ]
};

export function CrisisIntervention({ riskLevel, mlPrediction, onDismiss }: CrisisInterventionProps) {
  if (riskLevel === 'safe') return null;

  const isCritical = riskLevel === 'critical';
  const isHighRisk = riskLevel === 'high' || isCritical;

  const makePhoneCall = (number: string) => {
    if (number.includes('Text')) {
      // Handle text services differently
      navigator.clipboard.writeText(number).then(() => {
        alert('Instructions copied to clipboard: ' + number);
      });
    } else {
      // Format for phone call
      const cleanNumber = number.replace(/[^\d]/g, '');
      window.location.href = `tel:${cleanNumber}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        isCritical ? 'border-red-500 border-2' : 'border-orange-500'
      }`}>
        <CardHeader className={`${isCritical ? 'bg-red-50' : 'bg-orange-50'}`}>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={`h-6 w-6 ${isCritical ? 'text-red-600' : 'text-orange-600'}`} />
            {isCritical ? 'Immediate Support Needed' : 'We\'re Here to Help'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Risk Assessment Display */}
          {mlPrediction && (
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>AI Safety Assessment:</strong> Risk Level {mlPrediction.risk_level} 
                ({Math.round(mlPrediction.risk_score * 100)}% confidence: {Math.round(mlPrediction.confidence * 100)}%)
              </AlertDescription>
            </Alert>
          )}

          {/* Crisis Message */}
          <Alert className={isCritical ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}>
            <Heart className={`h-4 w-4 ${isCritical ? 'text-red-600' : 'text-orange-600'}`} />
            <AlertDescription className="text-lg">
              {isCritical ? (
                <>
                  <strong>Your life has value and meaning.</strong> You don't have to face this alone. 
                  Professional help is available right now - please reach out immediately.
                </>
              ) : (
                <>
                  <strong>It takes courage to share how you're feeling.</strong> You've taken an important 
                  step by talking about this. Support is available.
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Immediate Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {isCritical ? 'Call Now - Don\'t Wait' : 'Talk to Someone Today'}
            </h3>
            
            <div className="grid gap-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🇮🇳 India Crisis Helplines</h4>
                <div className="grid gap-2">
                  {CRISIS_HELPLINES.india.map((helpline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{helpline.name}</div>
                        <div className="text-sm text-gray-600">{helpline.available}</div>
                      </div>
                      <Button
                        onClick={() => makePhoneCall(helpline.number)}
                        variant={isCritical ? "destructive" : "default"}
                        size="sm"
                        className="ml-2"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {helpline.number}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">🌍 International Helplines</h4>
                <div className="grid gap-2">
                  {CRISIS_HELPLINES.international.map((helpline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{helpline.name}</div>
                        <div className="text-sm text-gray-600">{helpline.available}</div>
                      </div>
                      <Button
                        onClick={() => makePhoneCall(helpline.number)}
                        variant="outline"
                        size="sm"
                        className="ml-2"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {helpline.number}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Safety Planning */}
          {!isCritical && (
            <div className="space-y-3">
              <h3 className="font-semibold">Immediate Coping Strategies:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Reach out to a trusted friend or family member</li>
                <li>Use grounding techniques: 5 things you see, 4 you hear, 3 you touch</li>
                <li>Practice deep breathing or try our mindfulness exercises</li>
                <li>Remove any means of self-harm from your immediate area</li>
                <li>Stay in a safe, public place if possible</li>
              </ul>
            </div>
          )}

          {/* Professional Resources */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Professional Support Options:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Visit your nearest emergency room</li>
              <li>• Contact your doctor or mental health professional</li>
              <li>• Call emergency services (102 in India, 911 in US)</li>
              <li>• Use crisis chat services available online</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isCritical ? (
              <Button 
                onClick={() => makePhoneCall('9999666555')} 
                className="flex-1"
                variant="destructive"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Crisis Line Now
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => makePhoneCall('9999666555')} 
                  className="flex-1"
                  variant="default"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Talk to Someone
                </Button>
                {onDismiss && (
                  <Button 
                    onClick={onDismiss} 
                    variant="outline"
                    className="flex-1"
                  >
                    Continue Chat
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Footer Message */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            <p className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Remember: This crisis will pass. You are not alone. Help is available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}