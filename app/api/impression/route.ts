import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const bannerId = searchParams.get("bannerId")

  if (!bannerId) {
    return NextResponse.json({ error: "Banner ID is required" }, { status: 400 })
  }

  // 実際のアプリではここでインプレッションをデータベースに記録する
  console.log(`Impression recorded for banner: ${bannerId}`)

  // CORSヘッダーを追加
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}

// OPTIONSリクエストに対応（CORSプリフライトリクエスト用）
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}

