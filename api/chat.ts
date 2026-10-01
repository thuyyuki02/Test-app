import { GoogleGenAI } from '@google/genai';
import { DEMXANH_PRODUCTS } from '../src/data/products.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Tin nhắn không hợp lệ' });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || '';

    // If GEMINI_API_KEY is available in Vercel environment
    if (process.env.GEMINI_API_KEY) {
      try {
        const productCatalogContext = DEMXANH_PRODUCTS.map(
          (p) =>
            `- [ID: ${p.id}] ${p.name} (${p.brand}) - Loại: ${p.category} - Giá ưu đãi: ${p.salePrice.toLocaleString('vi-VN')}đ (Gốc: ${p.originalPrice.toLocaleString('vi-VN')}đ, Giảm ${p.discountPercent}%) - Bảo hành: ${p.warranty} - Quà tặng: ${p.gift}. Tính năng: ${p.features.join('; ')}`
        ).join('\n');

        const systemInstruction = `Bạn là Chuyên gia Tư vấn Giấc Ngủ & Sức Khỏe Cột Sống cấp cao của Hệ thống Đệm Xanh (demxanh.com - Hotline miễn cước: 1800 1051 - Zalo: 0962 701 701).

PHONG CÁCH TƯ VẤN:
- Cực kỳ tận tâm, am hiểu sâu sắc, văn phong tiếng Việt tự nhiên, lịch sự (dạ, vâng, thưa Anh/Chị).
- Trả lời rõ ràng, dùng gạch đầu dòng, in đậm tên sản phẩm, giá bán và đặc điểm nổi bật để khách dễ đọc.

NGUYÊN TẮC TƯ VẤN Y KHOA & CÔNG THÁI HỌC:
1. Đau lưng, thoái hóa cột sống, thoát vị đĩa đệm, người già:
   - Nguyên tắc: Giữ cột sống luôn thẳng tự nhiên, tuyệt đối không nằm đệm lún làm võng hông và đè nặng lên đốt sống L4-L5.
   - Khuyên chọn: Đệm Bông Ép Sông Hồng (phẳng lì vững chắc) hoặc Đệm Cao Su Thiên Nhiên Kim Cương (đàn hồi nâng đỡ đa vùng).
2. Phòng cưới, vợ chồng trẻ:
   - Ưu tiên thẩm mỹ sang trọng, êm ái thư giãn, đặc biệt là lò xo túi độc lập (Dunlopillo CoolSilk) để khi một người trở mình không làm rung lắc người nằm cạnh.
3. Độ bền & Bảo hành:
   - Đệm bông ép bền 7-10 năm (bảo hành 5 năm).
   - Đệm cao su thiên nhiên & lò xo túi bền 15-20 năm (bảo hành 10-12 năm chính hãng).
4. Chính sách vượt trội của Đệm Xanh:
   - Cam kết chính hãng 100% (hoàn tiền gấp 2 nếu hàng giả).
   - Miễn phí vận chuyển và bê vác tận phòng ngủ tại Hà Nội & TP.HCM.
   - Nằm thử 30 ngày đổi mới nếu nằm không hợp.
   - Tặng Voucher 200k và combo quà tặng gối cao su + ga chống thấm.

DANH SÁCH SẢN PHẨM CHÍNH HÃNG TẠI ĐỆM XANH:
${productCatalogContext}

QUY TẮC ĐẶC BIỆT:
Ở dòng cuối cùng của câu trả lời, hãy đính kèm mã ID các sản phẩm phù hợp nhất theo định dạng:
[RECOMMENDED_PRODUCTS: id1, id2]`;

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
            systemInstruction,
            temperature: 0.7,
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

        const recommendedProducts = DEMXANH_PRODUCTS.filter((p) => recommendedIds.includes(p.id));

        return res.status(200).json({
          success: true,
          reply,
          recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : DEMXANH_PRODUCTS.slice(0, 2),
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed on Vercel:', geminiError?.message);
      }
    }

    // Smart fallback if GEMINI_API_KEY is not yet configured in Vercel
    const msg = userPrompt.toLowerCase();
    const bongEp = DEMXANH_PRODUCTS.find((p) => p.category === 'bong-ep') || DEMXANH_PRODUCTS[0];
    const caoSu = DEMXANH_PRODUCTS.find((p) => p.category === 'cao-su') || DEMXANH_PRODUCTS[1];
    const loXo = DEMXANH_PRODUCTS.find((p) => p.category === 'lo-xo') || DEMXANH_PRODUCTS[2];

    let reply = '';
    let recs = [bongEp, caoSu];

    if (msg.includes('đau lưng') || msg.includes('thoát vị') || msg.includes('cột sống') || msg.includes('người già')) {
      reply = `Dạ em chào Anh/Chị! Với tình trạng đau lưng hoặc thoái hóa cột sống, nguyên tắc số 1 là bề mặt đệm phải nâng đỡ vững chắc, giữ cột sống ở đường cong sinh lý tự nhiên, tuyệt đối không nằm đệm quá lún gây cong võng thắt lưng.\n\nĐệm Xanh khuyên Anh/Chị nên lựa chọn 2 dòng sản phẩm đạt chuẩn y khoa sau:\n1. **${bongEp.name}**: Công nghệ ép nhiệt tinh khiết bề mặt phẳng hoàn hảo, không lún xẹp, giá ưu đãi từ ${bongEp.salePrice.toLocaleString('vi-VN')}đ.\n2. **${caoSu.name}**: Cao su 100% thiên nhiên đàn hồi nâng đỡ đa vùng, giải phóng hoàn toàn áp lực đĩa đệm.\n\nAnh/Chị đang cần đệm cho giường kích thước nào (1m6x2m hay 1m8x2m) để em báo giá chính xác và giữ ưu đãi quà tặng gối cao su cho mình ạ?`;
      recs = [bongEp, caoSu];
    } else if (msg.includes('cưới') || msg.includes('vợ chồng') || msg.includes('phòng ngủ') || msg.includes('tân hôn')) {
      reply = `Dạ Đệm Xanh chúc mừng ngày trọng đại của Anh/Chị! Đệm phòng tân hôn cần tiêu chí: Sang trọng, êm ái thư giãn và đặc biệt là hệ thống lò xo túi độc lập không rung lắc khi trở mình.\n\nĐệm Xanh gợi ý 2 mẫu bán chạy nhất cho phòng cưới:\n1. **${loXo.name}**: Chuẩn khách sạn 5 sao, lớp cao su êm ái bề mặt cùng lò xo túi chống ồn tuyệt đối.\n2. **${caoSu.name}**: Bền bỉ 15-20 năm, thoáng khí 4 mùa.\n\nĐặc biệt đơn phòng cưới đang được tặng Voucher giảm thêm 200k + Bộ quà cưới gồm 2 gối tự nhiên và ga chống thấm cao cấp ạ!`;
      recs = [loXo, caoSu];
    } else {
      reply = `Dạ em chào Anh/Chị! Em là Chuyên gia Tư vấn của Hệ thống Đệm Xanh (demxanh.com).\n\nĐệm Xanh hiện có sẵn hơn 500+ mẫu đệm chính hãng chiết khấu tới 35%:\n- **Đệm bông ép**: Sông Hồng, Hanvico (Chống cong võng cột sống, giá từ 1.8 triệu)\n- **Đệm cao su thiên nhiên**: Kim Cương, Liên Á, Dunlopillo (Bền 15-20 năm, thoáng khí tối đa)\n- **Đệm lò xo túi cao cấp**: Dunlopillo CoolSilk (Êm ái chuẩn khách sạn 5 sao)\n- **Topper làm mềm & Chăn ga gối** các loại\n\nChính sách Đệm Xanh: Miễn phí giao tận phòng + Nằm thử 30 ngày tại nhà. Anh/Chị đang tìm đệm kích thước nào (1m6 hay 1m8) và dự kiến ngân sách ra sao để em gợi ý mẫu tốt nhất ạ?`;
      recs = DEMXANH_PRODUCTS.slice(0, 2);
    }

    return res.status(200).json({
      success: true,
      reply,
      recommendedProducts: recs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Lỗi server' });
  }
}
