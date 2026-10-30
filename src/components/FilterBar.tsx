import React from 'react';
import {
  Laptop,
  Shirt,
  Armchair,
  BookOpen,
  Gamepad2,
  Bike,
  Baby,
  Package,
  Layers,
  MapPin,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, DealType, ItemCondition } from '../types';
import { POTI_DISTRICTS } from '../data/mockData';

interface CategoryOption {
  id: Category | 'all';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'ყველა კატეგორია', icon: Layers },
  { id: 'tech', label: 'ტექნიკა & გაჯეტები', icon: Laptop },
  { id: 'gaming', label: 'გეიმინგი & კონსოლები', icon: Gamepad2 },
  { id: 'books', label: 'წიგნები & საკანცელარიო', icon: BookOpen },
  { id: 'sports', label: 'სპორტი & ველო', icon: Bike },
  { id: 'furniture', label: 'ავეჯი & სახლი', icon: Armchair },
  { id: 'clothes', label: 'ტანსაცმელი', icon: Shirt },
  { id: 'kids', label: 'საბავშვო', icon: Baby },
  { id: 'other', label: 'სხვა ნივთები', icon: Package },
];

const CONDITIONS: { id: ItemCondition | 'all'; label: string }[] = [
  { id: 'all', label: 'ნებისმიერი მდგომარეობა' },
  { id: 'like_new', label: 'ახალივით' },
  { id: 'good', label: 'კარგი' },
  { id: 'fair', label: 'საშუალო' },
  { id: 'repair', label: 'შესაკეთებელი / ნაწილებად' },
];

export const FilterBar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedDealType,
    setSelectedDealType,
    selectedDistrict,
    setSelectedDistrict,
    selectedCondition,
    setSelectedCondition,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const isFiltered =
    selectedCategory !== 'all' ||
    selectedDealType !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedCondition !== 'all' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedDealType('all');
    setSelectedDistrict('all');
    setSelectedCondition('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Category Horizontal Scrolling Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Bar: Deal Type segmented controls + Poti District + Condition selects */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Deal Type Segmented Controls */}
        <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setSelectedDealType('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedDealType === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ყველა ტიპი
          </button>
          <button
            onClick={() => setSelectedDealType('gift')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedDealType === 'gift'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            🎁 მხოლოდ გაჩუქება (უფასოდ)
          </button>
          <button
            onClick={() => setSelectedDealType('exchange')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedDealType === 'exchange'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            🔄 მხოლოდ გაცვლა
          </button>
        </div>

        {/* Dropdown Filters (Poti District, Condition, Reset) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Poti District select */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="pl-8 pr-7 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
            >
              <option value="all">ფოთი (ყველა უბანი)</option>
              {POTI_DISTRICTS.filter((d) => d !== 'ყველა უბანი').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Condition select */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value as ItemCondition | 'all')}
              className="pl-8 pr-7 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond.id} value={cond.id}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button if any filter is active */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>გასუფთავება</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
