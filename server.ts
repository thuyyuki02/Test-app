import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DEMXANH_PRODUCTS, DEMXANH_SHOWROOMS } from './src/data/products.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface TrainingDoc {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  content: string;
}

export interface AISettingsConfig {
  botName: string;
  botSubtitle: string;
  botAvatarUrl: string;
  primaryColor: string;
  welcomeMessage: string;
  teaserMessage: string;
  bubblePosition: 'bottom-right' | 'bottom-left';
  hotline: string;
  zalo: string;
  tone: 'friendly_sales' | 'orthopedic_expert' | 'direct_closing' | 'gentle_caring';
  temperature: number;
  customInstruction: string;
  showProductCards: boolean;
  enableVoucher: boolean;
  documents: TrainingDoc[];
}

// In-memory store for AI settings & uploaded documents
let currentSettings: AISettingsConfig = {
  botName: 'Chuyên Viên Đệm Xanh AI',
  botSubtitle: 'demxanh.com • Tư vấn 24/7',
  botAvatarUrl: '',
  primaryColor: '#008848',
  welcomeMessage: `Dạ em chào Anh/Chị! Em là **Trợ lý AI Tư vấn Bán hàng của Đệm Xanh (demxanh.com)** 🌿.\n\nĐệm Xanh đang có chương trình **Giảm giá tới 35% + Tặng Voucher 200k & Bộ quà ga gối**:\n- **Đệm bông ép** (Sông Hồng, Hanvico) - Nâng đỡ thẳng cột sống, giá từ 1.8M\n- **Đệm cao su thiên nhiên** (Kim Cương, Liên Á) - Êm ái, siêu bền 15-20 năm\n- **Đệm lò xo túi độc lập** (Dunlopillo Anh Quốc) - Chuẩn khách sạn 5 sao, không rung lắc khi trở mình\n- **Topper lông vũ & Đệm Foam Nhật**\n\nAnh/Chị đang tìm đệm cho phòng ngủ nào (giường 1m6 hay 1m8) và có quan tâm vấn đề đau lưng không ạ?`,
  teaserMessage: 'Dạ em chào Anh/Chị! Cần tư vấn đệm đau lưng hay đệm cưới nhắn em nhé! (Tặng Voucher 200K)',
  bubblePosition: 'bottom-right',
  hotline: '1800 1051',
  zalo: '0962 701 701',
  tone: 'friendly_sales',
  temperature: 0.7,
  customInstruction: `Ưu tiên khuyên khách chọn đệm phù hợp với sức khỏe cột sống. Nhấn mạnh chính sách 30 ngày nằm thử đổi trả và miễn phí vận chuyển nội thành Hà Nội, TP.HCM.`,
  showProductCards: true,
  enableVoucher: true,
  documents: [
    {
      id: 'doc-chinh-sach-demxanh-2026',
      name: 'Chính_Sách_Bảo_Hành_Vận_Chuyển_ĐệmXanh.txt',
      uploadedAt: '2026-10-01 08:00',
      size: '4.2 KB',
      content: `1. Cam kết chính hãng 100%: Hoàn tiền gấp 2 lần nếu phát hiện hàng giả, hàng nhái.\n2. Bảo hành: Bảo hành chính hãng từ 5 năm (Bông ép Sông Hồng, Hanvico) đến 12-15 năm (Cao su Kim Cương, Liên Á, Lò xo Dunlopillo).\n3. Nằm thử: Đổi mới miễn phí trong 30 ngày nếu không êm hoặc không vừa vặn kích thước.\n4. Miễn phí vận chuyển tận phòng: Áp dụng đơn từ 1.000.000đ tại nội thành Hà Nội & TP.HCM. Hỗ trợ bê vác lên tầng cao chung cư, nhà phố.`
    },
    {
      id: 'doc-cam-nang-dau-lung',
      name: 'Cam_Nang_Tu_Van_Khach_Dau_Lung_Thoat_Vi.txt',
      uploadedAt: '2026-10-01 08:30',
      size: '6.8 KB',
      content: `TÀI LIỆU CHUYÊN SÂU TƯ VẤN KHÁCH ĐAU LƯNG & THOÁT VỊ:\n- Nguyên tắc vàng: Giữ cho 3 đường cong sinh học cột sống (cổ, ngực, thắt lưng) luôn nằm trên một đường thẳng khi nằm nghiêng hoặc nằm ngửa.\n- TUYỆT ĐỐI KHÔNG tư vấn đệm mút xốp mềm hoặc lò xo liên kết rẻ tiền vì sẽ làm võng hông và đè nặng lên các đốt sống L4-L5, S1.\n- 2 lựa chọn khuyên dùng hàng đầu:\n  1) Đệm Bông Ép Sông Hồng Thế Hệ 3: Lõi tinh khiết lượn sóng đàn hồi vừa phải, bề mặt phẳng lì nâng đỡ tối đa.\n  2) Đệm Cao Su Thiên Nhiên Kim Cương Happy Gold 10cm: Ôm sát đường cong nhưng không lún xẹp, độ dẻo tự nhiên giúp giải phóng cơ bắp.`
    }
  ]
};

