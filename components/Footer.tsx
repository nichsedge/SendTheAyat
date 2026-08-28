import { BookOpen, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F4F3ED] border-t border-[#E5E2D6] py-10 text-xs text-zinc-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-900/10 flex items-center justify-center text-emerald-900 font-arabic text-xs font-bold">
            ق
          </div>
          <span className="font-semibold text-zinc-900">KirimAyat</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500">Pesan Personal Ayat Al-Qur&apos;an</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
            Teks & Terjemahan Resmi Kemenag RI
          </span>
          <span>•</span>
          <span>Tenang & Bebas Iklan</span>
        </div>
      </div>
    </footer>
  );
}
