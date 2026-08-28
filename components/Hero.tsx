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
  const popularNames = ['Dinda', 'Ibu', 'Fajar', 'Diriku Sendiri', 'Zahra', 'Adit', 'Overthinking'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToFeed();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 border-b border-[#EAE7DD]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-emerald-100/35 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Top Minimal Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-900/10 border border-emerald-900/15 text-emerald-950 text-xs font-semibold tracking-wide mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
          <span>Terinspirasi dari konsep SendTheSong — khusus ayat Al-Qur’an</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 font-serif-elegant leading-[1.15] mb-4">
          Sampaikan ceritamu, <br className="hidden sm:inline" />
          <span className="italic font-normal text-emerald-950">lewat lantunan ayat Al-Qur’an.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-xl mx-auto mb-8">
          Kirimkan pesan personal, doa tulus, atau curahan hati yang disematkan bersama ayat Al-Qur&apos;an penyejuk jiwa. Cari namamu atau tulis untuk orang tersayang.
        </p>

        {/* The Signature Search Box (SendTheSong style) */}
        <div className="max-w-xl mx-auto mb-5">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-800 transition-colors" />
            <input
              id="hero-name-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari pesan untuk namamu (misal: Dinda, Ibu, Fajar, Zahra)..."
              className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-full bg-white border-2 border-zinc-200/90 shadow-sm focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 transition-all"
            />
            <button
              id="btn-hero-search-submit"
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium transition-all shadow-xs"
            >
              Cari Nama
            </button>
          </form>

          {/* Quick Name Filter Tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-zinc-500">
            <span className="font-medium mr-1">Pencarian populer:</span>
            {popularNames.map((name) => (
              <button
                key={name}
                id={`pill-name-${name.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => {
                  onSearchChange(name);
                  onScrollToFeed();
                }}
                className={`px-2.5 py-1 rounded-full border transition-all ${
                  searchQuery.toLowerCase() === name.toLowerCase()
                    ? 'bg-emerald-900 text-white border-emerald-900 font-semibold'
                    : 'bg-white/80 hover:bg-white text-zinc-700 border-zinc-200/90'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            id="hero-cta-compose-btn"
            type="button"
            onClick={() => onStartSend()}
            className="px-6 py-3.5 rounded-full bg-emerald-900 text-white font-medium text-xs sm:text-sm hover:bg-emerald-950 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 group"
          >
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span>Tulis Pesan & Kirim Ayat</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            id="hero-cta-browse-btn"
            type="button"
            onClick={onScrollToFeed}
            className="px-5 py-3.5 rounded-full bg-white text-zinc-800 font-medium text-xs sm:text-sm border border-zinc-200 hover:bg-zinc-50 transition-all shadow-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <span>Jelajahi Semua Pesan</span>
          </button>
        </div>

        {/* Featured Live Preview Letter Card */}
        <div className="mt-12 max-w-xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-[#FCFCF9] border border-[#E4E1D4] shadow-sm relative group">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                  Contoh Pesan Terkirim:
                </span>
                <span className="text-base font-semibold text-zinc-900 font-serif-elegant">
                  Untuk: Sahabat Terbaikku
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-900/10 text-emerald-900 font-semibold border border-emerald-900/15">
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
            <div className="py-3 text-right font-arabic text-xl sm:text-2xl text-emerald-950 font-normal leading-[2.3] select-all" dir="rtl">
              {featured.arabicText}
            </div>

            {/* Translation */}
            <p className="text-xs text-zinc-600 font-serif-elegant italic leading-relaxed mb-3">
              &quot;{featured.translation}&quot;
            </p>

            {/* Personal Letter Note */}
            <div className="p-3.5 rounded-xl bg-[#F4F4EE] border border-[#E3E2D6] text-xs text-zinc-700 italic font-serif-elegant leading-relaxed">
              &quot;Buat kamu yang lagi capek berjuang hari ini, ingat ya: janji Allah itu pasti, kemudahan itu disiapkan bersamaan dengan kesulitan ini. Istirahat ya.&quot;
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Dari: Seseorang yang mendoakanmu</span>
              <button
                type="button"
                onClick={() => onStartSend(featured)}
                className="text-emerald-900 hover:text-emerald-950 font-semibold flex items-center gap-1"
              >
                <span>Kirim Ayat Ini</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
