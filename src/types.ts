export type SenderType = 'her' | 'him';

export interface ChatMessage {
  id: string;
  sender: SenderType;
  originalText: string;
  asciiValue: string;
  timestamp: string; // ISO string or formatted time
  status: 'sent' | 'delivered' | 'read';
}

export type ConversationTheme = 'whatsapp-light' | 'whatsapp-dark' | 'neon-cyan' | 'minimalist';
