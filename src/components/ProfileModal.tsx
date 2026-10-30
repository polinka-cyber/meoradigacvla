import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Repeat,
  Heart,
  Package,
  Edit3,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POTI_DISTRICTS } from '../data/mockData';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    updateCurrentUser,
    items,
    setSelectedItem,
    favorites,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'saved' | 'settings'>('listings');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [district, setDistrict] = useState(currentUser.district || 'ცენტრი (რუსთაველის რკალი)');
  const [bio, setBio] = useState(currentUser.bio || '');

  if (!isProfileModalOpen) return null;

  const myListings = items.filter((i) => i.userId === currentUser.id);
  const myFavorites = items.filter((i) => favorites.includes(i.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      phone,
      city: 'ფოთი',
      district,
      bio,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              მომხმარებლის პროფილი
            </h2>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ფოთი
            </span>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* User Profile Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer self-center sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'გაუქმება' : 'რედაქტირება'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  ფოთი, {currentUser.district}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {currentUser.phone || 'ნომერი არ არის'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ★ {currentUser.rating.toFixed(1)} რეიტინგი
                </span>
              </div>

              {currentUser.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>

          {/* Edit Form if editing */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    სახელი და გვარი
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    ტელეფონი
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  ფოთის უბანი
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {POTI_DISTRICTS.filter((d) => d !== 'ყველა უბანი').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  მოკლე ბიო / აღწერა
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  შენახვა
                </button>
              </div>
            </form>
          )}

          {/* Tabs: My Listings & Saved */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('listings')}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === 'listings'
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                ჩემი განცხადებები ფოთში ({myListings.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === 'saved'
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                შენახული ნივთები ({myFavorites.length})
              </button>
            </div>

            {/* Listings Grid */}
            <div className="space-y-2">
              {activeTab === 'listings' ? (
                myListings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    თქვენ ჯერ არ გაქვთ დამატებული განცხადებები ფოთში.
                  </div>
                ) : (
                  myListings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsProfileModalOpen(false);
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.photos[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.dealType === 'gift' ? '🎁 ვაჩუქებ' : '🔄 გაცვლა'} · {item.district} · {item.views} ნახვა
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.status === 'active' ? 'აქტიური' : item.status === 'reserved' ? 'დაჯავშნილი' : 'დასრულებული'}
                      </span>
                    </div>
                  ))
                )
              ) : myFavorites.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  შენახული ნივთები ცარიელია.
                </div>
              ) : (
                myFavorites.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsProfileModalOpen(false);
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.photos[0]}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.user.name} · {item.district}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      ნახვა →
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
