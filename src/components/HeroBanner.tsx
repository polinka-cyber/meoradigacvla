import React from 'react';
import { Gift, Repeat, ArrowRight, ShieldCheck, Sparkles, MapPin, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedDealType, setActiveTab, setIsCreateModalOpen, openAuthModal } = useApp();

  return (
    <section className="relative overflow-hidden bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>მხოლოდ ქალაქ ფოთის მასშტაბით · ადგილობრივი გაცვლა</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
              მეორადი ნივთებისა და ტექნიკის გაცვლა ფოთში.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              გაჩუქე უფასოდ ან გაცვალე ტექნიკა, წიგნები და ავეჯი ფოთელ მეზობლებთან.
              შეხვდი მარტივად ცენტრში, კუნძულზე, მალთაყვაში, ნაბადასა თუ ჭალაში.
            </p>

            {/* Quick Action Buttons including Registration */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>გაიარე რეგისტრაცია</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDealType('gift');
                  setActiveTab('gifts');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-100 font-medium text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Gift className="w-4 h-4 text-emerald-500" />
                <span>🎁 უფასო გაჩუქება</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDealType('exchange');
                  setActiveTab('exchanges');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-100 font-medium text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Repeat className="w-4 h-4 text-indigo-500" />
                <span>🔄 ბარტერი</span>
              </button>
            </div>

            {/* Poti Community Trust Features */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% უფასო ფოთის მცხოვრებთათვის</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <div>
                <span>პირდაპირი ჩატი & შეთანხმება</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <div>
                <span>კუნძული · მალთაყვა · ცენტრი · ნაბადა · ჭალა</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Image Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 aspect-[16/10] sm:aspect-[16/11]">
              <img
                src="/src/assets/images/hero_exchange_banner_1793383201586.jpg"
                alt="ფოთის მეორადი ნივთებისა და ტექნიკის გაცვლა"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-xs font-medium text-slate-200">
                  ფოთის ადგილობრივი საზოგადოება
                </p>
                <p className="text-[11px] text-slate-300">
                  გაჩუქე ან გაცვალე მეორადი ტექნიკა და ნივთები
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
