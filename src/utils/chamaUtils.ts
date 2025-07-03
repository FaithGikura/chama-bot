
import { Member, ChamaStats, PaymentStatus } from "@/types/chama";

export const generateMockMembers = (): Member[] => {
  const kenyanNames = [
    "Grace Wanjiku", "John Kamau", "Mary Akinyi", "Peter Mwangi", 
    "Faith Njeri", "David Ochieng", "Catherine Wambui", "Samuel Kiplagat",
    "Agnes Muthoni", "Michael Otieno", "Sarah Chebet", "Joseph Karanja"
  ];
  
  const phoneNumbers = [
    "+254722123456", "+254733456789", "+254711987654", "+254700234567",
    "+254722876543", "+254733321098", "+254711456123", "+254700789456",
    "+254722654321", "+254733789012", "+254711234567", "+254700567890"
  ];

  return kenyanNames.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    phoneNumber: phoneNumbers[index],
    monthlyContribution: [1000, 1500, 2000, 2500, 3000][Math.floor(Math.random() * 5)],
    dueDate: getRandomDueDate(),
    hasPaid: Math.random() > 0.4, // 60% chance of having paid
    lastPaymentDate: Math.random() > 0.3 ? getRandomPaymentDate() : null,
    joinedDate: getRandomJoinDate(),
  }));
};

export const calculateStats = (members: Member[]): ChamaStats => {
  const totalMembers = members.length;
  const paidMembers = members.filter(m => m.hasPaid).length;
  const pendingMembers = totalMembers - paidMembers;
  const collectionRate = totalMembers > 0 ? Math.round((paidMembers / totalMembers) * 100) : 0;
  const totalExpected = members.reduce((sum, m) => sum + m.monthlyContribution, 0);
  const totalCollected = members.filter(m => m.hasPaid).reduce((sum, m) => sum + m.monthlyContribution, 0);

  return {
    totalMembers,
    paidMembers,
    pendingMembers,
    collectionRate,
    totalExpected,
    totalCollected,
  };
};

export const getPaymentStatus = (member: Member): PaymentStatus => {
  if (member.hasPaid) return 'paid';
  
  const dueDate = new Date(member.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate < today) return 'overdue';
  return 'pending';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Helper functions for generating mock data
const getRandomDueDate = (): string => {
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), 28); // 28th of current month
  
  // Sometimes make it next month
  if (Math.random() > 0.7) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  
  return dueDate.toISOString().split('T')[0];
};

const getRandomPaymentDate = (): string => {
  const today = new Date();
  const paymentDate = new Date(today);
  paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30));
  return paymentDate.toISOString();
};

const getRandomJoinDate = (): string => {
  const today = new Date();
  const joinDate = new Date(today);
  joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 12));
  return joinDate.toISOString();
};
