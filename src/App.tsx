import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ProductCatalogSidebar } from './components/ProductCatalogSidebar';
import { MattressQuizModal } from './components/MattressQuizModal';
import { ShowroomModal } from './components/ShowroomModal';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { EmbedCodeModal } from './components/EmbedCodeModal';
import { AISettingsModal } from './components/AISettingsModal';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { DemXanhWebsiteView } from './components/DemXanhWebsiteView';
import { ProductItem } from './data/products';
import { AISettingsConfig } from '../server';
import {
  MessageSquare,
  LayoutGrid,
  Bot,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Gift,
  Code,
  ShieldCheck,
  Send,
  HelpCircle,
  Settings,
  Lock,
} from 'lucide-react';

const DEFAULT_SETTINGS: AISettingsConfig = {
  botName: 'Chuyên Viên Đệm Xanh AI',
  botSubtitle: 'demxanh.com • Tư vấn 24/7',
  botAvatarUrl: '',
  primaryColor: '#008848',
  welcomeMessage: `Dạ em chào Anh/Chị! Em là **Trợ lý AI Tư vấn Bán hàng của Đệm Xanh (demxanh.com)** 🌿.\n\nĐệm Xanh đang có chương trình **Giảm giá tới 35% + Tặng Voucher 200k & Bộ quà ga gối**:\n- **Đệm bông ép** (Sông Hồng, Hanvico) - Nâng đỡ thẳng cột sống, giá từ 1.8M\n- **Đệm cao su thiên nhiên** (Kim Cương, Liên Á) - Êm ái, siêu bền 15-20 năm\n- **Đệm lò xo túi độc lập** (Dunlopillo Anh Quốc) - Chuẩn khách sạn 5 sao, không rung lắc khi trở mình\n- **Topper lông vũ & Đệm Foam Nhật**\n\nAnh/Chị đang tìm đệm cho phòng ngủ nào (giường 1m6 hay 1m8) và có quan tâm vấn đề đau lưng không ạ?`,
  teaserMessage: 'Dạ em chào Anh/Chị! Cần tư vấn đệm đau lưng hay đệm cưới nhắn em nhé! (Tặng Voucher 200K)',
  bubblePosition: 'bottom-right',
  hotline: '1800 1051',
  zalo: '0962 701 701',
  tone: 'friendly_sales',
  temperature: 0.7,
  customInstruction: 'Ưu tiên khuyên khách chọn đệm phù hợp với sức khỏe cột sống. Nhấn mạnh chính sách 30 ngày nằm thử đổi trả và miễn phí vận chuyển nội thành Hà Nội, TP.HCM.',
  showProductCards: true,
  enableVoucher: true,
  documents: [
    {
      id: 'doc-chinh-sach-demxanh-2026',
      name: 'Chính_Sách_Bảo_Hành_Vận_Chuyển_ĐệmXanh.txt',
      uploadedAt: '2026-10-01 08:00',
      size: '4.2 KB',
      content: `1. Cam kết chính hãng 100%: Hoàn tiền gấp 2 lần nếu phát hiện hàng giả, hàng nhái.\n2. Bảo hành: Bảo hành chính hãng từ 5 năm (Bông ép Sông Hồng, Hanvico) đến 12-15 năm (Cao su Kim Cương, Liên Á, Lò xo Dunlopillo).\n3. Nằm thử: Đổi mới miễn phí trong 30 ngày nếu không êm hoặc không vừa vặn kích thước.\n4. Miễn phí vận chuyển tận phòng: Áp dụng đơn từ 1.000.000đ tại nội thành Hà Nội & TP.HCM. Hỗ trợ bê vác lên tầng cao chung cư, nhà phố.`
    }
  ]
};

