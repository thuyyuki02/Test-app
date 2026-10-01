import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Truck,
  Percent,
  ChevronRight,
  Star,
  Award,
  BookOpen,
  Gift,
  CheckCircle2,
  Code,
  ExternalLink,
  Settings,
  Lock,
} from 'lucide-react';
import { DEMXANH_PRODUCTS, ProductItem } from '../data/products';
import { ProductCard } from './ProductCard';

interface DemXanhWebsiteViewProps {
  onOpenChatWithPrompt: (prompt: string) => void;
  onOpenQuiz: () => void;
  onOpenShowroom: () => void;
  onOpenLeadModal: (product?: ProductItem) => void;
  onOpenEmbedModal: () => void;
  onOpenSettings: () => void;
}

export const DemXanhWebsiteView: React.FC<DemXanhWebsiteViewProps> = ({
  onOpenChatWithPrompt,
  onOpenQuiz,
  onOpenShowroom,
  onOpenLeadModal,
  onOpenEmbedModal,
  onOpenSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất Cả Sản Phẩm' },
    { id: 'bong-ep', label: 'Đệm Bông Ép' },
    { id: 'cao-su', label: 'Đệm Cao Su' },
    { id: 'lo-xo', label: 'Đệm Lò Xo' },
    { id: 'foam', label: 'Đệm Foam Nhật' },
    { id: 'topper-phu-kien', label: 'Topper & Phụ Kiện' },
  ];

  const filteredProducts = DEMXANH_PRODUCTS.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Keyboard shortcut Ctrl + Shift + A for shop owner admin quick access
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onOpenSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSettings]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* 1. Top Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-300">🌿 ĐỆM XANH (demxanh.com)</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Hệ thống phân phối đệm chính hãng số 1 Việt Nam</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={onOpenEmbedModal}
              className="text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer font-medium"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Lấy mã nhúng</span>
            </button>
            <span>•</span>
            <button
              onClick={onOpenShowroom}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Showroom Hà Nội & HCM</span>
            </button>
            <span>•</span>
            <a
              href="tel:18001051"
              className="hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              1800 1051 (Miễn cước)
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main DemXanh Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-xl shadow-xs">
              ĐX
            </div>
            <div>
              <div className="font-black text-2xl text-emerald-800 tracking-tight leading-none">
                ĐỆM XANH
              </div>
              <div className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                demxanh.com • Kho Đệm Giá Tận Gốc
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg relative hidden md:block">
            <input
              type="text"
              placeholder="Tìm đệm Sông Hồng, Kim Cương, Liên Á, Dunlopillo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border-2 border-emerald-600 rounded-full focus:outline-none focus:bg-white"
            />
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
            <button
              onClick={() =>
                onOpenChatWithPrompt(`Tìm giúp tôi đệm phù hợp với từ khóa: "${searchQuery}"`)
              }
              className="absolute right-1.5 top-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              Hỏi AI
            </button>
          </div>

          {/* Contact & Tools */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenQuiz}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tìm đệm chuẩn 30s</span>
            </button>

            <button
              onClick={() => onOpenLeadModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Voucher 200K</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-xl font-bold text-xs">
              <ShoppingCart className="w-4 h-4" />
              <span>Giỏ hàng (0)</span>
            </div>
          </div>
        </div>

        {/* Navigation Categories Menu */}
        <div className="bg-emerald-700 text-white px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar text-xs font-bold py-2.5 uppercase tracking-wide">
            <span className="bg-emerald-800 px-3 py-1 rounded-md text-amber-300 flex items-center gap-1 shrink-0">
              <Percent className="w-3.5 h-3.5" /> Khuyến Mại Đến 45%
            </span>
            <button
              onClick={() => setSelectedCategory('bong-ep')}
              className={`hover:text-amber-200 transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'bong-ep' ? 'text-amber-300 underline underline-offset-4' : ''
              }`}
            >
              Đệm Bông Ép
            </button>
            <button
              onClick={() => setSelectedCategory('cao-su')}
              className={`hover:text-amber-200 transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'cao-su' ? 'text-amber-300 underline underline-offset-4' : ''
              }`}
            >
              Đệm Cao Su Thiên Nhiên
            </button>
            <button
              onClick={() => setSelectedCategory('lo-xo')}
              className={`hover:text-amber-200 transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'lo-xo' ? 'text-amber-300 underline underline-offset-4' : ''
              }`}
            >
              Đệm Lò Xo Túi
            </button>
            <button
              onClick={() => setSelectedCategory('foam')}
              className={`hover:text-amber-200 transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'foam' ? 'text-amber-300 underline underline-offset-4' : ''
              }`}
            >
              Đệm Foam Nhật
            </button>
            <button
              onClick={() => setSelectedCategory('topper-phu-kien')}
              className={`hover:text-amber-200 transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'topper-phu-kien' ? 'text-amber-300 underline underline-offset-4' : ''
              }`}
            >
              Topper Làm Mềm
            </button>
            <button
              onClick={onOpenShowroom}
              className="hover:text-amber-200 transition-colors shrink-0 cursor-pointer"
            >
              Hệ Thống Showroom
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-10 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Tuần Lễ Vàng Chăn Ga Gối Đệm 2026
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              Chọn Đệm Chuẩn Sức Khỏe <br />
              <span className="text-amber-300">Nâng Đỡ Cột Sống Hoàn Hảo</span>
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Hệ thống Siêu thị Đệm Xanh (demxanh.com) cam kết 100% chính hãng, bảo hành lên tới 12 năm.
              Giảm ngay tới 35% + Tặng 02 gối cao su thiên nhiên + Nằm thử 30 ngày tại nhà!
            </p>

            {/* Quick Interactive Triggers */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() =>
                  onOpenChatWithPrompt(
                    'Dạ em chào Đệm Xanh, em cần tư vấn chọn đệm cho người đau lưng / thoái hoá đốt sống ạ!'
                  )
                }
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>🌿 Bấm Chat Tư Vấn Đệm Đau Lưng</span>
              </button>

              <button
                onClick={() =>
                  onOpenChatWithPrompt(
                    'Em muốn tư vấn đệm lò xo túi êm ái chuẩn khách sạn 5 sao cho phòng cưới 1m8x2m ạ!'
                  )
                }
                className="bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold px-4 py-3 rounded-2xl text-xs sm:text-sm backdrop-blur-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>💍 Chat Tư Vấn Đệm Cưới</span>
              </button>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="relative w-full lg:w-[480px] aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
              alt="Đệm Xanh Bestseller"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-950/85 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Đệm Cao Su Thiên Nhiên Kim Cương</div>
                <div className="text-amber-300 text-[11px] font-medium">Bảo hành 12 năm • Tặng 02 gối cao su</div>
              </div>
              <button
                onClick={() =>
                  onOpenChatWithPrompt('Tư vấn giúp em mẫu Đệm Cao Su Kim Cương Happy Gold!')
                }
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Hỏi giá
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Badges */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">100% Chính Hãng</div>
              <div className="text-slate-500 text-[11px]">Bảo hành điện tử 5 - 12 năm</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Truck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Giao Nhanh Tận Phòng</div>
              <div className="text-slate-500 text-[11px]">Miễn phí ship Hà Nội & HCM</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Percent className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Giá Tốt Tại Kho</div>
              <div className="text-slate-500 text-[11px]">Chiết khấu tới 45% giá hãng</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <MapPin className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Chuỗi Showroom Lớn</div>
              <div className="text-slate-500 text-[11px]">Nằm thử trải nghiệm miễn phí</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
        {/* Category Pills Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Đệm Bán Chạy Nhất Tại Đệm Xanh
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bấm "Hỏi AI về mẫu này" để bong bóng chat tư vấn chuẩn kích thước và báo giá ưu đãi
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={`${product.id}-${idx}`}
              product={product}
              onAskAbout={(item) =>
                onOpenChatWithPrompt(
                  `Em tư vấn chi tiết về mẫu **${item.name}** (${item.brand}). Mẫu này có ưu đãi gì và kích thước 1m8x2m giá thế nào em?`
                )
              }
              onSelectProduct={() => onOpenLeadModal(product)}
            />
          ))}
        </div>
      </section>

      {/* 6. Bedding Mattress Guide / Comparison Section */}
      <section className="bg-emerald-50/60 border-t border-emerald-100 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              Cẩm Nang Giấc Ngủ Đệm Xanh
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Bạn Chưa Biết Nên Chọn Loại Đệm Nào?
            </h3>
            <p className="text-xs text-slate-600">
              Hãy so sánh nhanh 4 dòng đệm phổ biến nhất hiện nay hoặc bấm bong bóng chat để chuyên viên AI hỗ trợ tức thì!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
              <div className="font-bold text-base text-emerald-900">1. Đệm Bông Ép</div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>• <strong>Đặc tính:</strong> Bề mặt phẳng, cứng vừa, không lún võng</div>
                <div>• <strong>Độ bền:</strong> 5 - 7 năm</div>
                <div>• <strong>Phù hợp:</strong> Người đau lưng, người già, trẻ nhỏ</div>
                <div>• <strong>Mức giá:</strong> 1.8M - 4.5M</div>
              </div>
              <button
                onClick={() =>
                  onOpenChatWithPrompt('Tư vấn giúp tôi các dòng Đệm Bông Ép Sông Hồng và Hanvico!')
                }
                className="w-full text-xs font-bold py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl cursor-pointer"
              >
                Hỏi AI về Đệm Bông Ép
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
              <div className="font-bold text-base text-emerald-900">2. Đệm Cao Su Thiên Nhiên</div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>• <strong>Đặc tính:</strong> 100% mủ cao su, đàn hồi tối ưu, thoáng khí</div>
                <div>• <strong>Độ bền:</strong> 15 - 20 năm</div>
                <div>• <strong>Phù hợp:</strong> Mọi lứa tuổi, giải phóng áp lực cột sống</div>
                <div>• <strong>Mức giá:</strong> 5.5M - 15M+</div>
              </div>
              <button
                onClick={() =>
                  onOpenChatWithPrompt('Tư vấn giúp tôi Đệm Cao Su Thiên Nhiên Kim Cương và Liên Á!')
                }
                className="w-full text-xs font-bold py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl cursor-pointer"
              >
                Hỏi AI về Đệm Cao Su
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
              <div className="font-bold text-base text-emerald-900">3. Đệm Lò Xo Túi Độc Lập</div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>• <strong>Đặc tính:</strong> Êm ái bồng bềnh, cách ly chuyển động tốt</div>
                <div>• <strong>Độ bền:</strong> 10 - 15 năm</div>
                <div>• <strong>Phù hợp:</strong> Phòng cưới, khách sạn 5 sao, phòng master</div>
                <div>• <strong>Mức giá:</strong> 5M - 18M+</div>
              </div>
              <button
                onClick={() =>
                  onOpenChatWithPrompt('Tư vấn giúp tôi Đệm Lò Xo Túi Dunlopillo Anh Quốc!')
                }
                className="w-full text-xs font-bold py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl cursor-pointer"
              >
                Hỏi AI về Đệm Lò Xo
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
              <div className="font-bold text-base text-emerald-900">4. Đệm Foam & Topper</div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>• <strong>Đặc tính:</strong> Nhẹ, nâng đỡ đa vùng, dễ cuộn gấp</div>
                <div>• <strong>Độ bền:</strong> 7 - 10 năm</div>
                <div>• <strong>Phù hợp:</strong> Giới trẻ, chung cư, làm êm đệm cũ</div>
                <div>• <strong>Mức giá:</strong> 800k - 6M</div>
              </div>
              <button
                onClick={() =>
                  onOpenChatWithPrompt('Tư vấn giúp tôi Đệm Foam Nhật Bản Inoac và Topper!')
                }
                className="w-full text-xs font-bold py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl cursor-pointer"
              >
                Hỏi AI về Đệm Foam / Topper
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-10 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                ĐX
              </div>
              <span className="font-extrabold text-lg text-white">ĐỆM XANH</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống Siêu Thị Đệm Xanh - demxanh.com - Chuyên phân phối các sản phẩm chăn ga gối đệm chính hãng từ Sông Hồng, Kim Cương, Liên Á, Vạn Thành, Dunlopillo, Hanvico, Everon.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-xs">Tổng Đài Tư Vấn</div>
            <div className="space-y-1 text-slate-400">
              <div>Tổng đài miễn cước: <strong className="text-emerald-400">1800 1051</strong></div>
              <div>Hotline / Zalo: <strong className="text-emerald-400">0962 701 701</strong></div>
              <div>Giờ mở cửa: 8h00 - 21h30 (Hàng ngày)</div>
              <div>Email: cskh@demxanh.com</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-xs">Hệ Thống Showroom</div>
            <div className="space-y-1 text-slate-400">
              <div>• 113 Nguyễn Trãi, Thanh Xuân, Hà Nội</div>
              <div>• 102 & 380 Cầu Giấy, Hà Nội</div>
              <div>• 807 Giải Phóng, Hoàng Mai, Hà Nội</div>
              <div>• 566 Bát Khối, Long Biên, Hà Nội</div>
              <div>• Showroom TP. Hồ Chí Minh, Thái Bình, Ninh Bình</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-xs">Chính Sách & Hỗ Trợ</div>
            <div className="space-y-1 text-slate-400">
              <div>• Chính sách nằm thử 30 ngày</div>
              <div>• Bảo hành chính hãng tới 12 năm</div>
              <div>• Miễn phí vận chuyển nội thành</div>
              <div>• Đổi trả linh hoạt tận nhà</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 Đệm Xanh (demxanh.com). All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span>Tư vấn Bán hàng AI cho demxanh.com</span>
            <span>•</span>
            <button
              onClick={onOpenSettings}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Khu vực dành riêng cho chủ shop / quản trị viên (Phím tắt: Ctrl + Shift + A)"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Quản trị AI (Admin)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
