import { Link } from "react-router-dom";

export default function Index() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1224] via-[#111c33] to-[#1b1b3a] text-white flex items-center justify-center px-4">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left: Branding */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-[#a855f7] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
                            D
                        </div>
                        <span className="text-sm font-medium tracking-wide text-slate-300">
                            Project Drive
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Your personal cloud,{" "}
                        <span className="text-[#f472b6]">simplified</span>
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base mb-6 max-w-md">
                        Upload, preview, download, and manage your files securely. A clean,
                        minimal Drive-like experience on top of your own backend and Supabase
                        storage.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] text-white text-sm font-medium shadow-lg shadow-purple-500/30 transition"
                        >
                            Go to Drive
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition"
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                {/* Right: Simple mockup card */}
                <div className="hidden md:block">
                    <div className="rounded-2xl bg-white/5 border border-white/10 shadow-2xl p-4 backdrop-blur">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs text-slate-200">
                                <i className="ri-folder-2-line" />
                                <span>My Drive</span>
                            </div>
                            <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-xs">
                                <i className="ri-add-line" />
                                <span>New</span>
                            </button>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded bg-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] text-xs">
                                        <i className="ri-image-2-line" />
                                    </div>
                                    <span className="text-white truncate max-w-[120px]">
                                        screenshot.png
                                    </span>
                                </div>
                                <span className="text-slate-300">2.1 MB</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded bg-emerald-400/20 flex items-center justify-center text-emerald-300 text-xs">
                                        <i className="ri-file-text-line" />
                                    </div>
                                    <span className="text-white truncate max-w-[120px]">
                                        report.pdf
                                    </span>
                                </div>
                                <span className="text-slate-300">820 KB</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded bg-amber-400/20 flex items-center justify-center text-amber-300 text-xs">
                                        <i className="ri-music-2-line" />
                                    </div>
                                    <span className="text-white truncate max-w-[120px]">
                                        audio.mp3
                                    </span>
                                </div>
                                <span className="text-slate-300">5.4 MB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
