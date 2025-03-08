"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    if (!email) {
      setError("メールアドレスを入力してください。")
      setIsLoading(false)
      return
    }

    try {
      // ここに実際のパスワードリセットロジックを実装
      // 例: const response = await resetPassword(email);

      // 仮の成功処理（実際のアプリではAPIリクエストを行う）
      setTimeout(() => {
        setSuccess(true)
      }, 1000)
    } catch (err) {
      setError("パスワードリセットリクエストに失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">パスワードをお忘れですか？</CardTitle>
          <CardDescription>
            登録したメールアドレスを入力してください。パスワードリセットのリンクをお送りします。
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>パスワードリセットのリンクを送信しました。メールをご確認ください。</AlertDescription>
              </Alert>
            )}
            {!success && (
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!success ? (
              <>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "送信中..." : "リセットリンクを送信"}
                </Button>
                <div className="text-center text-sm">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    ログイン画面に戻る
                  </Link>
                </div>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href="/auth/login">ログイン画面に戻る</Link>
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

