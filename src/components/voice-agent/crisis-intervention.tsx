'use client';

import { AlertTriangle, Phone, MessageCircle, Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CrisisInterventionProps {
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  onAcknowledge: () => void;
  onContinueConversation: () => void;
}

export function CrisisIntervention({ riskLevel, onAcknowledge, onContinueConversation }: CrisisInterventionProps) {
  if (riskLevel === 'safe') return null;

  const helplines = [
    { name: 'Vandrevala Foundation', number: '9999666555', country: 'India' },
    { name: 'iCall', number: '9152987821', country: 'India' },
    { name: 'Aasra', number: '9820466726', country: 'India' },
    { name: 'National Suicide Prevention Lifeline', number: '988', country: 'US' },
  ];

  const getAlertVariant = () => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'moderate': return 'default';
      default: return 'default';
    }
  };

  const getMessage = () => {
    switch (riskLevel) {
      case 'critical':
        return "I'm deeply concerned about what you're sharing. Your life has immense value, and there are people ready to help you right now.";
      case 'high':
        return "I can hear that you're going through an incredibly difficult time. You don't have to face this alone.";
      case 'moderate':
        return "It sounds like you're struggling. Reaching out for support shows real strength.";
      default:
        return "I'm here to support you.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {riskLevel === 'critical' || riskLevel === 'high' ? (
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            ) : (
              <div className="p-3 bg-blue-100 rounded-full">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl font-headline">
            {riskLevel === 'critical' ? 'Immediate Support Available' : 'Support Resources'}
          </CardTitle>
          <CardDescription className="text-base">
            {getMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {(riskLevel === 'critical' || riskLevel === 'high') && (
            <Alert variant={getAlertVariant()}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Crisis Support</AlertTitle>
              <AlertDescription>
                If you're having thoughts of self-harm, please reach out immediately. These services are free, confidential, and available 24/7.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Crisis Helplines</h3>
            <div className="grid gap-3">
              {helplines.map((helpline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{helpline.name}</p>
                    <p className="text-sm text-muted-foreground">{helpline.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{helpline.number}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.open(`tel:${helpline.number}`, '_self');
                        }
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {riskLevel === 'critical' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Immediate Steps:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Call one of the helplines above right now</li>
                <li>• Go to your nearest emergency room</li>
                <li>• Call emergency services (911 in US, 102 in India)</li>
                <li>• Stay with a trusted friend or family member</li>
              </ul>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Remember:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You are not alone in this</li>
              <li>• Your life has value and meaning</li>
              <li>• These feelings can change with proper support</li>
              <li>• Reaching out shows courage and strength</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={onAcknowledge}
              className="flex-1"
              variant={riskLevel === 'critical' ? 'default' : 'default'}
            >
              I understand - Show me resources
            </Button>
            {riskLevel !== 'critical' && (
              <Button 
                onClick={onContinueConversation}
                variant="outline"
                className="flex-1"
              >
                Continue conversation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}