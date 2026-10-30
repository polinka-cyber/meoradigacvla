import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CreateItemModal } from './components/CreateItemModal';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import { Gift, Repeat, Heart, Package, Plus, Sparkles, UserPlus, MapPin } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    items,
    activeTab,
    setActiveTab,
    selectedCategory,
    selectedDealType,
    selectedDistrict,
    selectedCondition,
    searchQuery,
    favorites,
    currentUser,
    setIsCreateModalOpen,
    openAuthModal,
  } = useApp();

  // Filter items based on activeTab, category, dealType, Poti district, condition, search
  const filteredItems = items.filter((item) => {
    // Tab filter
    if (activeTab === 'gifts' && item.dealType !== 'gift') return false;
    if (activeTab === 'exchanges' && item.dealType !== 'exchange') return false;
    if (activeTab === 'my_items' && item.userId !== currentUser.id) return false;
    if (activeTab === 'saved' && !favorites.includes(item.id)) return false;

    // Deal type filter
    if (selectedDealType !== 'all' && item.dealType !== selectedDealType) return false;

    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    // Poti District filter
    if (selectedDistrict !== 'all') {
      const target = selectedDistrict.toLowerCase();
      const itemDist = (item.district || '').toLowerCase();
      // Match keywords e.g. "ცენტრი", "კუნძული", "მალთაყვა", "ნაბადა", "ჭალა", "პორტი"
      const keyword = target.split(' ')[0].replace(/[^ა-ჰ]/g, '');
      if (!itemDist.includes(keyword)) {
        return false;
      }
    }

    // Condition filter
    if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

    // Live search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchExchange = item.wantInExchange?.toLowerCase().includes(q);
      const matchDistrict = (item.district || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchExchange && !matchDistrict) {
        return false;
      }
    }

    return true;
  });

  const getSectionTitle = () => {
    if (activeTab === 'gifts') return '🎁 უფასოდ გასაჩუქებელი ნივთები ფოთში';
    if (activeTab === 'exchanges') return '🔄 ბარტერი და გაცვლის შეთავაზებები ფოთში';
    if (activeTab === 'my_items') return 'ჩემი განცხადებები (ფოთი)';
    if (activeTab === 'saved') return '❤️ შენახული ნივთები';
    if (selectedCategory !== 'all') {
      const labels: Record<string, string> = {
        tech: '💻 ტექნიკა და გაჯეტები ფოთში',
        gaming: '🎮 გეიმინგი & კონსოლები',
        books: '📚 წიგნები & საკანცელარიო',
        sports: '🚲 სპორტი, ველო & თევზაობა',
        furniture: '🛋️ ავეჯი & სახლი',
        clothes: '👕 ტანსაცმელი & ფეხსაცმელი',
        kids: '🧸 საბავშვო ნივთები',
        other: '📦 სხვა ნივთები',
      };
      return labels[selectedCategory] || 'განცხადებები ფოთში';
    }
    return 'უახლესი განცხადებები ფოთში';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        {/* Hero banner shown on explore tab when not searching */}
        {activeTab === 'explore' && !searchQuery && <HeroBanner />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Main Controls & Filters */}
          <FilterBar />

          {/* Registration Prompt Callout Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-sm sm:text-base">
                  <span>ფოთის ბარტერის რეგისტრაციის ველი</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/25">100% უფასო</span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5">
                  გაიარე მარტივი რეგისტრაცია, მიუთითე შენი უბანი ფოთში და შეათანხმე გაცვლა პირდაპირ ჩატში!
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              რეგისტრაციის გახსნა →
            </button>
          </div>

          {/* Section Header with items count */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {getSectionTitle()}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                ({filteredItems.length})
              </span>
            </div>

            {/* Quick Add Button in section header */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>განცხადების დამატება ფოთში</span>
            </button>
          </div>

          {/* Products Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Package className="w-6 h-6 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  ნივთები ვერ მოიძებნა ფოთში
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  არჩეული უბნით ან კატეგორიით განცხადება არ არის. სცადეთ სხვა უბანი ან დაამატეთ თქვენი პირველი ნივთი!
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>დაამატე შენი ნივთი ფოთში</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Global Modals */}
      <ItemDetailModal />
      <CreateItemModal />
      <ChatModal />
      <AuthModal />
      <ProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
