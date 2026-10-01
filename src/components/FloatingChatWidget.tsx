import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Maximize2,
  Minimize2,
  Gift,
  HelpCircle,
  PhoneCall,
  MapPin,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { ProductItem, DEMXANH_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { AISettingsConfig } from '../../server';
import { generateClientConsultation } from '../utils/aiConsultant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedProducts?: ProductItem[];
}

interface FloatingChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenQuiz: () => void;
  onOpenShowroom: () => void;
  onOpenLeadModal: (product?: ProductItem) => void;
  settings: AISettingsConfig;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

const QUICK_PROMPTS = [
  'Đau lưng, thoái hoá nên nằm đệm gì?',
  'Đệm cưới 1m8x2m lò xo túi khách sạn',
  'Đệm bông ép Sông Hồng giá bao nhiêu?',
  'Đệm cao su Kim Cương Happy Gold',
  'Ngân sách 3-5 triệu nên mua đệm nào?',
];

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  isOpen,
  onToggle,
  onOpenQuiz,
  onOpenShowroom,
  onOpenLeadModal,
  settings,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: settings.welcomeMessage,
      timestamp: 'Vừa xong',
      recommendedProducts: [DEMXANH_PRODUCTS[0], DEMXANH_PRODUCTS[1]],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToAppropriatePosition = () => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg && lastMsg.role === 'assistant') {
      setTimeout(() => {
        const el = document.getElementById(`widget-msg-${lastMsg.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToAppropriatePosition();
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, loading]);

  // Handle external prompts (e.g. user clicked "Tư vấn mẫu này" on the website)
  useEffect(() => {
    if (externalPrompt) {
      if (!isOpen) onToggle();
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
      const smartResult = generateClientConsultation(text, DEMXANH_PRODUCTS);
      const fallbackMsg: ChatMessage = {
        id: `ai-fb-${Date.now()}`,
        role: 'assistant',
        content: smartResult.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: smartResult.recommendedProducts,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: settings.welcomeMessage,
        timestamp: 'Vừa xong',
        recommendedProducts: [DEMXANH_PRODUCTS[0], DEMXANH_PRODUCTS[1]],
      },
    ]);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;

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
          <div key={idx} className="flex items-start gap-1.5 my-0.5 ml-1">
            <span className="text-emerald-600 font-bold">•</span>
            <span>{parsedParts}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="leading-relaxed">
          {parsedParts}
        </p>
      );
    });
  };

  const isLeft = settings.bubblePosition === 'bottom-left';
  const primaryBg = settings.primaryColor || '#008848';

  return (
    <div
      className={`fixed bottom-5 z-50 flex flex-col ${
        isLeft ? 'left-5 items-start' : 'right-5 items-end'
      }`}
    >
      {/* 1. Floating Teaser Tooltip when bubble is closed */}
      {!isOpen && showTeaser && (
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-200/90 p-3 max-w-xs mb-3 animate-in fade-in slide-in-from-bottom-3 duration-300 relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-[10px] cursor-pointer"
          >
            ✕
          </button>
          <div className="flex items-start gap-2.5 cursor-pointer" onClick={onToggle}>
            {settings.botAvatarUrl ? (
              <img
                src={settings.botAvatarUrl}
                alt={settings.botName}
                className="w-8 h-8 rounded-full object-cover shrink-0 border"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs"
                style={{ backgroundColor: primaryBg }}
              >
                ĐX
              </div>
            )}
            <div className="text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <span>{settings.botName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">
                {settings.teaserMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Chat Window (Khung Chat Nổi Bật Ra) */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-emerald-300/80 flex flex-col overflow-hidden mb-3 animate-in fade-in zoom-in-95 duration-200 transition-all ${
            isExpanded
              ? 'w-[95vw] sm:w-[680px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[420px] h-[600px] max-h-[82vh]'
          }`}
        >
          {/* Header of Chat Window */}
          <div
            className="text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-sm"
            style={{ backgroundColor: primaryBg }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                {settings.botAvatarUrl ? (
                  <img
                    src={settings.botAvatarUrl}
                    alt={settings.botName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/40"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-black text-sm shadow-xs">
                    ĐX
                  </div>
                )}
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>{settings.botName}</span>
                  <span className="text-[10px] bg-black/20 text-white px-1.5 py-0.5 rounded font-medium">
                    Online 24/7
                  </span>
                </div>
                <div className="text-[11px] text-white/90 flex items-center gap-1">
                  <span>{settings.botSubtitle}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Làm mới cuộc trò chuyện"
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu nhỏ khung chat' : 'Phóng to khung chat'}
                className="hidden sm:block p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggle}
                title="Đóng khung chat (thu về bong bóng)"
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Tool Strip */}
          <div className="bg-emerald-50/80 border-b border-emerald-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-emerald-900 shrink-0">
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Test chọn đệm 30s</span>
            </button>
            <span className="text-emerald-300">•</span>
            <button
              onClick={onOpenShowroom}
              className="flex items-center gap-1 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>Showroom</span>
            </button>
            <span className="text-emerald-300">•</span>
            <button
              onClick={() => onOpenLeadModal()}
              className="flex items-center gap-1 text-amber-700 font-bold hover:underline cursor-pointer"
            >
              <Gift className="w-3 h-3 text-amber-600" />
              <span>Voucher 200k</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-slate-50/60">
            {messages.map((message) => {
              const isAI = message.role === 'assistant';

              return (
                <div
                  key={message.id}
                  id={`widget-msg-${message.id}`}
                  className={`flex gap-2.5 scroll-mt-4 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs overflow-hidden ${
                      isAI ? 'text-white' : 'bg-slate-800 text-white'
                    }`}
                    style={isAI ? { backgroundColor: primaryBg } : undefined}
                  >
                    {isAI ? (
                      settings.botAvatarUrl ? (
                        <img
                          src={settings.botAvatarUrl}
                          alt="Bot"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[88%]`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                      <span>{isAI ? settings.botName : 'Tôi'}</span>
                      <span>{message.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isAI
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                          : 'text-white rounded-tr-xs'
                      }`}
                      style={!isAI ? { backgroundColor: primaryBg } : undefined}
                    >
                      {isAI ? renderFormattedText(message.content) : message.content}
                    </div>

                    {/* Inline product recommendations */}
                    {isAI &&
                      settings.showProductCards &&
                      message.recommendedProducts &&
                      message.recommendedProducts.length > 0 && (
                        <div className="mt-2.5 w-full space-y-2">
                          <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 px-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Gợi ý tốt nhất cho Anh/Chị:</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {message.recommendedProducts.map((p, idx) => (
                              <ProductCard
                                key={`${p.id}-${idx}`}
                                product={p}
                                compact={true}
                                onAskAbout={(item) =>
                                  handleSendMessage(
                                    `Em tư vấn kỹ hơn về mẫu ${item.name}, ưu đãi và bảng giá kích thước 1m8x2m giúp Anh/Chị nhé!`
                                  )
                                }
                                onSelectProduct={() => onOpenLeadModal(p)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2 items-start">
                <div
                  className="w-7 h-7 rounded-xl text-white flex items-center justify-center shrink-0"
                  style={{ backgroundColor: primaryBg }}
                >
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-1.5 text-xs text-slate-500">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: primaryBg }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]"
                    style={{ backgroundColor: primaryBg }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]"
                    style={{ backgroundColor: primaryBg }}
                  />
                  <span className="text-[11px] ml-1">{settings.botName} đang trả lời...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="bg-slate-100 border-t border-slate-200/80 px-3 py-1.5 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 shrink-0 flex items-center gap-0.5">
              <HelpCircle className="w-3 h-3 text-emerald-600" /> Gợi ý:
            </span>
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhắn tin với Đệm Xanh (VD: Đệm đau lưng 1m8...)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="p-2.5 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                style={{ backgroundColor: primaryBg }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                100% Chính hãng • Nằm thử 30 ngày
              </span>
              <a
                href={`tel:${settings.hotline}`}
                className="font-semibold hover:underline"
                style={{ color: primaryBg }}
              >
                Hotline {settings.hotline}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Small Bubble */}
      <button
        onClick={onToggle}
        className={`group relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer border-2 border-white ${
          isOpen
            ? 'w-13 h-13 bg-slate-800 hover:bg-slate-900 text-white'
            : 'px-4 py-3 text-white gap-2.5 shadow-lg'
        }`}
        style={!isOpen ? { backgroundColor: primaryBg } : undefined}
        aria-label="Tư vấn Đệm Xanh AI"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            {settings.botAvatarUrl ? (
              <img
                src={settings.botAvatarUrl}
                alt={settings.botName}
                className="w-7 h-7 rounded-full object-cover border border-white/60"
              />
            ) : (
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 border-2 border-emerald-800 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 border-2 border-emerald-800" />
              </div>
            )}
            <div className="text-left font-bold leading-tight">
              <div className="text-xs tracking-tight flex items-center gap-1">
                <span>{settings.botName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              </div>
              <div className="text-[10px] text-white/80 font-normal">
                {settings.botSubtitle}
              </div>
            </div>
          </>
        )}
      </button>
    </div>
  );
};
