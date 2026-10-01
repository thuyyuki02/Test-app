import { ProductItem, DEMXANH_PRODUCTS } from '../data/products';

export function generateClientConsultation(
  userMessage: string,
  products: ProductItem[] = DEMXANH_PRODUCTS
): { reply: string; recommendedProducts: ProductItem[] } {
  const msg = userMessage.toLowerCase();
  const currentProducts = products && products.length > 0 ? products : DEMXANH_PRODUCTS;

  // 1. Direct match for specific product consultation (e.g. user clicked "Tư vấn mẫu này")
  const specificProduct = currentProducts.find((p) => {
    const pName = p.name.toLowerCase();
    const pBrand = p.brand.toLowerCase();
    return (
      msg.includes(pName) ||
      (pName.length > 8 && msg.includes(pName.slice(0, 25))) ||
      (msg.includes(pBrand) && pName.split(' ').some((w) => w.length > 3 && msg.includes(w)))
    );
  });

  if (specificProduct) {
    const sizeRows =
      specificProduct.sizes && specificProduct.sizes.length > 0
        ? specificProduct.sizes
            .map(
              (s) =>
                `- **${s.size}**: ${s.price.toLocaleString('vi-VN')}đ (Giá gốc: ${s.originalPrice.toLocaleString('vi-VN')}đ)`
            )
            .join('\n')
        : `- **Kích thước tiêu chuẩn**: ${specificProduct.salePrice.toLocaleString('vi-VN')}đ`;

    const featuresList =
      specificProduct.features && specificProduct.features.length > 0
        ? specificProduct.features.map((f) => `- ${f}`).join('\n')
        : `- Đệm chính hãng ${specificProduct.brand}, phân phối tại Hệ thống Đệm Xanh`;

    return {
      reply:
        `Dạ em xin gửi tới Anh/Chị thông tin tư vấn chi tiết về mẫu **${specificProduct.name}**:\n\n` +
        `⭐ **Thương hiệu:** ${specificProduct.brand} (Cam kết chính hãng 100% tại Đệm Xanh)\n` +
        `💰 **Giá ưu đãi hôm nay:** **${specificProduct.salePrice.toLocaleString('vi-VN')}đ** (Giá gốc: ${specificProduct.originalPrice.toLocaleString('vi-VN')}đ - Tiết kiệm ${specificProduct.discountPercent}%)\n` +
        `💎 **Đặc điểm & Cấu tạo:**\n${featuresList}\n\n` +
        `📏 **Bảng giá theo kích thước:**\n${sizeRows}\n\n` +
        `🛡️ **Chế độ bảo hành:** ${specificProduct.warranty || 'Bảo hành chính hãng 5-10 năm'}.\n` +
        `🎁 **Khuyến mại đặc biệt:** ${specificProduct.gift || 'Tặng kèm bộ quà gối + Ga chống thấm'}.\n` +
        `🚚 **Vận chuyển:** Miễn phí giao hàng & lắp đặt tận phòng, hỗ trợ đổi trả 30 ngày.\n\n` +
        (specificProduct.url
          ? `🔗 **Link xem chi tiết sản phẩm trên website:** [Xem ngay trên demxanh.com](${specificProduct.url})\n\n`
          : '') +
        `Anh/Chị cần tư vấn kích thước 1m6 hay 1m8, hoặc muốn em giữ combo quà tặng ưu đãi này cho mình không ạ?`,
      recommendedProducts: [specificProduct],
    };
  }

  // Find products by category
  const bongEp = currentProducts.find((p) => p.category === 'bong-ep') || currentProducts[0];
  const caoSu = currentProducts.find((p) => p.category === 'cao-su') || currentProducts[1] || currentProducts[0];
  const loXo = currentProducts.find((p) => p.category === 'lo-xo') || currentProducts[2] || currentProducts[0];

  if (msg.includes('đau lưng') || msg.includes('thoát vị') || msg.includes('cột sống') || msg.includes('người già')) {
    return {
      reply: `Dạ em chào Anh/Chị! Với tình trạng đau lưng hoặc thoát vị đĩa đệm, tiêu chí quan trọng nhất là bề mặt đệm phải giữ cột sống ở trạng thái thẳng tự nhiên, tuyệt đối không chọn đệm quá mềm gây võng hông.\n\nĐệm Xanh khuyên Anh/Chị nên tham khảo 2 mẫu tối ưu sau:\n1. **${bongEp?.name}**: Bề mặt phẳng lì nâng đỡ tối đa đốt sống lưng, giá từ ${bongEp?.salePrice?.toLocaleString('vi-VN')}đ.\n2. **${caoSu?.name}**: Đàn hồi tự nhiên ôm sát cơ thể, giải phóng áp lực thắt lưng.\n\nAnh/Chị hiện dự định dùng kích thước giường nào (1m6x2m hay 1m8x2m) ạ?`,
      recommendedProducts: [bongEp, caoSu].filter(Boolean),
    };
  }

  if (msg.includes('cưới') || msg.includes('vợ chồng') || msg.includes('phòng ngủ') || msg.includes('tân hôn')) {
    return {
      reply: `Dạ Đệm Xanh chúc mừng ngày vui của Anh/Chị! Đệm phòng cưới cần sự êm ái, thẩm mỹ sang trọng và không gây rung lắc khi trở mình.\n\nĐệm Xanh có 2 lựa chọn hàng đầu:\n1. **${loXo?.name}**: Chuẩn khách sạn 5 sao, lò xo túi độc lập êm ái không làm phiền người bên cạnh.\n2. **${caoSu?.name}**: Siêu bền bỉ, êm ái trọn vẹn.\n\nĐang có ưu đãi tặng kèm gối cao su + ga bảo vệ đệm cho đơn phòng cưới nữa ạ!`,
      recommendedProducts: [loXo, caoSu].filter(Boolean),
    };
  }

  if (msg.includes('sông hồng') || msg.includes('song hong')) {
    const sh = currentProducts.find((p) => p.name.toLowerCase().includes('sông hồng')) || bongEp;
    return {
      reply: `Dạ Đệm bông ép Sông Hồng là dòng đệm quốc dân được ưa chuộng nhất tại Đệm Xanh nhờ lõi bông tinh khiết kháng khuẩn, không hóa chất keo dính, độ phẳng cao giúp cột sống luôn thẳng tự nhiên.\n\nTại Đệm Xanh, mẫu **${sh.name}** đang có chiết khấu ${sh.discountPercent}% giá chỉ từ ${sh.salePrice.toLocaleString('vi-VN')}đ (Bảo hành 5 năm chính hãng). Anh/Chị dự định dùng đệm dày 5cm, 7cm, 9cm hay 15cm ạ?`,
      recommendedProducts: [sh],
    };
  }

  if (msg.includes('dunlopillo')) {
    const dunlop = currentProducts.find((p) => p.brand.toLowerCase().includes('dunlopillo')) || loXo;
    return {
      reply: `Dạ thương hiệu Dunlopillo chuẩn Hoàng gia Anh quốc là dòng đệm cao cấp số 1 tại Đệm Xanh. Đệm kết hợp công nghệ lò xo túi độc lập không rung lắc và lớp cao su kháng khuẩn Talasilver kháng khuẩn 99.9%.\n\nHiện mẫu **${dunlop.name}** đang giảm tới ${dunlop.discountPercent}% chỉ còn ${dunlop.salePrice.toLocaleString('vi-VN')}đ, tặng kèm bộ ga gối lụa cao cấp và bảo hành 10 năm tận nhà ạ!`,
      recommendedProducts: [dunlop],
    };
  }

  if (msg.includes('kim cương') || msg.includes('kim cuong')) {
    const kc = currentProducts.find((p) => p.brand.toLowerCase().includes('kim cương')) || caoSu;
    return {
      reply: `Dạ đệm cao su Kim Cương (như dòng Happy Gold) được làm từ 100% mủ cao su thiên nhiên nguyên chất, cấu trúc hơn 5000 lỗ thoáng khí nhỏ và 500 lỗ thoáng khí lớn, nâng đỡ êm ái từng đường cong cơ thể.\n\nMẫu **${kc.name}** đang có giá cực tốt từ ${kc.salePrice.toLocaleString('vi-VN')}đ, tặng kèm 2 gối cao su thiên nhiên và bảo hành lên tới 12 năm ạ!`,
      recommendedProducts: [kc],
    };
  }

  if (msg.includes('giá') || msg.includes('bao nhiêu') || msg.includes('bảng giá') || msg.includes('tiền')) {
    return {
      reply: `Dạ tại Đệm Xanh đang có các phân khúc giá tốt nhất thị trường kèm ưu đãi giảm tới 35%:\n` +
        `- **Dưới 3 triệu**: Đệm bông ép sinh viên/gia đình (Olympia, Queensweet, Sông Hồng gấp 3) phẳng lưng bền bỉ.\n` +
        `- **Từ 3 - 7 triệu**: Đệm bông ép cao cấp Sông Hồng vỏ gấm, đệm Foam đa tầng êm ái.\n` +
        `- **Từ 7 - 15 triệu**: Đệm cao su thiên nhiên Kim Cương, Liên Á và Đệm lò xo túi Dunlopillo CoolSilk 5 sao.\n\n` +
        `Anh/Chị muốn đầu tư trong khoảng ngân sách bao nhiêu để em lọc ra 2 mẫu tối ưu nhất ạ?`,
      recommendedProducts: [bongEp, caoSu, loXo].filter(Boolean),
    };
  }

  if (msg.includes('showroom') || msg.includes('địa chỉ') || msg.includes('cửa hàng') || msg.includes('ở đâu')) {
    return {
      reply: `Dạ Hệ thống Đệm Xanh hiện có chuỗi showroom lớn tại các tỉnh thành:\n` +
        `📍 **Hà Nội:** Cầu Giấy (102 Cầu Giấy), Đống Đa (807 Giải Phóng), Thanh Xuân, Hai Bà Trưng, Long Biên.\n` +
        `📍 **TP. Hồ Chí Minh:** Quận 10 (454 Nguyễn Chí Thanh), Tân Bình, Gò Vấp.\n` +
        `📍 **Thái Bình & Ninh Bình** đều có showroom chính hãng.\n\n` +
        `Tất cả showroom đều có sẵn giường nằm thử miễn phí. Anh/Chị đang ở khu vực quận/huyện nào để em gửi địa chỉ showroom gần nhất kèm chỉ đường ạ?`,
      recommendedProducts: currentProducts.slice(0, 2),
    };
  }

  if (msg.includes('bảo hành') || msg.includes('đổi trả') || msg.includes('vận chuyển') || msg.includes('ship')) {
    return {
      reply: `Dạ chính sách mua hàng tại Đệm Xanh cực kỳ an tâm cho khách hàng:\n` +
        `1. **Cam kết 100% chính hãng**: Đền gấp 2 lần nếu phát hiện hàng giả, hàng nhái.\n` +
        `2. **Bảo hành dài hạn**: 5 - 12 năm tận nhà tùy dòng sản phẩm.\n` +
        `3. **Nằm thử 30 ngày**: Đổi mẫu miễn phí nếu nằm không quen hoặc không hợp lưng.\n` +
        `4. **Miễn phí vận chuyển**: Giao nhanh trong 2h tại Hà Nội & TP.HCM, hỗ trợ bưng bê lên tận phòng ngủ.\n\n` +
        `Anh/Chị cần giao về địa chỉ nào ạ?`,
      recommendedProducts: currentProducts.slice(0, 2),
    };
  }

  if (msg.includes('cứng') || msg.includes('mềm') || msg.includes('độ cứng')) {
    return {
      reply: `Dạ về độ cứng - mềm khi chọn đệm, Đệm Xanh xin chia sẻ kinh nghiệm chọn đệm chuẩn y khoa:\n\n` +
        `🔹 **Thích nằm vững chắc, phẳng lưng (Độ cứng 8-9/10):** Nên chọn **Đệm Bông Ép Sông Hồng**. Bề mặt phẳng lì tuyệt đối, không lún xẹp, rất tốt cho người quen nằm phản/chiếu hoặc hay bị mỏi lưng.\n` +
        `🔹 **Thích êm ái vừa phải, đàn hồi đa vùng (Độ cứng 6-7/10):** Chọn **Đệm Cao Su Thiên Nhiên Kim Cương** hoặc **Đệm Foam**. Ôm sát hõm lưng mà không bị võng hông.\n` +
        `🔹 **Thích êm ái bồng bềnh chuẩn khách sạn 5 sao (Độ cứng 5-6/10):** Chọn **Đệm Lò Xo Túi Dunlopillo CoolSilk**, bề mặt êm mềm thư giãn tối đa.\n\n` +
        `Trước giờ Anh/Chị quen nằm đệm cứng hay thích đệm có độ êm ái bồng bềnh hơn ạ?`,
      recommendedProducts: [bongEp, caoSu, loXo].filter(Boolean),
    };
  }

  if (msg.includes('nóng') || msg.includes('mát') || msg.includes('mùa hè') || msg.includes('bí lưng') || msg.includes('chiếu')) {
    return {
      reply: `Dạ nỗi lo đệm bị bí nóng lưng vào mùa hè là rất phổ biến! Tại Đệm Xanh, các dòng đệm mùa hè được thiết kế chuyên biệt:\n\n` +
        `❄️ **Đệm Bông Ép Sông Hồng:** Lõi bông tinh khiết thoáng khí tự nhiên, vải bọc gấm/cotton thấm hút mồ hôi cực tốt, trải chiếu trúc/chiếu điều hòa lên trên rất tiện.\n` +
        `❄️ **Đệm Cao Su Thiên Nhiên:** Cấu trúc hàng ngàn lỗ thông hơi tổ ong 2 mặt, không giữ nhiệt cơ thể.\n` +
        `❄️ **Chiếu Điều Hòa Misuko / Topper Làm Mát:** Đang giảm 40-50% tại Đệm Xanh, giúp hạ nhiệt độ bề mặt đệm từ 2-3°C ngay khi nằm!\n\n` +
        `Anh/Chị muốn mua đệm mới mát lưng hay tìm chiếu điều hòa/topper phủ lên đệm cũ ạ?`,
      recommendedProducts: [bongEp, caoSu].filter(Boolean),
    };
  }

  if (msg.includes('1m6') || msg.includes('1m8') || msg.includes('1m2') || msg.includes('2m') || msg.includes('kích thước') || msg.includes('m6') || msg.includes('m8')) {
    return {
      reply: `Dạ Đệm Xanh có sẵn đầy đủ tất cả kích thước chuẩn và nhận cắt đệm theo kích thước giường đặc biệt:\n\n` +
        `📏 **Kích thước đôi phổ biến nhất:**\n` +
        `- **1m6 x 2m**: Kích thước tiêu chuẩn cho 2 vợ chồng hoặc phòng ngủ hiện đại.\n` +
        `- **1m8 x 2m**: Rộng rãi, thoải mái nhất khi ngủ cùng con nhỏ.\n` +
        `- **2m x 2m2**: Cỡ đại King size sang trọng.\n` +
        `📏 **Kích thước đơn:** 1m x 1m9, 1m2 x 2m, 1m4 x 2m (dành cho giường tầng, phòng trọ, giường đơn sinh viên).\n\n` +
        `Giường của Anh/Chị có lọt lòng kích thước bao nhiêu và cần đệm dày mấy phân (7cm, 9cm hay 15cm) để em báo giá tốt nhất kèm quà tặng ạ?`,
      recommendedProducts: [bongEp, loXo, caoSu].filter(Boolean),
    };
  }

  if (msg.includes('trẻ') || msg.includes('bé') || msg.includes('em bé') || msg.includes('sơ sinh') || msg.includes('con')) {
    return {
      reply: `Dạ với trẻ nhỏ và thanh thiếu niên đang trong độ tuổi phát triển xương, việc chọn đệm đúng chuẩn là tối quan trọng:\n\n` +
        `✅ **Khuyên dùng:** Đệm có độ phẳng vững chắc như **Đệm Bông Ép Sông Hồng Tinh Khiết** hoặc **Đệm Cao Su Thiên Nhiên kháng khuẩn**. Bề mặt phẳng giúp định hình khung xương sống của bé thẳng tắp, không bị gù hay cong vẹo cột sống.\n` +
        `❌ **Nên tránh:** Tuyệt đối không cho trẻ nằm đệm mút lún hoặc đệm quá mềm vì xương sống của bé còn non, rất dễ bị biến dạng khi nằm lâu.\n\n` +
        `Bé nhà mình hiện mấy tuổi và nằm giường riêng hay nằm chung với bố mẹ ạ?`,
      recommendedProducts: [bongEp, caoSu].filter(Boolean),
    };
  }

  if (msg.includes('khuyến mại') || msg.includes('giảm giá') || msg.includes('voucher') || msg.includes('quà') || msg.includes('ưu đãi')) {
    return {
      reply: `Dạ Đệm Xanh đang có chương trình **"Đại Tiệc Giấc Ngủ Vàng - Tri Ân Khách Hàng"** cực lớn hôm nay:\n\n` +
        `🎉 **Chiết khấu trực tiếp:** Giảm từ **20% đến 40%** theo giá niêm yết nhà máy.\n` +
        `🎁 **Quà tặng đính kèm:** Tặng bộ 02 gối cao cấp + 01 Ga chống thấm bảo vệ đệm (hoặc chăn hè thu Tencel).\n` +
        `🎫 **Voucher độc quyền Online:** Giảm thêm ngay **200.000đ** cho khách đặt qua Chat AI!\n` +
        `🚚 **Freeship 100%:** Giao hàng và bê vác tận phòng ngủ tại Hà Nội & TP.HCM.\n\n` +
        `Anh/Chị muốn nhận mã Voucher 200k áp dụng cho dòng đệm nào để em giữ suất ưu đãi cho mình ạ?`,
      recommendedProducts: [bongEp, loXo, caoSu].filter(Boolean),
    };
  }

  return {
    reply: `Dạ em chào Anh/Chị! Em là Trợ lý AI của Hệ thống Đệm Xanh (demxanh.com).\n\nĐệm Xanh hiện có đủ các dòng đệm chính hãng chiết khấu tới 35%:\n- **Đệm bông ép**: Sông Hồng, Hanvico (Phẳng lưng, ngừa đau mỏi)\n- **Đệm cao su thiên nhiên**: Kim Cương, Dunlopillo (Bền 15-20 năm, êm ái thoáng khí)\n- **Đệm lò xo túi**: Dunlopillo CoolSilk (Chuẩn khách sạn 5 sao, không rung lắc)\n- **Chăn đông, ga gối & Topper** làm mềm đệm cũ\n\nAnh/Chị đang tìm đệm kích thước bao nhiêu (1m6 hay 1m8) và mức ngân sách dự kiến ra sao để em gợi ý mẫu phù hợp nhất ạ?`,
    recommendedProducts: currentProducts.slice(0, 3),
  };
}
