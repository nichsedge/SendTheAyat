'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles, Send, Check, Heart, Edit3, Palette, User, MessageSquare, Loader2, BookOpen, RefreshCw } from 'lucide-react';
import { CardThemeId, PersonalMessage } from '@/lib/types';
import { CARD_THEMES } from '@/lib/themes';
import AudioPlayer from './AudioPlayer';

interface CardComposerProps {
  verse: {
    surahNumber: number;
    surahName: string;
    surahArabic: string;
    surahTranslation?: string;
    verseNumber: number | string;
    arabicText: string;
    translation: string;
    audioUrl?: string;
    defaultNote?: string;
  };
  onBackToPicker: () => void;
  onGenerateLink: (data: {
    recipientName: string;
    senderName: string;
    personalNote: string;
    theme: CardThemeId;
  }) => Promise<void>;
  isGenerating?: boolean;
}

export default function CardComposer({
  verse,
  onBackToPicker,
  onGenerateLink,
  isGenerating = false,
}: CardComposerProps) {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [personalNote, setPersonalNote] = useState(verse.defaultNote || '');
  const [selectedTheme, setSelectedTheme] = useState<CardThemeId>('emerald-sand');

  const themeConfig = CARD_THEMES[selectedTheme];

  const quickMessageSuggestions = [
    'Buat kamu yang lagi berjuang, ingat ya: ada kemudahan di setiap kesulitan.',
    'Semoga ayat ini bisa menemani harimu dan membawa ketenangan di dalam dada.',
    'Ketika dunia terasa begitu bising, semoga firman-Nya memeluk hatimu dengan damai.',
    'Terima kasih sudah hadir dan menjadi kebaikan. Saling mendoakan selalu ya.',
    'Jangan pernah merasa sendiri, Allah selalu dekat dan mendengar setiap bisik doamu.',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerateLink({
      recipientName: recipientName.trim() || 'Untukmu',
      senderName: senderName.trim() || 'Seseorang yang mendoakanmu',
      personalNote: personalNote.trim(),
      theme: selectedTheme,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Navigation */}
      <button
        id="btn-composer-back-to-picker"
        type="button"
        onClick={onBackToPicker}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Ganti Ayat Pilihan</span>
      </button>

      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 font-serif-elegant">
          Tulis Pesan & Kirim Ayat
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1">
          Sematkan pesan personalmu bersama ayat Al-Qur&apos;an penyejuk jiwa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-5">
          {/* Recipient Name */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>Penerima Pesan (To:)</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-normal">Wajib diisi</span>
            </label>
            <input
              id="input-recipient-name"
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Contoh: Dinda, Ibu, Fajar, Zahra, Diriku Sendiri..."
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 placeholder:text-zinc-400 font-medium"
            />
            <p className="text-[11px] text-zinc-400">
              Nama ini akan tampil di bagian atas kartu dan dapat dicari di halaman utama.
            </p>
          </div>

          {/* Attached Ayat Widget / Selector */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                <span>Ayat yang Disematkan:</span>
              </label>
              <button
                id="btn-change-attached-verse"
                type="button"
                onClick={onBackToPicker}
                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ganti Ayat</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-zinc-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-950 px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-200">
                  QS. {verse.surahName} : {verse.verseNumber}
                </span>
                {verse.audioUrl && (
                  <div className="scale-90 origin-right">
                    <AudioPlayer
                      audioUrl={verse.audioUrl}
                      surahName={verse.surahName}
                      verseNumber={verse.verseNumber}
                    />
                  </div>
                )}
              </div>

              <div className="text-right font-arabic text-lg text-emerald-950 font-normal leading-relaxed line-clamp-2" dir="rtl">
                {verse.arabicText}
              </div>

              <p className="text-xs text-zinc-600 font-serif-elegant italic line-clamp-2">
                &quot;{verse.translation}&quot;
              </p>
            </div>
          </div>

          {/* Personal Message */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
                <span>Cerita & Pesan Personalmu</span>
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                {personalNote.length}/300
              </span>
            </div>

            <textarea
              id="input-personal-note"
              rows={4}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Tuliskan ungkapan perasaan, doa, atau alasan kenapa kamu memilih ayat ini untuknya..."
              maxLength={300}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 placeholder:text-zinc-400 resize-none font-serif-elegant leading-relaxed"
            />

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-[11px] text-zinc-500 font-medium block mb-1.5">
                Inspirasi kalimat cepat:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickMessageSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPersonalNote(suggestion)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-emerald-50 hover:text-emerald-900 text-zinc-600 border border-zinc-200/80 transition-colors line-clamp-1 italic"
                  >
                    &quot;{suggestion}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sender Name */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-800" />
              <span>Pengirim Pesan (From: - Opsional)</span>
            </label>
            <input
              id="input-sender-name"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Contoh: Fajar, Sahabatmu, atau Anonim"
              maxLength={50}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 placeholder:text-zinc-400"
            />
            <p className="text-[11px] text-zinc-400">
              Jika dikosongkan, akan tampil sebagai &quot;Seseorang yang mendoakanmu&quot;.
            </p>
          </div>

          {/* Theme Selector */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-800" />
              <span>Pilihan Nuansa Kartu</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(CARD_THEMES).map((thm) => (
                <button
                  key={thm.id}
                  id={`theme-btn-${thm.id}`}
                  type="button"
                  onClick={() => setSelectedTheme(thm.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedTheme === thm.id
                      ? 'border-emerald-800 ring-2 ring-emerald-800/20 bg-emerald-50/50'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: thm.previewColor }}
                  />
                  <span className="text-xs font-medium text-zinc-800 truncate">{thm.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-create-share-link"
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan Link Personal...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Pesan & Buat Link</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Live Synchronized Card Preview */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
              <span>Pratinjau Kartu Pesan</span>
            </span>
            <span className="text-[11px] text-zinc-400">Tampilan penerima</span>
          </div>

          {/* Rendered Live Theme Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative ${themeConfig.bgClass} ${themeConfig.borderClass}`}
          >
            <div
              className={`p-6 sm:p-7 rounded-2xl border backdrop-blur-xs transition-all ${themeConfig.cardBgClass}`}
            >
              {/* Recipient Header */}
              <div className="pb-4 mb-4 border-b border-zinc-200/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                    Pesan Khusus Untuk:
                  </span>
                  <h4 className="text-base sm:text-lg font-semibold text-zinc-900 font-serif-elegant">
                    {recipientName || 'Untuk Kamu'}
                  </h4>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${themeConfig.accentBadgeClass}`}>
                  QS. {verse.surahName} : {verse.verseNumber}
                </span>
              </div>

              {/* Audio if available */}
              {verse.audioUrl && (
                <div className="mb-4">
                  <AudioPlayer
                    audioUrl={verse.audioUrl}
                    surahName={verse.surahName}
                    verseNumber={verse.verseNumber}
                  />
                </div>
              )}

              {/* Arabic Verse */}
              <div
                className={`py-4 text-right font-arabic text-2xl sm:text-3xl font-normal leading-[2.4] select-all ${themeConfig.arabicColorClass}`}
                dir="rtl"
              >
                {verse.arabicText}
              </div>

              {/* Indonesian Translation */}
              <div className="py-3 border-t border-zinc-200/50">
                <p className="text-[11px] uppercase tracking-wider opacity-60 font-semibold mb-1">
                  Terjemahan
                </p>
                <p className={`text-xs sm:text-sm font-serif-elegant italic leading-relaxed ${themeConfig.translationColorClass}`}>
                  &quot;{verse.translation}&quot;
                </p>
              </div>

              {/* Personal Letter Note */}
              <div
                className={`mt-4 p-4 rounded-xl border transition-all ${themeConfig.personalMsgBgClass}`}
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-60 mb-1 flex items-center justify-between">
                  <span>Catatan Pengirim:</span>
                  <span>{senderName ? `Dari: ${senderName}` : 'Dari seseorang yang mendoakanmu'}</span>
                </div>
                <p className="text-xs sm:text-sm font-serif-elegant italic leading-relaxed">
                  &quot;{personalNote || 'Semoga ayat ini menemanimu dengan penuh ketenteraman...'}&quot;
                </p>
              </div>

              {/* Footer Stamp */}
              <div className="mt-4 pt-3 border-t border-zinc-200/40 flex items-center justify-between text-[10px] opacity-60">
                <span>KirimAyat.xyz</span>
                <span>Pesan ayat personal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
