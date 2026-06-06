'use client';

import { useState } from 'react';
import { Shield, Moon, Sun, Heart } from 'lucide-react';
import { Language, Theme } from '@/lib/types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isModerator: boolean;
  onModeratorClick: () => void;
}

export default function Header({ lang, setLang, theme, setTheme, isModerator, onModeratorClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0a0a0a]/95 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9f1239] to-[#b91c1c] flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold tracking-tighter">UR</span>
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tighter">Ukrainian Reborn</div>
              <div className="text-[10px] text-zinc-500 -mt-1">\u0412\u0406\u0414\u0420\u041e\u0414\u0416\u0423\u0404\u041c\u041e \u041c\u041e\u0416\u041b\u0418\u0412\u041e\u0421\u0422\u0406 \u0420\u0410\u0417\u041e\u041c</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-x-8 text-sm font-medium">
            <a href="#vacancies" className="hover:text-[#9f1239] transition-colors">\u0412\u0430\u043a\u0430\u043d\u0441\u0456\u0457</a>
            <a href="#community" className="hover:text-[#9f1239] transition-colors">\u0421\u043f\u0456\u043b\u044c\u043d\u043e\u0442\u0430</a>
            <a href="#" className="hover:text-[#9f1239] transition-colors">\u0414\u043b\u044f \u0440\u043e\u0431\u043e\u0442\u043e\u0434\u0430\u0432\u0446\u0456\u0432</a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-x-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-zinc-900 rounded-2xl p-1 border border-zinc-800">
              <button
                onClick={() => setLang('ua')}
                className={`px-4 py-1.5 text-sm font-medium rounded-[14px] transition-all ${lang === 'ua' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                UA
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 text-sm font-medium rounded-[14px] transition-all ${lang === 'en' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center bg-zinc-900 rounded-2xl p-1 border border-zinc-800">
              <button onClick={() => setTheme('dark')} className="w-9 h-9 flex items-center justify-center rounded-[14px] hover:bg-zinc-800 transition-colors" title="\u0422\u0435\u043c\u043d\u0430">
                <Moon className="w-4 h-4" />
              </button>
              <button onClick={() => setTheme('light')} className="w-9 h-9 flex items-center justify-center rounded-[14px] hover:bg-zinc-800 transition-colors" title="\u0421\u0432\u0456\u0442\u043b\u0430">
                <Sun className="w-4 h-4" />
              </button>
              <button onClick={() => setTheme('reborn')} className="w-9 h-9 flex items-center justify-center rounded-[14px] hover:bg-zinc-800 transition-colors" title="Reborn Red">
                <Heart className="w-4 h-4 text-[#b91c1c]" />
              </button>
            </div>

            {/* Moderator Button */}
            <button 
              onClick={onModeratorClick}
              className="flex items-center gap-x-2 px-5 py-2.5 rounded-2xl text-sm font-semibold border border-zinc-700 hover:border-zinc-600 transition-all hover:bg-zinc-900"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">\u041c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440</span>
            </button>

            {isModerator && (
              <div className="flex items-center gap-x-2 px-4 py-2 bg-emerald-950 text-emerald-400 text-xs font-medium rounded-2xl border border-emerald-900">
                <span>\u041c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}