'use client';

import { useLanguage, SUPPORTED_LANGUAGES, Language } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function LanguageSelector() {
  const { language, setLanguage, t, languageInfo } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
          <CardTitle>{t('language.title')}</CardTitle>
        </div>
        <CardDescription>{t('language.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="language-select">{t('language.select')}</Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger id="language-select" className="w-full">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span>{languageInfo.nativeName}</span>
                  <span className="text-muted-foreground">({languageInfo.name})</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground">({lang.name})</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 ml-auto text-primary" aria-hidden="true" />
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Preview */}
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-muted/50 rounded-lg"
        >
          <p className="text-sm text-muted-foreground mb-1">Preview:</p>
          <p className="font-medium" dir={languageInfo.direction}>
            {t('common.welcome')} - {t('dashboard.affirmation')}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function LanguageSelectorCompact() {
  const { language, setLanguage, languageInfo } = useLanguage();
  
  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-auto gap-2" aria-label="Select language">
        <Globe className="w-4 h-4" aria-hidden="true" />
        <SelectValue>
          <span>{languageInfo.code.toUpperCase()}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.nativeName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
