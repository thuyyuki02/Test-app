import React, { useState, useRef } from 'react';
import {
  X,
  Settings,
  Sparkles,
  Upload,
  FileText,
  Trash2,
  Check,
  RotateCcw,
  Palette,
  Sliders,
  BookOpen,
  Image,
  MessageSquare,
  Plus,
  Loader2,
  Eye,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Key,
  LogOut,
  ShoppingBag,
  RefreshCw,
  Download,
  ExternalLink,
  Database,
  Search,
} from 'lucide-react';
import { AISettingsConfig, TrainingDoc } from '../../server';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettingsConfig;
  onSaveSettings: (newSettings: AISettingsConfig, adminToken?: string) => Promise<void>;
  onResetSettings: () => void;
  onProductsUpdated?: () => void;
}

const PRESET_COLORS = [
  { name: 'Xanh Lá Đệm Xanh', hex: '#008848' },
  { name: 'Xanh Ngọc Emerald', hex: '#059669' },
  { name: 'Xanh Dương Đậm', hex: '#1D4ED8' },
  { name: 'Xanh Teal Hiện Đại', hex: '#0F766E' },
  { name: 'Đỏ Ruby Quý Phái', hex: '#BE123C' },
  { name: 'Tím Hoàng Gia', hex: '#6D28D9' },
  { name: 'Đen Sang Trọng', hex: '#0F172A' },
];

