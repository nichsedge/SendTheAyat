import { SURAH_LIST } from './quran-data';
import { AyatItem, SurahMeta } from './types';

export function getAyatAudioUrl(surahNumber: number, verseNumber: number | string = 1): string {
  const s = String(surahNumber).padStart(3, '0');
  const vNum = typeof verseNumber === 'number' ? verseNumber : (parseInt(String(verseNumber), 10) || 1);
  const v = String(vNum).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${v}.mp3`;
}

export function getSurahAudioUrl(surahNumber: number): string {
  const s = String(surahNumber).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${s}.mp3`;
}

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

const surahCache = new Map<number, SurahFullDetail>();

export async function getSurahDetail(surahNumber: number): Promise<SurahFullDetail> {
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`, {
      headers: { 'Accept': 'application/json' }
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
          audioFull: {
            '05': getSurahAudioUrl(data.data.nomor),
          },
          ayat: (data.data.ayat || []).map((item: any) => ({
            nomorAyat: item.nomorAyat,
            teksArab: item.teksArab,
            teksLatin: item.teksLatin,
            teksIndonesia: item.teksIndonesia,
            audio: {
              '05': getAyatAudioUrl(data.data.nomor, item.nomorAyat),
            },
          })),
        };
        surahCache.set(surahNumber, detail);
        return detail;
      }
    }
  } catch (err) {
    console.warn(`Primary Quran API fetch failed for surah ${surahNumber}:`, err);
  }

  const meta = SURAH_LIST.find(s => s.nomor === surahNumber) || SURAH_LIST[0];
  return {
    nomor: meta.nomor,
    nama: meta.nama,
    namaLatin: meta.namaLatin,
    jumlahAyat: meta.jumlahAyat,
    tempatTurun: meta.tempatTurun,
    arti: meta.arti,
    deskripsi: meta.deskripsi,
    audioFull: { '05': getSurahAudioUrl(meta.nomor) },
    ayat: [
      {
        nomorAyat: 1,
        teksArab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        teksIndonesia: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        audio: { '05': getAyatAudioUrl(meta.nomor, 1) },
      }
    ]
  };
}
