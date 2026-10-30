import React from 'react';
import { Repeat, Heart, Shield, Sparkles, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setSelectedDealType, setSelectedDistrict } = useApp();

  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Repeat className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  ბარტერი
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ფოთი
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              მეორადი ნივთებისა და ტექნიკის გაცვლისა და გაჩუქების პლატფორმა ექსკლუზიურად
              ქალაქ ფოთის მოსახლეობისთვის.
            </p>
          </div>

          {/* Poti Districts */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>ფოთის უბნები</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedDistrict('ცენტრი (რუსთაველის რკალი)');
                    setActiveTab('explore');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  ცენტრი & რუსთაველის რკალი
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDistrict('კუნძულის უბანი');
                    setActiveTab('explore');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  კუნძულის უბანი
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDistrict('მალთაყვა');
                    setActiveTab('explore');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  მალთაყვა & სანაპირო
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDistrict('ნაბადა');
                    setActiveTab('explore');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  ნაბადა & პორტის მიმდებარე
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDistrict('ჭალა');
                    setActiveTab('explore');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  ჭალა & მე-7 რაიონი
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Filters */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              გაცვლა & გაჩუქება
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedDealType('gift');
                    setActiveTab('gifts');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  🎁 უფასო გაჩუქება ფოთში
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDealType('exchange');
                    setActiveTab('exchanges');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  🔄 ბარტერი / გაცვლა
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('tech');
                    setActiveTab('explore');
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  💻 მეორადი ტექნიკა
                </button>
              </li>
            </ul>
          </div>

          {/* Safe Community Meetings in Poti */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              უსაფრთხოება ფოთში
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              გაცვლისას შეხვდით ფოთის ხალხმრავალ ადგილებში (რუსთაველის რკალი, ცენტრალური პარკი, კუნძულის ხიდთან).
              ადგილზე შეამოწმეთ ტექნიკა.
            </p>
            <div className="pt-1 text-[11px] text-slate-400">
              © {new Date().getFullYear()} ბარტერი ფოთი (Barteri Poti).
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
