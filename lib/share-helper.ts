import { PersonalMessage, CardThemeId } from './types';

// Encode personal message into URL-safe base64
export function encodeSharePayload(data: Omit<PersonalMessage, 'views' | 'reactions'>): string {
  try {
    const jsonStr = JSON.stringify(data);
    if (typeof window !== 'undefined') {
      const bytes = new TextEncoder().encode(jsonStr);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } else {
      return Buffer.from(jsonStr, 'utf-8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  } catch (err) {
    console.error('Failed to encode share payload:', err);
    return '';
  }
}

// Decode personal message from URL-safe base64
export function decodeSharePayload(encoded: string): PersonalMessage | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    let jsonStr = '';
    if (typeof window !== 'undefined') {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonStr = new TextDecoder().decode(bytes);
    } else {
      jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    }

    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.surahName && parsed.arabicText) {
      return {
        id: parsed.id || `msg-${Date.now()}`,
        recipientName: parsed.recipientName || '',
        senderName: parsed.senderName || '',
        personalNote: parsed.personalNote || '',
        surahNumber: parsed.surahNumber || 1,
        surahName: parsed.surahName,
        surahArabic: parsed.surahArabic || '',
        surahTranslation: parsed.surahTranslation || '',
        verseNumber: parsed.verseNumber || 1,
        arabicText: parsed.arabicText,
        translation: parsed.translation,
        theme: (parsed.theme as CardThemeId) || 'emerald-sand',
        audioUrl: parsed.audioUrl,
        createdAt: parsed.createdAt || Date.now(),
        reactions: parsed.reactions || { aamiin: 0, heart: 0, peace: 0 },
      };
    }
  } catch (err) {
    console.error('Failed to decode share payload:', err);
  }
  return null;
}

// LocalStorage helpers for user's personal sent & saved list
const SENT_KEY = 'kirimayat_sent_messages';
const BOOKMARKS_KEY = 'kirimayat_saved_verses';

export function saveSentMessageLocally(msg: PersonalMessage): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSentMessagesLocally();
    const filtered = existing.filter(m => m.id !== msg.id);
    localStorage.setItem(SENT_KEY, JSON.stringify([msg, ...filtered].slice(0, 50)));
  } catch (e) {
    console.error('Error saving sent message locally:', e);
  }
}

export function getSentMessagesLocally(): PersonalMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleSavedVerseLocally(msg: PersonalMessage): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getSavedVersesLocally();
    const exists = existing.some(m => m.id === msg.id);
    if (exists) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existing.filter(m => m.id !== msg.id)));
      return false;
    } else {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([msg, ...existing]));
      return true;
    }
  } catch (e) {
    return false;
  }
}

export function isVerseSavedLocally(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getSavedVersesLocally();
    return existing.some(m => m.id === id);
  } catch (e) {
    return false;
  }
}

export function getSavedVersesLocally(): PersonalMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
