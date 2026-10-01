import React, { useState, useEffect } from 'react';
import {
  Filter,
  Check,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { DEMXANH_PRODUCTS, ProductItem } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductCatalogSidebarProps {
  onAskAboutProduct: (product: ProductItem) => void;
  onOpenLeadModal: (product?: ProductItem) => void;
}

export const ProductCatalogSidebar: React.FC<ProductCatalogSidebarProps> = ({
  onAskAboutProduct,
  onOpenLeadModal,
}) => {
  const [products, setProducts] = useState<ProductItem[]>(DEMXANH_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products) && d.products.length > 0) {
          setProducts(d.products);
        }
      })
      .catch((err) => console.warn('Sidebar could not fetch products:', err));

    const handleSynced = (e: any) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setProducts(e.detail);
      } else {
        fetch('/api/products')
          .then((r) => r.json())
          .then((d) => {
            if (d.success && Array.isArray(d.products)) {
              setProducts(d.products);
            }
          });
      }
    };

    window.addEventListener('demxanh-products-synced', handleSynced);
    return () => window.removeEventListener('demxanh-products-synced', handleSynced);
  }, []);

  const categories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'bong-ep', name: 'Đệm Bông Ép' },
    { id: 'cao-su', name: 'Đệm Cao Su' },
    { id: 'lo-xo', name: 'Đệm Lò Xo' },
    { id: 'foam', name: 'Đệm Foam' },
    { id: 'topper-phu-kien', name: 'Topper & Gối' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Sản Phẩm Đệm Xanh Bán Chạy</span>
          </h3>
          <p className="text-[11px] text-slate-500">Giá khuyến mại tốt nhất hôm nay</p>
        </div>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showComparison ? 'Ẩn so sánh' : 'So sánh 4 loại đệm'}</span>
        </button>
      </div>

      {/* Comparison Drawer / Accordion */}
      {showComparison && (
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 text-xs space-y-2.5">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Cẩm nang phân biệt 4 dòng đệm tại Đệm Xanh:</span>
          </div>
          <div className="space-y-1.5 text-slate-700">
            <div className="p-2 bg-white rounded-lg border border-emerald-200/60 shadow-2xs">
              <strong className="text-emerald-800">1. Đệm Bông Ép:</strong> Cứng phẳng, không lún, hợp người đau lưng, người già, trẻ nhỏ (giá 1.8M - 4.5M).
            </div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200/60 shadow-2xs">
              <strong className="text-emerald-800">2. Đệm Cao Su Tự Nhiên:</strong> Đàn hồi êm ái, bảo vệ cột sống, siêu bền 15-20 năm (giá 5.5M - 15M).
            </div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200/60 shadow-2xs">
              <strong className="text-emerald-800">3. Đệm Lò Xo Túi:</strong> Chuẩn khách sạn 5 sao, cao sang trọng, trở mình không rung (giá 5M - 18M).
            </div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200/60 shadow-2xs">
              <strong className="text-emerald-800">4. Đệm Foam & Topper:</strong> Êm ái, nhẹ nhàng, dễ cuộn gấp, giá tiết kiệm (giá 800k - 5M).
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
              selectedCategory === c.id
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredProducts.map((p, idx) => (
          <ProductCard
            key={`${p.id}-${idx}`}
            product={p}
            compact={true}
            onAskAbout={() => onAskAboutProduct(p)}
            onSelectProduct={() => onOpenLeadModal(p)}
          />
        ))}
      </div>

      {/* Trust Badges */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Bảo hành 5 - 12 năm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Miễn phí ship HN & HCM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Đổi trả 30 ngày linh hoạt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Quà tặng đến 1.5 triệu</span>
        </div>
      </div>
    </div>
  );
};