function buildSystemInstruction(settings: AISettingsConfig): string {
  let toneGuidance = '';
  switch (settings.tone) {
    case 'orthopedic_expert':
      toneGuidance = 'Phong cách: Chuyên gia Cơ Xương Khớp & Giấc Ngủ. Phân tích nguyên nhân đau lưng, tư thế nằm khoa học, giải thích tỉ mỉ góc độ nâng đỡ đốt sống.';
      break;
    case 'direct_closing':
      toneGuidance = 'Phong cách: Nhân viên Bán hàng Chuyên nghiệp, súc tích, đi thẳng vào ưu điểm sản phẩm, báo giá rõ ràng, thúc đẩy khách đặt hàng hoặc tới showroom nằm thử.';
      break;
    case 'gentle_caring':
      toneGuidance = 'Phong cách: Ân cần, chăm sóc như người thân trong gia đình, lắng nghe tâm sự về giấc ngủ, tư vấn dịu dàng chu đáo.';
      break;
    case 'friendly_sales':
    default:
      toneGuidance = 'Phong cách: Thân thiện, niềm nở, chu đáo, nhiệt tình chuẩn dịch vụ khách hàng 5 sao Đệm Xanh.';
      break;
  }

  let docsContext = '';
  if (settings.documents && settings.documents.length > 0) {
    docsContext = `\n\n=== TÀI LIỆU ĐÀO TẠO & KIẾN THỨC CỬA HÀNG ĐÃ NẠP (ƯU TIÊN TUÂN THỦ CAO NHẤT) ===\n` +
      settings.documents.map((d, idx) => `[Tài liệu ${idx + 1}: ${d.name}]\n${d.content}`).join('\n\n');
  }

  const catalogSummary = currentProducts.slice(0, 30).map(p =>
    `- ID: "${p.id}" | ${p.name} (${p.brand}) | Giá bán: ${p.salePrice.toLocaleString('vi-VN')}đ (Giá gốc: ${p.originalPrice.toLocaleString('vi-VN')}đ, Giảm: ${p.discountPercent}%) | Quà tặng: ${p.gift || 'Tặng gối cao cấp + Freeship'} | Link xem: ${p.url || 'https://demxanh.com'}`
  ).join('\n');

  return `
Bạn là ${settings.botName} - Trợ lý AI Bán hàng của Hệ thống Siêu thị Đệm Xanh (website: https://demxanh.com/ - Hotline: ${settings.hotline} - Zalo: ${settings.zalo}).
${toneGuidance}

Hướng dẫn riêng của người quản trị:
${settings.customInstruction || 'Tư vấn nhiệt tình, đúng sự thật, bảo vệ sức khỏe giấc ngủ khách hàng.'}

Kiến thức thương hiệu & quyền lợi khách hàng:
- Cam kết 100% hàng chính hãng, kích hoạt bảo hành chính hãng từ 5 đến 12 năm.
- Tặng combo quà tặng trị giá lên tới 1.500.000đ (gối cao su thiên nhiên, ga chống thấm).
- Miễn phí vận chuyển nội thành Hà Nội & TP.HCM, giao nhanh 2H.
- Showroom tại Hà Nội (Nguyễn Trãi, Cầu Giấy, Giải Phóng, Long Biên...), TP.HCM, Thái Bình, Ninh Bình.

DANH MỤC SẢN PHẨM THỰC TẾ ĐANG BÁN TẠI DEMXANH.COM (Hãy tư vấn dựa trên danh sách này):
${catalogSummary}

${docsContext}

Quy định về gợi ý sản phẩm:
${settings.showProductCards ? `Khi tư vấn hoặc gợi ý sản phẩm, ở CUỐI PHẢN HỒI hãy luôn gắn thẻ: [RECOMMENDED_PRODUCTS: id1, id2] sử dụng chính xác ID sản phẩm có trong danh sách trên (tối đa 2-3 sản phẩm) để hệ thống tự động hiển thị thẻ sản phẩm kèm ảnh thật và giá bán thật cho khách hàng.` : 'Không cần gắn thẻ sản phẩm.'}
`;
}

