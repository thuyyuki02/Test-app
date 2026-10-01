export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: 'bong-ep' | 'cao-su' | 'lo-xo' | 'foam' | 'topper-phu-kien';
  categoryName: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  thickness: string;
  sizes: { size: string; price: number; originalPrice: number }[];
  warranty: string;
  image: string;
  tagline: string;
  features: string[];
  bestFor: string;
  firmness: 'Cứng vừa (Firms)' | 'Vừa vặn (Medium)' | 'Êm mềm (Soft)';
  gift: string;
  url?: string;
}

export const DEMXANH_PRODUCTS: ProductItem[] = [
  {
    id: 'dx-dunlopillo-coolsilk-zen-prime-30cm',
    name: 'Đệm lò xo túi độc lập Dunlopillo CoolSilk ZEN Prime 30cm',
    brand: 'Dunlopillo',
    category: 'lo-xo',
    categoryName: 'Đệm Lò Xo',
    originalPrice: 21874000,
    salePrice: 17500000,
    discountPercent: 20,
    rating: 4.95,
    reviewCount: 312,
    thickness: '30cm',
    firmness: 'Vừa vặn (Medium)',
    warranty: '10 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10272_coolsilk_prime1.jpg',
    tagline: 'Công nghệ làm mát CoolSilk độc quyền Anh Quốc - Không rung lắc khi trở mình',
    features: [
      'Hệ thống lò xo túi độc lập IPS tổ ong nâng đỡ 5 vùng cơ thể hoàn hảo',
      'Vải bọc công nghệ CoolSilk sợi làm mát tức thì, thoát nhiệt đỉnh cao 4 mùa',
      'Lớp cao su thiên nhiên Talasilver kháng khuẩn Nano bạc bảo vệ sức khỏe',
      'Độ dày 30cm đẳng cấp chuẩn khách sạn 5 sao quốc tế'
    ],
    bestFor: 'Phòng cưới tân hôn, gia đình hiện đại, người cần sự êm ái cao cấp',
    gift: 'Tặng 02 gối cao su thiên nhiên + Ga bảo vệ đệm + Miễn phí ship tận giường',
    url: 'https://demxanh.com/dem-lo-xo-dunlopillo-coolsilk-zen-prime-30cm.html',
    sizes: [
      { size: '1m6 x 2m x 30cm', price: 17500000, originalPrice: 21874000 },
      { size: '1m8 x 2m x 30cm', price: 19800000, originalPrice: 24750000 },
      { size: '2m x 2m2 x 30cm', price: 23200000, originalPrice: 29000000 },
    ]
  },
  {
    id: 'dx-dunlopillo-coolsilk-zen-calm-27cm',
    name: 'Đệm lò xo túi độc lập Dunlopillo CoolSilk ZEN Calm 27cm',
    brand: 'Dunlopillo',
    category: 'lo-xo',
    categoryName: 'Đệm Lò Xo',
    originalPrice: 20124000,
    salePrice: 16100000,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 240,
    thickness: '27cm',
    firmness: 'Vừa vặn (Medium)',
    warranty: '10 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10273_coolsilk_calm33.jpg',
    tagline: 'Chuẩn công thái học nâng đỡ cột sống - Vải CoolSilk mát lạnh',
    features: [
      'Lò xo túi độc lập giúp người nằm cạnh trở mình không gây tiếng động',
      'Công nghệ giải phóng áp lực các điểm tỳ vai gáy và thắt lưng',
      'Thiết kế sang trọng tinh tế theo tiêu chuẩn châu Âu',
      'Vải dệt kim kháng khuẩn, chống nấm mốc tuyệt đối'
    ],
    bestFor: 'Vợ chồng trẻ, căn hộ chung cư, người thích đệm êm vừa không lún',
    gift: 'Tặng 02 gối định hình + 01 ga chống thấm cao cấp',
    url: 'https://demxanh.com/dem-lo-xo-dunlopillo-coolsilk-zen-calm-27cm.html',
    sizes: [
      { size: '1m6 x 2m x 27cm', price: 16100000, originalPrice: 20124000 },
      { size: '1m8 x 2m x 27cm', price: 18200000, originalPrice: 22750000 },
      { size: '2m x 2m2 x 27cm', price: 21500000, originalPrice: 26875000 },
    ]
  },
  {
    id: 'dx-dunlopillo-coolsilk-zen-air-25cm',
    name: 'Đệm lò xo túi độc lập Dunlopillo CoolSilk ZEN Air 25cm',
    brand: 'Dunlopillo',
    category: 'lo-xo',
    categoryName: 'Đệm Lò Xo',
    originalPrice: 18500000,
    salePrice: 14200000,
    discountPercent: 23,
    rating: 4.88,
    reviewCount: 185,
    thickness: '25cm',
    firmness: 'Cứng vừa (Firms)',
    warranty: '10 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10274_coolsilk_calm33.jpg',
    tagline: 'Độ dày 25cm tiêu chuẩn - Thoáng khí vượt trội, nâng đỡ tối ưu',
    features: [
      'Độ cao 25cm lý tưởng phù hợp hầu hết mọi loại giường ngủ gia đình',
      'Hệ thống lò xo túi cách ly dao động 100%',
      'Lớp lót xơ dừa tự nhiên tăng độ cứng vững và thông thoáng',
      'Bảo hành chính hãng 10 năm trên toàn hệ thống Đệm Xanh'
    ],
    bestFor: 'Gia đình, người hay đổ mồ hôi trộm khi ngủ, giường hạ thành',
    gift: 'Tặng bộ ga gối cotton cao cấp + Freeship tận phòng',
    url: 'https://demxanh.com/dem-lo-xo-tui-doc-lap-dunlopillo-coolsilk-zen-air-25cm.html',
    sizes: [
      { size: '1m6 x 2m x 25cm', price: 14200000, originalPrice: 18500000 },
      { size: '1m8 x 2m x 25cm', price: 16100000, originalPrice: 20900000 },
    ]
  },
  {
    id: 'dx-dunlopillo-latex-world-pure',
    name: 'Đệm Cao Su Dunlopillo Latex World Pure Dày 20cm',
    brand: 'Dunlopillo',
    category: 'cao-su',
    categoryName: 'Đệm Cao Su',
    originalPrice: 16170000,
    salePrice: 12938000,
    discountPercent: 20,
    rating: 4.96,
    reviewCount: 275,
    thickness: '20cm',
    firmness: 'Vừa vặn (Medium)',
    warranty: '12 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10238_pure_1.jpg',
    tagline: '100% Cao su thiên nhiên nhập khẩu nguyên khối - Trị liệu cột sống',
    features: [
      '100% cao su thiên nhiên Talasilver Latex công nghệ độc quyền',
      'Độ đàn hồi cơ học hoàn hảo, không biến dạng xẹp lún suốt 20 năm',
      'Hàng triệu lỗ thông hơi vi mô đối lưu không khí hai chiều liên tục',
      'Chứng chỉ an toàn quốc tế OEKO-TEX Standard 100 không kích ứng da'
    ],
    bestFor: 'Người bị thoái hóa đốt sống L4-L5, thoát vị đĩa đệm, đau mỏi thắt lưng',
    gift: 'Tặng 02 gối cao su thiên nhiên + Áo đệm cao cấp + Giảm thêm 200k khi chat',
    url: 'https://demxanh.com/thanh-ly-dem-cao-su-dunlopillo-latex-world-pure-120x200x20cm.html',
    sizes: [
      { size: '1m2 x 2m x 20cm', price: 12938000, originalPrice: 16170000 },
      { size: '1m6 x 2m x 20cm', price: 16800000, originalPrice: 21000000 },
      { size: '1m8 x 2m x 20cm', price: 19500000, originalPrice: 24375000 },
    ]
  },
  {
    id: 'dx-song-hong-tinh-khiet-the-he-moi',
    name: 'Đệm Bông Ép Sông Hồng Tinh Khiết Vỏ Gấm Thế Hệ Mới',
    brand: 'Sông Hồng',
    category: 'bong-ep',
    categoryName: 'Đệm Bông Ép',
    originalPrice: 3260000,
    salePrice: 2450000,
    discountPercent: 25,
    rating: 4.92,
    reviewCount: 520,
    thickness: '10cm / 15cm / 20cm',
    firmness: 'Cứng vừa (Firms)',
    warranty: '5 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10369_bm25302_5.jpg',
    tagline: 'Đệm quốc dân chính hãng Sông Hồng - Giữ thẳng cột sống, gập gọn tiện lợi',
    features: [
      'Công nghệ ép nhiệt lượn sóng tạo độ nẩy tự nhiên, không dùng keo dính hóa chất',
      'Lõi bông sợi trắng tinh khiết 100% kháng khuẩn tự nhiên',
      'Thiết kế gập 2 hoặc gập 3 cực kỳ tiện lợi khi vệ sinh nhà cửa',
      'Vỏ gấm chần bông cao cấp dập hoa văn sang trọng, tháo giặt dễ dàng'
    ],
    bestFor: 'Người đau lưng, người già, trẻ nhỏ đang phát triển xương và phòng ngủ tiết kiệm diện tích',
    gift: 'Tặng bộ ga chun cao cấp Sông Hồng + Miễn phí vận chuyển nội thành',
    url: 'https://demxanh.com/dem-bong-ep.html',
    sizes: [
      { size: '1m2 x 2m x 10cm', price: 2150000, originalPrice: 2850000 },
      { size: '1m6 x 2m x 10cm', price: 2450000, originalPrice: 3260000 },
      { size: '1m8 x 2m x 10cm', price: 2850000, originalPrice: 3800000 },
      { size: '2m x 2m2 x 10cm', price: 3450000, originalPrice: 4600000 },
    ]
  },
  {
    id: 'dx-chan-dong-song-hong-basic-cotton',
    name: 'Chăn Đông Sông Hồng Basic Cotton Chính Hãng',
    brand: 'Sông Hồng',
    category: 'topper-phu-kien',
    categoryName: 'Chăn Ga Gối',
    originalPrice: 1150000,
    salePrice: 910000,
    discountPercent: 21,
    rating: 4.9,
    reviewCount: 160,
    thickness: 'Dày dặn mùa đông',
    firmness: 'Êm mềm (Soft)',
    warranty: 'Đổi mới 30 ngày',
    image: 'https://demxanh.com/media/product/120_10368_bc26203_5.jpg',
    tagline: '100% Cotton tự nhiên thoáng mát - Giữ ấm sâu không bí bách',
    features: [
      'Vải cotton tự nhiên mềm mại, thấm hút mồ hôi tối đa',
      'Ruột bông siêu nhẹ giữ nhiệt tối ưu trong những đợt rét đại hàn',
      'Họa tiết hoa văn hiện đại, tinh tế cho phòng ngủ gia đình'
    ],
    bestFor: 'Mùa đông, quà tặng bố mẹ, tân gia, chuẩn chất lượng Sông Hồng',
    gift: 'Tặng túi đựng chăn chuyên dụng chống ẩm mốc',
    url: 'https://demxanh.com/chan-dong-song-hong-basic-cotton-bc26302.html',
    sizes: [
      { size: '2m x 2m2', price: 910000, originalPrice: 1150000 }
    ]
  },
  {
    id: 'dx-olympia-mediaid-pro',
    name: 'Đệm Y Tế Olympia Mediaid Pro Chống Loét Cột Sống',
    brand: 'Olympia',
    category: 'foam',
    categoryName: 'Đệm Foam & Y Tế',
    originalPrice: 950000,
    salePrice: 760000,
    discountPercent: 20,
    rating: 4.86,
    reviewCount: 140,
    thickness: '10cm',
    firmness: 'Cứng vừa (Firms)',
    warranty: '3 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10282_giuong_phu_khach_san_olympia_100x200_cao_60cm_khung_sat_dem_lo_xo_dung0.jpg',
    tagline: 'Chuyên dụng y tế & dưỡng bệnh - Nâng đỡ phân bổ áp lực cơ thể',
    features: [
      'Lõi mút nguyên khối đàn hồi cao cấp không lún xẹp',
      'Vỏ bọc simili chống thấm nước, dễ dàng lau chùi vệ sinh',
      'Chuyên dùng cho người bệnh, người cao tuổi cần nằm nghỉ dài ngày'
    ],
    bestFor: 'Người cao tuổi, phòng bệnh, chăm sóc sức khỏe',
    gift: 'Miễn phí giao hàng hỏa tốc',
    url: 'https://demxanh.com/dem-y-te-olympia-mediaid-pro-mut-thanh-ly.html',
    sizes: [
      { size: '1m x 2m x 10cm', price: 760000, originalPrice: 950000 },
      { size: '1m2 x 2m x 10cm', price: 920000, originalPrice: 1150000 }
    ]
  },
  {
    id: 'dx-dunlopillo-coolsilk-black-beaumont',
    name: 'Đệm Lò Xo Túi Dunlopillo CoolSilk Black Beaumont 38cm',
    brand: 'Dunlopillo',
    category: 'lo-xo',
    categoryName: 'Đệm Lò Xo',
    originalPrice: 135000000,
    salePrice: 108200000,
    discountPercent: 20,
    rating: 5.0,
    reviewCount: 42,
    thickness: '38cm',
    firmness: 'Êm mềm (Soft)',
    warranty: '15 năm chính hãng',
    image: 'https://demxanh.com/media/product/120_10281_coolsilk_black_beaumont1.jpg',
    tagline: 'Siêu phẩm đệm Hoàng Gia Anh Quốc - Đỉnh cao giấc ngủ thượng lưu',
    features: [
      'Hệ thống lò xo túi kép 2 tầng Double IPS cao cấp nhất thế giới',
      'Tích hợp lớp Pillow Top lông vũ & cao su thiên nhiên Talasilver Wave',
      'Vải dệt tơ tằm thượng hạng phủ tinh thể CoolSilk làm mát tức thì',
      'Được tin dùng trong các khách sạn Tổng thống và biệt thự xa hoa'
    ],
    bestFor: 'Biệt thự, phòng ngủ Master cao cấp, trải nghiệm giấc ngủ 7 sao',
    gift: 'Tặng trọn bộ chăn ga gối lụa tơ tằm trị giá 15.000.000đ',
    url: 'https://demxanh.com/dem-lo-xo-tui-doc-lap-dunlopillo-coolsilk-black-beaumont-38cm.html',
    sizes: [
      { size: '1m8 x 2m x 38cm', price: 108200000, originalPrice: 135000000 },
      { size: '2m x 2m2 x 38cm', price: 122000000, originalPrice: 152500000 }
    ]
  }
];

