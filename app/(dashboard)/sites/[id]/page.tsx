"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/contexts/app-context"

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { getSite, banners, isLoading } = useAppContext()
  const [site, setSite] = useState<any>(null)
  const [siteBanners, setSiteBanners] = useState<any[]>([])
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    // サイトデータとバナーデータを取得
    const fetchData = () => {
      setIsPageLoading(true)
      const siteData = getSite(Number.parseInt(params.id))

      if (!siteData) {
        router.push("/sites")
        return
      }

      // サイトに関連するバナーを取得
      const relatedBanners = banners.filter((banner) => banner.siteId === Number.parseInt(params.id))

      setSite(siteData)
      setSiteBanners(relatedBanners)

      setTimeout(() => {
        setIsPageLoading(false)
      }, 1000)
    }

    if (!isLoading) {
      fetchData()
    }
  }, [params.id, router, getSite, banners, isLoading])

  // スクリプトタグをクリップボードにコピー
  const copyScriptTag = () => {
    const scriptTag = `<script src="https://popup-manager.vercel.app/api/script?siteId=${params.id}" async></script>`
    navigator.clipboard.writeText(scriptTag)
    toast({
      title: "コピーしました",
      description: "スクリプトタグがクリップボードにコピーされました",
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
      case "scroll-50":
        return "50%スクロール時"
      case "exit-intent":
        return "離脱意図時"
      default:
        return rule
    }
  }

  if (isLoading || isPageLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sites">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">サイト詳細</h1>
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

  if (!site) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sites">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">サイト詳細</h1>
        </div>
        <div className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p>サイトが見つかりませんでした。</p>
              <Button asChild className="mt-4">
                <Link href="/sites">サイト一覧に戻る</Link>
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
            <Link href="/sites">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>サイト情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">URL</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium">{site.url}</p>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={site.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">説明</h3>
                <p className="mt-1">{site.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">作成日</h3>
                <p className="mt-1">{new Date(site.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ステータス</h3>
                <div className="mt-1">{getStatusBadge(site.status)}</div>
              </div>
              <div className="pt-4">
                <Button onClick={copyScriptTag} className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  スクリプトタグをコピー
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
              <CardDescription>過去7日間のパフォーマンス</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">インプレッション</div>
                  <div className="mt-1 text-2xl font-bold">{site.impressions.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">クリック</div>
                  <div className="mt-1 text-2xl font-bold">{site.clicks.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">CTR</div>
                  <div className="mt-1 text-2xl font-bold">{site.ctr}%</div>
                </div>
              </div>
              <div className="mt-6 h-[200px] w-full rounded-md bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">グラフデータがここに表示されます</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="banners" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="banners">バナー</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>
          <TabsContent value="banners" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>バナー一覧</CardTitle>
                  <CardDescription>このサイトに設定されているバナー</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/banners/new">新しいバナーを作成</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteBanners.length === 0 ? (
                    <div className="rounded-md bg-muted p-8 text-center">
                      <p className="text-muted-foreground">バナーがまだ設定されていません</p>
                      <Button asChild className="mt-4">
                        <Link href="/banners/new">バナーを作成する</Link>
                      </Button>
                    </div>
                  ) : (
                    siteBanners.map((banner) => (
                      <div key={banner.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 overflow-hidden rounded-md bg-muted">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">バナー画像</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium">{banner.name}</h3>
                            <div className="mt-1 flex items-center gap-2">
                              {getStatusBadge(banner.status)}
                              <span className="text-sm text-muted-foreground">
                                {getDisplayRuleText(banner.displayRule)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{banner.impressions.toLocaleString()} 表示</div>
                            <div className="text-sm text-muted-foreground">
                              {banner.clicks.toLocaleString()} クリック ({banner.ctr}%)
                            </div>
                          </div>
                          <Button variant="outline" asChild>
                            <Link href={`/banners/${banner.id}/edit`}>編集</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>サイト設定</CardTitle>
                <CardDescription>サイトの設定を変更します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/sites/${params.id}/edit`}>サイト情報を編集</Link>
                    </Button>
                    <Button variant="outline" className="text-destructive">
                      サイトを削除
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <h3 className="font-medium">スクリプトタグ</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      以下のスクリプトタグをサイトの&lt;head&gt;タグ内に貼り付けてください。
                    </p>
                    <div className="mt-2 rounded-md bg-background p-2">
                      <code className="text-xs">
                        {`<script src="https://popup-manager.vercel.app/api/script?siteId=${params.id}" async></script>`}
                      </code>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={copyScriptTag}>
                      <Copy className="mr-2 h-3 w-3" />
                      コピー
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

