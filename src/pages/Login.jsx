// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-black">
            EF Accounting
          </h1>
          <p className="text-black">Modern accounting for Danish businesses</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blueBrand"
            required
          />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blueBrand"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blueBrand text-white rounded-lg hover:bg-blueBrand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 px-2 text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "github",
            })
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Github className="w-5 h-5" />
          Github
        </button> */}

        <p className="text-center text-sm text-zinc-600">
          By clicking continue, you agree to our{" "}
          <a href="#" className="text-blueBrand hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blueBrand hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
