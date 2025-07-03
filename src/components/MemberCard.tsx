
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Phone, 
  DollarSign,
  Calendar
} from "lucide-react";
import { Member } from "@/types/chama";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDate, getPaymentStatus } from "@/utils/chamaUtils";

interface MemberCardProps {
  member: Member;
  isSelected: boolean;
  onToggleSelection: (memberId: string) => void;
  onPaymentUpdate: (memberId: string, paid: boolean) => void;
}

const MemberCard = ({ member, isSelected, onToggleSelection, onPaymentUpdate }: MemberCardProps) => {
  const { t } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const status = getPaymentStatus(member);
  
  const getStatusBadge = () => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('paid')}
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {t('overdue')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            {t('pending')}
          </Badge>
        );
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handlePaymentToggle = async () => {
    setIsUpdating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    onPaymentUpdate(member.id, !member.hasPaid);
    setIsUpdating(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(member.id)}
            />
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-3 w-3 mr-1" />
                {member.phoneNumber}
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('monthlyContribution')}</span>
            <span className="font-semibold flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              KES {member.monthlyContribution.toLocaleString()}
            </span>
          </div>
          
          {member.lastPaymentDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('lastPayment')}</span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(member.lastPaymentDate)}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('dueDate')}</span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(member.dueDate)}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button
            onClick={handlePaymentToggle}
            disabled={isUpdating}
            className={`w-full ${
              member.hasPaid 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            variant={member.hasPaid ? "outline" : "default"}
          >
            {isUpdating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {t('updating')}
              </div>
            ) : (
              <div className="flex items-center">
                {getStatusIcon()}
                <span className="ml-2">
                  {member.hasPaid ? t('markAsUnpaid') : t('markAsPaid')}
                </span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
