"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink, MoreHorizontal, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/contexts/app-context"

export default function SitesPage() {
  const { sites, isLoading } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // フィルタリングロジック
  const filteredSites = sites.filter((site) => {
    return (
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // スクリプトタグをクリップボードにコピー
  const copyScriptTag = (siteId) => {
    const scriptTag = `<script src="https://popup-manager.vercel.app/api/script?siteId=${siteId}" async></script>`
    navigator.clipboard.writeText(scriptTag)
    toast({
      title: "コピーしました",
      description: "スクリプトタグがクリップボードにコピーされました",
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">サイト管理</h1>
            <p className="text-muted-foreground">ポップアップバナーを表示するサイトの管理</p>
          </div>
          <Button asChild>
            <Link href="/sites/new">
              <Plus className="mr-2 h-4 w-4" />
              新しいサイトを追加
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="サイト名またはURLで検索..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サイト名</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>バナー</TableHead>
                  <TableHead className="text-right">インプレッション</TableHead>
                  <TableHead className="text-right">クリック</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      データを読み込み中...
                    </TableCell>
                  </TableRow>
                ) : filteredSites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      該当するサイトが見つかりませんでした
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(site.createdAt).toLocaleDateString()}に追加
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{site.url}</span>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={site.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {site.activeBanners} / {site.totalBanners}
                      </TableCell>
                      <TableCell className="text-right">{site.impressions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{site.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{site.ctr}%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">メニューを開く</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>アクション</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/sites/${site.id}`}>詳細を表示</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/sites/${site.id}/edit`}>編集</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyScriptTag(site.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              スクリプトタグをコピー
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>スクリプトの設置方法</CardTitle>
            <CardDescription>以下の手順でポップアップバナーをサイトに設置できます</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">1. スクリプトタグをコピー</h3>
              <p className="text-sm text-muted-foreground">
                サイトの行にある「スクリプトタグをコピー」ボタンをクリックします。
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">2. HTMLに貼り付け</h3>
              <p className="text-sm text-muted-foreground">
                コピーしたスクリプトタグをサイトのHTMLの&lt;head&gt;タグ内に貼り付けます。
              </p>
              <div className="rounded-md bg-muted p-4">
                <pre className="text-sm">
                  <code>{`<head>
  <!-- 他のhead要素 -->
  <script src="https://popup-manager.vercel.app/api/script?siteId=YOUR_SITE_ID" async></script>
</head>`}</code>
                </pre>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">3. 確認</h3>
              <p className="text-sm text-muted-foreground">
                設定したバナーがサイト上に正しく表示されることを確認します。バナーの表示設定に応じて表示タイミングが変わります。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

