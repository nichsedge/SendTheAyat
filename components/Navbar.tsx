'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Heart, Send, Bookmark, X, ArrowUpRight } from 'lucide-react';
import { getSavedVersesLocally, getSentMessagesLocally } from '@/lib/share-helper';
import { PersonalMessage } from '@/lib/types';

interface NavbarProps {
  onGoHome: () => void;
  onStartCompose: () => void;
  onOpenVersePicker: () => void;
  onSelectSavedCard?: (msg: PersonalMessage) => void;
}

export default function Navbar({
  onGoHome,
  onStartCompose,
  onOpenVersePicker,
  onSelectSavedCard,
}: NavbarProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'saved' | 'sent'>('saved');
  const [savedList, setSavedList] = useState<PersonalMessage[]>([]);
  const [sentList, setSentList] = useState<PersonalMessage[]>([]);

  const openHistoryModal = () => {
    setSavedList(getSavedVersesLocally());
    setSentList(getSentMessagesLocally());
    setShowHistoryModal(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF9F5]/90 border-b border-[#EBE8DF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            id="nav-logo-button"
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2.5 group text-left transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-900/10 border border-emerald-900/20 flex items-center justify-center text-emerald-900 transition-transform group-hover:scale-105">
              <span className="font-arabic text-sm leading-none font-bold">ق</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-zinc-900 flex items-center gap-1.5">
                KirimAyat
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                  Ayat & Pesan
                </span>
              </span>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                Sampaikan ayat penuh makna untuk orang tersayang
              </span>
            </div>
          </button>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="nav-explore-ayat-btn"
              type="button"
              onClick={onOpenVersePicker}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
              <span>Jelajah Ayat</span>
            </button>

            <button
              id="nav-history-btn"
              type="button"
              onClick={openHistoryModal}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 transition-colors flex items-center gap-1.5"
              title="Pesan Tersimpan & Terkirim"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Tersimpan</span>
            </button>

            <button
              id="nav-cta-kirim-btn"
              type="button"
              onClick={onStartCompose}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-900 text-white hover:bg-emerald-950 transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Kirim Ayat</span>
            </button>
          </div>
        </div>
      </header>

      {/* History & Bookmarks Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF9F5] border border-zinc-200 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-800" />
                <h3 className="font-semibold text-zinc-900 text-sm">Arsip Ayat & Pesan Kamu</h3>
              </div>
              <button
                id="close-history-modal-btn"
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 px-4 pt-2 gap-4 text-xs font-medium text-zinc-600">
              <button
                id="tab-saved-verses"
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'saved'
                    ? 'border-emerald-800 text-emerald-900 font-semibold'
                    : 'border-transparent hover:text-zinc-900'
                }`}
              >
                Ayat Tersimpan ({savedList.length})
              </button>
              <button
                id="tab-sent-messages"
                type="button"
                onClick={() => setActiveTab('sent')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'sent'
                    ? 'border-emerald-800 text-emerald-900 font-semibold'
                    : 'border-transparent hover:text-zinc-900'
                }`}
              >
                Pesan Terkirim ({sentList.length})
              </button>
            </div>

            {/* Content List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {activeTab === 'saved' ? (
                savedList.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs">
                    <Heart className="w-6 h-6 mx-auto text-zinc-300 mb-2" />
                    <p>Belum ada ayat yang kamu simpan.</p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Klik ikon bookmark atau hati pada kartu ayat untuk menyimpannya.
                    </p>
                  </div>
                ) : (
                  savedList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectSavedCard) onSelectSavedCard(item);
                        setShowHistoryModal(false);
                      }}
                      className="p-3 rounded-xl bg-white border border-zinc-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-emerald-900">
                          QS. {item.surahName}: {item.verseNumber}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-700 transition-colors" />
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-2 italic font-serif-elegant">
                        &quot;{item.translation}&quot;
                      </p>
                      {item.personalNote && (
                        <p className="text-[11px] text-zinc-500 mt-1.5 pt-1.5 border-t border-zinc-100 line-clamp-1">
                          💌 &quot;{item.personalNote}&quot;
                        </p>
                      )}
                    </div>
                  ))
                )
              ) : sentList.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  <Send className="w-6 h-6 mx-auto text-zinc-300 mb-2" />
                  <p>Belum ada pesan yang kamu kirimkan.</p>
                  <button
                    id="btn-modal-start-compose"
                    type="button"
                    onClick={() => {
                      setShowHistoryModal(false);
                      onStartCompose();
                    }}
                    className="mt-3 px-3 py-1.5 bg-emerald-900 text-white rounded-full text-xs font-medium hover:bg-emerald-950 transition-colors"
                  >
                    Kirim Ayat Pertamamu
                  </button>
                </div>
              ) : (
                sentList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectSavedCard) onSelectSavedCard(item);
                      setShowHistoryModal(false);
                    }}
                    className="p-3 rounded-xl bg-white border border-zinc-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-zinc-800">
                        {item.recipientName ? `Untuk: ${item.recipientName}` : 'Pesan Personal'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-medium">
                        QS. {item.surahName}: {item.verseNumber}
                      </span>
                    </div>
                    {item.personalNote && (
                      <p className="text-xs text-zinc-600 line-clamp-2 mb-1">
                        &quot;{item.personalNote}&quot;
                      </p>
                    )}
                    <span className="text-[10px] text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-200 bg-zinc-50 flex justify-end">
              <button
                id="close-modal-history-bottom-btn"
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
