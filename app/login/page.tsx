"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Home } from "lucide-react";

export default function AuthForm() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setMessage("");

    try {
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
          "確認メールを送信しました。メール内のリンクをクリックして完了してください。"
        );
      }

      // usersテーブルに登録 (Optional: スキーマが不明確なためエラーハンドリングのみ)
      const { error: tableError } = await supabase
        .from("users")
        .insert([{ mail: email }]);
      if (tableError) console.log("Note: usersテーブルへの登録はスキップされました (スキーマ不一致の可能性)");
      
    } catch (err) {
      setMessage("予期せぬエラーが発生しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
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
    } catch (err) {
      setMessage("予期せぬエラーが発生しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setMessage("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-neutral-50">
      {/* Natural Background Image */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for readability */}
         <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=2554&auto=format&fit=crop')] bg-cover bg-center" />
      </div>

      <div className="relative z-20 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-4 text-primary"
              >
                <Home className="w-8 h-8" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {isSignup
                  ? "理想の暮らしを始めましょう"
                  : "おかえりなさい"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isSignup ? "signup" : "login"}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={isSignup ? handleSignup : handleLogin}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      placeholder="メールアドレス"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {isSignup ? "アカウント作成" : "ログイン"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-red-500 min-h-[20px]">
                    {message}
                  </p>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>

          <div className="bg-gray-50/80 p-4 border-t border-gray-100 text-center backdrop-blur-sm">
            <button
              onClick={toggleMode}
              className="text-gray-500 hover:text-primary text-sm transition-colors flex items-center justify-center gap-2 mx-auto font-medium"
            >
              {isSignup
                ? "すでにアカウントをお持ちですか？ ログイン"
                : "アカウントをお持ちでないですか？ 新規登録"}
            </button>
          </div>
        </motion.div>
       
        {/* Footer info */}
        <p className="text-white/60 text-xs text-center mt-8 drop-shadow-md">
          © 2025 Team Project. All rights reserved.
        </p>
      </div>
    </div>
  );
}
