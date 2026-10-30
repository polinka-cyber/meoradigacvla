import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Gift,
  Repeat,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, DealType, ItemCondition } from '../types';
import { POTI_DISTRICTS } from '../data/mockData';

export const CreateItemModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addItem, currentUser, setSelectedItem } =
    useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('tech');
  const [dealType, setDealType] = useState<DealType>('gift');
  const [condition, setCondition] = useState<ItemCondition>('good');
  const [wantInExchange, setWantInExchange] = useState('');
  const [district, setDistrict] = useState(currentUser.district || 'ცენტრი (რუსთაველის რკალი)');
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCreateModalOpen) return null;

  // Handle local image file upload via FileReader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Preset sample photos for fast testing
  const addPresetPhoto = (url: string) => {
    setPhotos((prev) => [...prev, url]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('გთხოვთ მიუთითოთ ნივთის სათაური');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('გთხოვთ მიუთითოთ მოკლე აღწერა');
      return;
    }
    if (dealType === 'exchange' && !wantInExchange.trim()) {
      setErrorMsg('გთხოვთ მიუთითოთ, რაში გსურთ ნივთის გაცვლა');
      return;
    }
    if (photos.length === 0) {
      setErrorMsg('გთხოვთ ატვირთოთ მინიმუმ 1 ფოტო');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdItem = addItem({
        title: title.trim(),
        description: description.trim(),
        category,
        dealType,
        condition,
        wantInExchange: dealType === 'exchange' ? wantInExchange.trim() : undefined,
        photos,
        city: 'ფოთი',
        district: `${district}${streetAddress.trim() ? ` (${streetAddress.trim()})` : ''}`,
        phone: phone.trim() || currentUser.phone,
        status: 'active',
      });

      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      setSelectedItem(createdItem);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('შეცდომა განცხადების დამატებისას.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ახალი განცხადების დამატება
              </h2>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ფოთი
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              გაჩუქე უფასოდ ან გაცვალე მეორადი ნივთი/ტექნიკა ფოთელ მეზობლებთან
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Deal Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              განცხადების ტიპი
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDealType('gift')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  dealType === 'gift'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>🎁 ვაჩუქებ უფასოდ</span>
              </button>

              <button
                type="button"
                onClick={() => setDealType('exchange')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  dealType === 'exchange'
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Repeat className="w-4 h-4 text-indigo-600" />
                <span>🔄 გავცვლი / ბარტერი</span>
              </button>
            </div>
          </div>

          {/* Photo Upload Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                ნივთის ფოტოები ({photos.length})
              </label>
              <span className="text-[11px] text-slate-400">ატვირთეთ ფაილი ან აირჩიეთ მზა ფოტო</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                დააჭირეთ ფოტოების ასატვირთად მოწყობილობიდან
              </p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP</p>
            </div>

            {/* Quick Presets */}
            <div className="pt-1">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                ან აირჩიეთ სწრაფი მზა ფოტო:
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => addPresetPhoto('/src/assets/images/tech_headphones_gadget_1793383194446.jpg')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  + ყურსასმენი
                </button>
                <button
                  type="button"
                  onClick={() => addPresetPhoto('/src/assets/images/vintage_city_bicycle_1793383194720.jpg')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  + ველოსიპედი
                </button>
                <button
                  type="button"
                  onClick={() => addPresetPhoto('/src/assets/images/curated_book_stack_1793383195177.jpg')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  + წიგნები
                </button>
                <button
                  type="button"
                  onClick={() => addPresetPhoto('/src/assets/images/hero_exchange_banner_1793383201586.jpg')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  + გაჯეტები / ლეპტოპი
                </button>
              </div>
            </div>

            {/* Photos Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
                {photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group"
                  >
                    <img
                      src={photoUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              სათაური *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="მაგ: Sony PlayStation 4 Slim, ველოსიპედი ან წიგნები"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                კატეგორია *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="tech">💻 ტექნიკა & გაჯეტები</option>
                <option value="gaming">🎮 გეიმინგი & კონსოლები</option>
                <option value="books">📚 წიგნები & საკანცელარიო</option>
                <option value="sports">🚲 სპორტი & ველო</option>
                <option value="furniture">🛋️ ავეჯი & სახლი</option>
                <option value="clothes">👕 ტანსაცმელი & ფეხსაცმელი</option>
                <option value="kids">🧸 საბავშვო ნივთები</option>
                <option value="other">📦 სხვა ნივთები</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                მდგომარეობა *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="like_new">ახალივით (უნაკლო)</option>
                <option value="good">კარგი (მცირე ხმარების კვალით)</option>
                <option value="fair">საშუალო (მუშა მდგომარეობაში)</option>
                <option value="repair">შესაკეთებელი / ნაწილებად</option>
              </select>
            </div>
          </div>

          {/* If Exchange: What do you want in return? */}
          {dealType === 'exchange' && (
            <div className="space-y-1 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <label className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                სანაცვლოდ რაში გსურთ გაცვლა? *
              </label>
              <input
                type="text"
                value={wantInExchange}
                onChange={(e) => setWantInExchange(e.target.value)}
                placeholder="მაგ: გავცვლი iPad-ში, ველოსიპედში ან აკუსტიკურ გიტარაში..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              აღწერა *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="დაწერეთ დეტალები: კომპლექტაცია, მდგომარეობა, შეხვედრის ადგილი ფოთში..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              required
            />
          </div>

          {/* Poti District and Street */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                ფოთის უბანი *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {POTI_DISTRICTS.filter((d) => d !== 'ყველა უბანი').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                შეხვედრის ადგილი / ქუჩა ფოთში
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="მაგ: ცენტრალური პარკი / რუსთაველის რკალი"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              ტელეფონის ნომერი
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="599 00 00 00"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>განცხადების გამოქვეყნება (ფოთი)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
