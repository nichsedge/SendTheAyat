'use client';

import { useEffect, useState, use, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SharedCardView from '@/components/SharedCardView';
import Footer from '@/components/Footer';
import { PersonalMessage } from '@/lib/types';
import { decodeSharePayload, encodeSharePayload } from '@/lib/share-helper';
import { CURATED_VERSES } from '@/lib/quran-data';
import { INITIAL_COMMUNITY_MESSAGES } from '@/lib/community-messages';
import { Loader2 } from 'lucide-react';

export default function VerseViewClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [message, setMessage] = useState<PersonalMessage | null>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('p');
      if (p) {
        return decodeSharePayload(p);
      }
    }
    const seed = INITIAL_COMMUNITY_MESSAGES.find(m => m.id === id);
    if (seed) return seed;
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('p');
      if (p && decodeSharePayload(p)) return false;
    }
    const seed = INITIAL_COMMUNITY_MESSAGES.find(m => m.id === id);
    if (seed) return false;
    return true;
  });

  useEffect(() => {
    const p = searchParams.get('p');
    if (p && decodeSharePayload(p)) {
      return;
    }

    const seed = INITIAL_COMMUNITY_MESSAGES.find(m => m.id === id);
    if (seed) {
      return;
    }

    // Fetch from API endpoint by id
    fetch(`/api/messages?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.message) {
          setMessage(data.message);
        } else {
          // Fallback to first curated verse as preview if not found
          const fallback = CURATED_VERSES[0];
          setMessage({
            id,
            recipientName: 'Untukmu',
            senderName: 'Dari Seseorang',
            personalNote: 'Semoga ayat ini membawa ketenangan dan keberkahan di setiap langkahmu.',
            surahNumber: fallback.surahNumber,
            surahName: fallback.surahName,
            surahArabic: fallback.surahArabic,
            verseNumber: fallback.verseNumber,
            arabicText: fallback.arabicText,
            translation: fallback.translation,
            theme: 'emerald-sand',
            audioUrl: fallback.audioUrl,
            createdAt: Date.now(),
          });
        }
      })
      .catch((e) => {
        console.error('Error loading shared card:', e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
        <Navbar
          onGoHome={() => router.push('/')}
          onStartCompose={() => router.push('/')}
          onOpenVersePicker={() => router.push('/')}
        />
        <div className="text-center py-20 text-zinc-600">
          <p>Pesan ayat tidak ditemukan.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-emerald-900 text-white rounded-full text-xs font-medium"
          >
            Kembali ke Beranda
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const token = encodeSharePayload(message);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?p=${token}` : '';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
      <Navbar
        onGoHome={() => router.push('/')}
        onStartCompose={() => router.push('/')}
        onOpenVersePicker={() => router.push('/')}
      />
      <main className="flex-1">
        <SharedCardView
          message={message}
          shareUrl={shareUrl}
          onNewMessage={() => router.push('/')}
          isCreator={false}
        />
      </main>
      <Footer />
    </div>
  );
}
