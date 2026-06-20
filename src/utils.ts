import { ChatMessage } from './types';

/**
 * Encodes English text into a space-separated sequence of decimal ASCII code units.
 */
export function textToAscii(text: string): string {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString())
    .join(' ');
}

/**
 * Decodes a space-separated sequence of decimal ASCII code units back into English text.
 */
export function asciiToText(asciiString: string): string {
  const cleanAscii = asciiString.trim();
  if (!cleanAscii) return '';
  
  return cleanAscii
    .split(/\s+/)
    .map(codeStr => {
      const code = parseInt(codeStr, 10);
      if (isNaN(code)) return '?';
      return String.fromCharCode(code);
    })
    .join('');
}

/**
 * Formats a date string or timestamp into a readable digital time (e.g., "12:15 PM").
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '12:00 PM';
  }
}

/**
 * Initial mock chat messages representing realistic, engaging ASCII communication.
 */
export const getInitialMessages = (): ChatMessage[] => {
  const now = new Date();
  
  // Create offsets to position conversations nicely in the past minutes
  const timeOffset = (minutesAgo: number) => {
    const d = new Date(now.getTime() - minutesAgo * 60000);
    return d.toISOString();
  };

  const initialMsgsRaw = [
    { sender: 'her' as const, text: "Are you online? Did you deploy Project 3543?", minsAgo: 10 },
    { sender: 'him' as const, text: "Loud and clear. All communications translate to numerical streams. Did you receive the signal?", minsAgo: 8 },
    { sender: 'her' as const, text: "Wait, so if I type 'A', does it translate to '65' on your grid?", minsAgo: 7 },
    { sender: 'him' as const, text: "Affirmative. Click on any block or tap the bubble menu to view raw text.", minsAgo: 5 },
    { sender: 'her' as const, text: "Excellent. Let us protect these coordinates and maintain strict discipline.", minsAgo: 3 },
    { sender: 'him' as const, text: "Agreed. Deciphering testing block: 83 101 99 114 101 116 32 79 112 115", minsAgo: 1 },
  ];

  return initialMsgsRaw.map((msg, index) => {
    // If we already wrote raw numbers (like the last one), preserve it, else encode
    const hasRawAscii = msg.text.match(/^\d+([\s\d]*)$/);
    const originalText = hasRawAscii ? asciiToText(msg.text) : msg.text;
    const asciiValue = hasRawAscii ? msg.text : textToAscii(msg.text);

    return {
      id: `msg-${index + 1}`,
      sender: msg.sender,
      originalText,
      asciiValue,
      timestamp: timeOffset(msg.minsAgo),
      status: 'read' as const
    };
  });
};
