"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, MoreHorizontal, Plus, Search } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"

export default function BannersPage() {
  const { banners, sites, updateBanner, isLoading } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [siteFilter, setSiteFilter] = useState("all")

  // フィルタリングロジック
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = banner.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || banner.status === statusFilter
    const matchesSite = siteFilter === "all" || banner.siteId === Number.parseInt(siteFilter)
    return matchesSearch && matchesStatus && matchesSite
  })

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

  // バナーのステータスを切り替える
  const toggleBannerStatus = (id) => {
    const banner = banners.find((b) => b.id === id)
    if (banner) {
      const newStatus = banner.status === "active" ? "inactive" : "active"
      updateBanner(id, { status: newStatus })
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">バナー管理</h1>
            <p className="text-muted-foreground">ポップアップバナーの作成、編集、管理</p>
          </div>
          <Button asChild>
            <Link href="/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              新しいバナーを作成
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="バナー名で検索..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ステータスでフィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのステータス</SelectItem>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="inactive">非アクティブ</SelectItem>
                    <SelectItem value="scheduled">予定</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={siteFilter} onValueChange={setSiteFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="サイトでフィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのサイト</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>バナー</TableHead>
                  <TableHead>サイト</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>表示ルール</TableHead>
                  <TableHead className="text-right">インプレッション</TableHead>
                  <TableHead className="text-right">クリック</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      データを読み込み中...
                    </TableCell>
                  </TableRow>
                ) : filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      該当するバナーが見つかりませんでした
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((banner) => {
                    const site = sites.find((s) => s.id === banner.siteId)
                    return (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-24 overflow-hidden rounded-md">
                              <Image
                                src={banner.image || "/placeholder.svg"}
                                alt={banner.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{banner.name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">{banner.url}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{site?.name || "-"}</TableCell>
                        <TableCell>{getStatusBadge(banner.status)}</TableCell>
                        <TableCell>{getDisplayRuleText(banner.displayRule)}</TableCell>
                        <TableCell className="text-right">{banner.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{banner.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{banner.ctr}%</TableCell>
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
                                <Link href={`/banners/${banner.id}`}>詳細を表示</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/banners/${banner.id}/edit`}>編集</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleBannerStatus(banner.id)}>
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
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

