"use client";

export default function Header() {
  const handleLogout = () => {
    // Cookieを削除
    document.cookie =
      "appSession=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // 強制的にページをリロード（キャッシュをクリアするため）
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
