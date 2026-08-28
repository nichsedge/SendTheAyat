import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import VerseViewClient from '@/components/VerseViewClient';

export function generateStaticParams() {
  return [
    { id: 'msg-seed-1' },
    { id: 'msg-seed-2' },
    { id: 'msg-seed-3' },
    { id: 'msg-seed-4' },
    { id: 'msg-seed-5' },
    { id: 'msg-seed-6' },
    { id: 'msg-seed-7' },
    { id: 'msg-seed-8' },
    { id: 'view' },
  ];
}

export default async function SharedVersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
        </div>
      }
    >
      <VerseViewClient id={id} />
    </Suspense>
  );
}
