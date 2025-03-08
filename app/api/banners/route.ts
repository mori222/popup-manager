import { NextResponse } from "next/server"

// ローカルストレージからバナーとサイトのデータを取得する関数
function getLocalData() {
  // サーバーサイドでの実行時はグローバルオブジェクトを使用
  if (typeof window === "undefined") {
    try {
      // ローカルストレージからデータを取得（サーバーサイドではファイルシステムやデータベースを使用する）
      const storedBanners = global.localStorage?.getItem("banners")
      const storedSites = global.localStorage?.getItem("sites")

      if (storedBanners && storedSites) {
        return {
          banners: JSON.parse(storedBanners),
          sites: JSON.parse(storedSites),
        }
      }
    } catch (error) {
      console.error("Error reading data:", error)
    }

    // 初期データを返す（実際のアプリではデータベースから取得）
    return {
      banners: [],
      sites: [],
    }
  }

  return {
    banners: [],
    sites: [],
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get("siteId")

  if (!siteId) {
    return NextResponse.json({ error: "Site ID is required" }, { status: 400 })
  }

  // モックデータを使用（実際のアプリではデータベースから取得）
  const mockBanner = {
    id: "banner-123",
    name: "春のセールバナー",
    imageUrl: "/placeholder.svg?height=300&width=600",
    url: "https://example.com/spring-sale",
    position: "center",
    displayRule: "immediate",
    showCloseButton: true,
    showOnMobile: true,
  }

  return NextResponse.json(mockBanner)
}

