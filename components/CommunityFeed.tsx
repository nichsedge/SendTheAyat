'use client';

import { useState, useMemo } from 'react';
import { Search, Heart, Sparkles, Send, Volume2, ArrowRight, Bookmark, Share2, Filter, MessageSquare, Clock, Check, Copy } from 'lucide-react';
import { PersonalMessage } from '@/lib/types';
import { CARD_THEMES } from '@/lib/themes';
import AudioPlayer from './AudioPlayer';
import { encodeSharePayload } from '@/lib/share-helper';

interface CommunityFeedProps {
  messages: PersonalMessage[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMessage: (msg: PersonalMessage) => void;
  onStartCompose: () => void;
}

export default function CommunityFeed({
  messages,
  searchQuery,
  onSearchChange,
  onOpenMessage,
  onStartCompose,
}: CommunityFeedProps) {
  const [selectedSort, setSelectedSort] = useState<'latest' | 'popular'>('latest');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    let list = [...messages];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((m) => {
        const rName = (m.recipientName || '').toLowerCase();
        const sName = (m.senderName || '').toLowerCase();
        const note = (m.personalNote || '').toLowerCase();
        const surah = (m.surahName || '').toLowerCase();
        return rName.includes(q) || sName.includes(q) || note.includes(q) || surah.includes(q);
      });
    }

    if (selectedSort === 'popular') {
      list.sort((a, b) => {
        const reactionsA = (a.reactions?.aamiin || 0) + (a.reactions?.heart || 0) + (a.reactions?.peace || 0) + (a.views || 0);
        const reactionsB = (b.reactions?.aamiin || 0) + (b.reactions?.heart || 0) + (b.reactions?.peace || 0) + (b.views || 0);
        return reactionsB - reactionsA;
      });
    } else {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return list;
  }, [messages, searchQuery, selectedSort]);

  const handleCopyCardLink = (e: React.MouseEvent, msg: PersonalMessage) => {
    e.stopPropagation();
    const token = encodeSharePayload(msg);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/?p=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  return (
    <section id="community-feed-section" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E8E5DA]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pesan & Doa Komunitas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 font-serif-elegant">
              Jelajahi Pesan untuk Nama Seseorang
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Setiap pesan menyimpan doa dan ketenangan lewat untaian ayat Al-Qur&apos;an.
            </p>
          </div>

          {/* Sort tabs */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="sort-latest-btn"
              type="button"
              onClick={() => setSelectedSort('latest')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedSort === 'latest'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              Terkini
            </button>
            <button
              id="sort-popular-btn"
              type="button"
              onClick={() => setSelectedSort('popular')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedSort === 'popular'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              Paling Tersentuh
            </button>
          </div>
        </div>

        {/* Filter State Display */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 rounded-xl text-xs text-emerald-950">
            <span>
              Menampilkan pesan untuk: <strong className="underline">&quot;{searchQuery}&quot;</strong> ({filteredMessages.length} pesan ditemukan)
            </span>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline ml-3"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Grid of SendTheSong-style Cards */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8">
            <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-zinc-800">
              Belum ada pesan untuk &quot;{searchQuery}&quot;
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mt-1 mb-5">
              Jadilah orang pertama yang mengirimkan ayat Al-Qur&apos;an dan pesan penuh doa untuk {searchQuery}!
            </p>
            <button
              id="btn-empty-compose"
              type="button"
              onClick={onStartCompose}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium rounded-full shadow-sm"
            >
              Tulis Pesan untuk {searchQuery}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMessages.map((msg) => {
              const thm = CARD_THEMES[msg.theme] || CARD_THEMES['emerald-sand'];
              const totalReactions = (msg.reactions?.aamiin || 0) + (msg.reactions?.heart || 0) + (msg.reactions?.peace || 0);

              return (
                <div
                  key={msg.id}
                  onClick={() => onOpenMessage(msg)}
                  className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 relative text-left ${thm.bgClass} ${thm.borderClass}`}
                >
                  <div>
                    {/* Header: To Recipient */}
                    <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-black/5">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-50 block">
                          Untuk:
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 font-serif-elegant group-hover:text-emerald-950 transition-colors line-clamp-1">
                          {msg.recipientName || 'Untukmu'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3 opacity-60" />
                          {formatTimeAgo(msg.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* The Personal Note / Letter snippet */}
                    {msg.personalNote && (
                      <p className="text-xs sm:text-sm font-serif-elegant italic text-zinc-700 leading-relaxed line-clamp-3 mb-4">
                        &quot;{msg.personalNote}&quot;
                      </p>
                    )}

                    {/* The Attached Song/Ayat Box */}
                    <div className={`p-3.5 rounded-xl border mb-3 transition-all ${thm.cardBgClass}`}>
                      {/* Badge and Compact Audio Player (Never overlapping) */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] truncate ${thm.accentBadgeClass}`}>
                          QS. {msg.surahName} : {msg.verseNumber}
                        </span>
                        {msg.audioUrl && (
                          <div className="shrink-0">
                            <AudioPlayer
                              audioUrl={msg.audioUrl}
                              surahName={msg.surahName}
                              verseNumber={msg.verseNumber}
                              variant="compact"
                              themeClass="text-emerald-900 bg-emerald-100/80 border-emerald-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* Arabic line */}
                      <div className={`py-1 text-right font-arabic text-base sm:text-lg font-normal line-clamp-2 select-all ${thm.arabicColorClass}`} dir="rtl">
                        {msg.arabicText}
                      </div>

                      {/* Translation preview */}
                      <p className={`text-[11px] font-serif-elegant italic line-clamp-2 mt-1 opacity-80 ${thm.translationColorClass}`}>
                        &quot;{msg.translation}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Footer: Sender & Reactions */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                      Dari: <strong className="text-zinc-700">{msg.senderName || 'Anonim'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {totalReactions > 0 && (
                        <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                          {totalReactions}
                        </span>
                      )}
                      <button
                        id={`btn-copy-card-${msg.id}`}
                        type="button"
                        onClick={(e) => handleCopyCardLink(e, msg)}
                        title="Salin tautan pesan ini"
                        className="p-1 rounded-md hover:bg-black/5 text-zinc-500 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
