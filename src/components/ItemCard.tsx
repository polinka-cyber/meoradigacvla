import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  MessageSquare,
  Gift,
  Repeat,
  MapPin,
  Clock,
  Eye,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { ListingItem } from '../types';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: ListingItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { setSelectedItem, toggleFavorite, isFavorite, openChatForItem } = useApp();
  const [imgError, setImgError] = useState(false);
  const favorited = isFavorite(item.id);

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'like_new':
        return 'ახალივით';
      case 'good':
        return 'კარგი';
      case 'fair':
        return 'საშუალო';
      case 'repair':
        return 'შესაკეთებელი';
      default:
        return condition;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tech':
        return 'ტექნიკა';
      case 'gaming':
        return 'გეიმინგი';
      case 'books':
        return 'წიგნები';
      case 'sports':
        return 'სპორტი';
      case 'furniture':
        return 'ავეჯი';
      case 'clothes':
        return 'ტანსაცმელი';
      case 'kids':
        return 'საბავშვო';
      default:
        return 'სხვა';
    }
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
        {!imgError && item.photos[0] ? (
          <img
            src={item.photos[0]}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          />
        ) : (
          /* Resilient Fallback Container */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Package className="w-10 h-10 mb-1 stroke-1" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
              {item.title}
            </span>
          </div>
        )}

        {/* Scrim Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Deal Type Marker (Top Left) */}
        <div className="absolute top-2.5 left-2.5">
          {item.dealType === 'gift' ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/95 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
              <Gift className="w-3.5 h-3.5" />
              <span>უფასოდ / ვაჩუქებ</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/95 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
              <Repeat className="w-3.5 h-3.5" />
              <span>ბარტერი / გაცვლა</span>
            </div>
          )}
        </div>

        {/* Status Overlay if Reserved or Completed */}
        {item.status !== 'active' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-3">
            <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold tracking-wide uppercase">
              {item.status === 'reserved' ? 'დაჯავშნილია' : 'გაჩუქებული / გაცვლილი'}
            </span>
          </div>
        )}

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          aria-label={favorited ? 'შენახულიდან ამოშლა' : 'შენახვა'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-xs ${
            favorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata Row: Category · Condition · Poti District */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{getCategoryLabel(item.category)}</span>
            <span aria-hidden="true">·</span>
            <span>{getConditionLabel(item.condition)}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate text-emerald-700 dark:text-emerald-400 font-medium">
              {item.district || 'ფოთი'}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedItem(item)}
            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {item.title}
          </h3>

          {/* If Exchange: "სანაცვლოდ სურს:" */}
          {item.dealType === 'exchange' && item.wantInExchange && (
            <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                სანაცვლოდ სურს:
              </span>{' '}
              <span className="text-slate-700 dark:text-slate-200 line-clamp-1">
                {item.wantInExchange}
              </span>
            </div>
          )}

          {/* If Gift: Brief description excerpt */}
          {item.dealType === 'gift' && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Card Footer: Author & Interactive Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {/* Author avatar & name */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.user.avatar}
              alt={item.user.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[100px]">
              {item.user.name}
            </span>
          </div>

          {/* Actions: Comments count + Message Owner */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedItem(item)}
              title="კომენტარები და დეტალები"
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">{item.commentsCount || 0}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openChatForItem(item);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-medium transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>მიწერა</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
