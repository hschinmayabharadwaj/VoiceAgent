'use client';

import { useTheme, ThemeMode, AccentColor } from '@/contexts/theme-context';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const themeModes: { value: ThemeMode; icon: React.ElementType; labelKey: string }[] = [
  { value: 'light', icon: Sun, labelKey: 'theme.light' },
  { value: 'dark', icon: Moon, labelKey: 'theme.dark' },
  { value: 'system', icon: Monitor, labelKey: 'theme.system' },
];

const accentColors: { value: AccentColor; color: string; labelKey: string }[] = [
  { value: 'teal', color: 'bg-teal-500', labelKey: 'theme.teal' },
  { value: 'purple', color: 'bg-purple-500', labelKey: 'theme.purple' },
  { value: 'blue', color: 'bg-blue-500', labelKey: 'theme.blue' },
  { value: 'green', color: 'bg-green-500', labelKey: 'theme.green' },
  { value: 'orange', color: 'bg-orange-500', labelKey: 'theme.orange' },
  { value: 'pink', color: 'bg-pink-500', labelKey: 'theme.pink' },
];

export function ThemeSelector() {
  const { mode, setMode, accentColor, setAccentColor } = useTheme();
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('theme.title')}</CardTitle>
        <CardDescription>{t('theme.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Mode */}
        <div className="space-y-3">
          <Label>{t('theme.mode')}</Label>
          <div className="flex gap-2">
            {themeModes.map(({ value, icon: Icon, labelKey }) => (
              <Button
                key={value}
                variant={mode === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode(value)}
                className="flex-1 gap-2"
                aria-pressed={mode === value}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {t(labelKey)}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Accent Color */}
        <div className="space-y-3">
          <Label>{t('theme.colors')}</Label>
          <div className="flex flex-wrap gap-3">
            {accentColors.map(({ value, color, labelKey }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAccentColor(value)}
                className={`relative w-10 h-10 rounded-full ${color} flex items-center justify-center transition-all ${
                  accentColor === value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                }`}
                aria-label={t(labelKey)}
                aria-pressed={accentColor === value}
              >
                {accentColor === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check className="w-5 h-5 text-white" aria-hidden="true" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {t(`theme.${accentColor}`)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
