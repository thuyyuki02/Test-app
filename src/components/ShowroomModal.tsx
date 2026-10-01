import React from 'react';
import { X, MapPin, Phone, Clock, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { DEMXANH_SHOWROOMS } from '../data/products';

interface ShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookVisit?: (showroomName: string) => void;
}

export const ShowroomModal: React.FC<ShowroomModalProps> = ({
  isOpen,
  onClose,
  onBookVisit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Hệ Thống Showroom Đệm Xanh</h3>
              <p className="text-emerald-100 text-xs">
                Nằm thử trải nghiệm miễn phí tại Hà Nội, TP.HCM, Thái Bình, Ninh Bình
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-3 flex items-center justify-around text-xs text-emerald-900 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Nằm thử đệm 30 ngày</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Miễn phí giao hàng & vác tận phòng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tặng quà trị giá tới 1.5 triệu</span>
          </div>
        </div>

        {/* List of showrooms */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {DEMXANH_SHOWROOMS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{item.area}</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Showroom chính hãng
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item.address}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <strong>Hotline:</strong> {item.hotline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.openTime}
                  </span>
                </div>
              </div>

              {onBookVisit && (
                <button
                  onClick={() => {
                    onBookVisit(item.area);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-2xs active:scale-98 transition-all cursor-pointer text-center"
                >
                  Hẹn lịch nằm thử
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between px-6">
          <span>Tổng đài miễn cước tư vấn: <strong className="text-emerald-700 text-sm">1800 1051</strong></span>
          <span className="text-slate-400">Website: demxanh.com</span>
        </div>
      </div>
    </div>
  );
};
