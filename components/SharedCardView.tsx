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
  ExternalLink,
  Smartphone,
  ImageIcon,
  X,
  Lock,
  Eye,
  Loader2
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'story' | 'feed'>('story');

  const cardRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);

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
      particleCount: 25,
      spread: 50,
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

  const handleDownloadImage = async (format: 'story' | 'feed' = exportFormat) => {
    const targetRef = format === 'story' ? storyRef.current : cardRef.current;
    if (!targetRef) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await toPng(targetRef, {
        cacheBust: true,
        pixelRatio: 2.6,
        quality: 0.98,
      });
      const link = document.createElement('a');
      link.download = `KirimAyat-${format === 'story' ? 'Story-9-16' : 'Feed'}-QS-${message.surahName}-${message.verseNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 md:py-14 animate-fadeIn">
      {/* Top Banner / Notification */}
      {isCreator && (
        <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-emerald-900/10 border border-emerald-900/20 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0 active:scale-95"
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
        className={`p-4 sm:p-8 md:p-12 rounded-3xl border transition-all relative shadow-sm ${themeConfig.bgClass} ${themeConfig.borderClass}`}
      >
        {/* Subtle Decorative Geometric Top Motif */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6 opacity-40">
          <div className="h-px bg-current flex-1 max-w-[60px] sm:max-w-[80px]" />
          <span className="text-xs font-serif">۞</span>
          <div className="h-px bg-current flex-1 max-w-[60px] sm:max-w-[80px]" />
        </div>

        {/* Card Inside Wrapper */}
        <div className={`p-4 sm:p-7 md:p-9 rounded-2xl border backdrop-blur-xs ${themeConfig.cardBgClass}`}>
          {/* Header Bar */}
          <div className="pb-4 mb-4 border-b border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60 block mb-0.5">
                Pesan Khusus Untuk:
              </span>
              <h2 className="text-lg sm:text-2xl font-semibold text-zinc-900 font-serif-elegant">
                {message.recipientName || 'Untukmu yang Istimewa'}
              </h2>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2">
              {message.isPrivate && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 font-medium">
                  <Lock className="w-2.5 h-2.5 text-amber-700" />
                  <span>Surat Privat</span>
                </span>
              )}
              <span className={`text-[11px] sm:text-xs px-3 py-1 rounded-full font-semibold ${themeConfig.accentBadgeClass}`}>
                QS. {message.surahName} : {message.verseNumber}
              </span>
              <button
                id="btn-bookmark-verse"
                type="button"
                onClick={handleToggleBookmark}
                title={isSaved ? 'Hapus dari simpanan' : 'Simpan ayat ini'}
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors active:scale-90"
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
            <div className="mb-4 sm:mb-6">
              <AudioPlayer
                audioUrl={message.audioUrl}
                surahName={message.surahName}
                verseNumber={message.verseNumber}
              />
            </div>
          )}

          {/* Arabic Calligraphy / Uthmani Typography */}
          <div
            className={`py-4 sm:py-8 md:py-10 text-right font-arabic text-xl sm:text-3xl md:text-4xl font-normal leading-[2.3] sm:leading-[2.5] select-all ${themeConfig.arabicColorClass}`}
            dir="rtl"
          >
            {message.arabicText}
          </div>

          {/* Indonesian Translation */}
          <div className="py-3 sm:py-4 border-t border-zinc-200/60">
            <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold opacity-60 mb-1">
              Terjemahan (Kemenag RI)
            </p>
            <p className={`text-xs sm:text-base md:text-lg font-serif-elegant italic leading-relaxed ${themeConfig.translationColorClass}`}>
              &quot;{message.translation}&quot;
            </p>
          </div>

          {/* Personal Heartfelt Note */}
          {message.personalNote && (
            <div className={`mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl border transition-all ${themeConfig.personalMsgBgClass}`}>
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold opacity-70 mb-1.5 gap-2">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>Pesan Personal:</span>
                </span>
                <span className="truncate">{message.senderName ? `Dari: ${message.senderName}` : 'Dari seseorang yang mendoakanmu'}</span>
              </div>
              <p className="text-xs sm:text-base font-serif-elegant italic leading-relaxed">
                &quot;{message.personalNote}&quot;
              </p>
            </div>
          )}

          {/* Bottom Card Branding & Reference */}
          <div className="mt-4 pt-3 border-t border-zinc-200/50 flex items-center justify-between text-[10px] opacity-60">
            <span>KirimAyat.xyz</span>
            <span>Surah ke-{message.surahNumber} • Al-Qur’an Al-Karim</span>
          </div>
        </div>

        {/* Peaceful Reactions Bar */}
        <div className="mt-5 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="text-[11px] sm:text-xs font-medium opacity-70">
            Tanggapan doa & ketenangan:
          </span>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              id="reaction-btn-aamiin"
              type="button"
              onClick={() => handleReaction('aamiin')}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 active:scale-95 ${
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
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 active:scale-95 ${
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
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 active:scale-95 ${
                myReactions.peace
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-zinc-800 border border-black/10'
              }`}
            >
              <span>✨ Tenang</span>
              {reactions.peace > 0 && <span className="text-[10px] font-mono">({reactions.peace})</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Share Actions Grid (2-column on mobile) */}
      <div className="mt-6 space-y-3 sm:space-y-4">
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Bagikan Pesan Ini</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <button
              id="btn-action-copy-link"
              type="button"
              onClick={handleCopyLink}
              className="px-3 sm:px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="truncate">{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
            </button>

            <button
              id="btn-action-share-wa"
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="truncate">WhatsApp</span>
            </button>

            <button
              id="btn-action-share-twitter"
              type="button"
              onClick={handleShareTwitter}
              className="px-3 sm:px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="truncate">X (Twitter)</span>
            </button>

            <button
              id="btn-action-open-export-modal"
              type="button"
              onClick={() => setShowExportModal(true)}
              className="px-3 sm:px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span className="truncate">Unduh Gambar (Story & Feed)</span>
            </button>
          </div>
        </div>

        {/* CTA: Make a new one */}
        <div className="text-center pt-2 sm:pt-4">
          <button
            id="btn-create-another-message"
            type="button"
            onClick={onNewMessage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Ayat Versimu Sendiri</span>
          </button>
        </div>
      </div>

      {/* Export Format Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-zinc-200 space-y-4 my-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-zinc-900">
                  Unduh Gambar Kartu
                </h3>
                <p className="text-xs text-zinc-500">
                  Pilih format yang pas untuk posting di media sosial
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setExportFormat('story')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  exportFormat === 'story'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-800" />
                <span>Format Story (9:16)</span>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('feed')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  exportFormat === 'feed'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-800" />
                <span>Format Feed (1:1)</span>
              </button>
            </div>

            {/* Preview Box */}
            <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-2 sm:p-4 flex items-center justify-center max-h-[380px] overflow-hidden">
              {exportFormat === 'story' ? (
                <div className="transform scale-[0.48] sm:scale-[0.52] origin-center -my-24">
                  {/* Scaled Visual Preview */}
                  <div
                    className={`w-[360px] min-h-[640px] p-6 rounded-3xl border shadow-lg flex flex-col justify-between ${themeConfig.bgClass} ${themeConfig.borderClass}`}
                  >
                    <div className="flex items-center justify-center gap-2 opacity-50 mb-3">
                      <div className="h-px bg-current flex-1 max-w-[40px]" />
                      <span className="text-xs font-serif">۞</span>
                      <div className="h-px bg-current flex-1 max-w-[40px]" />
                    </div>
                    <div className={`p-5 rounded-2xl border backdrop-blur-xs flex-1 flex flex-col justify-between ${themeConfig.cardBgClass}`}>
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/50">
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 block">
                              Pesan Untuk:
                            </span>
                            <h4 className="text-lg font-semibold font-serif-elegant truncate">
                              {message.recipientName || 'Untukmu'}
                            </h4>
                          </div>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${themeConfig.accentBadgeClass}`}>
                            QS. {message.surahName} : {message.verseNumber}
                          </span>
                        </div>
                        <div className={`py-4 text-right font-arabic text-2xl leading-[2.3] ${themeConfig.arabicColorClass}`} dir="rtl">
                          {message.arabicText}
                        </div>
                        <div className="py-2 border-t border-zinc-200/50">
                          <p className={`text-xs font-serif-elegant italic leading-relaxed ${themeConfig.translationColorClass}`}>
                            &quot;{message.translation}&quot;
                          </p>
                        </div>
                      </div>
                      {message.personalNote && (
                        <div className={`mt-3 p-3 rounded-xl border ${themeConfig.personalMsgBgClass}`}>
                          <div className="text-[10px] font-semibold opacity-70 mb-1 flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 fill-current" />
                            <span>Dari: {message.senderName || 'Seseorang yang mendoakanmu'}</span>
                          </div>
                          <p className="text-xs font-serif-elegant italic">
                            &quot;{message.personalNote}&quot;
                          </p>
                        </div>
                      )}
                      <div className="mt-3 pt-2 border-t border-zinc-200/40 flex items-center justify-between text-[9px] opacity-60">
                        <span>KirimAyat.xyz</span>
                        <span>Surah ke-{message.surahNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 px-4">
                  <p className="text-xs font-medium text-zinc-700 mb-1">Format Feed / Kartu Persegi</p>
                  <p className="text-[11px] text-zinc-500 max-w-xs">
                    Format kartu standar yang sama persis seperti yang tampil di layar utama.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Download Action */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isExportingImage}
                onClick={() => handleDownloadImage(exportFormat)}
                className="flex-2 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 disabled:opacity-70"
              >
                {isExportingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyiapkan Gambar HD...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Gambar {exportFormat === 'story' ? 'Story (9:16)' : 'Feed (1:1)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Offscreen 9:16 Story DOM Node for high-res rendering */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <div
          ref={storyRef}
          id="exportable-story-9-16-card"
          className={`w-[420px] min-h-[746px] p-8 rounded-3xl border flex flex-col justify-between relative shadow-lg ${themeConfig.bgClass} ${themeConfig.borderClass}`}
        >
          {/* Top Geometric Motif */}
          <div className="flex items-center justify-center gap-3 mb-4 opacity-50">
            <div className="h-px bg-current flex-1 max-w-[60px]" />
            <span className="text-sm font-serif">۞</span>
            <div className="h-px bg-current flex-1 max-w-[60px]" />
          </div>

          {/* Main Content Box */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xs flex-1 flex flex-col justify-between ${themeConfig.cardBgClass}`}>
            <div>
              {/* Story Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200/60 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block">
                    Pesan Khusus Untuk:
                  </span>
                  <h3 className="text-xl font-semibold font-serif-elegant text-zinc-900">
                    {message.recipientName || 'Untukmu yang Istimewa'}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {message.isPrivate && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-medium flex items-center gap-1 border border-amber-200">
                      <Lock className="w-2.5 h-2.5 text-amber-700" />
                      <span>Privat</span>
                    </span>
                  )}
                  <span className={`text-[11px] px-3 py-1 rounded-full font-semibold ${themeConfig.accentBadgeClass}`}>
                    QS. {message.surahName} : {message.verseNumber}
                  </span>
                </div>
              </div>

              {/* Arabic Calligraphy */}
              <div
                className={`py-6 text-right font-arabic text-3xl font-normal leading-[2.4] ${themeConfig.arabicColorClass}`}
                dir="rtl"
              >
                {message.arabicText}
              </div>

              {/* Translation */}
              <div className="py-3 border-t border-zinc-200/60">
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-60 mb-1">
                  Terjemahan (Kemenag RI)
                </p>
                <p className={`text-sm font-serif-elegant italic leading-relaxed ${themeConfig.translationColorClass}`}>
                  &quot;{message.translation}&quot;
                </p>
              </div>
            </div>

            {/* Personal Note */}
            {message.personalNote && (
              <div className={`mt-4 p-4 rounded-xl border transition-all ${themeConfig.personalMsgBgClass}`}>
                <div className="flex items-center justify-between text-[11px] font-semibold opacity-75 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Pesan Personal:</span>
                  </span>
                  <span className="truncate">{message.senderName ? `Dari: ${message.senderName}` : 'Dari seseorang yang mendoakanmu'}</span>
                </div>
                <p className="text-sm font-serif-elegant italic leading-relaxed">
                  &quot;{message.personalNote}&quot;
                </p>
              </div>
            )}

            {/* Story Footer Branding */}
            <div className="mt-4 pt-3 border-t border-zinc-200/50 flex items-center justify-between text-[10px] opacity-65">
              <span className="font-semibold tracking-wide">KirimAyat.xyz</span>
              <span>Dengarkan suara tilawah di web</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
