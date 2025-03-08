"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppContext } from "@/contexts/app-context"

// バナーフォームのバリデーションスキーマ
const bannerFormSchema = z.object({
  name: z.string().min(1, { message: "バナー名は必須です" }),
  url: z.string().url({ message: "有効なURLを入力してください" }),
  siteId: z.string().min(1, { message: "サイトを選択してください" }),
  displayRule: z.string().min(1, { message: "表示タイミングを選択してください" }),
  position: z.string().min(1, { message: "表示位置を選択してください" }),
  closeButton: z.boolean().default(true),
  mobileDisplay: z.boolean().default(true),
  active: z.boolean().default(true),
})

type BannerFormValues = z.infer<typeof bannerFormSchema>

export default function NewBannerPage() {
  const router = useRouter()
  const { sites, addBanner } = useAppContext()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // フォームの初期値
  const defaultValues: Partial<BannerFormValues> = {
    name: "",
    url: "",
    siteId: "",
    displayRule: "",
    position: "",
    closeButton: true,
    mobileDisplay: true,
    active: true,
  }

  // フォーム設定
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: BannerFormValues) => {
    setIsSubmitting(true)

    // サイト情報を取得
    const site = sites.find((s) => s.id === Number.parseInt(data.siteId))

    if (!site) {
      setIsSubmitting(false)
      return
    }

    // バナーを追加
    addBanner({
      name: data.name,
      image: previewImage || "/placeholder.svg?height=100&width=300",
      url: data.url,
      site: site.url,
      siteId: Number.parseInt(data.siteId),
      status: data.active ? "active" : "inactive",
      displayRule: data.displayRule,
      position: data.position,
      showCloseButton: data.closeButton,
      showOnMobile: data.mobileDisplay,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/banners")
    }, 1000)
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
          <h1 className="text-3xl font-bold tracking-tight">新しいバナーを作成</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                    <CardDescription>バナーの基本的な情報を入力してください</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>バナー名</FormLabel>
                          <FormControl>
                            <Input placeholder="例: 春のセールバナー" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>リンク先URL</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://example.com/page" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="siteId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>表示サイト</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="サイトを選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sites.map((site) => (
                                <SelectItem key={site.id} value={site.id.toString()}>
                                  {site.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>表示設定</CardTitle>
                    <CardDescription>バナーの表示タイミングと動作を設定します</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="displayRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>表示タイミング</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="表示タイミングを選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediate">即時表示</SelectItem>
                              <SelectItem value="delay-5s">5秒後に表示</SelectItem>
                              <SelectItem value="delay-10s">10秒後に表示</SelectItem>
                              <SelectItem value="scroll-50">50%スクロール時</SelectItem>
                              <SelectItem value="exit-intent">離脱意図時</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>表示位置</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="表示位置を選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="center">中央</SelectItem>
                              <SelectItem value="top">上部</SelectItem>
                              <SelectItem value="bottom">下部</SelectItem>
                              <SelectItem value="top-left">左上</SelectItem>
                              <SelectItem value="top-right">右上</SelectItem>
                              <SelectItem value="bottom-left">左下</SelectItem>
                              <SelectItem value="bottom-right">右下</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="closeButton"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>閉じるボタンを表示</FormLabel>
                            <FormDescription>ユーザーがバナーを閉じるためのボタンを表示します</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobileDisplay"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>モバイルでも表示</FormLabel>
                            <FormDescription>モバイルデバイスでもバナーを表示します</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>バナー画像</CardTitle>
                    <CardDescription>表示するバナー画像をアップロードしてください</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="relative flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                        {previewImage ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={previewImage || "/placeholder.svg"}
                              alt="バナープレビュー"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <div className="text-sm font-medium">
                              ここにファイルをドロップするか、クリックしてアップロード
                            </div>
                            <div className="text-xs text-muted-foreground">PNG, JPG, GIF (最大 2MB)</div>
                          </div>
                        )}
                        <Input
                          id="banner-image"
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={handleImageChange}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">推奨サイズ: 600 x 400 ピクセル</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>公開設定</CardTitle>
                    <CardDescription>バナーの公開状態を設定します</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>すぐに公開する</FormLabel>
                            <FormDescription>オフにすると下書き状態で保存されます</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" asChild>
                        <Link href="/banners">キャンセル</Link>
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "保存中..." : "バナーを保存"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

