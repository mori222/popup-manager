"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppContext } from "@/contexts/app-context"

// サイトフォームのバリデーションスキーマ
const siteFormSchema = z.object({
  name: z.string().min(1, { message: "サイト名は必須です" }),
  url: z.string().url({ message: "有効なURLを入力してください" }),
  description: z.string().optional(),
  active: z.boolean().default(true),
})

type SiteFormValues = z.infer<typeof siteFormSchema>

export default function EditSitePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getSite, updateSite } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // フォーム設定
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
      active: true,
    },
  })

  useEffect(() => {
    // 実際のアプリではここでAPIからデータをフェッチする
    const fetchSite = () => {
      setIsLoading(true)
      // コンテキストからサイトデータを取得
      const siteData = getSite(Number.parseInt(params.id))

      if (!siteData) {
        router.push("/sites")
        return
      }

      // フォームに値をセット
      form.reset({
        name: siteData.name,
        url: siteData.url,
        description: siteData.description || "",
        active: siteData.status === "active",
      })

      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }

    fetchSite()
  }, [params, router, form, getSite])

  const onSubmit = async (data: SiteFormValues) => {
    setIsSubmitting(true)

    // サイトを更新
    updateSite(Number.parseInt(params.id), {
      name: data.name,
      url: data.url,
      description: data.description || "",
      status: data.active ? "active" : "inactive",
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/sites/${params.id}`)
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/sites/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">サイトを編集</h1>
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

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/sites/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">サイトを編集</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>サイト情報</CardTitle>
                <CardDescription>ポップアップバナーを表示するサイトの情報を編集してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>サイト名</FormLabel>
                      <FormControl>
                        <Input placeholder="例: メインサイト" {...field} />
                      </FormControl>
                      <FormDescription>管理画面で表示される名前です</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>サイトURL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>バナーを表示するウェブサイトのURLを入力してください</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>説明（オプション）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="サイトの説明や用途などを入力してください"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>サイトをアクティブにする</FormLabel>
                        <FormDescription>オフにするとバナーが表示されなくなります</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" asChild>
                <Link href={`/sites/${params.id}`}>キャンセル</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "変更を保存"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

