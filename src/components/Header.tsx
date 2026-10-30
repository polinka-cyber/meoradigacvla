import React, { useState } from 'react';
import {
  Sun,
  Moon,
  MessageSquare,
  Plus,
  User,
  Heart,
  ChevronDown,
  Repeat,
  Gift,
  Search,
  UserPlus,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentUser,
    switchUser,
    allUsers,
    activeTab,
    setActiveTab,
    unreadCountTotal,
    setIsCreateModalOpen,
    openAuthModal,
    setIsProfileModalOpen,
    setIsChatModalOpen,
    favorites,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand title, one line with Poti indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm font-bold text-lg transition-transform group-hover:scale-105">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    ბარტერი
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ფოთი
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  მხოლოდ ფოთის მასშტაბით
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar in Header */}
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="მოძებნე ტექნიკა, ველოსიპედი, წიგნები ფოთში..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('explore')}
              className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'explore'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              კატალოგი
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'gifts'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift className="w-4 h-4 text-emerald-500" />
              <span>გაჩუქება</span>
            </button>
            <button
              onClick={() => setActiveTab('exchanges')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'exchanges'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4 text-indigo-500" />
              <span>გაცვლა</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'saved'
                  ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>შენახული</span>
              {favorites.length > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-rose-500">
                  ({favorites.length})
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions, Theme Toggle, Registration button & Account Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Direct Registration Button */}
            <button
              onClick={() => openAuthModal('register')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>რეგისტრაცია</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              title={theme === 'dark' ? 'ნათელ რეჟიმზე გადართვა' : 'მუქ რეჟიმზე გადართვა'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
            </button>

            {/* Chat & Messages Button */}
            <button
              onClick={() => setIsChatModalOpen(true)}
              aria-label="შეტყობინებები"
              title="ჩატი და შეტყობინებები"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCountTotal > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-emerald-500 rounded-full flex items-center justify-center font-mono">
                  {unreadCountTotal}
                </span>
              )}
            </button>

            {/* User Dropdown / Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                    {currentUser.district || 'ფოთი'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Switcher Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.district}
                    </p>
                    <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      ★ {currentUser.rating.toFixed(1)} · {currentUser.tradesCompleted} გაცვლა ფოთში
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      ჩემი პროფილი და განცხადებები
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('my_items');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      ჩემი შეთავაზებები
                    </button>
                  </div>

                  {/* Quick Profile Switcher for Live Testing in Poti */}
                  <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      ფოთელი მომხმარებლები (ტესტირება)
                    </p>
                    <div className="space-y-1">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-left cursor-pointer transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate flex-1">{u.name}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                            {u.district?.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>ახალი აქაუნთის რეგისტრაცია</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action CTA: Add Listing */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">დაამატე განცხადება</span>
              <span className="sm:hidden">დამატება</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
