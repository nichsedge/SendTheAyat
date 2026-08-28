'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Sparkles, Filter, ChevronRight, Check, Play, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { SURAH_LIST, CURATED_VERSES, THEME_CATEGORIES } from '@/lib/quran-data';
import { getSurahDetail, SurahFullDetail } from '@/lib/quran-api';
import { CuratedVerse, SurahMeta, AyatItem } from '@/lib/types';
import AudioPlayer from './AudioPlayer';

interface AyatPickerProps {
  initialMood?: string;
  onSelectVerse: (verse: {
    surahNumber: number;
    surahName: string;
    surahArabic: string;
    surahTranslation?: string;
    verseNumber: number | string;
    arabicText: string;
    translation: string;
    audioUrl?: string;
    defaultNote?: string;
  }) => void;
  onBackToHome?: () => void;
}

export default function AyatPicker({ initialMood, onSelectVerse, onBackToHome }: AyatPickerProps) {
  const [activeTab, setActiveTab] = useState<'curated' | 'browse'>('curated');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialMood || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Browse mode state
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(94); // Default Al-Insyirah
  const [surahDetail, setSurahDetail] = useState<SurahFullDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(5);

  // Sync category if initialMood changes
  const [prevInitialMood, setPrevInitialMood] = useState(initialMood);
  if (initialMood !== prevInitialMood) {
    setPrevInitialMood(initialMood);
    if (initialMood) {
      setSelectedCategory(initialMood);
      setActiveTab('curated');
    }
  }

  // Load surah verses when selected
  useEffect(() => {
    let isMounted = true;
    async function loadSurah() {
      setIsLoadingSurah(true);
      try {
        const detail = await getSurahDetail(selectedSurahNumber);
        if (isMounted) {
          setSurahDetail(detail);
          const defVerse = detail.jumlahAyat >= 5 ? 5 : 1;
          setSelectedVerseNumber(defVerse);
        }
      } catch (e) {
        console.error('Error loading surah details:', e);
      } finally {
        if (isMounted) setIsLoadingSurah(false);
      }
    }
    loadSurah();
    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber]);

  // Filter curated verses
  const filteredCuratedVerses = useMemo(() => {
    return CURATED_VERSES.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.themeCategory === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;
      
      const matchText = 
        item.surahName.toLowerCase().includes(q) ||
        item.themeLabel.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.contextNote.toLowerCase().includes(q);

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  // Filter 114 surahs
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SURAH_LIST;
    return SURAH_LIST.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nomor.toString() === q
    );
  }, [searchQuery]);

  const currentAyatItem: AyatItem | undefined = useMemo(() => {
    if (!surahDetail) return undefined;
    return surahDetail.ayat.find((a) => a.nomorAyat === selectedVerseNumber) || surahDetail.ayat[0];
  }, [surahDetail, selectedVerseNumber]);

  const selectedSurahMeta = SURAH_LIST.find((s) => s.nomor === selectedSurahNumber) || SURAH_LIST[93];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-zinc-200">
        <div>
          {onBackToHome && (
            <button
              id="btn-back-from-picker"
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
          )}
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 font-serif-elegant">
            Pilih Ayat Al-Qur&apos;an
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Pilih ayat yang paling menyentuh dari tema pilihan atau cari langsung surah & ayat yang kamu inginkan.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 rounded-xl bg-zinc-200/70 shrink-0 self-start sm:self-auto">
          <button
            id="tab-curated-verses"
            type="button"
            onClick={() => setActiveTab('curated')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'curated'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            <span>Pilihan Bermakna</span>
          </button>
          <button
            id="tab-browse-surahs"
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>Semua Surah (1-114)</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="quran-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'curated'
                ? 'Cari ayat berdasarkan kata kunci (contoh: sabar, kesulitan, rezeki, hati, syukur)...'
                : 'Cari nama surah atau nomor surah (contoh: Yasin, Al-Kahf, 67)...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Categories (for Curated Tab) */}
        {activeTab === 'curated' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {THEME_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-btn-${cat.id}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-900 text-white font-medium shadow-xs'
                    : 'bg-[#F2F0E8] text-zinc-700 hover:bg-zinc-200/80 border border-zinc-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CURATED TAB CONTENT */}
      {activeTab === 'curated' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredCuratedVerses.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-zinc-200">
              <BookOpen className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-zinc-600 font-medium text-sm">Tidak ditemukan ayat dengan kata kunci tersebut.</p>
              <p className="text-xs text-zinc-400 mt-1">Coba gunakan kata kunci lain atau beralih ke tab &apos;Semua Surah&apos;.</p>
            </div>
          ) : (
            filteredCuratedVerses.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E5E2D6] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-700 hover:shadow-md transition-all group relative text-left"
              >
                <div>
                  {/* Top Badge & Audio */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-semibold border border-emerald-900/15 shrink-0">
                        QS. {item.surahName} : {item.verseNumber}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium truncate">
                        {item.themeLabel}
                      </span>
                    </div>
                    {item.audioUrl && (
                      <div className="shrink-0">
                        <AudioPlayer
                          audioUrl={item.audioUrl}
                          surahName={item.surahName}
                          verseNumber={item.verseNumber}
                          variant="compact"
                          themeClass="text-emerald-900 bg-emerald-100/70 border-emerald-300/80"
                        />
                      </div>
                    )}
                  </div>

                  {/* Arabic text snippet */}
                  <div className="py-3 text-right font-arabic text-xl sm:text-2xl text-emerald-950 font-normal leading-[2.3] select-all" dir="rtl">
                    {item.arabicText}
                  </div>

                  {/* Indonesian Translation */}
                  <p className="text-xs sm:text-sm text-zinc-700 font-serif-elegant italic leading-relaxed mb-3">
                    &quot;{item.translation}&quot;
                  </p>

                  {/* Context Note */}
                  <p className="text-[11px] text-zinc-500 bg-[#FAF9F5] p-2.5 rounded-lg border border-zinc-100 mb-4">
                    💡 <span className="italic">{item.contextNote}</span>
                  </p>
                </div>

                {/* Bottom Action */}
                <button
                  id={`btn-choose-curated-${item.id}`}
                  type="button"
                  onClick={() =>
                    onSelectVerse({
                      surahNumber: item.surahNumber,
                      surahName: item.surahName,
                      surahArabic: item.surahArabic,
                      verseNumber: item.verseNumber,
                      arabicText: item.arabicText,
                      translation: item.translation,
                      audioUrl: item.audioUrl,
                      defaultNote: item.suggestedMessages[0],
                    })
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Pilih Ayat Ini untuk Dikirim</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* BROWSE ALL 114 SURAHS TAB */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Surah Directory */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Daftar 114 Surah
            </h3>
            <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.nomor}
                  id={`surah-select-${surah.nomor}`}
                  type="button"
                  onClick={() => setSelectedSurahNumber(surah.nomor)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedSurahNumber === surah.nomor
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedSurahNumber === surah.nomor
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {surah.nomor}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-medium">{surah.namaLatin}</div>
                      <div
                        className={`text-[11px] ${
                          selectedSurahNumber === surah.nomor ? 'text-emerald-100' : 'text-zinc-500'
                        }`}
                      >
                        {surah.arti} • {surah.jumlahAyat} ayat
                      </div>
                    </div>
                  </div>
                  <span
                    className={`font-arabic text-base ${
                      selectedSurahNumber === surah.nomor ? 'text-white' : 'text-zinc-600'
                    }`}
                  >
                    {surah.nama}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Verses in Selected Surah */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 flex flex-col justify-between min-h-[480px]">
            <div>
              {/* Surah Title Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-zinc-900">
                      Surah {selectedSurahMeta.namaLatin} ({selectedSurahMeta.nama})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                      {selectedSurahMeta.tempatTurun}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Arti: {selectedSurahMeta.arti} • Total {selectedSurahMeta.jumlahAyat} Ayat
                  </p>
                </div>
              </div>

              {isLoadingSurah ? (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
                  <span className="text-xs">Memuat teks Al-Qur&apos;an resmi...</span>
                </div>
              ) : surahDetail ? (
                <div className="py-4 space-y-4">
                  {/* Verse picker pills */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block mb-2">
                      Pilih Nomor Ayat (1 - {surahDetail.jumlahAyat}):
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-zinc-50 rounded-xl border border-zinc-100">
                      {surahDetail.ayat.map((ay) => (
                        <button
                          key={ay.nomorAyat}
                          id={`verse-pill-${ay.nomorAyat}`}
                          type="button"
                          onClick={() => setSelectedVerseNumber(ay.nomorAyat)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                            selectedVerseNumber === ay.nomorAyat
                              ? 'bg-emerald-900 text-white font-bold shadow-xs'
                              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          {ay.nomorAyat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Verse Display */}
                  {currentAyatItem && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFCF9] border border-[#E2DFD2] space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-900/10 text-emerald-900 font-semibold shrink-0">
                          Ayat ke-{currentAyatItem.nomorAyat}
                        </span>
                        {currentAyatItem.audio && currentAyatItem.audio['05'] && (
                          <div className="shrink-0">
                            <AudioPlayer
                              audioUrl={currentAyatItem.audio['05']}
                              surahName={surahDetail.namaLatin}
                              verseNumber={currentAyatItem.nomorAyat}
                              variant="compact"
                            />
                          </div>
                        )}
                      </div>

                      {/* Arabic */}
                      <div className="text-right font-arabic text-2xl sm:text-3xl text-emerald-950 font-normal leading-[2.4] select-all" dir="rtl">
                        {currentAyatItem.teksArab}
                      </div>

                      {/* Translation */}
                      <div className="pt-2 border-t border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                          Terjemahan Resmi Kemenag:
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-700 font-serif-elegant italic leading-relaxed">
                          &quot;{currentAyatItem.teksIndonesia}&quot;
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* CTA to use this verse */}
            {currentAyatItem && surahDetail && (
              <button
                id="btn-confirm-browse-verse"
                type="button"
                onClick={() =>
                  onSelectVerse({
                    surahNumber: surahDetail.nomor,
                    surahName: surahDetail.namaLatin,
                    surahArabic: surahDetail.nama,
                    surahTranslation: surahDetail.arti,
                    verseNumber: currentAyatItem.nomorAyat,
                    arabicText: currentAyatItem.teksArab,
                    translation: currentAyatItem.teksIndonesia,
                    audioUrl: currentAyatItem.audio?.['05'] || surahDetail.audioFull?.['05'],
                    defaultNote: `Semoga ayat QS. ${surahDetail.namaLatin}: ${currentAyatItem.nomorAyat} ini memberikan ketenteraman dan kebaikan untukmu.`,
                  })
                }
                className="w-full mt-4 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
              >
                <Check className="w-4 h-4" />
                <span>Pilih Ayat QS. {surahDetail.namaLatin} : {currentAyatItem.nomorAyat}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
