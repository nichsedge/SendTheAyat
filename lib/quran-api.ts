import { SURAH_LIST } from './quran-data';
import { AyatItem, SurahMeta } from './types';

export async function getSurahList(): Promise<SurahMeta[]> {
  return SURAH_LIST;
}

export interface SurahFullDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
  deskripsi: string;
  audioFull?: Record<string, string>;
  ayat: AyatItem[];
}

// In-memory cache for surah verses during session
const surahCache = new Map<number, SurahFullDetail>();

export async function getSurahDetail(surahNumber: number): Promise<SurahFullDetail> {
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  try {
    // Primary trusted source: EQuran API v2 (official Kemenag dataset mirror)
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`, {
      next: { revalidate: 86400 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.code === 200 && data.data) {
        const detail: SurahFullDetail = {
          nomor: data.data.nomor,
          nama: data.data.nama,
          namaLatin: data.data.namaLatin,
          jumlahAyat: data.data.jumlahAyat,
          tempatTurun: data.data.tempatTurun === 'Mekah' ? 'Mekah' : 'Madinah',
          arti: data.data.arti,
          deskripsi: data.data.deskripsi || '',
          audioFull: data.data.audioFull,
          ayat: (data.data.ayat || []).map((item: any) => ({
            nomorAyat: item.nomorAyat,
            teksArab: item.teksArab,
            teksLatin: item.teksLatin,
            teksIndonesia: item.teksIndonesia,
            audio: item.audio,
          })),
        };
        surahCache.set(surahNumber, detail);
        return detail;
      }
    }
  } catch (err) {
    console.warn(`Primary Quran API fetch failed for surah ${surahNumber}, trying secondary...`, err);
  }

  // Secondary fallback: Quran Kemenag Open API
  try {
    const res = await fetch(`https://open-api.my.id/api/quran/surah/${surahNumber}`);
    if (res.ok) {
      const data = await res.json();
      const meta = SURAH_LIST.find(s => s.nomor === surahNumber) || SURAH_LIST[0];
      const detail: SurahFullDetail = {
        nomor: meta.nomor,
        nama: meta.nama,
        namaLatin: meta.namaLatin,
        jumlahAyat: meta.jumlahAyat,
        tempatTurun: meta.tempatTurun,
        arti: meta.arti,
        deskripsi: meta.deskripsi,
        ayat: (data.ayat || []).map((item: any) => ({
          nomorAyat: item.nomor || item.nomorAyat,
          teksArab: item.ar || item.teksArab,
          teksLatin: item.tr || item.teksLatin,
          teksIndonesia: item.idn || item.teksIndonesia,
        })),
      };
      surahCache.set(surahNumber, detail);
      return detail;
    }
  } catch (err) {
    console.error(`Secondary Quran API failed for surah ${surahNumber}:`, err);
  }

  // Fallback metadata if network is unavailable
  const meta = SURAH_LIST.find(s => s.nomor === surahNumber) || SURAH_LIST[0];
  return {
    nomor: meta.nomor,
    nama: meta.nama,
    namaLatin: meta.namaLatin,
    jumlahAyat: meta.jumlahAyat,
    tempatTurun: meta.tempatTurun,
    arti: meta.arti,
    deskripsi: meta.deskripsi,
    ayat: [
      {
        nomorAyat: 1,
        teksArab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        teksIndonesia: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      }
    ]
  };
}
