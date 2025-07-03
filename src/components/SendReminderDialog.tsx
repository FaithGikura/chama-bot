
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Users } from "lucide-react";
import { Member } from "@/types/chama";
import { useLanguage } from "@/hooks/useLanguage";

interface SendReminderDialogProps {
  selectedMemberIds: string[];
  members: Member[];
  onSendReminder: (memberIds: string[], message: string) => void;
  disabled?: boolean;
}

const SendReminderDialog = ({ selectedMemberIds, members, onSendReminder, disabled }: SendReminderDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { t, language } = useLanguage();

  const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id));

  const templates = {
    en: {
      gentle: "Hi {name}! This is a friendly reminder that your Chama contribution of KES {amount} is due on {dueDate}. Thank you for being part of our group! 😊",
      urgent: "Hello {name}, your Chama payment of KES {amount} was due on {dueDate}. Please make your contribution as soon as possible to avoid penalties. Thank you!",
      weekly: "Weekly Update: Hi {name}! Just a reminder that your monthly contribution of KES {amount} is coming up on {dueDate}. Stay ahead! 💪",
      balance: "Hi {name}! Your current balance status: {status}. Next payment due: {dueDate} (KES {amount}). Questions? Reply to this message!"
    },
    sw: {
      gentle: "Hujambo {name}! Hii ni ukumbusho wa kirafiki kuwa mchango wako wa Chama wa KES {amount} unastahili {dueDate}. Asante kwa kuwa sehemu ya kikundi chetu! 😊",
      urgent: "Hujambo {name}, malipo yako ya Chama ya KES {amount} yalipaswa kulipwa {dueDate}. Tafadhali fanya mchango wako haraka iwezekanavyo ili kuepuka faini. Asante!",
      weekly: "Ripoti ya Kila Wiki: Hujambo {name}! Ukumbusho tu kuwa mchango wako wa kila mwezi wa KES {amount} unakuja {dueDate}. Jongea mbele! 💪",
      balance: "Hujambo {name}! Hali yako ya sasa ya akaunti: {status}. Malipo yanayofuata: {dueDate} (KES {amount}). Una maswali? Jibu ujumbe huu!"
    }
  };

  const handleTemplateSelect = (templateType: string) => {
    setTemplate(templateType);
    setMessage(templates[language as keyof typeof templates]?.[templateType as keyof typeof templates.en] || "");
  };

  const handleSend = async () => {
    if (!message.trim() || selectedMemberIds.length === 0) return;
    
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onSendReminder(selectedMemberIds, message);
    setIsSending(false);
    setIsOpen(false);
    setMessage("");
    setTemplate("");
  };

  const previewMessage = (member: Member) => {
    return message
      .replace('{name}', member.name)
      .replace('{amount}', member.monthlyContribution.toLocaleString())
      .replace('{dueDate}', new Date(member.dueDate).toLocaleDateString())
      .replace('{status}', member.hasPaid ? t('paid') : t('pending'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={disabled}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <MessageCircle className="h-4 w-4" />
          {t('sendReminder')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {t('sendPaymentReminder')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selected Members */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('selectedMembers')} ({selectedMembers.length})
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
              {selectedMembers.map(member => (
                <Badge key={member.id} variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {member.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Message Templates */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t('messageTemplate')}</label>
            <Select value={template} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder={t('chooseTemplate')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gentle">{t('gentleReminder')}</SelectItem>
                <SelectItem value="urgent">{t('urgentReminder')}</SelectItem>
                <SelectItem value="weekly">{t('weeklyUpdate')}</SelectItem>
                <SelectItem value="balance">{t('balanceUpdate')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Composer */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t('customMessage')}</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('typeCustomMessage')}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('useVariables')}: {'{name}, {amount}, {dueDate}, {status}'}
            </p>
          </div>

          {/* Message Preview */}
          {message && selectedMembers.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">{t('messagePreview')}</label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {selectedMembers.slice(0, 3).map(member => (
                    <div key={member.id} className="text-sm">
                      <span className="font-medium text-green-800">To {member.name}:</span>
                      <p className="text-green-700 mt-1">{previewMessage(member)}</p>
                    </div>
                  ))}
                  {selectedMembers.length > 3 && (
                    <p className="text-sm text-green-600 italic">
                      ...{t('andMoreMembers', { count: selectedMembers.length - 3 })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSending}
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || selectedMemberIds.length === 0 || isSending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('sending')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t('sendToMembers', { count: selectedMemberIds.length })}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendReminderDialog;
