import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  PhoneCall,
  RotateCcw,
  Gift,
  HelpCircle,
  ThumbsUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ProductItem, DEMXANH_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedProducts?: ProductItem[];
}

interface ChatWindowProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenLeadModal: (product?: ProductItem) => void;
  onOpenShowroom: () => void;
  onOpenQuiz: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `Dạ em chào Anh/Chị! Em là **Trợ lý AI Tư vấn Bán hàng Chuyên sâu của Hệ thống Siêu thị Đệm Xanh (demxanh.com)** 🌿.\n\nĐệm Xanh chúng em chuyên phân phối chính hãng 100% các dòng:\n- **Đệm bông ép** (Sông Hồng, Hanvico, Olympia) - Giữ thẳng cột sống, giá từ 1.8M\n- **Đệm cao su thiên nhiên** (Kim Cương, Liên Á, Vạn Thành) - Êm ái, siêu bền 15-20 năm\n- **Đệm lò xo túi độc lập** (Dunlopillo Anh Quốc, Kim Cương) - Chuẩn khách sạn 5 sao, không rung lắc\n- **Đệm Foam Nhật Bản Inoac** & Topper làm mềm đệm\n\nAnh/Chị đang tìm đệm cho ai nằm và muốn ưu tiên đệm nằm phẳng hay êm ái để em tư vấn mẫu chuẩn nhất ạ?`,
    timestamp: 'Vừa xong',
    recommendedProducts: [
      DEMXANH_PRODUCTS[0], // Sông Hồng
      DEMXANH_PRODUCTS[1], // Kim Cương
      DEMXANH_PRODUCTS[2], // Dunlopillo
    ],
  },
];

const SUGGESTED_QUESTIONS = [
  'Đau lưng, thoát vị đĩa đệm nên nằm đệm gì?',
  'Tư vấn đệm cưới 1m8x2m lò xo túi êm ái',
  'Đệm bông ép Sông Hồng thế hệ 3 giá bao nhiêu?',
  'Đệm cao su thiên nhiên Kim Cương Happy Gold',
  'Tìm đệm kích thước 1m6 ngân sách dưới 5 triệu',
  'Chính sách bảo hành và giao hàng Đệm Xanh',
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onSelectProduct,
  onOpenLeadModal,
  onOpenShowroom,
  onOpenQuiz,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToAppropriatePosition = () => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];

    // If the latest message is from AI, scroll so the TOP of the answer is visible
    if (lastMsg && lastMsg.role === 'assistant') {
      setTimeout(() => {
        const el = document.getElementById(`chat-msg-${lastMsg.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    // Otherwise, scroll to show the user's question or typing indicator
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToAppropriatePosition();
  }, [messages, loading]);

  // Load synced products from demxanh.com and update welcome recommendations
  useEffect(() => {
    const updateWelcomeCards = (products: ProductItem[]) => {
      if (products && products.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === 'welcome-1'
              ? { ...msg, recommendedProducts: products.slice(0, 3) }
              : msg
          )
        );
      }
    };

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          updateWelcomeCards(data.products);
        }
      })
      .catch((err) => console.warn('Could not load products for chat:', err));

    const handleSynced = (e: any) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        updateWelcomeCards(e.detail);
      } else {
        fetch('/api/products')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.products)) {
              updateWelcomeCards(data.products);
            }
          });
      }
    };

    window.addEventListener('demxanh-products-synced', handleSynced);
    return () => window.removeEventListener('demxanh-products-synced', handleSynced);
  }, []);

  // Handle external prompts (e.g. from Quiz or Product Card)
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          recommendedProducts: data.recommendedProducts || [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Lỗi server');
      }
    } catch {
      // Fallback assistant response
      const fallbackMsg: ChatMessage = {
        id: `ai-fb-${Date.now()}`,
        role: 'assistant',
        content: `Dạ Đệm Xanh xin ghi nhận câu hỏi của Anh/Chị! Để được tư vấn chi tiết nhất theo đúng kích thước giường và tình trạng sức khỏe, Anh/Chị có thể gọi ngay tổng đài miễn cước **1800 1051** hoặc Zalo **0962 701 701**. Chuyên viên Đệm Xanh đang trực 24/7 để hỗ trợ Anh/Chị nhận thêm voucher giảm 200k ạ!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: [DEMXANH_PRODUCTS[0], DEMXANH_PRODUCTS[1]],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Render markdown-like simple formatting (bold, newlines, bullet points)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bullet point
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      // Bold parsing
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-emerald-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 ml-1">
            <span className="text-emerald-600 font-bold">•</span>
            <span>{parsedParts}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed">
          {parsedParts}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Consultation Control Header */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4 text-emerald-100" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Chuyên Viên Bán Hàng Đệm Xanh AI</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 rounded">
                Trực tuyến 24/7
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Hotline 1800 1051 (Miễn phí) • Zalo: 0962 701 701
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Test chọn đệm</span>
          </button>

          <button
            onClick={handleResetChat}
            title="Bắt đầu phiên tư vấn mới"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((message) => {
          const isAI = message.role === 'assistant';

          return (
            <div
              key={message.id}
              id={`chat-msg-${message.id}`}
              className={`flex gap-3 max-w-4xl mx-auto scroll-mt-6 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs ${
                  isAI
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[88%]`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {isAI ? 'Đệm Xanh Consultant' : 'Quý khách'}
                  </span>
                  <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm shadow-xs ${
                    isAI
                      ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                      : 'bg-emerald-600 text-white rounded-tr-xs'
                  }`}
                >
                  {isAI ? renderFormattedText(message.content) : message.content}
                </div>

                {/* Inline Recommended Product Cards */}
                {isAI && message.recommendedProducts && message.recommendedProducts.length > 0 && (
                  <div className="mt-3 w-full space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 px-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Sản phẩm Đệm Xanh khuyên dùng cho Anh/Chị:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {message.recommendedProducts.map((prod, pIdx) => (
                        <ProductCard
                          key={`${prod.id}-${pIdx}`}
                          product={prod}
                          onAskAbout={(p) =>
                            handleSendMessage(
                              `Anh/Chị muốn tư vấn kỹ hơn về mẫu ${p.name} (giá từ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.salePrice)}). Mẫu này có ưu đãi gì và kích thước 1m8x2m giá thế nào em?`
                            )
                          }
                          onSelectProduct={() => onOpenLeadModal(prod)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-4xl mx-auto items-start">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 ml-1 font-medium">
                Đệm Xanh AI đang tìm mẫu đệm tốt nhất cho Anh/Chị...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-slate-100/70 border-t border-slate-200/80 px-4 py-2 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-emerald-600" />
            Gợi ý nhanh:
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-3 py-1.5 rounded-full shrink-0 transition-all cursor-pointer shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Nhập câu hỏi (Ví dụ: Đệm cho người đau lưng 1m8x2m tầm 5 triệu...)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-emerald-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>

        {/* Quick Footer Links */}
        <div className="max-w-4xl mx-auto mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <PhoneCall className="w-3 h-3" />
              Tổng đài 1800 1051 (Miễn cước)
            </span>
            <span>•</span>
            <button
              onClick={onOpenShowroom}
              className="text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              <MapPin className="w-3 h-3 text-rose-500" />
              Nằm thử tại showroom
            </button>
          </div>

          <button
            onClick={() => onOpenLeadModal()}
            className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Gift className="w-3 h-3 text-amber-500" />
            Nhận Voucher giảm thêm 200.000đ ngay
          </button>
        </div>
      </div>
    </div>
  );
};
