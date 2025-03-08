export default function DemoPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">バナー表示デモページ</h1>
      <p className="mb-4">このページはポップアップバナーのテスト用デモページです。</p>
      <p className="mb-4">以下のスクリプトタグをサイトのheadタグ内に挿入することで、バナーが表示されます：</p>

      <div className="bg-gray-100 p-4 rounded-md mb-6 overflow-x-auto">
        <pre className="text-sm">
          {`<script src="${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/script?siteId=1" async></script>`}
        </pre>
      </div>

      <h2 className="text-2xl font-bold mb-4">表示ルールについて</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          <strong>即時表示</strong>: ページ読み込み後すぐにバナーを表示します
        </li>
        <li>
          <strong>5秒後に表示</strong>: ページ読み込みから5秒後にバナーを表示します
        </li>
        <li>
          <strong>50%スクロール時</strong>: ページを50%スクロールしたときにバナーを表示します
        </li>
        <li>
          <strong>離脱意図時</strong>: ユーザーがページから離れようとしたときにバナーを表示します
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">テスト方法</h2>
      <ol className="list-decimal pl-6 mb-6 space-y-2">
        <li>管理画面でバナーを作成し、表示ルールを設定します</li>
        <li>バナーを「アクティブ」状態にします</li>
        <li>このページを再読み込みして、バナーの表示を確認します</li>
      </ol>

      <div className="h-[1000px]">
        <p className="text-gray-500">（スクロールテスト用の余白）</p>
      </div>
    </div>
  )
}

