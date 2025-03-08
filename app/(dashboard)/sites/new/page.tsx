"use client"

import { useState } from "react"
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

export default function NewSitePage() {
  const router = useRouter()
  const { addSite } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // フォームの初期値
  const defaultValues: Partial<SiteFormValues> = {
    name: "",
    url: "",
    description: "",
    active: true,
  }

  // フォーム設定
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: SiteFormValues) => {
    setIsSubmitting(true)

    // サイトを追加
    addSite({
      name: data.name,
      url: data.url,
      description: data.description || "",
      status: data.active ? "active" : "inactive",
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/sites")
    }, 1000)
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
          <h1 className="text-3xl font-bold tracking-tight">新しいサイトを追加</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>サイト情報</CardTitle>
                <CardDescription>ポップアップバナーを表示するサイトの情報を入力してください</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>設置方法</CardTitle>
                <CardDescription>サイトを保存した後、以下の手順でバナーを設置できます</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">1. スクリプトタグをコピー</h3>
                  <p className="text-sm text-muted-foreground">
                    サイト保存後に表示されるスクリプトタグをコピーします。
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
                  <h3 className="text-lg font-medium">3. バナーを作成</h3>
                  <p className="text-sm text-muted-foreground">サイトにバナーを追加して、表示設定を行います。</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/sites">キャンセル</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "サイトを保存"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

