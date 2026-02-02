'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Phone, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { motion, AnimatePresence } from 'framer-motion';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const STORAGE_KEY = 'manasmitra_emergency_contacts';

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContacts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse emergency contacts:', e);
      }
    }
  }, []);
  
  const saveContacts = (newContacts: EmergencyContact[]) => {
    setContacts(newContacts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
  };
  
  const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: crypto.randomUUID() };
    saveContacts([...contacts, newContact]);
    return newContact;
  };
  
  const removeContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
  };
  
  const updateContact = (id: string, updates: Partial<EmergencyContact>) => {
    saveContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  
  return { contacts, addContact, removeContact, updateContact };
}

export function EmergencyContactsManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { contacts, addContact, removeContact } = useEmergencyContacts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: t('emergency.error'),
        description: t('emergency.requiredFields'),
        variant: 'destructive',
      });
      return;
    }
    
    addContact(newContact);
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsDialogOpen(false);
    toast({
      title: t('emergency.added'),
      description: t('emergency.addedDesc'),
    });
  };
  
  const handleRemoveContact = (id: string, name: string) => {
    removeContact(id);
    toast({
      title: t('emergency.removed'),
      description: `${name} ${t('emergency.removedDesc')}`,
    });
  };
  
  const handleCallContact = (phone: string) => {
    window.open(`tel:${phone.replace(/\D/g, '')}`, '_blank');
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          <CardTitle>{t('emergency.title')}</CardTitle>
        </div>
        <CardDescription>{t('emergency.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="popLayout">
          {contacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground"
            >
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p>{t('emergency.noContacts')}</p>
              <p className="text-sm">{t('emergency.addFirst')}</p>
            </motion.div>
          ) : (
            contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.relationship && `${contact.relationship} • `}
                      {contact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCallContact(contact.phone)}
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveContact(contact.id, contact.name)}
                    aria-label={`Remove ${contact.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              {t('emergency.addContact')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('emergency.addTitle')}</DialogTitle>
              <DialogDescription>{t('emergency.addDescription')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">{t('emergency.name')} *</Label>
                <Input
                  id="contact-name"
                  placeholder={t('emergency.namePlaceholder')}
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">{t('emergency.phone')} *</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder={t('emergency.phonePlaceholder')}
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-relationship">{t('emergency.relationship')}</Label>
                <Input
                  id="contact-relationship"
                  placeholder={t('emergency.relationshipPlaceholder')}
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleAddContact}>
                {t('emergency.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
