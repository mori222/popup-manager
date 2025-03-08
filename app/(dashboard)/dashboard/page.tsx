"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

// 仮のデータ
const mockData = {
  totalBanners: 12,
  activeBanners: 5,
  totalSites: 3,
  totalImpressions: 24689,
  totalClicks: 1245,
  ctr: 5.04,
  recentActivity: [
    { id: 1, action: "バナーが追加されました", site: "example.com", date: "2023-04-01" },
    { id: 2, action: "バナーが編集されました", site: "mysite.jp", date: "2023-03-30" },
    { id: 3, action: "新しいサイトが追加されました", site: "newsite.co.jp", date: "2023-03-28" },
  ],
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(mockData)

  useEffect(() => {
    // 実際のアプリではここでデータをフェッチする
    const timer = setTimeout(() => {
      setData(mockData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
            <p className="text-muted-foreground">バナー管理ツールの概要と統計情報</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/banners/new">新しいバナーを作成</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">バナー</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "読み込み中..." : `${data.activeBanners} / ${data.totalBanners}`}
              </div>
              <p className="text-xs text-muted-foreground">アクティブ / 合計</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">インプレッション</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "読み込み中..." : data.totalImpressions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">過去30日間</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">クリック率</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "読み込み中..." : `${data.ctr}%`}</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : `${data.totalClicks.toLocaleString()} クリック`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
            <TabsTrigger value="activity">アクティビティ</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>サイト概要</CardTitle>
                <CardDescription>管理しているサイトとバナーの概要</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {isLoading ? (
                    <div className="h-24 rounded-md bg-muted"></div>
                  ) : (
                    <>
                      {Array.from({ length: data.totalSites }).map((_, i) => (
                        <Card key={i}>
                          <CardHeader className="p-4">
                            <CardTitle className="text-base">サイト {i + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">
                              {i === 0 ? "example.com" : i === 1 ? "mysite.jp" : "newsite.co.jp"}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm">アクティブバナー: {i === 0 ? 2 : i === 1 ? 2 : 1}</span>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/sites/${i + 1}`}>詳細</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>分析データ</CardTitle>
                <CardDescription>バナーのパフォーマンス分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-md bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">グラフデータがここに表示されます</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>最近のアクティビティ</CardTitle>
                <CardDescription>システム上の最近の変更とアクティビティ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-md bg-muted"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {data.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.site}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">{activity.date}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

