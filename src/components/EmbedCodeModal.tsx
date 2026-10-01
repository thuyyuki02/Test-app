import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink, Globe, Sparkles } from 'lucide-react';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({ isOpen, onClose }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPopout, setCopiedPopout] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://demxanh.com';

  if (!isOpen) return null;

  // 1-line script for demxanh.com
  const oneLineScript = `<!-- Tích hợp Chatbot AI Đệm Xanh (demxanh.com) -->
<script src="${currentOrigin}/widget.js" async></script>`;

  // Popout link code
  const popoutLinkCode = `<!-- Nút mở Cửa Sổ Riêng cho website demxanh.com -->
<button onclick="window.open('${currentOrigin}', 'DemXanhAI', 'width=460,height=720,menubar=no,toolbar=no,status=no,resizable=yes');" style="background:#008848;color:#fff;padding:10px 18px;border-radius:24px;border:none;font-weight:bold;cursor:pointer;">
  💬 Tư vấn Đệm AI
</button>`;

  const iframeCode = `<!-- Nhúng trực tiếp vào 1 trang /tu-van-dem-ai trên demxanh.com -->
<iframe 
  src="${currentOrigin}?mode=widget" 
  width="100%" 
  height="700px" 
  style="border:none;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.1);" 
  title="Đệm Xanh AI Consultant"
></iframe>`;

  const copyToClipboard = (text: string, type: 'script' | 'popout' | 'iframe') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else if (type === 'popout') {
      setCopiedPopout(true);
      setTimeout(() => setCopiedPopout(false), 2000);
    } else {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Code className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Mã Nhúng Bong Bóng Chat AI Cho Website demxanh.com Có Sẵn
              </h3>
              <p className="text-emerald-100 text-xs">
                Chỉ cần dán 1 dòng mã vào website hiện tại của bạn là bong bóng chat sẽ nổi lên góc dưới bên phải
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Note for existing website */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Dành cho website https://demxanh.com đang chạy của bạn:</span>
              <p className="mt-0.5 text-amber-800">
                Bạn <strong>không cần tạo lại web</strong>. Bạn chỉ cần copy đúng 1 dòng mã dưới đây và dán vào mã nguồn website hiện tại của bạn. Khi đó trên website demxanh.com sẽ tự động có nút <strong>Bong bóng tròn nổi ở góc màn hình</strong>, khách hàng bấm vào sẽ bung cửa sổ tư vấn AI!
              </p>
            </div>
          </div>

          {/* Method 1: 1-line script */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-500/40 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Mã Script Bong Bóng Nổi (Copy dán 1 dòng duy nhất)
              </span>
              <button
                onClick={() => copyToClipboard(oneLineScript, 'script')}
                className="text-xs text-white font-bold flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-xl cursor-pointer shadow-xs active:scale-98 transition-all"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép mã'}</span>
              </button>
            </div>
            
            <pre className="bg-slate-900 text-emerald-300 text-xs p-3.5 rounded-xl overflow-x-auto font-mono select-all">
              {oneLineScript}
            </pre>

            <div className="text-xs text-slate-700 space-y-1 pt-1">
              <div className="font-semibold text-slate-800">📍 Hướng dẫn dán vào website demxanh.com:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li><strong>Cách 1 (Nhanh nhất qua GTM):</strong> Mở Google Tag Manager của demxanh.com &gt; Thêm thẻ <em>"HTML Tùy chỉnh"</em> &gt; Dán mã trên vào &gt; Kích hoạt <em>"All Pages"</em> &gt; Xuất bản.</li>
                <li><strong>Cách 2 (Qua mã nguồn Website):</strong> Dán dòng mã trên vào trước thẻ <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-800 border border-slate-200">&lt;/body&gt;</code> trong file <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-slate-200">footer.php</code> hoặc file layout dùng chung của website.</li>
                <li><strong>Cách 3 (Nếu dùng Wordpress):</strong> Cài plugin <em>"Insert Headers and Footers"</em> &gt; Dán đoạn mã vào mục <em>"Scripts in Footer"</em> &gt; Lưu lại.</li>
              </ul>
            </div>
          </div>

          {/* Method 2: Popout window link */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                Cách 2: Gắn Link/Nút "Mở Cửa Sổ Riêng" Trên Menu Website demxanh.com
              </span>
              <button
                onClick={() => copyToClipboard(popoutLinkCode, 'popout')}
                className="text-xs text-slate-700 font-semibold hover:text-emerald-800 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                {copiedPopout ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPopout ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Khi khách bấm vào nút hoặc link trên menu demxanh.com, trình duyệt sẽ bật riêng một cửa sổ tư vấn 460x720 chuyên nghiệp.
            </p>
            <pre className="bg-slate-900 text-slate-200 text-xs p-3 rounded-xl overflow-x-auto font-mono max-h-36">
              {popoutLinkCode}
            </pre>
          </div>

          {/* Method 3: iFrame */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                Cách 3: Nhúng Toàn Trang Vào Trang Con (Ví dụ: demxanh.com/tu-van-dem-ai)
              </span>
              <button
                onClick={() => copyToClipboard(iframeCode, 'iframe')}
                className="text-xs text-slate-700 font-semibold hover:text-emerald-800 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIframe ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 text-xs p-3 rounded-xl overflow-x-auto font-mono">
              {iframeCode}
            </pre>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6">
          <span>Hỗ trợ tích hợp kỹ thuật cho demxanh.com: 1800 1051</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
