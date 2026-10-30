import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Repeat,
  Gift,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Conversation, ChatMessage } from '../types';

export const ChatModal: React.FC = () => {
  const {
    isChatModalOpen,
    closeChat,
    currentUser,
    conversations,
    messages,
    activeConversation,
    openConversation,
    sendMessage,
    respondToTradeProposal,
    items,
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalPhoto, setProposalPhoto] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter conversations for the current user
  const userConversations = conversations.filter((c) =>
    c.participantIds.includes(currentUser.id)
  );

  const activeMessages = activeConversation ? messages[activeConversation.id] || [] : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversation?.id]);

  if (!isChatModalOpen) return null;

  const getOtherParticipant = (conv: Conversation) => {
    const otherId = conv.participantIds.find((id) => id !== currentUser.id);
    if (!otherId) return currentUser;
    return conv.participants[otherId] || currentUser;
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(messageText.trim());
    setMessageText('');
  };

  const handleSendQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim()) return;

    sendMessage('შემოგთავაზეთ ბარტერის ვარიანტი:', undefined, {
      offeredItemTitle: proposalTitle.trim(),
      offeredItemPhoto: proposalPhoto.trim() || undefined,
      status: 'pending',
    });

    setProposalTitle('');
    setProposalPhoto('');
    setShowProposalModal(false);
  };

  const handleAttachPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        sendMessage('', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[85vh] max-h-[700px] flex flex-col">
        {/* Modal Main Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              შეტყობინებები და მოლაპარაკება
            </span>
            <span className="text-xs text-slate-400">({userConversations.length})</span>
          </div>
          <button
            onClick={closeChat}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Pane Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List (Sidebar) */}
          <div
            className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-950/40 ${
              activeConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              დიალოგები
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {userConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  ჯერ არ გაქვთ აქტიური ჩათი. გახსენით სასურველი განცხადება და დააჭირეთ „მიწერას“.
                </div>
              ) : (
                userConversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv);
                  const isSelected = activeConversation?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => openConversation(conv)}
                      className={`w-full p-3 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800/90 shadow-xs'
                          : 'hover:bg-white/60 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <img
                        src={otherUser.avatar}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {otherUser.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {conv.lastMessageTimestamp}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                          {conv.itemTitle}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Conversation Thread */}
          <div
            className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${
              !activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-850/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => openConversation({} as any)}
                      className="md:hidden p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <img
                      src={getOtherParticipant(activeConversation).avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {getOtherParticipant(activeConversation).name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                        <span className="truncate">{activeConversation.itemTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {activeConversation.itemDealType === 'gift' ? 'ვაჩუქებ' : 'ბარტერი'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Make Trade Offer Button */}
                  <button
                    onClick={() => setShowProposalModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ბარტერის შეთავაზება</span>
                    <span className="sm:hidden">შეთავაზება</span>
                  </button>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Item Context Pill in Chat */}
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                    {activeConversation.itemPhoto ? (
                      <img
                        src={activeConversation.itemPhoto}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {activeConversation.itemTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        მოლაპარაკება მიმდინარეობს ამ ნივთზე
                      </p>
                    </div>
                  </div>

                  {activeMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                          }`}
                        >
                          {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                          {/* Image Attachment in message */}
                          {msg.photoUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
                              <img
                                src={msg.photoUrl}
                                alt="ფოტო ჩატში"
                                referrerPolicy="no-referrer"
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}

                          {/* Trade Proposal Card */}
                          {msg.tradeProposal && (
                            <div
                              className={`mt-2 p-3 rounded-xl border text-xs ${
                                isMe
                                  ? 'bg-emerald-700/60 border-emerald-500 text-white'
                                  : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <div className="font-bold flex items-center gap-1.5 mb-1 text-indigo-200 dark:text-indigo-400">
                                <Repeat className="w-3.5 h-3.5" />
                                <span>ბარტერის შეთავაზება:</span>
                              </div>
                              <p className="font-semibold">{msg.tradeProposal.offeredItemTitle}</p>

                              {msg.tradeProposal.offeredItemPhoto && (
                                <img
                                  src={msg.tradeProposal.offeredItemPhoto}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="mt-2 w-full max-h-36 object-cover rounded-lg"
                                />
                              )}

                              {/* Status or Accept/Decline action */}
                              <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center justify-between">
                                {msg.tradeProposal.status === 'pending' ? (
                                  !isMe ? (
                                    <div className="flex items-center gap-2 w-full">
                                      <button
                                        onClick={() =>
                                          respondToTradeProposal(msg.id, 'accepted')
                                        }
                                        className="flex-1 py-1 px-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[11px] cursor-pointer"
                                      >
                                        ✓ მიღება
                                      </button>
                                      <button
                                        onClick={() =>
                                          respondToTradeProposal(msg.id, 'declined')
                                        }
                                        className="flex-1 py-1 px-2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] cursor-pointer"
                                      >
                                        ✕ უარყოფა
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-emerald-200 font-medium">
                                      მოლოდინშია...
                                    </span>
                                  )
                                ) : msg.tradeProposal.status === 'accepted' ? (
                                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    შეთავაზება მიღებულია!
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium text-rose-300 flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" />
                                    უარყოფილია
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 px-1 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Negotiation Replies */}
                <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">
                    სწრაფი პასუხი:
                  </span>
                  <button
                    onClick={() => handleSendQuickReply('გამარჯობა, ისევ აქტუალურია ნივთი?')}
                    className="px-2.5 py-1 rounded-md text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap cursor-pointer"
                  >
                    აქტუალურია?
                  </button>
                  <button
                    onClick={() => handleSendQuickReply('სად და როდის შევძლოთ შეხვედრა?')}
                    className="px-2.5 py-1 rounded-md text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap cursor-pointer"
                  >
                    სად შევხვდეთ?
                  </button>
                  <button
                    onClick={() => handleSendQuickReply('დღესვე შემიძლია წამოღება, თუ გაწყობთ.')}
                    className="px-2.5 py-1 rounded-md text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap cursor-pointer"
                  >
                    დღესვე წავიღებ
                  </button>
                </div>

                {/* Message Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAttachPhoto}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="ფოტოს მიმაგრება"
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="დაწერეთ შეტყობინება..."
                    className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center p-8 text-slate-400 dark:text-slate-500">
                <p className="text-sm">აირჩიეთ დიალოგი მარცხენა სიიდან</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Make Trade Proposal Modal */}
        {showProposalModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ბარტერის შეთავაზება
                </h3>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendProposal} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    რას სთავაზობთ სანაცვლოდ? *
                  </label>
                  <input
                    type="text"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    placeholder="მაგ: AirPods Pro 2, Kindle Paperwhite ან ველოსიპედი"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    შემოთავაზებული ნივთის ფოტოს ლინკი (არასავალდებულო)
                  </label>
                  <input
                    type="url"
                    value={proposalPhoto}
                    onChange={(e) => setProposalPhoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400"
                  >
                    გაუქმება
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    შეთავაზების გაგზავნა
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
