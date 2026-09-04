'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AyatPicker from '@/components/AyatPicker';
import CardComposer from '@/components/CardComposer';
import SharedCardView from '@/components/SharedCardView';
import CommunityFeed from '@/components/CommunityFeed';
import CuratedFeed from '@/components/CuratedFeed';
import Footer from '@/components/Footer';
import { CURATED_VERSES } from '@/lib/quran-data';
import { INITIAL_COMMUNITY_MESSAGES } from '@/lib/community-messages';
import { CardThemeId, CuratedVerse, PersonalMessage } from '@/lib/types';
import { decodeSharePayload, encodeSharePayload, getSentMessagesLocally, saveSentMessageLocally } from '@/lib/share-helper';
import { Loader2 } from 'lucide-react';

function MainAppContent() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<'landing' | 'picker' | 'compose' | 'shared'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('p');
      const id = new URLSearchParams(window.location.search).get('id');
      if (p || id) return 'shared';
    }
    return 'landing';
  });
  
  const [initialMood, setInitialMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [communityMessages, setCommunityMessages] = useState<PersonalMessage[]>(INITIAL_COMMUNITY_MESSAGES);
  
  // Selected verse for composer
  const [selectedVerse, setSelectedVerse] = useState<{
    surahNumber: number;
    surahName: string;
    surahArabic: string;
    surahTranslation?: string;
    verseNumber: number | string;
    arabicText: string;
    translation: string;
    audioUrl?: string;
    defaultNote?: string;
  }>(CURATED_VERSES[0]);

  // Active message when in 'shared' view
  const [activeMessage, setActiveMessage] = useState<PersonalMessage | null>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('p');
      if (p) {
        return decodeSharePayload(p);
      }
    }
    return null;
  });
  const [isCreator, setIsCreator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.href : '';
  });

  // Load community messages from API and combine with local messages
  useEffect(() => {
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.messages)) {
          const localSent = getSentMessagesLocally();
          const map = new Map<string, PersonalMessage>();
          
          // Seed & Server messages
          data.messages.forEach((m: PersonalMessage) => map.set(m.id, m));
          // Local messages take precedence
          localSent.forEach((m: PersonalMessage) => map.set(m.id, m));
          
          setCommunityMessages(Array.from(map.values()));
        }
      })
      .catch((err) => console.warn('Could not fetch remote messages, using local/seed:', err));
  }, []);

  // Check URL parameters on mount (?id=msgId)
  useEffect(() => {
    const msgId = searchParams.get('id');
    const p = searchParams.get('p');

    if (!p && msgId) {
      fetch(`/api/messages?id=${encodeURIComponent(msgId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.message) {
            setActiveMessage(data.message);
            setCurrentShareUrl(window.location.href);
            setIsCreator(false);
            setCurrentView('shared');
          }
        })
        .catch((err) => console.error('Failed to load message by id:', err));
    }
  }, [searchParams]);

  // Handler: Start send from hero, feed, or navbar
  const handleStartSend = (verse?: CuratedVerse) => {
    if (verse) {
      setSelectedVerse({
        surahNumber: verse.surahNumber,
        surahName: verse.surahName,
        surahArabic: verse.surahArabic,
        verseNumber: verse.verseNumber,
        arabicText: verse.arabicText,
        translation: verse.translation,
        audioUrl: verse.audioUrl,
        defaultNote: verse.suggestedMessages[0],
      });
      setCurrentView('compose');
    } else {
      setInitialMood('all');
      setCurrentView('picker');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Select verse from picker
  const handleSelectVerseFromPicker = (verse: typeof selectedVerse) => {
    setSelectedVerse(verse);
    setCurrentView('compose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Open community message card
  const handleOpenMessage = (msg: PersonalMessage) => {
    setActiveMessage(msg);
    const token = encodeSharePayload(msg);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    setCurrentShareUrl(`${origin}/v/${msg.id}?p=${token}`);
    setIsCreator(false);
    setCurrentView('shared');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll to feed
  const handleScrollToFeed = () => {
    const el = document.getElementById('community-feed-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler: Generate Shareable Link
  const handleGenerateLink = async (formData: {
    recipientName: string;
    senderName: string;
    personalNote: string;
    theme: CardThemeId;
    isPrivate: boolean;
  }) => {
    setIsGenerating(true);
    try {
      const payload: Omit<PersonalMessage, 'views' | 'reactions'> = {
        id: `ka-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        recipientName: formData.recipientName || 'Untukmu',
        senderName: formData.senderName || 'Seseorang yang mendoakanmu',
        personalNote: formData.personalNote,
        surahNumber: selectedVerse.surahNumber,
        surahName: selectedVerse.surahName,
        surahArabic: selectedVerse.surahArabic,
        surahTranslation: selectedVerse.surahTranslation || '',
        verseNumber: selectedVerse.verseNumber,
        arabicText: selectedVerse.arabicText,
        translation: selectedVerse.translation,
        theme: formData.theme,
        audioUrl: selectedVerse.audioUrl,
        isPrivate: formData.isPrivate,
        createdAt: Date.now(),
      };

      const token = encodeSharePayload(payload);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      // Share URL routes through /v/[id]?p=[token] for rich social preview & instant client hydration
      const fullUrl = `${origin}/v/${payload.id}?p=${token}`;

      const fullMsg: PersonalMessage = {
        ...payload,
        reactions: { aamiin: 0, heart: 0, peace: 0 },
        views: 1,
      };

      // Save locally to user's history
      saveSentMessageLocally(fullMsg);

      // Only prepend to public community feed if not private
      if (!formData.isPrivate) {
        setCommunityMessages((prev) => [fullMsg, ...prev.filter((m) => m.id !== fullMsg.id)]);
      }

      // Also persist on server / Cloudflare D1
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((e) => console.warn('API store notice:', e));

      setActiveMessage(fullMsg);
      setCurrentShareUrl(fullUrl);
      setIsCreator(true);
      setCurrentView('shared');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error generating link:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
      <Navbar
        onGoHome={() => {
          setCurrentView('landing');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartCompose={() => handleStartSend()}
        onOpenVersePicker={() => {
          setInitialMood('all');
          setCurrentView('picker');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectSavedCard={(msg) => handleOpenMessage(msg)}
      />

      <main className="flex-1">
        {/* VIEW 1: LANDING & FEED (SendTheSong Experience) */}
        {currentView === 'landing' && (
          <>
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onStartSend={handleStartSend}
              onScrollToFeed={handleScrollToFeed}
            />

            <CommunityFeed
              messages={communityMessages}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenMessage={handleOpenMessage}
              onStartCompose={() => handleStartSend()}
            />

            <CuratedFeed
              onSelectVerse={(verse) => {
                handleStartSend(verse);
              }}
            />
          </>
        )}

        {/* VIEW 2: AYAT PICKER */}
        {currentView === 'picker' && (
          <AyatPicker
            initialMood={initialMood}
            onSelectVerse={handleSelectVerseFromPicker}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}

        {/* VIEW 3: CARD COMPOSER */}
        {currentView === 'compose' && (
          <CardComposer
            verse={selectedVerse}
            onBackToPicker={() => setCurrentView('picker')}
            onGenerateLink={handleGenerateLink}
            isGenerating={isGenerating}
          />
        )}

        {/* VIEW 4: SHARED CARD VIEW */}
        {currentView === 'shared' && activeMessage && (
          <SharedCardView
            message={activeMessage}
            shareUrl={currentShareUrl}
            isCreator={isCreator}
            onNewMessage={() => {
              setInitialMood('all');
              setCurrentView('picker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
        </div>
      }
    >
      <MainAppContent />
    </Suspense>
  );
}
