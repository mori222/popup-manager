"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    if (!password || !confirmPassword) {
      setError("すべての項目を入力してください。")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。")
      setIsLoading(false)
      return
    }

    if (!token) {
      setError("無効なリセットリンクです。もう一度パスワードリセットをリクエストしてください。")
      setIsLoading(false)
      return
    }

    try {
      // ここに実際のパスワードリセットロジックを実装
      // 例: const response = await confirmResetPassword(token, password);

      // 仮の成功処理（実際のアプリではAPIリクエストを行う）
      setTimeout(() => {
        setSuccess(true)
      }, 1000)
    } catch (err) {
      setError("パスワードのリセットに失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">新しいパスワードを設定</CardTitle>
          <CardDescription>新しいパスワードを入力して、アカウントへのアクセスを回復してください。</CardDescription>
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
                <AlertDescription>
                  パスワードが正常にリセットされました。新しいパスワードでログインできます。
                </AlertDescription>
              </Alert>
            )}
            {!success && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">新しいパスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">8文字以上で、英数字を含めてください</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!success ? (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "処理中..." : "パスワードを変更"}
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/auth/login">ログイン画面へ</Link>
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