export const DEMXANH_SHOWROOMS = [
  {
    area: 'Showroom Thanh Xuân - Hà Nội',
    address: '113 Nguyễn Trãi, Thượng Đình, Thanh Xuân (Đối diện Royal City)',
    hotline: '0962 701 701',
    openTime: '8h00 - 21h30 (Mở cửa cả CN & Ngày Lễ)'
  },
  {
    area: 'Showroom Cầu Giấy - Hà Nội',
    address: '102 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội',
    hotline: '0981 212 212',
    openTime: '8h00 - 21h30'
  },
  {
    area: 'Showroom Hoàng Mai - Giải Phóng',
    address: '807 Giải Phóng, Giáp Bát, Hoàng Mai, Hà Nội',
    hotline: '0903 441 560',
    openTime: '8h00 - 21h30'
  },
  {
    area: 'Showroom Long Biên - Hà Nội',
    address: '566 Ngô Gia Tự, Đức Giang, Long Biên, Hà Nội',
    hotline: '0962 701 701',
    openTime: '8h00 - 21h30'
  },
  {
    area: 'Showroom Tân Bình - TP. Hồ Chí Minh',
    address: 'Số 466 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM',
    hotline: '0962 701 701',
    openTime: '8h00 - 21h30'
  },
  {
    area: 'Showroom Quận 7 - TP. Hồ Chí Minh',
    address: 'Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM',
    hotline: '0903 441 560',
    openTime: '8h00 - 21h30'
  },
  {
    area: 'Showroom Thái Bình',
    address: 'Trần Hưng Đạo, TP. Thái Bình',
    hotline: '0962 701 701',
    openTime: '8h00 - 21h00'
  },
  {
    area: 'Showroom Ninh Bình',
    address: 'Trần Hưng Đạo, TP. Ninh Bình',
    hotline: '0962 701 701',
    openTime: '8h00 - 21h00'
  }
];
