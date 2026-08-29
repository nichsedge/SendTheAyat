'use client';

import { useState } from 'react';
import { CURATED_VERSES } from '@/lib/quran-data';
import { CuratedVerse } from '@/lib/types';
import { Sparkles, ArrowRight, Heart, BookOpen } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface CuratedFeedProps {
  onSelectVerse: (verse: CuratedVerse) => void;
}

export default function CuratedFeed({ onSelectVerse }: CuratedFeedProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ketenangan' | 'ujian' | 'harapan' | 'syukur' | 'cinta'>('all');

  const filteredVerses = activeFilter === 'all'
    ? CURATED_VERSES
    : CURATED_VERSES.filter((v) => v.themeCategory === activeFilter);

  return (
    <section className="py-10 sm:py-16 md:py-20 border-b border-[#EBE8DF]">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            Inspirasi Ayat Penyejuk Jiwa
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-900 font-serif-elegant">
            Temukan Ayat yang Berbicara pada Hatimu
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Pilih salah satu ayat di bawah ini untuk langsung kamu kirimkan dengan pesan pribadimu.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {[
            { id: 'all', label: 'Semua Ayat' },
            { id: 'ketenangan', label: 'Ketenangan Jiwa' },
            { id: 'ujian', label: 'Saat Berjuang' },
            { id: 'harapan', label: 'Harapan & Rezeki' },
            { id: 'syukur', label: 'Rasa Syukur' },
            { id: 'cinta', label: 'Cinta & Doa' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`feed-filter-${tab.id}`}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs transition-all active:scale-95 ${
                activeFilter === tab.id
                  ? 'bg-emerald-900 text-white font-medium shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVerses.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E7E4D8] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-700 hover:shadow-md transition-all group text-left relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900/10 text-emerald-900 border border-emerald-900/15">
                    QS. {item.surahName} : {item.verseNumber}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {item.themeLabel}
                  </span>
                </div>

                {/* Arabic Script */}
                <div className="py-3 text-right font-arabic text-xl text-emerald-950 font-normal leading-[2.3] select-all line-clamp-3" dir="rtl">
                  {item.arabicText}
                </div>

                {/* Translation */}
                <p className="text-xs text-zinc-600 font-serif-elegant italic leading-relaxed line-clamp-3 mb-3">
                  &quot;{item.translation}&quot;
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between mt-2">
                <span className="text-[11px] text-zinc-400 italic">
                  Kemenag RI
                </span>
                <button
                  id={`feed-btn-choose-${item.id}`}
                  type="button"
                  onClick={() => onSelectVerse(item)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium transition-all flex items-center gap-1 group-hover:scale-105 shadow-xs"
                >
                  <span>Kirim Ayat Ini</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
