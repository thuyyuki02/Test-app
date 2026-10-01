import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Phone,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Truck,
  Percent,
  MessageCircle,
  X,
  Maximize2,
  Code,
} from 'lucide-react';
import { DEMXANH_PRODUCTS, ProductItem } from '../data/products';
import { ProductCard } from './ProductCard';

interface WebsiteSimulatorProps {
  onOpenStandaloneChat: () => void;
  onConsultProduct: (product: ProductItem) => void;
  onOpenEmbedModal: () => void;
}

export const WebsiteSimulator: React.FC<WebsiteSimulatorProps> = ({
  onOpenStandaloneChat,
  onConsultProduct,
  onOpenEmbedModal,
}) => {
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  const filteredProducts = DEMXANH_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(quickSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col relative pb-16">
      {/* Top Simulator Banner informing user */}
      <div className="bg-emerald-950 text-white px-4 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2 sticky top-14 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            Đang hiển thị chế độ <strong>Mô phỏng website thực tế demxanh.com</strong> với tiện ích Chatbot AI.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEmbedModal}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Lấy mã nhúng cho demxanh.com</span>
          </button>

          <button
            onClick={onOpenStandaloneChat}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3 py-1 rounded-lg font-bold text-xs shadow-sm cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở Ra Cửa Sổ Riêng</span>
          </button>
        </div>
      </div>

      {/* Website DemXanh Mockup Container */}
      <div className="max-w-6xl mx-auto w-full bg-white shadow-xl my-4 rounded-2xl overflow-hidden border border-slate-200">
        {/* DemXanh Header Mock */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-2xl shadow-sm">
                ĐX
              </div>
              <div>
                <div className="font-black text-2xl text-emerald-800 tracking-tight leading-none">
                  ĐỆM XANH
                </div>
                <div className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                  demxanh.com • Hệ Thống Siêu Thị Chăn Ga Gối Đệm
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative hidden sm:block">
              <input
                type="text"
                placeholder="Tìm kiếm đệm Sông Hồng, Kim Cương, Dunlopillo..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border-2 border-emerald-600 rounded-full focus:outline-none"
              />
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
            </div>

            {/* Contact info & Cart */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-800 text-sm">1800 1051</div>
                  <div className="text-[10px] text-slate-500">Tư vấn miễn cước</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-2 rounded-xl font-bold">
                <ShoppingCart className="w-4 h-4" />
                <span>Giỏ hàng (0)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DemXanh Navigation Categories */}
        <div className="bg-emerald-700 text-white px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
          <span className="bg-emerald-800 px-3 py-1 rounded-md text-amber-300 flex items-center gap-1 shrink-0">
            <Percent className="w-3.5 h-3.5" /> Khuyến Mãi Hot
          </span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Đệm Bông Ép</span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Đệm Cao Su</span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Đệm Lò Xo</span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Đệm Foam</span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Topper Làm Mềm</span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Chăn Ga Gối</span>
          <span className="hover:text-emerald-200 cursor-pointer shrink-0">Hệ Thống Showroom</span>
        </div>

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="max-w-xl space-y-3 z-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 font-black text-xs px-3 py-1 rounded-full uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Đại Tiệc Giấc Ngủ 2026
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Hệ Thống Phân Phối Đệm Chính Hãng Lớn Nhất
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Giảm tới 35% đệm Sông Hồng, Kim Cương, Liên Á, Dunlopillo. Tặng kèm bộ ga gối và miễn phí vận chuyển tận phòng!
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenStandaloneChat}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mở Chatbot AI Tư Vấn Bán Hàng</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-80 aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
              alt="Đệm Xanh"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">100% Chính Hãng</div>
              <div className="text-[11px] text-slate-500">Bảo hành tới 12 năm</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Miễn Phí Vận Chuyển</div>
              <div className="text-[11px] text-slate-500">Nội thành Hà Nội & HCM</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Percent className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Giá Tốt Nhất Thị Trường</div>
              <div className="text-[11px] text-slate-500">Chiết khấu tới 45%</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Chuỗi Showroom Lớn</div>
              <div className="text-[11px] text-slate-500">Nằm thử trải nghiệm 30 ngày</div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Đệm Bán Chạy Tại Đệm Xanh</h2>
              <p className="text-xs text-slate-500">Sản phẩm được hàng triệu gia đình Việt tin dùng</p>
            </div>
            <button
              onClick={onOpenStandaloneChat}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Hỏi AI về cách chọn đệm phù hợp <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAskAbout={() => onConsultProduct(product)}
                onSelectProduct={() => onConsultProduct(product)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Widget simulating the DemXanh website popup */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {widgetOpen && (
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 w-80 sm:w-96 overflow-hidden mb-3 animate-in slide-in-from-bottom-5 duration-300 flex flex-col">
            {/* Widget Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="font-bold text-sm">Trợ Lý Đệm Xanh AI</div>
                  <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Đang online • Tư vấn 24/7
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenStandaloneChat}
                  title="Mở ra Cửa Sổ Riêng lớn hơn"
                  className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWidgetOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widget Teaser Message */}
            <div className="p-4 bg-slate-50 space-y-3 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <p className="font-semibold text-slate-800">
                  Dạ em chào Anh/Chị! Đang có ưu đãi <strong>giảm tới 35%</strong> và tặng <strong>Voucher 200k</strong> cho khách hàng hôm nay.
                </p>
                <p className="text-slate-500 text-[11px]">
                  Anh/Chị cần tư vấn đệm đau lưng, đệm cưới, đệm cao su hay bông ép ạ?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => {
                    onOpenStandaloneChat();
                  }}
                  className="w-full text-left p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>🌿 Tư vấn đệm cho người đau lưng / thoái hoá</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>

                <button
                  onClick={() => {
                    onOpenStandaloneChat();
                  }}
                  className="w-full text-left p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>💍 Tư vấn đệm cưới lò xo túi êm ái</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              </div>

              <button
                onClick={onOpenStandaloneChat}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-center shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Bật cửa sổ tư vấn riêng biệt</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          onClick={() => {
            if (!widgetOpen) setWidgetOpen(true);
            else onOpenStandaloneChat();
          }}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-600/40 active:scale-95 transition-all cursor-pointer border-2 border-emerald-400/40"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 border-2 border-emerald-700" />
          </div>
          <div className="text-left font-bold leading-tight">
            <div className="text-xs">Tư vấn Đệm AI 24/7</div>
            <div className="text-[10px] text-emerald-100 font-normal">demxanh.com • Nhận voucher 200k</div>
          </div>
        </button>
      </div>
    </div>
  );
};
