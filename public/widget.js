(function() {
  if (window.__DEMXANH_AI_LOADED__) return;
  window.__DEMXANH_AI_LOADED__ = true;

  console.log('[DemXanh AI Widget] Đang khởi tạo Trợ lý Đệm Xanh...');

  // Auto detect current script origin
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('/widget.js') !== -1) return scripts[i];
    }
    return null;
  })();

  var appUrl = currentScript && currentScript.src ? new URL(currentScript.src).origin : 'https://test-app-beryl-mu.vercel.app';

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
    container.style.cssText = 'position:fixed !important;bottom:20px !important;right:20px !important;z-index:9999999 !important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif !important;display:flex !important;flex-direction:column !important;align-items:flex-end !important;pointer-events:auto !important;';

    var iframe = document.createElement('iframe');
    iframe.src = appUrl + '/?mode=widget';
    iframe.style.cssText = 'width:420px !important;height:640px !important;max-height:85vh !important;max-width:calc(100vw - 32px) !important;border:none !important;border-radius:24px !important;box-shadow:0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,136,72,0.25) !important;display:none;margin-bottom:12px !important;background:#ffffff !important;overflow:hidden !important;';
    iframe.allow = 'clipboard-write';

    var bubble = document.createElement('div');
    bubble.style.cssText = 'display:flex !important;align-items:center !important;gap:10px !important;background:linear-gradient(135deg, #008848 0%, #006030 100%) !important;color:#ffffff !important;padding:11px 18px !important;border-radius:50px !important;box-shadow:0 8px 24px rgba(0,136,72,0.45) !important;cursor:pointer !important;user-select:none !important;transition:transform 0.25s, box-shadow 0.25s !important;line-height:normal !important;box-sizing:border-box !important;border:2px solid #ffffff !important;';
    bubble.innerHTML = '<div style="position:relative;width:32px;height:32px;background:rgba(255,255,255,0.22);border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span style="position:absolute;top:0;right:0;width:9px;height:9px;background:#fbbf24;border-radius:50%;border:2px solid #008848;"></span></div><div style="line-height:1.25;text-align:left;color:#ffffff;"><div style="font-size:13px;font-weight:700;color:#ffffff;">Tư vấn Đệm AI</div><div style="font-size:11px;opacity:0.9;color:#dcfce7;">Hỏi giá, mẫu đệm 24/7</div></div>';

    bubble.onmouseenter = function() { bubble.style.transform = 'scale(1.05)'; bubble.style.boxShadow = '0 10px 28px rgba(0,136,72,0.6)'; };
    bubble.onmouseleave = function() { bubble.style.transform = 'scale(1)'; bubble.style.boxShadow = '0 8px 24px rgba(0,136,72,0.45)'; };

    function toggle() {
      isOpen = !isOpen;
      if (isOpen) {
        iframe.style.display = 'block';
        bubble.style.background = '#1e293b';
        bubble.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span style="font-size:13px;font-weight:700;color:#ffffff;margin-left:6px;">Đóng chat</span>';
      } else {
        iframe.style.display = 'none';
        bubble.style.background = 'linear-gradient(135deg, #008848 0%, #006030 100%)';
        bubble.innerHTML = '<div style="position:relative;width:32px;height:32px;background:rgba(255,255,255,0.22);border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span style="position:absolute;top:0;right:0;width:9px;height:9px;background:#fbbf24;border-radius:50%;border:2px solid #008848;"></span></div><div style="line-height:1.25;text-align:left;color:#ffffff;"><div style="font-size:13px;font-weight:700;color:#ffffff;">Tư vấn Đệm AI</div><div style="font-size:11px;opacity:0.9;color:#dcfce7;">Hỏi giá, mẫu đệm 24/7</div></div>';
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
    console.log('[DemXanh AI Widget] Bong bóng chat đã hiển thị tại góc phải!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
