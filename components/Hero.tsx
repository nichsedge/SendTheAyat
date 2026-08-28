'use client';

import { useState } from 'react';
import { Search, Sparkles, Send, ArrowRight, BookOpen, Heart, Volume2 } from 'lucide-react';
import { CURATED_VERSES } from '@/lib/quran-data';
import { CuratedVerse } from '@/lib/types';
import AudioPlayer from './AudioPlayer';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onStartSend: (verse?: CuratedVerse) => void;
  onScrollToFeed: () => void;
}

export default function Hero({
  searchQuery,
  onSearchChange,
  onStartSend,
  onScrollToFeed,
}: HeroProps) {
  const featured = CURATED_VERSES[0];
  const popularNames = ['Dinda', 'Mama', 'Fajar', 'Zahra', 'diri sendiri'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToFeed();
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 border-b border-[#EAE7DD]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] sm:h-[380px] bg-emerald-100/40 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Top Minimal Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-900/15 text-emerald-950 text-[11px] sm:text-xs font-semibold tracking-wide mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span>SendTheSong — versi ayat Al-Qur’an & doa</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 font-serif-elegant leading-[1.2] mb-3 sm:mb-4 px-1">
          Sampaikan ceritamu, <br className="hidden sm:inline" />
          <span className="italic font-normal text-emerald-950">lewat lantunan ayat Al-Qur’an.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-zinc-600 font-normal leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8 px-2">
          Kirimkan pesan personal, doa tulus, atau curahan hati yang disematkan bersama ayat Al-Qur&apos;an penyejuk jiwa. Cari namamu atau tulis untuk orang tersayang.
        </p>

        {/* The Signature Search Box (Mobile-first polished) */}
        <div className="max-w-xl mx-auto mb-4 sm:mb-5">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-800 transition-colors" />
            <input
              id="hero-name-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari pesan untuk namamu (Dinda, Mama, Fajar)..."
              className="w-full pl-10 sm:pl-12 pr-24 sm:pr-28 py-3 sm:py-3.5 rounded-full bg-white border-2 border-zinc-200/90 shadow-xs focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 transition-all"
            />
            <button
              id="btn-hero-search-submit"
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium transition-all shadow-xs active:scale-95"
            >
              Cari Nama
            </button>
          </form>

          {/* Quick Name Filter Tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-zinc-500 px-1">
            <span className="text-[11px] font-medium mr-0.5 opacity-80">Pencarian populer:</span>
            {popularNames.map((name) => (
              <button
                key={name}
                id={`pill-name-${name.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => {
                  onSearchChange(name);
                  onScrollToFeed();
                }}
                className={`px-2.5 py-0.5 sm:py-1 rounded-full border text-[11px] transition-all active:scale-95 ${
                  searchQuery.toLowerCase() === name.toLowerCase()
                    ? 'bg-emerald-900 text-white border-emerald-900 font-semibold'
                    : 'bg-white/90 hover:bg-white text-zinc-700 border-zinc-200/90'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-none mx-auto">
          <button
            id="hero-cta-compose-btn"
            type="button"
            onClick={() => onStartSend()}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-full bg-emerald-900 text-white font-medium text-xs sm:text-sm hover:bg-emerald-950 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 group"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
            <span>Tulis Pesan & Kirim Ayat</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
          </button>

          <button
            id="hero-cta-browse-btn"
            type="button"
            onClick={onScrollToFeed}
            className="w-full sm:w-auto px-5 py-3 sm:py-3.5 rounded-full bg-white text-zinc-800 font-medium text-xs sm:text-sm border border-zinc-200 hover:bg-zinc-50 transition-all shadow-2xs flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>Jelajahi Semua Pesan</span>
          </button>
        </div>

        {/* Featured Live Preview Letter Card */}
        <div className="mt-8 sm:mt-12 max-w-xl mx-auto text-left">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#FCFCF9] border border-[#E4E1D4] shadow-xs relative">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-100 gap-2">
              <div className="truncate">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                  Contoh Pesan Terkirim:
                </span>
                <span className="text-sm sm:text-base font-semibold text-zinc-900 font-serif-elegant truncate block">
                  Untuk: Dinda
                </span>
              </div>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-900/10 text-emerald-900 font-semibold border border-emerald-900/15 shrink-0">
                QS. {featured.surahName} : {featured.verseNumber}
              </span>
            </div>

            {/* Audio recitation */}
            {featured.audioUrl && (
              <div className="mb-3">
                <AudioPlayer
                  audioUrl={featured.audioUrl}
                  surahName={featured.surahName}
                  verseNumber={featured.verseNumber}
                />
              </div>
            )}

            {/* Arabic */}
            <div className="py-2.5 sm:py-3 text-right font-arabic text-xl sm:text-2xl text-emerald-950 font-normal leading-[2.3] select-all" dir="rtl">
              {featured.arabicText}
            </div>

            {/* Translation */}
            <p className="text-xs text-zinc-600 font-serif-elegant italic leading-relaxed mb-3">
              &quot;{featured.translation}&quot;
            </p>

            {/* Personal Letter Note */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#F4F4EE] border border-[#E3E2D6] text-xs text-zinc-700 italic font-serif-elegant leading-relaxed">
              &quot;din, jujur wkwk msih suka kepikiran masa2 dulu. skrg dh beda bgt y hidup kita. smg lu sllu dapet yg tulus & bahagia terus sm pilihan lu skrg yaaa. ayat ini sllu ngingetin gw sm doa baik bwt lu.&quot;
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 gap-2">
              <span className="truncate">Dari: anon mantan lu yg cringe</span>
              <button
                type="button"
                onClick={() => onStartSend(featured)}
                className="text-emerald-900 hover:text-emerald-950 font-semibold flex items-center gap-1 shrink-0 active:scale-95"
              >
                <span>Kirim Ini</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
