"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showPwd, setShowPwd] = React.useState(false);

  const onLogin = async () => {
    // your login logic here (kept empty per your note)
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log(response);
      toast.success("Login successful");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  console.log(user);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/5 bg-white/80 dark:bg-neutral-900/70 backdrop-blur shadow-xl ring-1 ring-black/5 transition">
          <div className="px-6 sm:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Login to your account
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                onLogin();
              }}
            >
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  className="block w-full rounded-xl border-0 bg-white/90 dark:bg-neutral-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-neutral-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  type="email"
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="block w-full rounded-xl border-0 bg-white/90 dark:bg-neutral-800/80 px-4 py-2.5 pr-12 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-neutral-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    type={showPwd ? "text" : "password"}
                    id="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-2.5 my-auto inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Forgot your password? Reset it here.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || buttonDisabled}
                onClick={onLogin}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Log in
              </button>

              {/* Footer */}
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Tiny legal line */}
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-2">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
