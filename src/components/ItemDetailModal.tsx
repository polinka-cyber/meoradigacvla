import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageSquare,
  Gift,
  Repeat,
  MapPin,
  Clock,
  Eye,
  Phone,
  ShieldCheck,
  Send,
  Trash2,
  CheckCircle,
  Share2,
  Check,
  CornerDownRight,
  Package,
} from 'lucide-react';
import { ListingItem, ItemStatus } from '../types';
import { useApp } from '../context/AppContext';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedItem,
    setSelectedItem,
    currentUser,
    toggleFavorite,
    isFavorite,
    openChatForItem,
    getItemComments,
    addComment,
    updateItemStatus,
    deleteItem,
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!selectedItem) return null;

  const comments = getItemComments(selectedItem.id);
  const favorited = isFavorite(selectedItem.id);
  const isOwner = selectedItem.userId === currentUser.id;

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'like_new':
        return 'ახალივით (უნაკლო მდგომარეობაში)';
      case 'good':
        return 'კარგი (მცირე ხმარების კვალით)';
      case 'fair':
        return 'საშუალო (მუშა მდგომარეობაში)';
      case 'repair':
        return 'შესაკეთებელი / ნაწილებად';
      default:
        return condition;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tech':
        return 'ტექნიკა & გაჯეტები';
      case 'gaming':
        return 'გეიმინგი & კონსოლები';
      case 'books':
        return 'წიგნები & საკანცელარიო';
      case 'sports':
        return 'სპორტი & ველო';
      case 'furniture':
        return 'ავეჯი & სახლი';
      case 'clothes':
        return 'ტანსაცმელი & ფეხსაცმელი';
      case 'kids':
        return 'საბავშვო ნივთები';
      default:
        return 'სხვა';
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedItem.id, commentText);
    setCommentText('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    addComment(selectedItem.id, replyText, parentId);
    setReplyText('');
    setReplyToId(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            {selectedItem.dealType === 'gift' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Gift className="w-3.5 h-3.5" />
                ვაჩუქებ უფასოდ
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Repeat className="w-3.5 h-3.5" />
                გავცვლი / ბარტერი
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {getCategoryLabel(selectedItem.category)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="გაზიარება"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => toggleFavorite(selectedItem.id)}
              title="შენახვა"
              className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                favorited ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Photos & Gallery */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                {selectedItem.photos[activePhotoIndex] ? (
                  <img
                    src={selectedItem.photos[activePhotoIndex]}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Package className="w-12 h-12 stroke-1" />
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple photos */}
              {selectedItem.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedItem.photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activePhotoIndex === idx
                          ? 'border-emerald-500 scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Owner actions if current user is owner */}
              {isOwner && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                      ეს თქვენი განცხადებაა
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('ნამდვილად გსურთ განცხადების წაშლა?')) {
                          deleteItem(selectedItem.id);
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      განცხადების წაშლა
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-800 dark:text-amber-300">სტატუსის შეცვლა:</span>
                    <select
                      value={selectedItem.status}
                      onChange={(e) => updateItemStatus(selectedItem.id, e.target.value as ItemStatus)}
                      className="text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      <option value="active">აქტიური</option>
                      <option value="reserved">დაჯავშნილი</option>
                      <option value="completed">გაჩუქებული / გაცვლილი</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Item Details & Primary Action */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedItem.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                      ფოთი{selectedItem.district ? `, ${selectedItem.district}` : ''}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedItem.createdAt}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {selectedItem.views} ნახვა
                    </span>
                  </div>
                </div>

                {/* What owner wants in exchange (High-impact callout) */}
                {selectedItem.dealType === 'exchange' && selectedItem.wantInExchange && (
                  <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
                    <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
                      სანაცვლოდ რას ითხოვს:
                    </div>
                    <p className="text-sm font-medium text-indigo-950 dark:text-indigo-100">
                      {selectedItem.wantInExchange}
                    </p>
                  </div>
                )}

                {/* Condition Spec */}
                <div className="text-xs space-y-1">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">მდგომარეობა:</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {getConditionLabel(selectedItem.condition)}
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs space-y-1">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">აღწერა:</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Owner Information Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedItem.user.avatar}
                      alt={selectedItem.user.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedItem.user.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedItem.user.city} · ★ {selectedItem.user.rating.toFixed(1)} ({selectedItem.user.tradesCompleted} გარიგება)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Message Owner & Phone */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                {!isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        openChatForItem(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>მიწერე მფლობელს ჩატში</span>
                    </button>

                    <button
                      onClick={() => setShowPhone(!showPhone)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{showPhone ? (selectedItem.phone || selectedItem.user.phone || '599 00 00 00') : 'ტელეფონის ნომრის ჩვენება'}</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
                    ეს თქვენი ნივთია. მყიდველები მოგწერთ ჩატში ან კომენტარებში.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Public Discussion & Comments Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                საჯარო კომენტარები & შეკითხვები ({comments.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ყველა მომხმარებელს შეუძლია კითხვის დასმა
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="დაუსვი შეკითხვა მფლობელს (მაგ: როდის შევხვდეთ, მუშაობს თუ არა...)"
                className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>გაგზავნა</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  ჯერ არ არის კომენტარები. იყავი პირველი ვინც კითხვას დასვამს!
                </div>
              ) : (
                comments
                  .filter((c) => !c.replyToId)
                  .map((comment) => {
                    const replies = comments.filter((c) => c.replyToId === comment.id);
                    return (
                      <div
                        key={comment.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={comment.userAvatar}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {comment.userName}
                            </span>
                            {comment.isAuthor && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                                მფლობელი
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pl-8">
                          {comment.content}
                        </p>

                        <div className="pl-8 pt-1 flex items-center gap-3">
                          <button
                            onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                            className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                          >
                            {replyToId === comment.id ? 'გაუქმება' : 'პასუხის გაცემა'}
                          </button>
                        </div>

                        {/* Inline Reply Input */}
                        {replyToId === comment.id && (
                          <div className="pl-8 pt-2 flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`უპასუხე ${comment.userName}-ს...`}
                              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyText.trim()}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium disabled:opacity-40 cursor-pointer"
                            >
                              პასუხი
                            </button>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {replies.length > 0 && (
                          <div className="pl-8 pt-2 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 ml-4">
                            {replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="bg-white/70 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-750"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <CornerDownRight className="w-3 h-3 text-slate-400" />
                                    <img
                                      src={reply.userAvatar}
                                      alt=""
                                      referrerPolicy="no-referrer"
                                      className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                      {reply.userName}
                                    </span>
                                    {reply.isAuthor && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                                        მფლობელი
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-200 pl-4 mt-1">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
