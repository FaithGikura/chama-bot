
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  MessageCircle, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Send,
  Settings,
  TrendingUp
} from "lucide-react";
import MemberCard from "@/components/MemberCard";
import SendReminderDialog from "@/components/SendReminderDialog";
import AddMemberDialog from "@/components/AddMemberDialog";
import { Member, ChamaStats } from "@/types/chama";
import { generateMockMembers, calculateStats } from "@/utils/chamaUtils";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<ChamaStats | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Initialize with mock data
    const mockMembers = generateMockMembers();
    setMembers(mockMembers);
    setStats(calculateStats(mockMembers));
  }, []);

  const handlePaymentUpdate = (memberId: string, paid: boolean) => {
    setMembers(prev => {
      const updated = prev.map(member => 
        member.id === memberId 
          ? { ...member, hasPaid: paid, lastPaymentDate: paid ? new Date().toISOString() : member.lastPaymentDate }
          : member
      );
      setStats(calculateStats(updated));
      return updated;
    });
    
    toast.success(
      paid 
        ? t('paymentMarkedPaid')
        : t('paymentMarkedUnpaid')
    );
  };

  const handleSendReminder = (memberIds: string[], message: string) => {
    // In a real app, this would integrate with WhatsApp Business API
    console.log(`Sending reminder to ${memberIds.length} members:`, message);
    toast.success(t('reminderSent', { count: memberIds.length }));
    setSelectedMembers([]);
  };

  const handleAddMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString(),
    };
    setMembers(prev => {
      const updated = [...prev, newMember];
      setStats(calculateStats(updated));
      return updated;
    });
    toast.success(t('memberAdded'));
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllUnpaid = () => {
    const unpaidMemberIds = members.filter(m => !m.hasPaid).map(m => m.id);
    setSelectedMembers(unpaidMemberIds);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('chamaBot')}</h1>
            <p className="text-gray-600">{t('managePayments')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Kiswahili</SelectItem>
              </SelectContent>
            </Select>
            <AddMemberDialog onAddMember={handleAddMember} />
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('totalMembers')}</p>
                    <p className="text-2xl font-bold">{stats.totalMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('paidMembers')}</p>
                    <p className="text-2xl font-bold">{stats.paidMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('pendingPayments')}</p>
                    <p className="text-2xl font-bold">{stats.pendingMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('collectionRate')}</p>
                    <p className="text-2xl font-bold">{stats.collectionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={selectAllUnpaid}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t('selectAllUnpaid')}
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedMembers.length} {t('selected')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SendReminderDialog 
                  selectedMemberIds={selectedMembers}
                  members={members}
                  onSendReminder={handleSendReminder}
                  disabled={selectedMembers.length === 0}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              isSelected={selectedMembers.includes(member.id)}
              onToggleSelection={toggleMemberSelection}
              onPaymentUpdate={handlePaymentUpdate}
            />
          ))}
        </div>

        {members.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noMembers')}</h3>
              <p className="text-gray-600 mb-4">{t('addFirstMember')}</p>
              <AddMemberDialog onAddMember={handleAddMember} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
