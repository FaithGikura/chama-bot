
export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  monthlyContribution: number;
  dueDate: string;
  hasPaid: boolean;
  lastPaymentDate: string | null;
  joinedDate: string;
}

export interface ChamaStats {
  totalMembers: number;
  paidMembers: number;
  pendingMembers: number;
  collectionRate: number;
  totalExpected: number;
  totalCollected: number;
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface ReminderTemplate {
  id: string;
  name: string;
  message: string;
  language: 'en' | 'sw';
}
