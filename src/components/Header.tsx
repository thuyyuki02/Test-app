import React from 'react';
import {
  PhoneCall,
  MapPin,
  Sparkles,
  ExternalLink,
  Code,
  Layout,
  MessageSquare,
  Gift,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  viewMode: 'standalone' | 'website-simulation';
  onChangeViewMode: (mode: 'standalone' | 'website-simulation') => void;
  onOpenQuiz: () => void;
  onOpenShowroom: () => void;
  onOpenEmbedModal: () => void;
  onOpenLeadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenQuiz,
  onOpenShowroom,
  onOpenEmbedModal,
  onOpenLeadModal,
}) => {
  const handlePopoutWindow = () => {
    window.open(
      window.location.href,
      'DemXanhAIChatWindow',
      'width=480,height=750,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
  };

  return (
    <header className="bg-white border-b border-emerald-900/10 sticky top-0 z-40 shadow-xs">
      {/* Top micro bar */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] py-1 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Hệ Thống Đệm Xanh (demxanh.com) - 100% Chính Hãng - Bảo hành tới 12 năm
          </span>
          <span className="text-emerald-400/60">•</span>
          <span>Nằm thử 30 ngày tại nhà miễn phí</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenShowroom}
            className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Showroom: Hà Nội • TP.HCM • Thái Bình • Ninh Bình</span>
          </button>
          <span className="text-emerald-400/60">•</span>
          <a
            href="tel:18001051"
            className="hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            Tổng đài miễn cước: 1800 1051
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm font-black text-xl tracking-tighter">
              ĐX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-800 tracking-tight leading-none">
                  ĐỆM XANH
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  AI Sales
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Trợ lý tư vấn đệm 24/7 (demxanh.com)</span>
              </div>
            </div>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => onChangeViewMode('standalone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'standalone'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Cửa sổ tư vấn riêng</span>
          </button>

          <button
            onClick={() => onChangeViewMode('website-simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'website-simulation'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Xem thử bong bóng trên trang mẫu</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Prominent Embed code button */}
          <button
            onClick={onOpenEmbedModal}
            title="Lấy mã nhúng bong bóng chat cho website demxanh.com của bạn"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-all cursor-pointer border border-emerald-600 active:scale-98"
          >
            <Code className="w-3.5 h-3.5 text-amber-300" />
            <span>📦 Lấy mã gắn vào website</span>
          </button>

          {/* Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tìm đệm 30s</span>
          </button>

          {/* Showroom Button */}
          <button
            onClick={onOpenShowroom}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Showroom</span>
          </button>

          {/* Popout button */}
          <button
            onClick={handlePopoutWindow}
            title="Mở ra cửa sổ popup độc lập"
            className="hidden lg:flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="text-[11px]">Bật cửa sổ</span>
          </button>

          {/* Get 200k Voucher button */}
          <button
            onClick={onOpenLeadModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-100" />
            <span>Voucher 200K</span>
          </button>
        </div>
      </div>
    </header>
  );
};
