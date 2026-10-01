import React, { useState } from 'react';
import { ProductItem } from '../data/products';
import { ShieldCheck, Gift, Star, ChevronRight, Check, PhoneCall, Sparkles, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onSelectProduct?: (product: ProductItem) => void;
  onAskAbout?: (product: ProductItem) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAskAbout,
  compact = false,
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-500/80 p-3 shadow-xs hover:shadow-md transition-all flex gap-3 group">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
          <img
            src={product.image || 'https://demxanh.com/media/product/120_10272_coolsilk_prime1.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://demxanh.com/media/product/120_10272_coolsilk_prime1.jpg';
            }}
          />
          <span className="absolute top-1 left-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            -{product.discountPercent}%
          </span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span>{product.brand}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{product.categoryName}</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 truncate mt-0.5" title={product.name}>
              {product.name}
            </h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-emerald-700 font-bold text-sm">
                {formatCurrency(product.salePrice)}
              </span>
              <span className="text-slate-400 line-through text-xs">
                {formatCurrency(product.originalPrice)}
              </span>
            </div>

            {product.gift && (
              <div className="mt-1 text-[10px] text-amber-800 bg-amber-50/90 border border-amber-200/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Gift className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                <span className="truncate">{product.gift}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
            {product.url ? (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded transition-colors"
                title="Xem sản phẩm trên website demxanh.com"
              >
                <span>Xem trên web</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewCount})
              </span>
            )}

            {onAskAbout && (
              <button
                onClick={() => onAskAbout(product)}
                className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                Tư vấn mẫu này <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Product Image & Badges */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={product.image || 'https://demxanh.com/media/product/120_10272_coolsilk_prime1.jpg'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://demxanh.com/media/product/120_10272_coolsilk_prime1.jpg';
          }}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
            GIẢM {product.discountPercent}%
          </span>
          <span className="bg-emerald-800/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
            {product.brand}
          </span>
        </div>
        <div className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-slate-300 text-[10px]">({product.reviewCount} đánh giá)</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {product.categoryName}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {product.warranty}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">
            "{product.tagline}"
          </p>

          {/* Key highlights */}
          <div className="mt-2.5 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700">
            <div className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Độ cứng:</strong> {product.firmness}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Thích hợp:</strong> {product.bestFor}</span>
            </div>
          </div>

          {/* Gift banner */}
          {product.gift && (
            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/70 p-2 rounded-lg">
              <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="font-medium">{product.gift}</span>
            </div>
          )}

          {/* Size picker */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
              <span>Chọn kích thước:</span>
              <span className="text-slate-500 text-[11px]">Độ dày: {product.thickness}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {product.sizes.map((s, idx) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`text-xs py-1 px-2 rounded-md border text-left transition-all cursor-pointer ${
                    selectedSizeIndex === idx
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="truncate">{s.size}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2.5">
            <div>
              <div className="text-xl font-bold text-rose-600">
                {formatCurrency(currentSize.price)}
              </div>
              <div className="text-xs text-slate-400 line-through">
                {formatCurrency(currentSize.originalPrice)}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Tiết kiệm {formatCurrency(currentSize.originalPrice - currentSize.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {onAskAbout && (
              <button
                onClick={() => onAskAbout(product)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:scale-98 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hỏi AI về mẫu này</span>
              </button>
            )}

            {onSelectProduct && (
              <button
                onClick={() => onSelectProduct(product)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Giữ ưu đãi ngay</span>
              </button>
            )}
          </div>

          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[11px] font-semibold rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xem chi tiết sản phẩm trên website demxanh.com</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
