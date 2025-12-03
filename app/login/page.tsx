"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 認証状態の変化を監視して、自動でページ遷移
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        console.log("ログイン検知:", session.user.email);
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || "/";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(next as any); 
      }
    });

    // クリーンアップ
    return () => subscription.unsubscribe();
  }, [router]);

  // サインアップ処理（メール認証付き）
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin, // メールリンクのリダイレクト先
      },
    });

    if (error) {
      setMessage("サインアップ失敗: " + error.message);
      return;
    }

    if (data.session) {
      setMessage("サインアップ成功！ログイン状態です。");
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(next as any);
    } else {
      setMessage(
        "サインアップ成功！確認メールを開くと自動的にログインします。"
      );
    }

    // usersテーブルに登録
    const { error: tableError } = await supabase
      .from("users")
      .insert([{ mail: email }]);
    if (tableError) console.log("users テーブル登録エラー:", tableError);
  };

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("ログイン失敗: " + error.message);
      return;
    }

    if (data.session) {
      setMessage("ログイン成功！");
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(next as any);
    }
  };

  // モード切り替え
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setMessage("");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        {isSignup ? "サインアップ" : "ログイン"}
      </h2>

      <form
        onSubmit={isSignup ? handleSignup : handleLogin}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 w-full rounded"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 py-1 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
        >
          {isSignup ? "サインアップ" : "ログイン"}
        </button>
      </form>

      <p className="text-center mt-3 text-sm text-gray-600">{message}</p>

      <div className="text-center mt-4">
        <button
          onClick={toggleMode}
          className="text-blue-600 hover:underline text-sm"
        >
          {isSignup
            ? "すでにアカウントをお持ちですか？ログインへ"
            : "アカウントをお持ちでないですか？サインアップへ"}
        </button>
      </div>
    </div>
  );
}
