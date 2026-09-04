export interface SurahMeta {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
  deskripsi: string;
  audioFull?: {
    [key: string]: string;
  };
}

export interface AyatItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin?: string;
  teksIndonesia: string;
  audio?: {
    '01'?: string;
    '02'?: string;
    '03'?: string;
    '04'?: string;
    '05'?: string;
  };
}

export interface CuratedVerse {
  id: string;
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  verseNumber: number | string; // e.g. 5 or "5-6"
  arabicText: string;
  translation: string;
  themeCategory: 'ketenangan' | 'ujian' | 'harapan' | 'syukur' | 'doa' | 'cinta';
  themeLabel: string;
  contextNote: string;
  suggestedMessages: string[];
  audioUrl?: string;
}

export type CardThemeId = 
  | 'emerald-sand' 
  | 'warm-parchment' 
  | 'midnight-subtle' 
  | 'rose-dusk' 
  | 'pure-serenity';

export interface CardTheme {
  id: CardThemeId;
  name: string;
  bgClass: string;
  cardBgClass: string;
  borderClass: string;
  arabicColorClass: string;
  translationColorClass: string;
  personalMsgBgClass: string;
  accentBadgeClass: string;
  accentGoldClass: string;
  previewColor: string;
}

export interface PersonalMessage {
  id: string;
  recipientName?: string;
  senderName?: string;
  personalNote: string;
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  surahTranslation?: string;
  verseNumber: number | string;
  arabicText: string;
  translation: string;
  theme: CardThemeId;
  audioUrl?: string;
  createdAt: number;
  isPrivate?: boolean;
  views?: number;
  reactions?: {
    aamiin: number;
    heart: number;
    peace: number;
  };
}
