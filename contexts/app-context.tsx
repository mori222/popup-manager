"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// バナーの型定義
export interface Banner {
  id: number
  name: string
  image: string
  url: string
  site: string
  siteId: number
  status: "active" | "inactive" | "scheduled"
  displayRule: string
  position: string
  showCloseButton: boolean
  showOnMobile: boolean
  impressions: number
  clicks: number
  ctr: number
  createdAt: string
}

// サイトの型定義
export interface Site {
  id: number
  name: string
  url: string
  description: string
  activeBanners: number
  totalBanners: number
  impressions: number
  clicks: number
  ctr: number
  status: "active" | "inactive"
  createdAt: string
}

// コンテキストの型定義
interface AppContextType {
  banners: Banner[]
  sites: Site[]
  addBanner: (banner: Omit<Banner, "id" | "impressions" | "clicks" | "ctr" | "createdAt">) => void
  updateBanner: (id: number, banner: Partial<Banner>) => void
  deleteBanner: (id: number) => void
  addSite: (
    site: Omit<Site, "id" | "activeBanners" | "totalBanners" | "impressions" | "clicks" | "ctr" | "createdAt">,
  ) => void
  updateSite: (id: number, site: Partial<Site>) => void
  deleteSite: (id: number) => void
  getBanner: (id: number) => Banner | undefined
  getSite: (id: number) => Site | undefined
  isLoading: boolean
}

// 初期モックデータ
const initialBanners: Banner[] = [
  {
    id: 1,
    name: "春のセールバナー",
    image: "/placeholder.svg?height=100&width=300",
    url: "https://example.com/spring-sale",
    site: "example.com",
    siteId: 1,
    status: "active",
    displayRule: "immediate",
    position: "center",
    showCloseButton: true,
    showOnMobile: true,
    impressions: 12543,
    clicks: 843,
    ctr: 6.72,
    createdAt: "2023-03-15",
  },
  {
    id: 2,
    name: "新商品告知",
    image: "/placeholder.svg?height=100&width=300",
    url: "https://example.com/new-products",
    site: "example.com",
    siteId: 1,
    status: "active",
    displayRule: "delay-5s",
    position: "top",
    showCloseButton: true,
    showOnMobile: true,
    impressions: 8921,
    clicks: 402,
    ctr: 4.51,
    createdAt: "2023-03-10",
  },
  {
    id: 3,
    name: "会員登録促進",
    image: "/placeholder.svg?height=100&width=300",
    url: "https://mysite.jp/register",
    site: "mysite.jp",
    siteId: 2,
    status: "inactive",
    displayRule: "scroll-50",
    position: "bottom",
    showCloseButton: true,
    showOnMobile: false,
    impressions: 3225,
    clicks: 0,
    ctr: 0,
    createdAt: "2023-02-28",
  },
  {
    id: 4,
    name: "夏のキャンペーン",
    image: "/placeholder.svg?height=100&width=300",
    url: "https://mysite.jp/summer-campaign",
    site: "mysite.jp",
    siteId: 2,
    status: "scheduled",
    displayRule: "exit-intent",
    position: "center",
    showCloseButton: true,
    showOnMobile: true,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    createdAt: "2023-04-01",
  },
  {
    id: 5,
    name: "ブラックフライデー",
    image: "/placeholder.svg?height=100&width=300",
    url: "https://newsite.co.jp/black-friday",
    site: "newsite.co.jp",
    siteId: 3,
    status: "active",
    displayRule: "immediate",
    position: "bottom-right",
    showCloseButton: true,
    showOnMobile: true,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    createdAt: "2023-04-02",
  },
]

const initialSites: Site[] = [
  {
    id: 1,
    name: "メインサイト",
    url: "https://example.com",
    description: "会社のメインウェブサイトです。製品情報や会社概要を掲載しています。",
    activeBanners: 2,
    totalBanners: 3,
    impressions: 15432,
    clicks: 987,
    ctr: 6.4,
    status: "active",
    createdAt: "2023-02-15",
  },
  {
    id: 2,
    name: "ブログサイト",
    url: "https://mysite.jp",
    description: "マーケティングブログサイトです。業界のトレンドや最新情報を発信しています。",
    activeBanners: 2,
    totalBanners: 4,
    impressions: 8921,
    clicks: 402,
    ctr: 4.51,
    status: "active",
    createdAt: "2023-03-01",
  },
  {
    id: 3,
    name: "新サイト",
    url: "https://newsite.co.jp",
    description: "新しく立ち上げたプロジェクトサイトです。まだ開発中の段階です。",
    activeBanners: 1,
    totalBanners: 1,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    status: "active",
    createdAt: "2023-04-01",
  },
]