export default function App() {
  // Check if running embedded in an iframe on demxanh.com (via ?mode=widget)
  const isWidgetMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'widget';

  // Modes: 'standalone' (primary chatbot window) | 'widget-demo' (simulated bubble on demxanh.com)
  const [viewMode, setViewMode] = useState<'standalone' | 'widget-demo'>('standalone');

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // For widget demo mode
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false);

  const [aiSettings, setAiSettings] = useState<AISettingsConfig>(DEFAULT_SETTINGS);

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedShowroom, setSelectedShowroom] = useState<string | null>(null);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  // Mobile active tab inside Standalone view: 'chat' | 'catalog'
  const [mobileTab, setMobileTab] = useState<'chat' | 'catalog'>('chat');

  // Load server settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setAiSettings(data.settings);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server settings, using defaults:', err);
      });
  }, []);

  // Keyboard shortcut Ctrl + Shift + A for shop owner admin quick access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveSettings = async (newSettings: AISettingsConfig, adminToken?: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = adminToken || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dx_admin_token') : null);
      if (token) {
        headers['x-admin-token'] = token;
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setAiSettings(data.settings);
      } else {
        setAiSettings(newSettings);
      }
    } catch {
      setAiSettings(newSettings);
    }
  };

  const handleResetSettings = () => {
    handleSaveSettings(DEFAULT_SETTINGS);
  };

  const handleConsultProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setExternalPrompt(
      `Dạ nhờ em tư vấn chi tiết về mẫu **${product.name}** (${product.brand}). Mẫu này có ưu nhược điểm gì, bảo hành thế nào và hiện đang có chương trình khuyến mãi hay quà tặng gì vậy em?`
    );
    setMobileTab('chat');
    setIsDemoChatOpen(true);
  };

  const handleOpenLeadModalWithProduct = (product?: ProductItem) => {
    setSelectedProduct(product || null);
    setIsLeadOpen(true);
  };

  const handleBookShowroomVisit = (showroomArea: string) => {
    setSelectedShowroom(showroomArea);
    setIsLeadOpen(true);
  };

  const handleQuizSubmit = (prompt: string) => {
    setExternalPrompt(prompt);
    setMobileTab('chat');
    setIsDemoChatOpen(true);
  };

  // If embedded on demxanh.com via iframe widget (?mode=widget)
  if (isWidgetMode) {
    return (
      <div className="h-screen w-screen flex flex-col bg-white overflow-hidden text-slate-800 font-sans">
        {/* Compact Widget Header */}
        <div
          className="text-white p-3.5 flex items-center justify-between shrink-0 shadow-sm"
          style={{ backgroundColor: aiSettings.primaryColor }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-800 font-black text-xs flex items-center justify-center shadow-xs">
              ĐX
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                <span>{aiSettings.botName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              </div>
              <div className="text-[10px] text-white/80">demxanh.com • Hotline: {aiSettings.hotline}</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.parent) {
                window.parent.postMessage('demxanh-close-widget', '*');
              }
            }}
            className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
            title="Đóng khung chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            onSelectProduct={handleOpenLeadModalWithProduct}
            onOpenLeadModal={handleOpenLeadModalWithProduct}
            onOpenShowroom={() => setIsShowroomOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={() => setExternalPrompt(null)}
          />
        </div>

        {/* Modals inside iframe */}
        <MattressQuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          onSubmitQuiz={handleQuizSubmit}
        />
        <ShowroomModal
          isOpen={isShowroomOpen}
          onClose={() => setIsShowroomOpen(false)}
          onBookVisit={handleBookShowroomVisit}
        />
        <LeadCaptureModal
          isOpen={isLeadOpen}
          onClose={() => setIsLeadOpen(false)}
          selectedProduct={selectedProduct}
          selectedShowroom={selectedShowroom}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Dedicated AI Chatbot Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Top bar info */}
        <div className="bg-emerald-950 text-white text-[11px] py-1.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Chatbot AI Tư Vấn Bán Hàng Chuyên Sâu cho Website demxanh.com
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300">
              Đệm bông ép, cao su thiên nhiên, lò xo túi, foam Nhật Inoac
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="text-amber-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/20"
            >
              <Code className="w-3 h-3 text-amber-400" />
              <span>Lấy mã nhúng cho demxanh.com</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Phím tắt: Ctrl + Shift + A"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Quản trị AI</span>
            </button>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-xs"
              style={{ backgroundColor: aiSettings.primaryColor }}
            >
              ĐX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-900 tracking-tight leading-none">
                  {aiSettings.botName}
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  AI Sales 24/7
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hệ thống Đệm Xanh (demxanh.com) • Hotline: {aiSettings.hotline}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('standalone')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'standalone' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Cửa sổ tư vấn
              </button>
              <button
                onClick={() => setViewMode('widget-demo')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'widget-demo' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Thử bong bóng nổi
              </button>
            </div>

            {/* Mattress Quiz */}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tìm đệm 30s</span>
            </button>

            {/* Embed code button */}
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mã Nhúng demxanh.com</span>
            </button>

            {/* Lead voucher button */}
            <button
              onClick={() => handleOpenLeadModalWithProduct()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Voucher 200K</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      {viewMode === 'standalone' ? (
        <div className="flex-1 flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex items-center bg-white border-b border-slate-200 px-4 py-2 shrink-0">
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => setMobileTab('chat')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileTab === 'chat'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Khung Tư Vấn AI</span>
              </button>

              <button
                onClick={() => setMobileTab('catalog')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileTab === 'catalog'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Bảng Giá & So Sánh Đệm</span>
              </button>
            </div>
          </div>

          {/* Standalone Consultation Dashboard (Chat on left, Catalog & Comparison on right) */}
          <div className="flex-1 flex overflow-hidden bg-white shadow-xs border-x border-slate-200">
            {/* Left: Chat Window */}
            <div
              className={`flex-1 flex flex-col h-full overflow-hidden ${
                mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <ChatWindow
                onSelectProduct={handleOpenLeadModalWithProduct}
                onOpenLeadModal={handleOpenLeadModalWithProduct}
                onOpenShowroom={() => setIsShowroomOpen(true)}
                onOpenQuiz={() => setIsQuizOpen(true)}
                externalPrompt={externalPrompt}
                onClearExternalPrompt={() => setExternalPrompt(null)}
              />
            </div>

            {/* Right: Product Catalog & Comparison Sidebar */}
            <div
              className={`h-full overflow-hidden ${
                mobileTab === 'catalog' ? 'flex w-full' : 'hidden lg:flex'
              }`}
            >
              <ProductCatalogSidebar
                onAskAboutProduct={handleConsultProduct}
                onOpenLeadModal={handleOpenLeadModalWithProduct}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Widget Demo Preview Mode */
        <div className="flex-1 relative">
          <DemXanhWebsiteView
            onOpenChatWithPrompt={handleQuizSubmit}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenShowroom={() => setIsShowroomOpen(true)}
            onOpenLeadModal={handleOpenLeadModalWithProduct}
            onOpenEmbedModal={() => setIsEmbedOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <FloatingChatWidget
            isOpen={isDemoChatOpen}
            onToggle={() => setIsDemoChatOpen(!isDemoChatOpen)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenShowroom={() => setIsShowroomOpen(true)}
            onOpenLeadModal={handleOpenLeadModalWithProduct}
            settings={aiSettings}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={() => setExternalPrompt(null)}
          />
        </div>
      )}

      {/* 3. Modals */}
      <MattressQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmitQuiz={handleQuizSubmit}
      />

      <ShowroomModal
        isOpen={isShowroomOpen}
        onClose={() => setIsShowroomOpen(false)}
        onBookVisit={handleBookShowroomVisit}
      />

      <LeadCaptureModal
        isOpen={isLeadOpen}
        onClose={() => {
          setIsLeadOpen(false);
          setSelectedProduct(null);
          setSelectedShowroom(null);
        }}
        selectedProduct={selectedProduct}
        selectedShowroom={selectedShowroom}
      />

      <EmbedCodeModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
      />

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={aiSettings}
        onSaveSettings={handleSaveSettings}
        onResetSettings={handleResetSettings}
        onProductsUpdated={() => {
          // Re-trigger product catalog update if needed
        }}
      />
    </div>
  );
}
