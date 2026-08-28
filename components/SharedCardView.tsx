'use client';

import { useState, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Heart, 
  Sparkles, 
  Send, 
  Bookmark, 
  BookmarkCheck, 
  MessageCircle, 
  ArrowLeft,
  Volume2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { PersonalMessage } from '@/lib/types';
import { CARD_THEMES } from '@/lib/themes';
import { toggleSavedVerseLocally, isVerseSavedLocally } from '@/lib/share-helper';
import AudioPlayer from './AudioPlayer';

interface SharedCardViewProps {
  message: PersonalMessage;
  shareUrl?: string;
  onNewMessage: () => void;
  isCreator?: boolean;
}

export default function SharedCardView({
  message,
  shareUrl,
  onNewMessage,
  isCreator = false,
}: SharedCardViewProps) {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(() => isVerseSavedLocally(message.id));
  const [reactions, setReactions] = useState(message.reactions || { aamiin: 0, heart: 0, peace: 0 });
  const [myReactions, setMyReactions] = useState<{ [key: string]: boolean }>({});
  const [isExportingImage, setIsExportingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const themeConfig = CARD_THEMES[message.theme] || CARD_THEMES['emerald-sand'];
  const fullShareUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleToggleBookmark = () => {
    const nextSaved = toggleSavedVerseLocally(message);
    setIsSaved(nextSaved);
  };

  const handleReaction = (type: 'aamiin' | 'heart' | 'peace') => {
    if (myReactions[type]) return;

    setMyReactions((prev) => ({ ...prev, [type]: true }));
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    // Trigger subtle joyful confetti
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#047857', '#F59E0B', '#10B981', '#E2DFD2'],
      disableForReducedMotion: true,
    });
  };

  const handleShareWhatsApp = () => {
    const text = `💌 Sebuah ayat Al-Qur'an (QS. ${message.surahName}: ${message.verseNumber}) dan pesan personal dikirimkan untukmu:\n\n${fullShareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Sepotong ketenangan lewat firman-Nya: QS. ${message.surahName} : ${message.verseNumber} ✨\n\n${fullShareUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
      });
      const link = document.createElement('a');
      link.download = `KirimAyat-QS-${message.surahName}-${message.verseNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-fadeIn">
      {/* Top Banner / Notification */}
      {isCreator && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-900/10 border border-emerald-900/20 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold">Link Personal Berhasil Dibuat!</p>
              <p className="text-[11px] text-emerald-800">
                Salin tautan di bawah dan bagikan kepada orang yang kamu tuju.
              </p>
            </div>
          </div>
          <button
            id="btn-copy-top-banner"
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
        </div>
      )}

      {/* Main Peaceful Unfolded Card */}
      <div
        ref={cardRef}
        id="exportable-spiritual-card"
        className={`p-6 sm:p-10 md:p-12 rounded-3xl border transition-all relative shadow-md ${themeConfig.bgClass} ${themeConfig.borderClass}`}
      >
        {/* Subtle Decorative Geometric Top Motif */}
        <div className="flex items-center justify-center gap-3 mb-6 opacity-40">
          <div className="h-px bg-current flex-1 max-w-[80px]" />
          <span className="text-xs font-serif">۞</span>
          <div className="h-px bg-current flex-1 max-w-[80px]" />
        </div>

        {/* Card Inside Wrapper */}
        <div className={`p-6 sm:p-9 rounded-2xl border backdrop-blur-xs ${themeConfig.cardBgClass}`}>
          {/* Header Bar */}
          <div className="pb-5 mb-5 border-b border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold opacity-60 block mb-0.5">
                Pesan Khusus Untuk:
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 font-serif-elegant">
                {message.recipientName || 'Untukmu yang Istimewa'}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${themeConfig.accentBadgeClass}`}>
                QS. {message.surahName} : {message.verseNumber}
              </span>
              <button
                id="btn-bookmark-verse"
                type="button"
                onClick={handleToggleBookmark}
                title={isSaved ? 'Hapus dari simpanan' : 'Simpan ayat ini'}
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-emerald-800" />
                ) : (
                  <Bookmark className="w-4 h-4 opacity-50 hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* Audio Recitation Player if available */}
          {message.audioUrl && (
            <div className="mb-6 flex justify-center sm:justify-start">
              <AudioPlayer
                audioUrl={message.audioUrl}
                surahName={message.surahName}
                verseNumber={message.verseNumber}
              />
            </div>
          )}

          {/* Arabic Calligraphy / Uthmani Typography */}
          <div
            className={`py-6 sm:py-10 text-right font-arabic text-2xl sm:text-4xl md:text-[2.6rem] font-normal leading-[2.4] sm:leading-[2.6] select-all ${themeConfig.arabicColorClass}`}
            dir="rtl"
          >
            {message.arabicText}
          </div>

          {/* Indonesian Translation */}
          <div className="py-4 border-t border-zinc-200/60">
            <p className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-1.5">
              Terjemahan (Kemenag RI)
            </p>
            <p className={`text-sm sm:text-base md:text-lg font-serif-elegant italic leading-relaxed ${themeConfig.translationColorClass}`}>
              &quot;{message.translation}&quot;
            </p>
          </div>

          {/* Personal Heartfelt Note */}
          {message.personalNote && (
            <div className={`mt-6 p-5 sm:p-6 rounded-2xl border transition-all ${themeConfig.personalMsgBgClass}`}>
              <div className="flex items-center justify-between text-xs font-semibold opacity-70 mb-2">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Pesan Personal:</span>
                </span>
                <span>{message.senderName ? `Dari: ${message.senderName}` : 'Dari seseorang yang mendoakanmu'}</span>
              </div>
              <p className="text-sm sm:text-base font-serif-elegant italic leading-relaxed">
                &quot;{message.personalNote}&quot;
              </p>
            </div>
          )}

          {/* Bottom Card Branding & Reference */}
          <div className="mt-6 pt-4 border-t border-zinc-200/50 flex items-center justify-between text-[11px] opacity-60">
            <span>KirimAyat.xyz</span>
            <span>Surah ke-{message.surahNumber} • Al-Qur’an Al-Karim</span>
          </div>
        </div>

        {/* Peaceful Reactions Bar */}
        <div className="mt-6 pt-5 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium opacity-70">
            Tanggapan doa & ketenangan:
          </span>
          <div className="flex items-center gap-2">
            <button
              id="reaction-btn-aamiin"
              type="button"
              onClick={() => handleReaction('aamiin')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                myReactions.aamiin
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-zinc-800 border border-black/10'
              }`}
            >
              <span>🤲 Aamiin</span>
              {reactions.aamiin > 0 && <span className="text-[10px] font-mono">({reactions.aamiin})</span>}
            </button>

            <button
              id="reaction-btn-heart"
              type="button"
              onClick={() => handleReaction('heart')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                myReactions.heart
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-zinc-800 border border-black/10'
              }`}
            >
              <span>🤍 Tersentuh</span>
              {reactions.heart > 0 && <span className="text-[10px] font-mono">({reactions.heart})</span>}
            </button>

            <button
              id="reaction-btn-peace"
              type="button"
              onClick={() => handleReaction('peace')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                myReactions.peace
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-zinc-800 border border-black/10'
              }`}
            >
              <span>✨ Menenangkan</span>
              {reactions.peace > 0 && <span className="text-[10px] font-mono">({reactions.peace})</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Share Actions Grid */}
      <div className="mt-8 space-y-4">
        {/* Share Buttons Row */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Bagikan Pesan Ini</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              id="btn-action-copy-link"
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors flex items-center gap-2 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
            </button>

            <button
              id="btn-action-share-wa"
              type="button"
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition-colors flex items-center gap-2 active:scale-95 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Kirim via WhatsApp</span>
            </button>

            <button
              id="btn-action-share-twitter"
              type="button"
              onClick={handleShareTwitter}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-medium transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>X (Twitter)</span>
            </button>

            <button
              id="btn-action-download-image"
              type="button"
              disabled={isExportingImage}
              onClick={handleDownloadImage}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-medium transition-colors flex items-center gap-2 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>{isExportingImage ? 'Menyiapkan Gambar...' : 'Unduh Gambar Kartu'}</span>
            </button>
          </div>
        </div>

        {/* CTA: Make a new one */}
        <div className="text-center pt-4">
          <button
            id="btn-create-another-message"
            type="button"
            onClick={onNewMessage}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Ayat Versimu Sendiri</span>
          </button>
        </div>
      </div>
    </div>
  );
}
