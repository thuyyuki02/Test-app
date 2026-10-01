import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, BedDouble, UserCheck, Wallet, ArrowRight } from 'lucide-react';

interface MattressQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuiz: (summaryPrompt: string) => void;
}

export const MattressQuizModal: React.FC<MattressQuizModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuiz,
}) => {
  const [step, setStep] = useState(1);
  const [targetUser, setTargetUser] = useState<string>('');
  const [preference, setPreference] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  if (!isOpen) return null;

  const handleFinish = () => {
    const prompt = `Dạ nhờ Đệm Xanh tư vấn giúp tôi: Tôi cần mua đệm cho ${targetUser || 'gia đình'}, tình trạng/sở thích là ${preference || 'nâng đỡ lưng tốt'}, mức ngân sách dự kiến khoảng ${budget || 'tầm trung 4 - 8 triệu'}. Hãy cho tôi 2-3 gợi ý đệm tối ưu nhất cùng bảng giá kích thước 1m6 và 1m8 nhé!`;
    onSubmitQuiz(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Tìm Đệm Chuẩn Trong 30 Giây</h3>
              <p className="text-emerald-100 text-xs mt-0.5">Trắc nghiệm thông minh từ chuyên gia Đệm Xanh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Bước 1/3: Đệm dành cho ai sử dụng chính?</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'Vợ chồng / Phòng ngủ master',
                    title: 'Vợ chồng / Phòng Master',
                    desc: 'Cần đệm êm ái, chống rung khi trở mình, bền đẹp trên 10 năm'
                  },
                  {
                    id: 'Bố mẹ / Người cao tuổi bị đau lưng',
                    title: 'Bố mẹ / Người cao tuổi, thoái hóa cột sống',
                    desc: 'Cần đệm phẳng, độ cứng vừa phải, bảo vệ trục xương, không lún võng'
                  },
                  {
                    id: 'Trẻ em / Thanh thiếu niên đang phát triển',
                    title: 'Trẻ nhỏ / Con cái đang tuổi lớn',
                    desc: 'Định hình cột sống chống cong vẹo, kháng khuẩn, thoáng mát'
                  },
                  {
                    id: 'Cá nhân / Sinh viên / Nhà trọ',
                    title: 'Cá nhân / Sinh viên / Căn hộ dịch vụ',
                    desc: 'Tiết kiệm chi phí, dễ dàng gấp gọn hoặc di chuyển'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTargetUser(item.id);
                      setStep(2);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      targetUser === item.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {targetUser === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <BedDouble className="w-4 h-4 text-emerald-600" />
                <span>Bước 2/3: Cảm giác nằm & Tình trạng cơ thể?</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'Thích nằm phẳng, chắc chắn, hay đau lưng',
                    title: 'Phẳng chắc chắn (Bông ép / Cao su cứng)',
                    desc: 'Tốt nhất cho người đau dây thần kinh toạ, thoát vị, quen nằm chiếu cói'
                  },
                  {
                    id: 'Thích vừa êm vừa có độ nảy nâng đỡ cơ thể (Cao su tự nhiên / Foam)',
                    title: 'Êm ái vừa vặn (Cao su thiên nhiên / Foam Nhật)',
                    desc: 'Nâng niu từng điểm tỳ nén trên cơ thể, thoáng mát, siêu bền'
                  },
                  {
                    id: 'Thích bồng bềnh, dày dặn sang trọng như khách sạn 5 sao (Lò xo túi)',
                    title: 'Bồng bềnh sang trọng (Lò xo túi độc lập cao cấp)',
                    desc: 'Dày từ 25cm - 32cm, không rung lắc, đẳng cấp hoàng gia'
                  },
                  {
                    id: 'Muốn làm êm đệm cũ có sẵn với chi phí tiết kiệm nhất',
                    title: 'Muốn đệm cũ êm hơn (Dùng Topper trải trên)',
                    desc: 'Biến mọi đệm cứng thành đệm êm chỉ với 800k - 1 triệu'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPreference(item.id);
                      setStep(3);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      preference === item.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {preference === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Bước 3/3: Khoảng ngân sách đầu tư dự kiến?</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'Tiết kiệm: Dưới 3.5 triệu',
                    title: 'Dưới 3.5 Triệu',
                    subtitle: 'Đệm bông ép Sông Hồng, Hanvico, Topper'
                  },
                  {
                    id: 'Phổ thông: 3.5 - 7 triệu',
                    title: 'Từ 3.5 - 7 Triệu',
                    subtitle: 'Đệm cao su Kim Cương, Foam Nhật, Lò xo Asling'
                  },
                  {
                    id: 'Cao cấp: 7 - 15 triệu',
                    title: 'Từ 7 - 15 Triệu',
                    subtitle: 'Lò xo túi Dunlopillo Audrey, Cao su Liên Á Classic'
                  },
                  {
                    id: 'Hạng sang: Trên 15 triệu',
                    title: 'Trên 15 Triệu',
                    subtitle: 'Dunlopillo hoàng gia, Cao su thiên nhiên 15-20cm'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBudget(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      budget === item.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{item.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Quay lại
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              disabled={step === 1 && !targetUser}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Tiếp tục <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={!budget}
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem kết quả tư vấn AI ngay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
