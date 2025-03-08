"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/contexts/app-context"

export default function BannerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { getBanner, getSite, updateBanner, isLoading } = useAppContext()
  const [banner, setBanner] = useState<any>(null)
  const [site, setSite] = useState<any>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    const fetchBanner = () => {
      setIsPageLoading(true)
      const bannerData = getBanner(Number.parseInt(params.id))

      if (!bannerData) {
        router.push("/banners")
        return
      }

      // サイト情報も取得
      const siteData = getSite(bannerData.siteId)

      setBanner(bannerData)
      setSite(siteData)

      setTimeout(() => {
        setIsPageLoading(false)
      }, 500)
    }

    if (!isLoading) {
      fetchBanner()
    }
  }, [params.id, router, getBanner, getSite, isLoading])

  // バナーのステータスを切り替える
  const toggleBannerStatus = () => {
    if (!banner) return

    const newStatus = banner.status === "active" ? "inactive" : "active"
    updateBanner(banner.id, { status: newStatus })

    // 状態を更新
    setBanner({ ...banner, status: newStatus })

    toast({
      title: newStatus === "active" ? "バナーをアクティブにしました" : "バナーを非アクティブにしました",
      description: "バナーのステータスが更新されました",
    })
  }

  // バナーのステータスに応じたバッジを表示
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="default">アクティブ</Badge>
      case "inactive":
        return <Badge variant="secondary">非アクティブ</Badge>
      case "scheduled":
        return <Badge variant="outline">予定</Badge>
      default:
        return null
    }
  }

  // 表示ルールの日本語表示
  const getDisplayRuleText = (rule) => {
    switch (rule) {
      case "immediate":
        return "即時表示"
      case "delay-5s":
        return "5秒後に表示"
      case "delay-10s":
        return "10秒後に表示"
      case "scroll-50":
        return "50%スクロール時"
      case "exit-intent":
        return "離脱意図時"
      default:
        return rule
    }
  }

  // 表示位置の日本語表示
  const getPositionText = (position) => {
    switch (position) {
      case "center":
        return "中央"
      case "top":
        return "上部"
      case "bottom":
        return "下部"
      case "top-left":
        return "左上"
      case "top-right":
        return "右上"
      case "bottom-left":
        return "左下"
      case "bottom-right":
        return "右下"
      default:
        return position
    }
  }

  if (isLoading || isPageLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/banners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">バナー詳細</h1>
        </div>
        <div className="mt-6 grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-8 w-1/3 animate-pulse rounded-md bg-muted"></div>
              <div className="mt-4 h-4 w-1/2 animate-pulse rounded-md bg-muted"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/banners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">バナー詳細</h1>
        </div>
        <div className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p>バナーが見つかりませんでした。</p>
              <Button asChild className="mt-4">
                <Link href="/banners">バナー一覧に戻る</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/banners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{banner.name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>バナープレビュー</CardTitle>
              <CardDescription>バナーの表示イメージ</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <div className="relative h-[200px] w-full max-w-[600px] overflow-hidden rounded-md border">
                <Image src={banner.image || "/placeholder.svg"} alt={banner.name} fill className="object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ステータス</h3>
                <div className="mt-1">{getStatusBadge(banner.status)}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">リンク先URL</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium truncate">{banner.url}</p>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={banner.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">表示サイト</h3>
                <p className="mt-1">{site?.name || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">作成日</h3>
                <p className="mt-1">{new Date(banner.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="pt-4 space-y-2">
                <Button
                  onClick={toggleBannerStatus}
                  className="w-full"
                  variant={banner.status === "active" ? "outline" : "default"}
                >
                  {banner.status === "active" ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      非アクティブにする
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      アクティブにする
                    </>
                  )}
                </Button>
                <Button asChild className="w-full">
                  <Link href={`/banners/${banner.id}/edit`}>編集する</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="settings">表示設定</TabsTrigger>
            <TabsTrigger value="stats">統計情報</TabsTrigger>
          </TabsList>
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>表示設定</CardTitle>
                <CardDescription>バナーの表示タイミングと動作設定</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">表示タイミング</h3>
                      <p className="mt-1">{getDisplayRuleText(banner.displayRule)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">表示位置</h3>
                      <p className="mt-1">{getPositionText(banner.position)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">閉じるボタン</h3>
                      <p className="mt-1">{banner.showCloseButton ? "表示する" : "表示しない"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">モバイル表示</h3>
                      <p className="mt-1">{banner.showOnMobile ? "表示する" : "表示しない"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>統計情報</CardTitle>
                <CardDescription>バナーのパフォーマンス統計</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">インプレッション</div>
                    <div className="mt-1 text-2xl font-bold">{banner.impressions.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">クリック</div>
                    <div className="mt-1 text-2xl font-bold">{banner.clicks.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">CTR</div>
                    <div className="mt-1 text-2xl font-bold">{banner.ctr}%</div>
                  </div>
                </div>
                <div className="mt-6 h-[200px] w-full rounded-md bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">グラフデータがここに表示されます</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

