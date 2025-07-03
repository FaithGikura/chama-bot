
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Calendar } from "lucide-react";
import { Member } from "@/types/chama";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

interface AddMemberDialogProps {
  onAddMember: (member: Omit<Member, 'id'>) => void;
}

const AddMemberDialog = ({ onAddMember }: AddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    monthlyContribution: "",
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phoneNumber || !formData.monthlyContribution || !formData.dueDate) {
      toast.error(t('fillAllFields'));
      return;
    }

    // Validate phone number (basic Kenyan format)
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error(t('invalidPhoneFormat'));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMember: Omit<Member, 'id'> = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      monthlyContribution: parseInt(formData.monthlyContribution),
      dueDate: formData.dueDate,
      hasPaid: false,
      lastPaymentDate: null,
      joinedDate: new Date().toISOString(),
    };

    onAddMember(newMember);
    
    // Reset form
    setFormData({
      name: "",
      phoneNumber: "",
      monthlyContribution: "",
      dueDate: "",
    });
    
    setIsSubmitting(false);
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Set default due date to end of current month
  const getDefaultDueDate = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
          <UserPlus className="h-4 w-4" />
          {t('addMember')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t('addNewMember')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fullName')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('enterFullName')}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phoneNumber')} *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="0722123456 or +254722123456"
              disabled={isSubmitting}
              className="w-full"
            />
            <p className="text-xs text-gray-500">{t('phoneFormat')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution">{t('monthlyContribution')} (KES) *</Label>
            <Input
              id="contribution"
              type="number"
              min="100"
              step="50"
              value={formData.monthlyContribution}
              onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
              placeholder="1000"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">{t('paymentDueDate')} *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || getDefaultDueDate()}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('adding')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t('addMember')}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
