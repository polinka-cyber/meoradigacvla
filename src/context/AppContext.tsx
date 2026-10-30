import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ListingItem,
  Comment,
  Conversation,
  ChatMessage,
  Category,
  DealType,
  ItemCondition,
  ItemStatus,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_ITEMS,
  INITIAL_COMMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
} from '../data/mockData';

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth / Current User
  currentUser: User;
  switchUser: (userId: string) => void;
  registerUser: (userData: Partial<User>) => void;
  updateCurrentUser: (userData: Partial<User>) => void;
  allUsers: User[];

  // Items
  items: ListingItem[];
  addItem: (item: Omit<ListingItem, 'id' | 'createdAt' | 'views' | 'commentsCount' | 'user' | 'userId'>) => ListingItem;
  updateItemStatus: (itemId: string, status: ItemStatus) => void;
  deleteItem: (itemId: string) => void;
  selectedItem: ListingItem | null;
  setSelectedItem: (item: ListingItem | null) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  // Comments
  comments: Comment[];
  getItemComments: (itemId: string) => Comment[];
  addComment: (itemId: string, content: string, replyToId?: string) => void;

  // Chat & Messaging
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversation: Conversation | null;
  openChatForItem: (item: ListingItem) => void;
  openConversation: (conv: Conversation) => void;
  closeChat: () => void;
  sendMessage: (text: string, photoUrl?: string, tradeProposal?: ChatMessage['tradeProposal']) => void;
  respondToTradeProposal: (messageId: string, status: 'accepted' | 'declined') => void;
  unreadCountTotal: number;

  // Filters & Navigation
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  selectedDealType: DealType | 'all';
  setSelectedDealType: (type: DealType | 'all') => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedCondition: ItemCondition | 'all';
  setSelectedCondition: (cond: ItemCondition | 'all') => void;
  activeTab: 'explore' | 'gifts' | 'exchanges' | 'my_items' | 'saved';
  setActiveTab: (tab: 'explore' | 'gifts' | 'exchanges' | 'my_items' | 'saved') => void;

  // Modals state
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'register' | 'login';
  openAuthModal: (mode?: 'register' | 'login') => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('barteri_poti_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('barteri_poti_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Users & Auth
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('barteri_poti_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('barteri_poti_user_id');
    const found = allUsers.find((u) => u.id === savedId);
    return found || allUsers[0];
  });

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('barteri_poti_user_id', user.id);
    }
  };

  const registerUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'ფოთელი მომხმარებელი',
      email: userData.email || `user_${Date.now()}@poti.ge`,
      phone: userData.phone || '599 00 00 00',
      city: 'ფოთი',
      district: userData.district || 'ცენტრი (რუსთაველის რკალი)',
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: userData.bio || 'ფოთის ბარტერის საზოგადოების წევრი',
      joinedDate: 'ახლახან',
      rating: 5.0,
      tradesCompleted: 0,
    };
    const updated = [newUser, ...allUsers];
    setAllUsers(updated);
    setCurrentUser(newUser);
    localStorage.setItem('barteri_poti_users', JSON.stringify(updated));
    localStorage.setItem('barteri_poti_user_id', newUser.id);
  };

  const updateCurrentUser = (userData: Partial<User>) => {
    const updated = allUsers.map((u) => (u.id === currentUser.id ? { ...u, ...userData } : u));
    setAllUsers(updated);
    const updatedCurrent = { ...currentUser, ...userData };
    setCurrentUser(updatedCurrent);
    localStorage.setItem('barteri_poti_users', JSON.stringify(updated));
  };

  // Items
  const [items, setItems] = useState<ListingItem[]>(() => {
    const saved = localStorage.getItem('barteri_poti_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('barteri_poti_items', JSON.stringify(items));
  }, [items]);

  const addItem = (
    itemData: Omit<ListingItem, 'id' | 'createdAt' | 'views' | 'commentsCount' | 'user' | 'userId'>
  ): ListingItem => {
    const newItem: ListingItem = {
      ...itemData,
      city: 'ფოთი',
      id: `item_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      createdAt: 'ახლახან',
      views: 1,
      commentsCount: 0,
      status: 'active',
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateItemStatus = (itemId: string, status: ItemStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('barteri_poti_favorites');
    return saved ? JSON.parse(saved) : ['item_1', 'item_2'];
  });

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      localStorage.setItem('barteri_poti_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Comments
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('barteri_poti_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  useEffect(() => {
    localStorage.setItem('barteri_poti_comments', JSON.stringify(comments));
  }, [comments]);

  const getItemComments = (itemId: string) => {
    return comments.filter((c) => c.itemId === itemId);
  };

  const addComment = (itemId: string, content: string, replyToId?: string) => {
    if (!content.trim()) return;
    const item = items.find((i) => i.id === itemId);
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      itemId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: content.trim(),
      createdAt: 'ახლახან',
      replyToId,
      isAuthor: item?.userId === currentUser.id,
    };
    setComments((prev) => [...prev, newComment]);
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, commentsCount: (i.commentsCount || 0) + 1 } : i))
    );
  };

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('barteri_poti_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('barteri_poti_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    localStorage.setItem('barteri_poti_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('barteri_poti_messages', JSON.stringify(messages));
  }, [messages]);

  const openConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setIsChatModalOpen(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const openChatForItem = (item: ListingItem) => {
    if (item.userId === currentUser.id) {
      const existing = conversations.find(
        (c) => c.itemId === item.id && c.participantIds.includes(currentUser.id)
      );
      if (existing) {
        openConversation(existing);
      } else {
        setIsChatModalOpen(true);
      }
      return;
    }

    const existing = conversations.find(
      (c) =>
        c.itemId === item.id &&
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(item.userId)
    );

    if (existing) {
      openConversation(existing);
      return;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemPhoto: item.photos[0] || '',
      itemDealType: item.dealType,
      participantIds: [currentUser.id, item.userId],
      participants: {
        [currentUser.id]: currentUser,
        [item.userId]: item.user,
      },
      lastMessage: 'საუბარი დაიწყო',
      lastMessageTimestamp: 'ახლახან',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newConv.id]: [
        {
          id: `msg_init_${Date.now()}`,
          conversationId: newConv.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `გამარჯობა! დავინტერესდი თქვენი ნივთით: "${item.title}". ფოთში სად შევხვდეთ?`,
          timestamp: 'ახლახან',
        },
      ],
    }));
    setActiveConversation(newConv);
    setIsChatModalOpen(true);
  };

  const closeChat = () => {
    setIsChatModalOpen(false);
  };

  const sendMessage = (
    text: string,
    photoUrl?: string,
    tradeProposal?: ChatMessage['tradeProposal']
  ) => {
    if (!activeConversation) return;
    if (!text.trim() && !photoUrl && !tradeProposal) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
      photoUrl,
      tradeProposal,
    };

    const convId = activeConversation.id;
    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    const preview = tradeProposal
      ? `შეთავაზება: ${tradeProposal.offeredItemTitle}`
      : text.trim() || 'ფოტო';

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: preview,
              lastMessageTimestamp: 'ახლახან',
            }
          : c
      )
    );
  };

  const respondToTradeProposal = (messageId: string, status: 'accepted' | 'declined') => {
    if (!activeConversation) return;
    const convId = activeConversation.id;
    setMessages((prev) => {
      const convMsgs = prev[convId] || [];
      const updated = convMsgs.map((m) => {
        if (m.id === messageId && m.tradeProposal) {
          return {
            ...m,
            tradeProposal: {
              ...m.tradeProposal,
              status,
            },
          };
        }
        return m;
      });
      return { ...prev, [convId]: updated };
    });

    const responseText =
      status === 'accepted'
        ? 'შეთავაზება მიღებულია! შევხვდეთ ფოთში და გავცვალოთ.'
        : 'მადლობა შემოთავაზებისთვის, თუმცა ამ ეტაპზე ვერ დაგთანხმდებით.';

    sendMessage(responseText);
  };

  const unreadCountTotal = conversations
    .filter((c) => c.participantIds.includes(currentUser.id))
    .reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Filters: District within Poti
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedDealType, setSelectedDealType] = useState<DealType | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'gifts' | 'exchanges' | 'my_items' | 'saved'>('explore');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const openAuthModal = (mode: 'register' | 'login' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        switchUser,
        registerUser,
        updateCurrentUser,
        allUsers,
        items,
        addItem,
        updateItemStatus,
        deleteItem,
        selectedItem,
        setSelectedItem,
        favorites,
        toggleFavorite,
        isFavorite,
        comments,
        getItemComments,
        addComment,
        conversations,
        messages,
        activeConversation,
        openChatForItem,
        openConversation,
        closeChat,
        sendMessage,
        respondToTradeProposal,
        unreadCountTotal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDealType,
        setSelectedDealType,
        selectedDistrict,
        setSelectedDistrict,
        selectedCondition,
        setSelectedCondition,
        activeTab,
        setActiveTab,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isChatModalOpen,
        setIsChatModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
