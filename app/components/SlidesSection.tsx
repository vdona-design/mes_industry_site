"use client";
import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Sliders, Presentation, Check } from 'lucide-react';
import { SlideItem } from './data';

interface SlidesSectionProps {
  slides: SlideItem[];
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  executeSlideAction: (type: string) => void;
  isSlideFullScreen: boolean;
  toggleSlideFullscreen: () => Promise<void>;
  handleSlideClick: (e: React.MouseEvent) => void;
  slideRef: React.RefObject<HTMLDivElement>;
}

export function SlidesSection({
  slides,
  currentSlide,
  setCurrentSlide,
  executeSlideAction,
  isSlideFullScreen,
  toggleSlideFullscreen,
  handleSlideClick,
  slideRef
}: SlidesSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          ref={slideRef}
          onClick={handleSlideClick}
          className={`lg:col-span-full flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/20 rounded-2xl p-8 shadow-xl relative min-h-[460px] ${
            isSlideFullScreen ? 'cursor-pointer' : ''
          }`}
        >
          <div className="absolute top-4 right-6 flex items-center gap-3">
            <div className="text-xs text-slate-600 font-mono font-bold">SLIDE {currentSlide + 1} / {slides.length}</div>
            <button
              onClick={toggleSlideFullscreen}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
              aria-label={isSlideFullScreen ? 'Esci Fullscreen' : 'Apri Fullscreen'}
              title={isSlideFullScreen ? 'Esci Fullscreen (Esc)' : 'Apri Fullscreen (F)'}
            >
              <Presentation className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6">


            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {slides[currentSlide].title}
            </h3>

            <p className="text-slate-300 leading-relaxed text-base">
              {slides[currentSlide].desc}
            </p>

            <ul className="space-y-3 pt-2">
              {slides[currentSlide].points.map((pt, index) => (
                <li key={index} className="flex items-start text-sm text-slate-400">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 mr-3" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            {slides[currentSlide].actionType ? (
              <button
                onClick={() => executeSlideAction(slides[currentSlide].actionType!)}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-900/20"
              >
                <Sliders className="h-4 w-4" /> {slides[currentSlide].actionLabel}
              </button>
            ) : (
              <div className="text-xs text-slate-500 italic">Usa i controlli in basso per scorrere la presentazione.</div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setCurrentSlide(p => Math.max(0, p - 1))}
                disabled={currentSlide === 0}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-white transition border border-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentSlide(p => Math.min(slides.length - 1, p + 1))}
                disabled={currentSlide === slides.length - 1}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-white transition flex items-center gap-2 font-bold text-xs px-4"
              >
                Avanti <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden"></div>
      </div>
    </div>
  );
}
