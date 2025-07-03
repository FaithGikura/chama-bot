
import { useState, createContext, useContext, ReactNode } from 'react';

type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // General
    chamaBot: "Chama Payment Bot",
    managePayments: "Manage member payments and send automated reminders",
    
    // Stats
    totalMembers: "Total Members",
    paidMembers: "Paid This Month",
    pendingPayments: "Pending Payments",
    collectionRate: "Collection Rate",
    
    // Member Status
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    
    // Actions
    addMember: "Add Member",
    addNewMember: "Add New Member",
    sendReminder: "Send Reminder",
    markAsPaid: "Mark as Paid",
    markAsUnpaid: "Mark as Unpaid",
    selectAllUnpaid: "Select All Unpaid",
    selected: "selected",
    
    // Forms
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    monthlyContribution: "Monthly Contribution",
    paymentDueDate: "Payment Due Date",
    enterFullName: "Enter member's full name",
    phoneFormat: "Use format: 0722123456 or +254722123456",
    fillAllFields: "Please fill all required fields",
    invalidPhoneFormat: "Please enter a valid Kenyan phone number",
    
    // Member Details
    lastPayment: "Last Payment",
    dueDate: "Due Date",
    updating: "Updating...",
    adding: "Adding...",
    
    // Reminders
    sendPaymentReminder: "Send Payment Reminder",
    selectedMembers: "Selected Members",
    messageTemplate: "Message Template",
    customMessage: "Custom Message",
    messagePreview: "Message Preview",
    chooseTemplate: "Choose a template",
    gentleReminder: "Gentle Reminder",
    urgentReminder: "Urgent Reminder",
    weeklyUpdate: "Weekly Update",
    balanceUpdate: "Balance Update",
    typeCustomMessage: "Type your custom message here...",
    useVariables: "Use variables",
    andMoreMembers: "and {{count}} more members",
    sending: "Sending...",
    sendToMembers: "Send to {{count}} member(s)",
    
    // Messages
    memberAdded: "Member added successfully!",
    paymentMarkedPaid: "Payment marked as paid",
    paymentMarkedUnpaid: "Payment marked as unpaid",
    reminderSent: "Reminder sent to {{count}} member(s)",
    
    // Empty States
    noMembers: "No members yet",
    addFirstMember: "Add your first Chama member to get started",
    
    // Common
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
  },
  
  sw: {
    // General
    chamaBot: "Bot ya Malipo ya Chama",
    managePayments: "Simamia malipo ya wanachama na tuma vikumbusho kiotomatiki",
    
    // Stats
    totalMembers: "Wanachama Wote",
    paidMembers: "Wamelipa Mwezi Huu",
    pendingPayments: "Malipo Yanayongoja",
    collectionRate: "Kiwango cha Ukusanyaji",
    
    // Member Status
    paid: "Amelipa",
    pending: "Anasubiri",
    overdue: "Amechelewa",
    
    // Actions
    addMember: "Ongeza Mwanachama",
    addNewMember: "Ongeza Mwanachama Mpya",
    sendReminder: "Tuma Ukumbusho",
    markAsPaid: "Weka Amelipa",
    markAsUnpaid: "Weka Hajalipa",
    selectAllUnpaid: "Chagua Wote Wasiolipa",
    selected: "umechagua",
    
    // Forms
    fullName: "Jina Kamili",
    phoneNumber: "Nambari ya Simu",
    monthlyContribution: "Mchango wa Kila Mwezi",
    paymentDueDate: "Tarehe ya Malipo",
    enterFullName: "Ingiza jina kamili la mwanachama",
    phoneFormat: "Tumia muundo: 0722123456 au +254722123456",
    fillAllFields: "Tafadhali jaza sehemu zote zinazohitajika",
    invalidPhoneFormat: "Tafadhali ingiza nambari sahihi ya simu ya Kenya",
    
    // Member Details
    lastPayment: "Malipo ya Mwisho",
    dueDate: "Tarehe ya Malipo",
    updating: "Inasasisha...",
    adding: "Inaongeza...",
    
    // Reminders
    sendPaymentReminder: "Tuma Ukumbusho wa Malipo",
    selectedMembers: "Wanachama Waliochaguliwa",
    messageTemplate: "Kiolezo cha Ujumbe",
    customMessage: "Ujumbe wa Kibinafsi",
    messagePreview: "Muhtasari wa Ujumbe",
    chooseTemplate: "Chagua kiolezo",
    gentleReminder: "Ukumbusho wa Hisani",
    urgentReminder: "Ukumbusho wa Haraka",
    weeklyUpdate: "Ripoti ya Kila Wiki",
    balanceUpdate: "Ripoti ya Akaunti",
    typeCustomMessage: "Andika ujumbe wako wa kibinafsi hapa...",
    useVariables: "Tumia vigeu",
    andMoreMembers: "na wanachama {{count}} zaidi",
    sending: "Inatuma...",
    sendToMembers: "Tuma kwa mwanachama/wanachama {{count}}",
    
    // Messages
    memberAdded: "Mwanachama ameongezwa kwa mafanikio!",
    paymentMarkedPaid: "Malipo yamewekwa kuwa yamelipwa",
    paymentMarkedUnpaid: "Malipo yamewekwa kuwa hayajalipwa",
    reminderSent: "Ukumbusho umetumwa kwa wanachama {{count}}",
    
    // Empty States
    noMembers: "Hakuna wanachama bado",
    addFirstMember: "Ongeza mwanachama wako wa kwanza wa Chama ili uanze",
    
    // Common
    cancel: "Ghairi",
    save: "Hifadhi",
    edit: "Hariri",
    delete: "Futa",
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string, params?: Record<string, any>) => {
    let translation = translations[language][key as keyof typeof translations.en] || key;
    
    // Replace template variables
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      });
    }
    
    return translation;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