// コンテキストの作成
const AppContext = createContext<AppContextType | undefined>(undefined)

// コンテキストプロバイダーコンポーネント
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 初期データのロード（実際のアプリではAPIからデータを取得）
  useEffect(() => {
    // ローカルストレージからデータを取得
    const storedBanners = localStorage.getItem("banners")
    const storedSites = localStorage.getItem("sites")

    if (storedBanners && storedSites) {
      setBanners(JSON.parse(storedBanners))
      setSites(JSON.parse(storedSites))
    } else {
      // 初期データをセット
      setBanners(initialBanners)
      setSites(initialSites)

      // ローカルストレージに保存
      localStorage.setItem("banners", JSON.stringify(initialBanners))
      localStorage.setItem("sites", JSON.stringify(initialSites))
    }

    // ローディング状態を解除
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("banners", JSON.stringify(banners))
      localStorage.setItem("sites", JSON.stringify(sites))
    }
  }, [banners, sites, isLoading])

  // バナーを追加
  const addBanner = (banner: Omit<Banner, "id" | "impressions" | "clicks" | "ctr" | "createdAt">) => {
    const newBanner: Banner = {
      ...banner,
      id: banners.length > 0 ? Math.max(...banners.map((b) => b.id)) + 1 : 1,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setBanners([...banners, newBanner])

    // サイトの統計情報を更新
    updateSiteStats()
  }

  // バナーを更新
  const updateBanner = (id: number, banner: Partial<Banner>) => {
    setBanners(banners.map((b) => (b.id === id ? { ...b, ...banner } : b)))

    // サイトの統計情報を更新
    updateSiteStats()
  }

  // バナーを削除
  const deleteBanner = (id: number) => {
    setBanners(banners.filter((b) => b.id !== id))

    // サイトの統計情報を更新
    updateSiteStats()
  }

  // サイトを追加
  const addSite = (
    site: Omit<Site, "id" | "activeBanners" | "totalBanners" | "impressions" | "clicks" | "ctr" | "createdAt">,
  ) => {
    const newSite: Site = {
      ...site,
      id: sites.length > 0 ? Math.max(...sites.map((s) => s.id)) + 1 : 1,
      activeBanners: 0,
      totalBanners: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setSites([...sites, newSite])
  }

  // サイトを更新
  const updateSite = (id: number, site: Partial<Site>) => {
    setSites(sites.map((s) => (s.id === id ? { ...s, ...site } : s)))
  }

  // サイトを削除
  const deleteSite = (id: number) => {
    setSites(sites.filter((s) => s.id !== id))
    // 関連するバナーも削除
    setBanners(banners.filter((b) => b.siteId !== id))
  }

  // サイトの統計情報を更新
  const updateSiteStats = () => {
    const updatedSites = sites.map((site) => {
      const siteBanners = banners.filter((b) => b.siteId === site.id)
      const activeBanners = siteBanners.filter((b) => b.status === "active").length
      const totalBanners = siteBanners.length
      const impressions = siteBanners.reduce((sum, b) => sum + b.impressions, 0)
      const clicks = siteBanners.reduce((sum, b) => sum + b.clicks, 0)
      const ctr = impressions > 0 ? Number.parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0

      return {
        ...site,
        activeBanners,
        totalBanners,
        impressions,
        clicks,
        ctr,
      }
    })

    setSites(updatedSites)
  }

  // バナーを取得
  const getBanner = (id: number) => {
    return banners.find((b) => b.id === id)
  }

  // サイトを取得
  const getSite = (id: number) => {
    return sites.find((s) => s.id === id)
  }

  return (
    <AppContext.Provider
      value={{
        banners,
        sites,
        addBanner,
        updateBanner,
        deleteBanner,
        addSite,
        updateSite,
        deleteSite,
        getBanner,
        getSite,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// カスタムフック
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

