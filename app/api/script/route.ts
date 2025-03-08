import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get("siteId")

  if (!siteId) {
    return new NextResponse("Site ID is required", { status: 400 })
  }

  // 実際のアプリではここでサイトIDの検証やバナーデータの取得を行う
  const scriptContent = `
    (function() {
      // ポップアップバナーを表示するためのクライアントスクリプト
      const POPUP_MANAGER_API = "https://popup-manager.vercel.app/api";
      
      // バナーデータを取得
      async function fetchBannerData() {
        try {
          console.log("PopupManager: Fetching banner data for siteId ${siteId}");
          const response = await fetch(\`\${POPUP_MANAGER_API}/banners?siteId=${siteId}\`);
          if (!response.ok) {
            console.error('PopupManager: Failed to fetch banner data', response.status);
            throw new Error('Failed to fetch banner data');
          }
          const data = await response.json();
          console.log("PopupManager: Banner data received", data);
          return data;
        } catch (error) {
          console.error('PopupManager:', error);
          return null;
        }
      }
      
      // バナーを表示
      function showBanner(banner) {
        if (!banner) {
          console.error('PopupManager: No banner data to display');
          return;
        }
        
        console.log("PopupManager: Showing banner", banner);
        
        // バナー要素を作成
        const bannerEl = document.createElement('div');
        bannerEl.id = 'popup-manager-banner';
        bannerEl.style.position = 'fixed';
        bannerEl.style.zIndex = '9999';
        bannerEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        bannerEl.style.transition = 'all 0.3s ease';
        bannerEl.style.backgroundColor = '#fff';
        bannerEl.style.borderRadius = '4px';
        bannerEl.style.overflow = 'hidden';
        
        // 位置の設定
        switch(banner.position || 'center') {
          case 'center':
            bannerEl.style.top = '50%';
            bannerEl.style.left = '50%';
            bannerEl.style.transform = 'translate(-50%, -50%)';
            break;
          case 'top':
            bannerEl.style.top = '20px';
            bannerEl.style.left = '50%';
            bannerEl.style.transform = 'translateX(-50%)';
            break;
          case 'bottom':
            bannerEl.style.bottom = '20px';
            bannerEl.style.left = '50%';
            bannerEl.style.transform = 'translateX(-50%)';
            break;
          case 'top-left':
            bannerEl.style.top = '20px';
            bannerEl.style.left = '20px';
            break;
          case 'top-right':
            bannerEl.style.top = '20px';
            bannerEl.style.right = '20px';
            break;
          case 'bottom-left':
            bannerEl.style.bottom = '20px';
            bannerEl.style.left = '20px';
            break;
          case 'bottom-right':
            bannerEl.style.bottom = '20px';
            bannerEl.style.right = '20px';
            break;
        }
        
        // バナーコンテンツ
        bannerEl.innerHTML = \`
          <div style="position: relative;">
            <a href="\${banner.url}" target="_blank" rel="noopener noreferrer" style="display: block;">
              <img src="\${banner.imageUrl}" alt="\${banner.name}" style="display: block; max-width: 100%; height: auto; border-radius: 4px;" />
            </a>
            \${banner.showCloseButton ? \`
              <button style="position: absolute; top: -10px; right: -10px; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 1px solid #ddd; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                ×
              </button>
            \` : ''}
          </div>
        \`;
        
        // 閉じるボタンのイベント
        if (banner.showCloseButton) {
          const closeBtn = bannerEl.querySelector('button');
          closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.body.removeChild(bannerEl);
            
            // バナーを閉じたことを記録
            localStorage.setItem(\`popup-manager-closed-\${banner.id}\`, Date.now().toString());
          });
        }
        
        // バナーを表示
        document.body.appendChild(bannerEl);
        console.log("PopupManager: Banner added to DOM");
        
        // インプレッションを記録
        fetch(\`\${POPUP_MANAGER_API}/impression?bannerId=\${banner.id}\`, { method: 'POST' })
          .then(response => {
            if (!response.ok) {
              console.error('PopupManager: Failed to record impression');
            }
          })
          .catch(error => {
            console.error('PopupManager: Error recording impression', error);
          });
        
        // クリックイベントを追跡
        const bannerLink = bannerEl.querySelector('a');
        bannerLink.addEventListener('click', function() {
          fetch(\`\${POPUP_MANAGER_API}/click?bannerId=\${banner.id}\`, { method: 'POST' })
            .catch(error => {
              console.error('PopupManager: Error recording click', error);
            });
        });
      }
      
      // 表示ルールに基づいてバナーを表示
      function initBanner(banner) {
        if (!banner) {
          console.error('PopupManager: No banner data to initialize');
          return;
        }
        
        console.log("PopupManager: Initializing banner with rule:", banner.displayRule);
        
        // 既に閉じられたバナーかチェック
        const closedTime = localStorage.getItem(\`popup-manager-closed-\${banner.id}\`);
        if (closedTime) {
          // 24時間以内に閉じられた場合は表示しない
          const hoursSinceClosed = (Date.now() - parseInt(closedTime)) / (1000 * 60 * 60);
          if (hoursSinceClosed < 24) {
            console.log("PopupManager: Banner was closed recently, not showing");
            return;
          }
        }
        
        // モバイルチェック
        if (!banner.showOnMobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          console.log("PopupManager: Not showing on mobile as per settings");
          return;
        }
        
        // 表示ルールに基づいて表示
        switch(banner.displayRule) {
          case 'immediate':
            console.log("PopupManager: Showing banner immediately");
            showBanner(banner);
            break;
          case 'delay-5s':
            console.log("PopupManager: Will show banner after 5 seconds");
            setTimeout(() => showBanner(banner), 5000);
            break;
          case 'delay-10s':
            console.log("PopupManager: Will show banner after 10 seconds");
            setTimeout(() => showBanner(banner), 10000);
            break;
          case 'scroll-50':
            // 50%スクロールしたときに表示
            console.log("PopupManager: Will show banner at 50% scroll");
            let scrollShown = false;
            window.addEventListener('scroll', function() {
              if (scrollShown) return;
              const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
              if (scrollPercent >= 50) {
                console.log("PopupManager: 50% scroll detected, showing banner");
                showBanner(banner);
                scrollShown = true;
              }
            });
            break;
          case 'exit-intent':
            // 離脱意図を検出したときに表示
            console.log("PopupManager: Will show banner on exit intent");
            let shown = false;
            document.addEventListener('mouseleave', function(e) {
              if (shown || e.clientY > 0) return;
              console.log("PopupManager: Exit intent detected, showing banner");
              showBanner(banner);
              shown = true;
            });
            break;
          default:
            console.log("PopupManager: Unknown display rule, showing immediately");
            showBanner(banner);
        }
      }
      
      // メイン処理
      async function init() {
        console.log("PopupManager: Initializing for siteId ${siteId}");
        const banner = await fetchBannerData();
        if (banner) {
          initBanner(banner);
        } else {
          console.error("PopupManager: No banner data available");
        }
      }
      
      // DOMが読み込まれたら実行
      if (document.readyState === 'loading') {
        console.log("PopupManager: DOM still loading, waiting for DOMContentLoaded");
        document.addEventListener('DOMContentLoaded', init);
      } else {
        console.log("PopupManager: DOM already loaded, initializing now");
        init();
      }
    })();
  `

  return new NextResponse(scriptContent, {
    headers: {
      "Content-Type": "application/javascript",
    },
  })
}

