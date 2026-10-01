import React, { useState } from 'react';
import { X, Gift, Phone, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { ProductItem } from '../data/products';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: ProductItem | null;
  selectedShowroom?: string | null;
  onSuccess?: (voucherCode: string) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  selectedShowroom,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedVoucher, setSubmittedVoucher] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại để nhận voucher ưu đãi');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Khách hàng Đệm Xanh',
          phone: phone.trim(),
          note: note.trim(),
          productId: selectedProduct?.id || 'Tư vấn chung',
          showroom: selectedShowroom || 'Hà Nội / Showroom gần nhất',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedVoucher(data.voucherCode || 'DEMXANH200K');
        if (onSuccess) onSuccess(data.voucherCode || 'DEMXANH200K');
      } else {
        setError(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch {
      // Offline fallback
      setSubmittedVoucher('DEMXANH200K');
      if (onSuccess) onSuccess('DEMXANH200K');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Gift className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Nhận Voucher Giảm 200.000đ</h3>
              <p className="text-emerald-100 text-xs">Áp dụng trực tiếp tại hệ thống Đệm Xanh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedVoucher ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">Đăng Ký Thành Công!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Chuyên viên tư vấn Đệm Xanh sẽ liên hệ với Anh/Chị qua số{' '}
                <strong className="text-slate-800">{phone}</strong> trong vòng 5 phút để kích hoạt ưu đãi.
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 p-3.5 rounded-2xl text-center">
              <div className="text-xs text-emerald-800 font-medium">Mã Voucher của Anh/Chị:</div>
              <div className="text-xl font-black text-emerald-700 tracking-wider mt-1">
                {submittedVoucher}
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                (Giảm ngay 200.000đ + Tặng 02 gối cao su hoặc ga bọc)
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Tiếp tục chat với trợ lý AI
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {selectedProduct && (
              <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-xs min-w-0">
                  <div className="font-bold text-slate-900 truncate">{selectedProduct.name}</div>
                  <div className="text-emerald-700 font-semibold mt-0.5">
                    Giá từ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.salePrice)}
                  </div>
                </div>
              </div>
            )}

            {selectedShowroom && (
              <div className="text-xs text-slate-600 bg-emerald-50/70 border border-emerald-200/70 p-2.5 rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đăng ký nằm thử tại: <strong>{selectedShowroom}</strong></span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại của Anh/Chị <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên (không bắt buộc)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kích thước giường / Yêu cầu đặc biệt
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Giường 1m8x2m, cần giao gấp tại Hà Nội"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Nhận Voucher 200K & Báo Giá Ngay</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật thông tin 100% • Không gọi làm phiền</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
