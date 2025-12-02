import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../apiClient";
import { useToast } from "../toastContext";

export default function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/user/login", formData);

            // Save token
            localStorage.setItem("token", res.data.token);

            // Redirect to home page
            navigate("/home");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid credentials");
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    // If already logged in, redirect to home
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1224] via-[#111c33] to-[#1b1b3a] px-4">
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left side: Branding */}
                <div className="hidden md:block">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-[#a855f7] flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-purple-500/30">
                            D
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
                                Project Drive
                            </p>
                            <p className="text-sm text-slate-400">
                                Secure file storage
                            </p>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Welcome back
                    </h1>
                    <p className="text-slate-300 text-sm max-w-md">
                        Sign in to access your Drive, upload new files, and manage everything
                        in one clean, simple place.
                    </p>
                </div>

                {/* Right side: Login card */}
                <div className="w-full max-w-md md:ml-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="px-6 py-7 bg-[#0b1426]/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur text-white"
                    >
                        <h2 className="text-2xl font-semibold mb-1 text-white text-center md:text-left">
                            Sign in
                        </h2>
                        <p className="text-xs text-slate-400 mb-5 text-center md:text-left">
                            Use your email and password to continue.
                        </p>

                        {error && (
                            <div className="mb-4 p-2 bg-rose-500/10 text-rose-200 rounded text-xs text-center border border-rose-500/30">
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div className="mb-4 flex items-center justify-center text-xs text-slate-300">
                                <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mr-2" />
                                Signing you in...
                            </div>
                        )}

                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block mb-1.5 text-xs font-medium text-slate-200"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent block w-full px-3 py-2.5"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block mb-1.5 text-xs font-medium text-slate-200"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent block w-full px-3 py-2.5"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center text-sm font-medium text-white bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] focus:ring-2 focus:ring-[#a855f7]/40 rounded-full px-5 py-2.5 shadow-lg shadow-purple-500/30 transition"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                        <p className="mt-4 text-xs text-slate-400 text-center">
                            New here?{" "}
                            <a
                                href="/register"
                                className="text-[#a855f7] hover:text-[#f472b6] font-medium"
                            >
                                Create an account
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