const PRESET_AVATARS = [
  { id: 'logo-dx', label: 'Logo Chữ ĐX', url: '' },
  {
    id: 'avatar-female',
    label: 'Chuyên Viên Nữ',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'avatar-male',
    label: 'Chuyên Viên Nam',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  },
];

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetSettings,
  onProductsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'tuning' | 'knowledge' | 'products' | 'preview'>('branding');
  const [formData, setFormData] = useState<AISettingsConfig>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin authentication state
  const [adminPassword, setAdminPassword] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('dx_admin_token') : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Document upload state
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  // Real Products Sync state
  const [productList, setProductList] = useState<any[]>([]);
  const [syncingProducts, setSyncingProducts] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [feedUrl, setFeedUrl] = useState('https://demxanh.com/product.rss');
  const [productSearch, setProductSearch] = useState('');
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const fetchProductList = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProductList(data.products);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchProductList();
    }
  }, [isOpen]);

  const handleSyncLive = async () => {
    setSyncingProducts(true);
    setSyncError(null);
    setSyncSuccessMsg(null);
    try {
      const res = await fetch('/api/products/sync-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: feedUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setProductList(data.products || []);
        setSyncSuccessMsg(data.message || `Đã đồng bộ ${data.total} sản phẩm từ website demxanh.com!`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('demxanh-products-synced', { detail: data.products }));
        }
        if (onProductsUpdated) onProductsUpdated();
      } else {
        setSyncError(data.error || 'Đồng bộ thất bại');
      }
    } catch (err: any) {
      setSyncError(err.message || 'Lỗi kết nối khi đồng bộ');
    } finally {
      setSyncingProducts(false);
    }
  };

  const handleProductFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        let imported: any[] = [];
        if (file.name.endsWith('.json')) {
          imported = JSON.parse(text);
        } else {
          // Simple CSV parser
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            const obj: any = {};
            headers.forEach((h, idx) => { obj[h] = cols[idx]; });
            if (obj.name) imported.push(obj);
          }
        }

        if (imported.length > 0) {
          const res = await fetch('/api/products/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-token': adminToken || '',
            },
            body: JSON.stringify({ products: imported }),
          });
          const resData = await res.json();
          if (resData.success) {
            setProductList(imported);
            setSyncSuccessMsg(`Đã nhập thành công ${imported.length} sản phẩm từ file!`);
            if (onProductsUpdated) onProductsUpdated();
          }
        }
      } catch (err: any) {
        setSyncError('Lỗi đọc file sản phẩm: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setLoginError('Vui lòng nhập mật khẩu quản trị');
      return;
    }
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword.trim() }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('dx_admin_token', data.token);
        setAdminPassword('');
      } else {
        setLoginError(data.message || 'Mật khẩu quản trị không chính xác.');
      }
    } catch {
      // Local fallback for dev
      if (adminPassword === 'demxanh2026') {
        const token = 'dx-admin-secret-token-2026';
        setAdminToken(token);
        sessionStorage.setItem('dx_admin_token', token);
      } else {
        setLoginError('Mật khẩu quản trị không đúng. Mật khẩu mặc định: demxanh2026');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('dx_admin_token');
    setAdminPassword('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveSettings(formData, adminToken || undefined);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const newDoc: TrainingDoc = {
          id: `doc-${Date.now()}`,
          name: file.name,
          uploadedAt: new Date().toLocaleString('vi-VN'),
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content,
        };
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, newDoc],
        }));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, botAvatarUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddManualDoc = () => {
    if (!newDocName.trim() || !newDocContent.trim()) return;
    const newDoc: TrainingDoc = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      uploadedAt: new Date().toLocaleString('vi-VN'),
      size: `${(newDocContent.length / 1024).toFixed(1)} KB`,
      content: newDocContent.trim(),
    };
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
    setNewDocName('');
    setNewDocContent('');
    setIsAddingDoc(false);
  };

  const handleDeleteDoc = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  };

  const handleLoadSampleDocs = () => {
    const samplePromotionDoc: TrainingDoc = {
      id: `doc-sample-${Date.now()}`,
      name: 'Khuyen_Mai_Xuan_He_2026_ĐệmXanh.txt',
      uploadedAt: new Date().toLocaleString('vi-VN'),
      size: '2.5 KB',
      content: `CHƯƠNG TRÌNH KHUYẾN MÃI THÁNG:\n- Mua đệm lò xo Dunlopillo Audrey giảm 25% + tặng 01 ga chống thấm cao cấp + 02 ruột gối bông hạt Micro.\n- Mua đệm cao su Kim Cương Happy Gold tặng 02 gối cao su thiên nhiên Kim Cương trị giá 1.100.000đ.\n- Tặng mã giảm thêm DEMXANH200K khi khách để lại số điện thoại hoặc đặt cọc giữ giá trong ngày hôm nay.`,
    };

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, samplePromotionDoc],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
              {adminToken ? (
                <Unlock className="w-5 h-5 text-amber-300" />
              ) : (
                <Lock className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg leading-tight">
                  Quản Trị & Đào Tạo AI (demxanh.com)
                </h3>
                {adminToken ? (
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-300" /> Đã xác thực
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
                    Khóa bảo mật Admin
                  </span>
                )}
              </div>
              <p className="text-emerald-100 text-xs">
                {adminToken
                  ? 'Tùy biến Logo, Màu sắc, Tông giọng, Thông số & Đào tạo tri thức sản phẩm'
                  : 'Chỉ dành riêng cho chủ shop & quản trị viên Đệm Xanh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                onClick={handleAdminLogout}
                title="Đăng xuất quyền quản trị"
                className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If NOT authenticated as admin, show login view */}
        {!adminToken ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center border-2 border-emerald-200 shadow-inner">
              <Lock className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-lg text-slate-900">
                Xác Thực Quyền Quản Trị Viên
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Khu vực cài đặt và nạp tài liệu đào tạo AI chỉ dành riêng cho chủ shop Đệm Xanh. Khách hàng thông thường không được phép chỉnh sửa.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full space-y-3 pt-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu quản trị viên..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>

              {loginError && (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200 text-left">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn || !adminPassword.trim()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Mở Khóa Bảng Quản Trị AI</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 pt-1">
                Mật khẩu mặc định hệ thống: <code className="bg-slate-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded font-bold">demxanh2026</code>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'branding'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/60'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>1. Nhận Diện & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('tuning')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tuning'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/60'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>2. Thông Số & Tông Giọng AI</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'knowledge'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/60'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>3. Đào Tạo AI (Tài Liệu Cửa Hàng)</span>
            {formData.documents.length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">
                {formData.documents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/60'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>4. Sản Phẩm & Đồng Bộ demxanh.com</span>
            {productList.length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {productList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white/60'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>5. Xem Trước Widget</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-slate-700 space-y-6">
          {/* TAB 1: BRANDING & WIDGET */}
          {activeTab === 'branding' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Tùy biến thương hiệu giúp khung chat hòa nhập hoàn hảo với phong cách website Đệm Xanh của bạn.
                  </span>
                </div>
              </div>

              {/* Bot Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Tên Hiển Thị Của AI
                  </label>
                  <input
                    type="text"
                    value={formData.botName}
                    onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                    placeholder="Ví dụ: Chuyên Viên Đệm Xanh AI"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Dòng Phụ Đề / Trạng Thái
                  </label>
                  <input
                    type="text"
                    value={formData.botSubtitle}
                    onChange={(e) => setFormData({ ...formData, botSubtitle: e.target.value })}
                    placeholder="Ví dụ: demxanh.com • Tư vấn 24/7"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">
                  Avatar / Logo Trợ Lý AI
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, botAvatarUrl: av.url })}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        formData.botAvatarUrl === av.url
                          ? 'border-emerald-600 bg-emerald-50 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {av.url ? (
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                          ĐX
                        </div>
                      )}
                      <span className="truncate">{av.label}</span>
                    </button>
                  ))}

                  {/* Upload custom image */}
                  <div>
                    <input
                      type="file"
                      ref={avatarUploadRef}
                      onChange={handleAvatarFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarUploadRef.current?.click()}
                      className="w-full h-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Tải ảnh logo lên</span>
                    </button>
                  </div>
                </div>

                {formData.botAvatarUrl && (
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Đang dùng ảnh tùy chỉnh:</span>
                    <img
                      src={formData.botAvatarUrl}
                      alt="Custom Avatar"
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, botAvatarUrl: '' })}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      Dùng lại logo mặc định
                    </button>
                  </div>
                )}
              </div>

              {/* Primary Color Palette */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">
                  Màu Sắc Thương Hiệu Chủ Đạo (Primary Color)
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, primaryColor: c.hex })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                        formData.primaryColor === c.hex
                          ? 'border-slate-800 ring-2 ring-emerald-500 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}

                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="text-slate-400">Mã HEX:</span>
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-20 px-2 py-1 text-xs border rounded-md font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Welcome Message & Teaser */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Lời Chào Mở Đầu Khi Khách Mở Khung Chat
                  </label>
                  <textarea
                    rows={3}
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Lời Nhắn Nổi Trên Bong Bóng Nhỏ (Teaser Tooltip)
                  </label>
                  <input
                    type="text"
                    value={formData.teaserMessage}
                    onChange={(e) => setFormData({ ...formData, teaserMessage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bubble Position & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Vị Trí Bong Bóng Trên Web
                  </label>
                  <select
                    value={formData.bubblePosition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bubblePosition: e.target.value as 'bottom-right' | 'bottom-left',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="bottom-right">Góc Dưới Cùng Bên Phải (Khuyên Dùng)</option>
                    <option value="bottom-left">Góc Dưới Cùng Bên Trái</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Hotline Miễn Cước
                  </label>
                  <input
                    type="text"
                    value={formData.hotline}
                    onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Hotline Zalo Tư Vấn
                  </label>
                  <input
                    type="text"
                    value={formData.zalo}
                    onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI TUNING & PARAMETERS */}
          {activeTab === 'tuning' && (
            <div className="space-y-5">
              {/* Tone of voice */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Tông Giọng & Phong Cách Bán Hàng Của AI
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'friendly_sales',
                      title: '🌿 Thân Thiện & Chu Đáo (Khuyên Dùng)',
                      desc: 'Xưng hô lễ phép Dạ/Em, lắng nghe nhu cầu, chào hỏi ấm áp chuẩn dịch vụ khách hàng 5 sao Đệm Xanh.',
                    },
                    {
                      id: 'orthopedic_expert',
                      title: '🩺 Chuyên Gia Cơ Xương Khớp & Giấc Ngủ',
                      desc: 'Phân tích khoa học về góc nâng đỡ cột sống L4-L5, tư thế nằm, giải thích tại sao đệm này tốt cho người đau lưng.',
                    },
                    {
                      id: 'direct_closing',
                      title: '⚡ Chốt Sale Nhanh & Súc Tích',
                      desc: 'Tập trung tính năng cốt lõi, giá khuyến mãi tốt nhất và thúc đẩy khách ghé showroom hoặc để lại SĐT giữ voucher.',
                    },
                    {
                      id: 'gentle_caring',
                      title: '❤️ Chăm Sóc Ân Cần Gia Đình',
                      desc: 'Tư vấn tỉ mỉ như người nhà chọn đệm cho bố mẹ, con nhỏ, phòng cưới với sự tận tình và chu đáo.',
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tone: t.id as AISettingsConfig['tone'],
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formData.tone === t.id
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900">{t.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature slider */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    Độ Sáng Tạo / Nhiệt Độ (Temperature):{' '}
                    <strong className="text-emerald-700">{formData.temperature}</strong>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formData.temperature < 0.4
                      ? 'Rất chính xác, bám sát tài liệu'
                      : formData.temperature <= 0.75
                      ? 'Tự nhiên, cân bằng hoàn hảo'
                      : 'Linh hoạt, nhiều cách diễn đạt'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Chỉ Dẫn Riêng Biệt Cho AI (System Prompt)
                </label>
                <p className="text-slate-500 text-[11px] mb-1.5">
                  Bạn có thể bổ sung các nguyên tắc riêng (ví dụ: luôn nhắc khách kích thước 1m8x2m là size chuẩn nhất, hoặc ưu tiên đệm cao su Kim Cương khi khách hỏi về đệm bền lâu).
                </p>
                <textarea
                  rows={4}
                  value={formData.customInstruction}
                  onChange={(e) =>
                    setFormData({ ...formData, customInstruction: e.target.value })
                  }
                  placeholder="Nhập hướng dẫn riêng cho AI..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={formData.showProductCards}
                    onChange={(e) =>
                      setFormData({ ...formData, showProductCards: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Hiển thị thẻ sản phẩm trong chat</div>
                    <div className="text-[11px] text-slate-500">
                      Tự động gợi ý thẻ sản phẩm kèm giá giảm và quà tặng
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={formData.enableVoucher}
                    onChange={(e) =>
                      setFormData({ ...formData, enableVoucher: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Kích hoạt tặng Voucher 200.000đ</div>
                    <div className="text-[11px] text-slate-500">
                      Cho phép khách hàng để lại SĐT để nhận mã giảm giá
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE BASE & TRAINING */}
          {activeTab === 'knowledge' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Bộ Não Tri Thức Đệm Xanh (Knowledge Base)</span>
                  </h4>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    Nạp tài liệu giúp AI trả lời chính xác 100% theo chính sách, giá cả và cẩm nang riêng của cửa hàng.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleDocs}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    + Nạp tài liệu khuyến mãi mẫu
                  </button>
                </div>
              </div>

              {/* Upload Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.json,.csv,.md,.doc"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-900 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Tải lên file tài liệu (.txt, .json, .csv, .md)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingDoc(!isAddingDoc)}
                  className="p-4 rounded-2xl border border-slate-300 hover:border-emerald-500 bg-white hover:bg-slate-50 text-slate-800 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>{isAddingDoc ? 'Hủy nhập tay' : 'Nhập văn bản tri thức trực tiếp'}</span>
                </button>
              </div>

              {/* Manual input form */}
              {isAddingDoc && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-white shadow-sm space-y-3 animate-in fade-in duration-200">
                  <div className="font-bold text-slate-900 text-sm">Thêm Văn Bản Tri Thức Mới</div>
                  <input
                    type="text"
                    placeholder="Tên tài liệu (Ví dụ: Bang_Gia_Khuyen_Mai_Thang_10.txt)"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                  <textarea
                    rows={4}
                    placeholder="Dán nội dung kiến thức, quy định giảm giá, chính sách đổi trả hoặc thông tin kỹ thuật đệm..."
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    className="w-full p-3 text-xs border border-slate-300 rounded-xl"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingDoc(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      disabled={!newDocName.trim() || !newDocContent.trim()}
                      onClick={handleAddManualDoc}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Lưu vào trí não AI
                    </button>
                  </div>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Tài Liệu Đang Được AI Học ({formData.documents.length}):</span>
                  <span className="text-[11px] text-emerald-700 font-normal">
                    AI sẽ tự động đọc các tài liệu này để phản hồi khách
                  </span>
                </div>

                {formData.documents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed text-slate-400">
                    Chưa có tài liệu đào tạo nào. Hãy tải lên file hoặc bấm nút nạp mẫu phía trên!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate text-xs">{doc.name}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>Dung lượng: {doc.size}</span>
                              <span>•</span>
                              <span>Tải lên: {doc.uploadedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã nạp vào AI
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Xóa tài liệu này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTS & LIVE SYNC FROM DEMXANH.COM */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              {/* Sync Header Alert */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Đồng Bộ Dữ Liệu Sản Phẩm Trực Tiếp Từ demxanh.com</span>
                  </h4>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    Hệ thống sẽ kết nối với website demxanh.com thật để lấy toàn bộ tên sản phẩm, giá bán, quà tặng và hình ảnh mới nhất.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={syncingProducts}
                  onClick={handleSyncLive}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${syncingProducts ? 'animate-spin' : ''}`} />
                  <span>{syncingProducts ? 'Đang tải dữ liệu...' : '⚡ Bấm Đồng Bộ Ngay'}</span>
                </button>
              </div>

              {/* Success / Error Alerts */}
              {syncSuccessMsg && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{syncSuccessMsg}</span>
                </div>
              )}

              {syncError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium">
                  {syncError}
                </div>
              )}

              {/* Feed URL Configuration & File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="block font-semibold text-slate-800 text-xs">
                    Đường dẫn nguồn cấp dữ liệu website (RSS Feed / Sitemap):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feedUrl}
                      onChange={(e) => setFeedUrl(e.target.value)}
                      placeholder="https://demxanh.com/product.rss"
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                    <button
                      type="button"
                      disabled={syncingProducts}
                      onClick={handleSyncLive}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl cursor-pointer"
                    >
                      Quét
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-800 text-xs">
                    Hoặc tải file sản phẩm (.json, .csv):
                  </label>
                  <input
                    type="file"
                    ref={productFileInputRef}
                    onChange={handleProductFileImport}
                    accept=".json,.csv"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="w-full px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nạp file Excel / CSV</span>
                  </button>
                </div>
              </div>

              {/* Products List & Search */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Danh Sách Sản Phẩm Đang Được AI Tư Vấn ({productList.length}):</span>
                    <span className="text-[11px] text-emerald-700 font-normal">
                      (AI tự động nắm rõ thông số & giá của các sản phẩm này)
                    </span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Lọc sản phẩm theo tên..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-96 overflow-y-auto shadow-2xs">
                  {productList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      Chưa có sản phẩm nào. Hãy bấm nút <strong>"⚡ Bấm Đồng Bộ Ngay"</strong> phía trên để tải toàn bộ sản phẩm thực tế từ demxanh.com!
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {productList
                        .filter(
                          (p) =>
                            !productSearch ||
                            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()))
                        )
                        .map((prod, pIdx) => (
                          <div
                            key={`${prod.id}-${pIdx}`}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={prod.image || 'https://demxanh.com/template/2021/images/favico.png'}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {prod.name}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                  <span className="bg-slate-100 px-2 py-0.2 rounded font-medium text-slate-700">
                                    {prod.brand || 'Đệm Xanh'}
                                  </span>
                                  <span>•</span>
                                  <span>{prod.categoryName || prod.category}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 text-right">
                              <div>
                                <div className="font-bold text-emerald-800 text-sm">
                                  {Number(prod.salePrice).toLocaleString('vi-VN')}đ
                                </div>
                                {prod.originalPrice > prod.salePrice && (
                                  <div className="text-[10px] text-slate-400 line-through">
                                    {Number(prod.originalPrice).toLocaleString('vi-VN')}đ
                                  </div>
                                )}
                              </div>

                              {prod.url && (
                                <a
                                  href={prod.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                  title="Xem trên website demxanh.com"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Xem Trước Giao Diện Thực Tế Của Bong Bóng & Khung Chat:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Bubble Preview */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500">1. Bong bóng nhỏ ở góc:</span>
                    <div className="p-6 bg-slate-200/50 rounded-2xl border border-slate-300 flex flex-col items-end justify-center min-h-[140px]">
                      {/* Teaser */}
                      <div className="bg-white rounded-2xl shadow-md border p-2.5 max-w-[240px] mb-2 text-[11px]">
                        <div className="font-bold text-slate-900">{formData.botName}</div>
                        <div className="text-slate-600 line-clamp-2 mt-0.5">{formData.teaserMessage}</div>
                      </div>

                      {/* Bubble */}
                      <div
                        className="px-4 py-2.5 rounded-full text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Tư vấn Đệm AI</span>
                      </div>
                    </div>
                  </div>

                  {/* Header preview */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500">2. Header khung chat:</span>
                    <div className="rounded-2xl overflow-hidden border shadow-lg">
                      <div
                        className="p-3 text-white flex items-center justify-between"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        <div className="flex items-center gap-2">
                          {formData.botAvatarUrl ? (
                            <img
                              src={formData.botAvatarUrl}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-white text-emerald-800 font-bold flex items-center justify-center text-xs">
                              ĐX
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-xs">{formData.botName}</div>
                            <div className="text-[10px] text-white/80">{formData.botSubtitle}</div>
                          </div>
                        </div>
                        <X className="w-4 h-4 text-white/80" />
                      </div>

                      <div className="p-3 bg-slate-50 text-[11px] text-slate-700 min-h-[90px]">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          {formData.welcomeMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn khôi phục về cài đặt mặc định của Đệm Xanh?')) {
                onResetSettings();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định Đệm Xanh</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Đã lưu cài đặt thành công!
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu Cài Đặt AI</span>
                </>
              )}
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};