// Helper for local smart matching
function generateSmartFallback(userMessage: string, settings: AISettingsConfig): { reply: string; productIds: string[] } {
  const msg = userMessage.toLowerCase();
  
  // 1. Direct match for specific product consultation (e.g. user clicked "Tư vấn mẫu này")
  const specificProduct = currentProducts.find(p => {
    const pName = p.name.toLowerCase();
    const pBrand = p.brand.toLowerCase();
    return msg.includes(pName) ||
      (pName.length > 8 && msg.includes(pName.slice(0, 25))) ||
      (msg.includes(pBrand) && pName.split(' ').some(w => w.length > 3 && msg.includes(w)));
  });

  if (specificProduct) {
    const sizeRows = specificProduct.sizes && specificProduct.sizes.length > 0
      ? specificProduct.sizes.map(s => `- **${s.size}**: ${s.price.toLocaleString('vi-VN')}đ (Giá gốc: ${s.originalPrice.toLocaleString('vi-VN')}đ)`).join('\n')
      : `- **Kích thước tiêu chuẩn**: ${specificProduct.salePrice.toLocaleString('vi-VN')}đ`;

    const featuresList = specificProduct.features && specificProduct.features.length > 0
      ? specificProduct.features.map(f => `- ${f}`).join('\n')
      : `- Đệm chính hãng ${specificProduct.brand}, phân phối tại Hệ thống Đệm Xanh`;

    return {
      reply: `Dạ em xin gửi tới Anh/Chị thông tin tư vấn chi tiết về mẫu **${specificProduct.name}**:\n\n` +
        `⭐ **Thương hiệu:** ${specificProduct.brand} (Cam kết chính hãng 100% tại Đệm Xanh)\n` +
        `💰 **Giá ưu đãi hôm nay:** **${specificProduct.salePrice.toLocaleString('vi-VN')}đ** (Giá gốc: ${specificProduct.originalPrice.toLocaleString('vi-VN')}đ - Tiết kiệm ${specificProduct.discountPercent}%)\n` +
        `💎 **Đặc điểm & Cấu tạo:**\n${featuresList}\n\n` +
        `📏 **Bảng giá theo kích thước:**\n${sizeRows}\n\n` +
        `🛡️ **Chế độ bảo hành:** ${specificProduct.warranty || 'Bảo hành chính hãng 5-10 năm'}.\n` +
        `🎁 **Khuyến mại đặc biệt:** ${specificProduct.gift || 'Tặng kèm bộ quà gối + Ga chống thấm'}.\n` +
        `🚚 **Vận chuyển:** Miễn phí giao hàng & lắp đặt tận phòng, hỗ trợ đổi trả 30 ngày.\n\n` +
        (specificProduct.url ? `🔗 **Link xem chi tiết sản phẩm trên website:** [Xem ngay trên demxanh.com](${specificProduct.url})\n\n` : '') +
        `Anh/Chị cần tư vấn kích thước 1m6 hay 1m8, hoặc muốn em giữ combo quà tặng ưu đãi này cho mình không ạ?`,
      productIds: [specificProduct.id]
    };
  }

  // Find products from currentProducts
  const bongEp = currentProducts.find(p => p.category === 'bong-ep') || currentProducts[0];
  const caoSu = currentProducts.find(p => p.category === 'cao-su') || currentProducts[1] || currentProducts[0];
  const loXo = currentProducts.find(p => p.category === 'lo-xo') || currentProducts[2] || currentProducts[0];

  if (msg.includes('đau lưng') || msg.includes('thoát vị') || msg.includes('cột sống') || msg.includes('người già')) {
    return {
      reply: `Dạ em chào Anh/Chị! Với tình trạng đau lưng hoặc thoát vị đĩa đệm, tiêu chí quan trọng nhất là bề mặt đệm phải giữ cột sống ở trạng thái thẳng tự nhiên, tuyệt đối không chọn đệm quá mềm gây võng hông.\n\nĐệm Xanh khuyên Anh/Chị nên tham khảo 2 mẫu tối ưu sau:\n1. **${bongEp?.name}**: Bề mặt phẳng lì nâng đỡ tối đa đốt sống lưng, giá từ ${bongEp?.salePrice?.toLocaleString('vi-VN')}đ.\n2. **${caoSu?.name}**: Đàn hồi tự nhiên ôm sát cơ thể, giải phóng áp lực thắt lưng.\n\nAnh/Chị hiện dự định dùng kích thước giường nào (1m6x2m hay 1m8x2m) ạ?`,
      productIds: [bongEp?.id, caoSu?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('cưới') || msg.includes('vợ chồng') || msg.includes('phòng ngủ') || msg.includes('tân hôn')) {
    return {
      reply: `Dạ Đệm Xanh chúc mừng ngày vui của Anh/Chị! Đệm phòng cưới cần sự êm ái, thẩm mỹ sang trọng và không gây rung lắc khi trở mình.\n\nĐệm Xanh có 2 lựa chọn hàng đầu:\n1. **${loXo?.name}**: Chuẩn khách sạn 5 sao, lò xo túi độc lập êm ái không làm phiền người bên cạnh.\n2. **${caoSu?.name}**: Siêu bền bỉ, êm ái trọn vẹn.\n\nĐang có ưu đãi tặng kèm gối cao su + ga bảo vệ đệm cho đơn phòng cưới nữa ạ!`,
      productIds: [loXo?.id, caoSu?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('sông hồng') || msg.includes('song hong')) {
    const sh = currentProducts.find(p => p.name.toLowerCase().includes('sông hồng')) || bongEp;
    return {
      reply: `Dạ Đệm bông ép Sông Hồng là dòng đệm quốc dân bán chạy số 1 tại Đệm Xanh nhờ lõi bông tinh khiết kháng khuẩn không hóa chất, độ phẳng cao giữ cột sống thẳng tự nhiên.\n\nMẫu **${sh?.name}** đang giảm ${sh?.discountPercent}% chỉ từ ${sh?.salePrice?.toLocaleString('vi-VN')}đ (Bảo hành 5 năm chính hãng). Anh/Chị muốn dùng đệm độ dày 7cm, 9cm hay 15cm ạ?`,
      productIds: [sh?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('dunlopillo')) {
    const dunlop = currentProducts.find(p => p.brand.toLowerCase().includes('dunlopillo')) || loXo;
    return {
      reply: `Dạ thương hiệu Dunlopillo chuẩn Hoàng gia Anh là dòng đệm cao cấp số 1 tại Đệm Xanh với hệ thống lò xo túi độc lập cách ly rung động và cao su kháng khuẩn Talasilver 99.9%.\n\nHiện mẫu **${dunlop?.name}** đang giảm tới ${dunlop?.discountPercent}% chỉ còn ${dunlop?.salePrice?.toLocaleString('vi-VN')}đ, tặng kèm bộ ga gối lụa cao cấp và bảo hành 10 năm tận nhà ạ!`,
      productIds: [dunlop?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('kim cương') || msg.includes('kim cuong') || msg.includes('cao su')) {
    const kc = currentProducts.find(p => p.brand.toLowerCase().includes('kim cương')) || caoSu;
    return {
      reply: `Dạ đệm cao su thiên nhiên Kim Cương (như Happy Gold) làm từ 100% mủ cao su nguyên chất, cấu trúc hơn 5000 lỗ thoáng khí nâng đỡ trọn vẹn từng đường cong cơ thể, độ bền 15-20 năm.\n\nĐệm Xanh đang ưu đãi giảm 25% mẫu **${kc?.name}** chỉ từ ${kc?.salePrice?.toLocaleString('vi-VN')}đ, tặng kèm 2 gối cao su thiên nhiên và bảo hành 12 năm ạ!`,
      productIds: [kc?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('cứng') || msg.includes('mềm') || msg.includes('độ cứng')) {
    return {
      reply: `Dạ về độ cứng - mềm khi chọn đệm, Đệm Xanh xin chia sẻ kinh nghiệm chuẩn y khoa:\n\n` +
        `🔹 **Thích nằm vững chắc, phẳng lưng:** Chọn **Đệm Bông Ép Sông Hồng**. Bề mặt phẳng lì tuyệt đối, ngừa đau mỏi lưng rất tốt cho người lớn tuổi hoặc người quen nằm chiếu/phản.\n` +
        `🔹 **Thích êm ái vừa phải, đàn hồi ôm sát cơ thể:** Chọn **Đệm Cao Su Thiên Nhiên Kim Cương** hoặc **Đệm Foam**, ôm trọn hõm lưng không bị võng.\n` +
        `🔹 **Thích êm mềm bồng bềnh chuẩn khách sạn 5 sao:** Chọn **Đệm Lò Xo Túi Dunlopillo CoolSilk**.\n\n` +
        `Anh/Chị trước giờ quen nằm đệm phẳng cứng hay thích êm ái bồng bềnh hơn ạ?`,
      productIds: [bongEp?.id, caoSu?.id, loXo?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('nóng') || msg.includes('mát') || msg.includes('mùa hè') || msg.includes('bí lưng') || msg.includes('chiếu')) {
    return {
      reply: `Dạ các dòng đệm mùa hè tại Đệm Xanh luôn có cơ chế thoát nhiệt tối ưu:\n\n` +
        `❄️ **Đệm Bông Ép Sông Hồng:** Lõi bông tinh khiết thoáng khí tự nhiên, vải gấm/cotton thấm hút mồ hôi, trải chiếu điều hòa lên rất tiện.\n` +
        `❄️ **Đệm Cao Su Thiên Nhiên:** Cấu trúc hàng ngàn lỗ tổ ong thông khí 2 mặt, không gây tích nhiệt cơ thể.\n` +
        `❄️ **Chiếu Điều Hòa Misuko:** Đang giảm 40-50% tại Đệm Xanh, giúp hạ nhiệt độ bề mặt đệm từ 2-3°C ngay khi nằm!\n\n` +
        `Anh/Chị cần tìm đệm mát lưng hay tìm chiếu điều hòa trải lên đệm cũ ạ?`,
      productIds: [bongEp?.id, caoSu?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('1m6') || msg.includes('1m8') || msg.includes('1m2') || msg.includes('2m') || msg.includes('kích thước') || msg.includes('m6') || msg.includes('m8')) {
    return {
      reply: `Dạ Đệm Xanh có sẵn tất cả các kích thước chuẩn từ 1m2 đến 2m2:\n- **1m6 x 2m**: Kích thước tiêu chuẩn phổ biến nhất cho gia đình.\n- **1m8 x 2m**: Rộng rãi, thoải mái nhất cho 2 vợ chồng và bé nhỏ.\n- **2m x 2m2**: Cỡ đại King size sang trọng.\n- **1m2 x 2m**: Kích thước đơn cho bé hoặc giường đơn.\n\nGiường của Anh/Chị kích thước lọt lòng bao nhiêu và cần độ dày mấy phân (7cm, 9cm hay 15cm) để em báo giá tốt nhất kèm quà tặng ạ?`,
      productIds: [bongEp?.id, loXo?.id, caoSu?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('giá') || msg.includes('bao nhiêu') || msg.includes('bảng giá') || msg.includes('tiền')) {
    return {
      reply: `Dạ tại Đệm Xanh đang có các phân khúc giá tốt nhất thị trường kèm ưu đãi giảm tới 35%:\n` +
        `- **Dưới 3 triệu**: Đệm bông ép sinh viên/gia đình (Olympia, Queensweet, Sông Hồng gấp 3) phẳng lưng bền bỉ.\n` +
        `- **Từ 3 - 7 triệu**: Đệm bông ép cao cấp Sông Hồng vỏ gấm, đệm Foam đa tầng êm ái.\n` +
        `- **Từ 7 - 15 triệu**: Đệm cao su thiên nhiên Kim Cương, Liên Á và Đệm lò xo túi Dunlopillo CoolSilk 5 sao.\n\n` +
        `Anh/Chị muốn đầu tư trong khoảng ngân sách bao nhiêu để em lọc ra 2 mẫu tối ưu nhất ạ?`,
      productIds: [bongEp?.id, caoSu?.id, loXo?.id].filter(Boolean) as string[]
    };
  }

  if (msg.includes('showroom') || msg.includes('địa chỉ') || msg.includes('cửa hàng') || msg.includes('ở đâu')) {
    return {
      reply: `Dạ Hệ thống Đệm Xanh hiện có chuỗi showroom lớn tại các tỉnh thành:\n` +
        `📍 **Hà Nội:** Cầu Giấy (102 Cầu Giấy), Đống Đa (807 Giải Phóng), Thanh Xuân, Hai Bà Trưng, Long Biên.\n` +
        `📍 **TP. Hồ Chí Minh:** Quận 10 (454 Nguyễn Chí Thanh), Tân Bình, Gò Vấp.\n` +
        `📍 **Thái Bình & Ninh Bình** đều có showroom chính hãng.\n\n` +
        `Tất cả showroom đều có sẵn giường nằm thử miễn phí. Anh/Chị đang ở khu vực quận/huyện nào để em gửi địa chỉ showroom gần nhất kèm chỉ đường ạ?`,
      productIds: currentProducts.slice(0, 2).map(p => p.id)
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
      productIds: currentProducts.slice(0, 2).map(p => p.id)
    };
  }

  return {
    reply: `Dạ em chào Anh/Chị! Em là ${settings.botName} của Hệ thống Đệm Xanh (demxanh.com).\n\nĐệm Xanh hiện có đủ các dòng đệm chính hãng chiết khấu tới 35%:\n- **Đệm bông ép**: Sông Hồng, Hanvico (Phẳng lưng, ngừa đau mỏi)\n- **Đệm cao su thiên nhiên**: Kim Cương, Dunlopillo (Bền 15-20 năm, êm ái thoáng khí)\n- **Đệm lò xo túi**: Dunlopillo CoolSilk (Chuẩn khách sạn 5 sao, không rung lắc)\n- **Chăn đông, ga gối & Topper** làm mềm đệm cũ\n\nAnh/Chị đang tìm đệm kích thước bao nhiêu (1m6 hay 1m8) và mức ngân sách dự kiến ra sao để em gợi ý mẫu phù hợp nhất ạ?`,
    productIds: currentProducts.slice(0, 3).map(p => p.id)
  };
}

// Middleware to allow cross-origin embedding and API calls
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');
  res.removeHeader('X-Frame-Options'); // Allow embedding in iframe on demxanh.com
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Serve embeddable widget script for demxanh.com
app.get('/widget.js', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const fallbackAppUrl = process.env.APP_URL || `${protocol}://${host}`;

  const script = `
(function() {
  if (window.__DEMXANH_AI_LOADED__) return;
  window.__DEMXANH_AI_LOADED__ = true;

  console.log('[DemXanh AI Widget] Đang khởi tạo trợ lý Đệm Xanh...');

  // Auto-detect app origin from the loaded script tag
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('/widget.js') !== -1) return scripts[i];
    }
    return null;
  })();

  var appUrl = "${fallbackAppUrl}";
  if (currentScript && currentScript.src) {
    try {
      appUrl = new URL(currentScript.src).origin;
    } catch(e) {}
  }

  function init() {
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        setTimeout(init, 50);
      }
      return;
    }

    var isOpen = false;

    var container = document.createElement('div');
    container.id = 'demxanh-ai-widget-root';
    container.style.cssText = 'position:fixed !important;bottom:24px !important;right:24px !important;z-index:2147483647 !important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif !important;display:flex !important;flex-direction:column !important;align-items:flex-end !important;pointer-events:auto !important;';

    var iframe = document.createElement('iframe');
    iframe.src = appUrl + '?mode=widget';
    iframe.style.cssText = 'width:420px !important;height:640px !important;max-height:85vh !important;max-width:92vw !important;border:none !important;border-radius:24px !important;box-shadow:0 20px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,136,72,0.25) !important;display:none;margin-bottom:12px !important;background:#ffffff !important;overflow:hidden !important;';
    iframe.allow = 'clipboard-write';

    var bubble = document.createElement('div');
    bubble.style.cssText = 'display:flex !important;align-items:center !important;gap:10px !important;background:#008848 !important;color:#ffffff !important;padding:12px 18px !important;border-radius:50px !important;box-shadow:0 8px 24px rgba(0,136,72,0.38) !important;cursor:pointer !important;user-select:none !important;transition:transform 0.2s, background-color 0.2s !important;line-height:normal !important;box-sizing:border-box !important;';
    bubble.innerHTML = '<div style="position:relative;display:flex;align-items:center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span style="position:absolute;top:-2px;right:-2px;width:9px;height:9px;background:#fbbf24;border-radius:50%;border:2px solid #008848;"></span></div><div style="line-height:1.2;text-align:left;color:#ffffff;"><div style="font-size:13px;font-weight:700;color:#ffffff;">Tư vấn Đệm AI</div><div style="font-size:11px;opacity:0.88;color:#ffffff;">demxanh.com • 24/7</div></div>';

    bubble.onmouseenter = function() { bubble.style.transform = 'scale(1.04)'; };
    bubble.onmouseleave = function() { bubble.style.transform = 'scale(1)'; };

    function toggle() {
      isOpen = !isOpen;
      if (isOpen) {
        iframe.style.display = 'block';
        bubble.style.backgroundColor = '#1e293b';
        bubble.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span style="font-size:13px;font-weight:700;color:#ffffff;margin-left:6px;">Đóng chat</span>';
      } else {
        iframe.style.display = 'none';
        bubble.style.backgroundColor = '#008848';
        bubble.innerHTML = '<div style="position:relative;display:flex;align-items:center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span style="position:absolute;top:-2px;right:-2px;width:9px;height:9px;background:#fbbf24;border-radius:50%;border:2px solid #008848;"></span></div><div style="line-height:1.2;text-align:left;color:#ffffff;"><div style="font-size:13px;font-weight:700;color:#ffffff;">Tư vấn Đệm AI</div><div style="font-size:11px;opacity:0.88;color:#ffffff;">demxanh.com • 24/7</div></div>';
      }
    }

    bubble.onclick = toggle;

    window.addEventListener('message', function(e) {
      if (e.data === 'demxanh-close-widget') {
        if (isOpen) toggle();
      }
    });

    container.appendChild(iframe);
    container.appendChild(bubble);
    document.body.appendChild(container);
    console.log('[DemXanh AI Widget] Khởi tạo bong bóng chat thành công!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
  res.send(script);
});

// Admin security token
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'demxanh2026';
const ADMIN_TOKEN = 'dx-admin-secret-token-2026';

// Middleware to protect admin mutation endpoints
function requireAdmin(req: Request, res: Response, next: () => void) {
  const token = req.headers['x-admin-token'];
  if (token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Yêu cầu quyền Quản trị viên để thực hiện thao tác này.' });
  }
}

// API Routes

// 0. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN, message: 'Đăng nhập Quản trị viên thành công!' });
  } else {
    res.status(401).json({ success: false, message: 'Mật khẩu quản trị viên không chính xác. Vui lòng thử lại!' });
  }
});

// 1. Get current AI & widget settings (read-only for UI initial load)
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings: currentSettings });
});

// 2. Update AI & widget settings (Admin protected)
app.post('/api/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    currentSettings = {
      ...currentSettings,
      ...newSettings,
      // Ensure documents array is preserved if not explicitly overwritten
      documents: newSettings.documents !== undefined ? newSettings.documents : currentSettings.documents,
    };
    res.json({ success: true, settings: currentSettings, message: 'Đã lưu cấu hình AI thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Không thể lưu cài đặt' });
  }
});

// 3. Upload or add training document (Admin protected)
app.post('/api/settings/upload-doc', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, content, size } = req.body;
    if (!name || !content) {
      res.status(400).json({ success: false, error: 'Tên và nội dung tài liệu là bắt buộc' });
      return;
    }

    const newDoc: TrainingDoc = {
      id: `doc-${Date.now()}`,
      name,
      uploadedAt: new Date().toLocaleString('vi-VN'),
      size: size || `${(content.length / 1024).toFixed(1)} KB`,
      content,
    };

    currentSettings.documents.push(newDoc);
    res.json({ success: true, document: newDoc, totalDocs: currentSettings.documents.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lỗi tải tài liệu đào tạo' });
  }
});

// 4. Delete training document (Admin protected)
app.delete('/api/settings/doc/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  currentSettings.documents = currentSettings.documents.filter(d => d.id !== id);
  res.json({ success: true, totalDocs: currentSettings.documents.length });
});

// In-memory store for active products
let currentProducts = [...DEMXANH_PRODUCTS];

// Products & Showrooms
app.get('/api/products', (_req: Request, res: Response) => {
  res.json({ success: true, products: currentProducts });
});

// Live Sync Products directly from demxanh.com (RSS Feed & Site)
app.post('/api/products/sync-live', async (req: Request, res: Response) => {
  try {
    const feedUrl = req.body?.url || 'https://demxanh.com/product.rss';
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} khi tải dữ liệu từ ${feedUrl}`);
    }

    const xml = await response.text();
    const itemChunks = xml.split('<item>').slice(1);
    const syncedItems: any[] = [];
    const existingIds = new Set<string>();

    for (const chunk of itemChunks) {
      const title = (chunk.match(/<title>(.*?)<\/title>/)?.[1] || '').trim();
      const priceStr = (chunk.match(/<price>(.*?)<\/price>/)?.[1] || '').trim();
      const brand = (chunk.match(/<brand>(.*?)<\/brand>/)?.[1] || 'Đệm Xanh').trim();
      const link = (chunk.match(/<link>(.*?)<\/link>/)?.[1] || '').trim();
      let img = chunk.match(/<media:content url="(.*?)"/)?.[1] || '';
      if (img && !img.startsWith('http')) {
        img = 'https://demxanh.com' + (img.startsWith('/') ? '' : '/') + img;
      }
      if (!img) {
        img = 'https://demxanh.com/template/2021/images/favico.png';
      }

      const salePrice = parseInt(priceStr, 10) || 0;
      if (title && salePrice > 0) {
        const guidMatch = chunk.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1]?.trim();
        const linkSlug = link ? link.split('/').pop()?.replace('.html', '').replace(/[^a-z0-9-_]/gi, '') : '';
        const titleSlug = title.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const baseId = guidMatch ? `dx-guid-${guidMatch}` : (linkSlug ? `dx-${linkSlug}` : `dx-${titleSlug}`);
        let id = baseId;
        let counter = 1;
        while (existingIds.has(id)) {
          id = `${baseId}-${counter++}`;
        }
        existingIds.add(id);

        let category: 'bong-ep' | 'cao-su' | 'lo-xo' | 'foam' | 'topper-phu-kien' = 'topper-phu-kien';
        let categoryName = 'Topper & Phụ Kiện';
        const lower = title.toLowerCase();
        if (lower.includes('bông ép') || lower.includes('song hong') || lower.includes('sông hồng') || lower.includes('hanvico')) {
          category = 'bong-ep';
          categoryName = 'Đệm Bông Ép';
        } else if (lower.includes('cao su') || lower.includes('vạn thành') || lower.includes('kim cương') || lower.includes('liên á')) {
          category = 'cao-su';
          categoryName = 'Đệm Cao Su';
        } else if (lower.includes('lò xo') || lower.includes('dunlopillo') || lower.includes('kingkoil') || lower.includes('asling')) {
          category = 'lo-xo';
          categoryName = 'Đệm Lò Xo';
        } else if (lower.includes('foam') || lower.includes('inoac') || lower.includes('oyatsu')) {
          category = 'foam';
          categoryName = 'Đệm Foam';
        }

        // Ensure valid image URL from demxanh.com
        const hasValidExt = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(img);
        if (!hasValidExt || img.endsWith('_')) {
          if (category === 'lo-xo') {
            img = 'https://demxanh.com/media/product/120_10272_coolsilk_prime1.jpg';
          } else if (category === 'cao-su') {
            img = 'https://demxanh.com/media/product/120_10238_pure_1.jpg';
          } else if (category === 'bong-ep') {
            img = 'https://demxanh.com/media/product/120_10369_bm25302_5.jpg';
          } else {
            img = 'https://demxanh.com/media/product/120_10282_giuong_phu_khach_san_olympia_100x200_cao_60cm_khung_sat_dem_lo_xo_dung0.jpg';
          }
        }

        const originalPrice = Math.round(salePrice * 1.25);
        const discountPercent = 20;

        syncedItems.push({
          id,
          name: title,
          brand: brand || 'Đệm Xanh',
          category,
          categoryName,
          originalPrice,
          salePrice,
          discountPercent,
          rating: 4.9,
          reviewCount: Math.floor(Math.random() * 200) + 40,
          thickness: title.includes('cm') ? (title.match(/\d+cm/)?.[0] || '10-25cm') : '10-20cm',
          firmness: category === 'bong-ep' ? 'Cứng vừa (Firms)' : category === 'cao-su' ? 'Vừa vặn (Medium)' : 'Êm mềm (Soft)',
          warranty: category === 'cao-su' ? '12 năm' : category === 'lo-xo' ? '10 năm' : '5 năm',
          image: img,
          tagline: `Chính hãng ${brand} phân phối tại demxanh.com`,
          features: [
            `Sản phẩm chính hãng ${brand} bán tại Hệ thống Đệm Xanh`,
            `Giá niêm yết chuẩn trên website demxanh.com: ${salePrice.toLocaleString('vi-VN')}đ`,
            'Bảo hành chính hãng, miễn phí vận chuyển tận phòng'
          ],
          bestFor: 'Khách hàng mua sắm tại demxanh.com',
          gift: 'Tặng combo quà gối cao cấp + Miễn phí vận chuyển nội thành',
          url: link,
          sizes: [
            { size: '1m6 x 2m', price: salePrice, originalPrice },
            { size: '1m8 x 2m', price: Math.round(salePrice * 1.15), originalPrice: Math.round(originalPrice * 1.15) }
          ]
        });
      }
    }

    if (syncedItems.length > 0) {
      // Prioritize mattress products first
      const mattressItems = syncedItems.filter(p =>
        p.name.toLowerCase().includes('đệm') ||
        p.name.toLowerCase().includes('topper') ||
        p.name.toLowerCase().includes('nệm')
      );
      const otherItems = syncedItems.filter(p => !mattressItems.includes(p));
      const combined = [...mattressItems, ...otherItems];

      currentProducts = combined.slice(0, 60);

      // Create an automated training document with all synced products for AI knowledge!
      const productCatalogText = currentProducts.map(p =>
        `- [${p.brand}] ${p.name} | Giá bán: ${p.salePrice.toLocaleString('vi-VN')}đ (Giá gốc: ${p.originalPrice.toLocaleString('vi-VN')}đ) | Link: ${p.url || 'demxanh.com'}`
      ).join('\n');

      const existingDocIndex = currentSettings.documents.findIndex(d => d.id === 'doc-synced-demxanh-products');
      const syncedDoc: TrainingDoc = {
        id: 'doc-synced-demxanh-products',
        name: `Bang_Gia_SanPham_That_Tu_DemXanh_(${currentProducts.length}_sp).txt`,
        uploadedAt: new Date().toLocaleString('vi-VN'),
        size: `${(productCatalogText.length / 1024).toFixed(1)} KB`,
        content: `DANH SÁCH SẢN PHẨM & BẢNG GIÁ THỰC TẾ ĐỒNG BỘ TRỰC TIẾP TỪ WEBSITE DEMXANH.COM:\n\n${productCatalogText}`,
      };

      if (existingDocIndex >= 0) {
        currentSettings.documents[existingDocIndex] = syncedDoc;
      } else {
        currentSettings.documents.unshift(syncedDoc);
      }

      res.json({
        success: true,
        message: `Đã đồng bộ thành công ${currentProducts.length} sản phẩm thực tế từ website demxanh.com!`,
        total: currentProducts.length,
        products: currentProducts,
      });
      return;
    }

    res.status(400).json({ success: false, error: 'Không tìm thấy dữ liệu sản phẩm trong feed' });
  } catch (error: any) {
    console.error('Sync error:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi khi đồng bộ từ demxanh.com' });
  }
});

// Import Products from JSON / CSV
app.post('/api/products/import', requireAdmin, (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    if (Array.isArray(products) && products.length > 0) {
      currentProducts = products;
      res.json({ success: true, count: currentProducts.length, message: `Đã nhập thành công ${products.length} sản phẩm!` });
      return;
    }
    res.status(400).json({ success: false, error: 'Dữ liệu sản phẩm không hợp lệ' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lỗi khi nhập sản phẩm' });
  }
});

app.get('/api/showrooms', (_req: Request, res: Response) => {
  res.json({ success: true, showrooms: DEMXANH_SHOWROOMS });
});

// Chat endpoint with custom settings & training knowledge
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Tin nhắn không hợp lệ' });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || '';
    const dynamicSystemInstruction = buildSystemInstruction(currentSettings);

    if (process.env.GEMINI_API_KEY) {
      try {
        let validMessages = messages;
        while (validMessages.length > 0 && (validMessages[0].role === 'assistant' || validMessages[0].role === 'model')) {
          validMessages = validMessages.slice(1);
        }
        if (validMessages.length === 0) validMessages = messages;

        const contents = validMessages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: dynamicSystemInstruction,
            temperature: currentSettings.temperature || 0.7,
            topP: 0.95,
          },
        });

        const rawText = response.text || '';
        
        let reply = rawText;
        let recommendedIds: string[] = [];
        const match = rawText.match(/\[RECOMMENDED_PRODUCTS:\s*([a-zA-Z0-9-,\s]+)\]/);
        if (match) {
          recommendedIds = match[1].split(',').map((id: string) => id.trim()).filter(Boolean);
          reply = rawText.replace(/\[RECOMMENDED_PRODUCTS:\s*([a-zA-Z0-9-,\s]+)\]/, '').trim();
        }

        if (recommendedIds.length === 0 && currentSettings.showProductCards) {
          const fallback = generateSmartFallback(userPrompt, currentSettings);
          recommendedIds = fallback.productIds;
        }

        let matchedProducts = currentSettings.showProductCards
          ? currentProducts.filter(p => recommendedIds.includes(p.id))
          : [];

        if (matchedProducts.length === 0 && currentSettings.showProductCards) {
          matchedProducts = currentProducts.slice(0, 3);
        }

        const recommendedProducts = matchedProducts;

        res.json({
          success: true,
          reply,
          recommendedProducts,
          timestamp: new Date().toISOString(),
        });
        return;
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart engine with training docs:', geminiError);
      }
    }

    // Fallback response with training knowledge
    const fallback = generateSmartFallback(userPrompt, currentSettings);
    let matchedFallbackProducts = currentSettings.showProductCards
      ? currentProducts.filter(p => fallback.productIds.includes(p.id))
      : [];

    if (matchedFallbackProducts.length === 0 && currentSettings.showProductCards) {
      matchedFallbackProducts = currentProducts.slice(0, 2);
    }

    const recommendedProducts = matchedFallbackProducts;

    res.json({
      success: true,
      reply: fallback.reply,
      recommendedProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Có lỗi xảy ra trong quá trình xử lý yêu cầu. Vui lòng thử lại!',
    });
  }
});

// Lead capture
app.post('/api/lead', (req: Request, res: Response) => {
  const { name, phone, note, productId, showroom } = req.body;
  if (!phone) {
    res.status(400).json({ success: false, message: 'Vui lòng cung cấp số điện thoại' });
    return;
  }

  console.log(`[DemXanh Lead Captured] Khách hàng: ${name || 'Khách vãng lai'} - SĐT: ${phone} - SP: ${productId || 'Tư vấn chung'} - Showroom: ${showroom || 'Gần nhất'}`);
  
  res.json({
    success: true,
    message: 'Đăng ký tư vấn thành công! Chuyên viên Đệm Xanh sẽ liên hệ với Anh/Chị trong vòng 5 phút.',
    voucherCode: 'DEMXANH200K'
  });
});

// Start Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Đệm Xanh AI Consultant Server running on http://localhost:${PORT}`);
  });
}

startServer();
