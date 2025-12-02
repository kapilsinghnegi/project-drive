import { useState, useEffect } from "react";
import { api, buildApiUrl } from "../apiClient";
import { useToast } from "../toastContext";
import { FiEye } from "react-icons/fi";
import { AiOutlineFilePdf } from "react-icons/ai";
import { BsFiletypeJpg, BsFiletypePng } from "react-icons/bs";
import { BiFile } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const getFileIcon = (file) => {
    if (file.mimetype.startsWith("image/jpeg"))
        return <BsFiletypeJpg className="text-pink-400 text-xl" />;
    if (file.mimetype.startsWith("image/png"))
        return <BsFiletypePng className="text-blue-400 text-xl" />;
    if (file.mimetype === "application/pdf")
        return <AiOutlineFilePdf className="text-red-400 text-xl" />;
    return <BiFile className="text-purple-300 text-xl" />;
};


export default function Home() {
    const [files, setFiles] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [previewInfo, setPreviewInfo] = useState("");
    const [showShare, setShowShare] = useState(false);
    const [shareFileId, setShareFileId] = useState(null);
    const [shareEmail, setShareEmail] = useState("");
    const [sharePassword, setSharePassword] = useState("");
    const [shareExpiration, setShareExpiration] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Fetch files when component loads
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/file", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setFiles(res.data.files || []);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) {
            toast.error("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadFile);

        setLoading(true);
        try {
            await api.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setShowUpload(false);
            await fetchFiles();
            toast.success("File uploaded successfully");
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;

        setLoading(true);
        try {
            await api.delete(`/api/file/${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            await fetchFiles();
            toast.success("File deleted");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (file) => {
        try {
            setLoading(true);
            const response = await api.get(
                `/api/file/download/${encodeURIComponent(file.path)}`,
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.originalname);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Download failed", error);
            toast.error("Failed to download file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-4 md:p-8 bg-[#0f172a] min-h-screen w-full">
            <div className="max-w-6xl mx-auto">
                {loading && (
                    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3 text-slate-100 text-sm">
                            <div className="h-10 w-10 border-4 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            <span>Working on your files...</span>
                        </div>
                    </div>
                )}
                {/* Top App Bar */}
                <header className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-[#a855f7] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                            D
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-semibold text-white">
                                My Drive
                            </h1>
                            <p className="text-xs text-slate-300">
                                Secure file storage powered by Supabase
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowUpload(true)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] text-white font-medium py-2 px-5 rounded-full text-sm shadow-lg shadow-purple-500/40 transition"
                        ><FiUpload className="text-white text-lg" />
                            <span>New</span>
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ec4899] to-[#a855f7] hover:from-[#db2777] hover:to-[#9333ea] text-white py-2 px-4 rounded-full text-sm shadow-lg shadow-purple-500/40 transition"
                        >
                            <FiLogOut className="text-white text-lg" />
                            Logout
                        </button>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="flex items-center justify-between bg-[#111c33] rounded-xl px-4 py-3 shadow-lg shadow-black/20 border border-white/10 mb-3 text-slate-200">
                    <div className="flex items-center gap-2 text-sm">
                        <i className="ri-folder-2-line text-lg" />
                        <span>My files</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Sorted by</span>
                        <span className="font-medium">Last modified</span>
                    </div>
                </div>

                {/* Upload Popup Modal */}
                {showUpload && (
                    <div
                        className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowUpload(false);
                        }}
                    >
                        <div
                            className="relative w-full max-w-md bg-[#0b1426]/90 p-6 rounded-2xl shadow-2xl border border-white/10 animate-[scaleIn_.25s_ease]"
                        >
                            {/* Top Right Close */}
                            <button
                                onClick={() => setShowUpload(false)}
                                className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
                            >
                                <i className="ri-close-line text-2xl" />
                            </button>

                            {/* Title */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <i className="ri-upload-cloud-2-line text-[#a855f7] text-2xl" />
                                    Upload Item
                                </h2>

                                {/* Extra Cross Icon beside title */}
                                <button
                                    onClick={() => setShowUpload(false)}
                                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                                >
                                    <RxCross2 />
                                </button>
                            </div>

                            {/* Upload Form */}
                            <form onSubmit={handleUpload}>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const droppedFile = e.dataTransfer.files[0];
                                        setUploadFile(droppedFile);
                                        setPreviewInfo(
                                            droppedFile
                                                ? `${droppedFile.name} (${(droppedFile.size / 1024).toFixed(1)} KB)`
                                                : ""
                                        );
                                    }}
                                    className="relative flex flex-col items-center justify-center h-52 border-2 border-dashed border-white/20 rounded-xl bg-[#131c2f] cursor-pointer hover:border-[#a855f7]/60 transition"
                                >
                                    {/* Inner close icon */}
                                    {previewInfo && (
                                        <button
                                            onClick={() => {
                                                setUploadFile(null);
                                                setPreviewInfo("");
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition"
                                        >
                                            <i className="ri-close-line text-lg" />
                                        </button>
                                    )}

                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setUploadFile(file);
                                            setPreviewInfo(
                                                file
                                                    ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
                                                    : ""
                                            );
                                        }}
                                    />

                                    <label
                                        htmlFor="file"
                                        className="flex flex-col items-center text-center text-slate-200 px-4"
                                    >
                                        <i className="ri-folder-upload-line text-5xl mb-3 text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                        <p className="text-sm font-medium text-white">
                                            {previewInfo || "Click to browse or drag & drop a file"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Files stored securely in Supabase
                                        </p>
                                    </label>
                                </div>

                                {/* Upload Button */}
                                <button
                                    type="submit"
                                    className="mt-4 w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] text-white font-medium py-2.5 px-4 rounded-full text-sm shadow-lg shadow-purple-500/30 transition"
                                >
                                    <i className="ri-upload-line text-lg" />
                                    Upload Item
                                </button>
                            </form>
                        </div>
                    </div>
                )}



                {/* File List (Drive-like table) */}
                <div className="mt-2 bg-[#0b1426] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* Header row */}
                    <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-slate-300 border-b border-white/5">
                        <div className="col-span-6 flex items-center gap-2">
                            <i className="ri-file-2-line" />
                            <span>Name</span>
                        </div>
                        <div className="hidden md:block col-span-2 text-right">
                            Owner
                        </div>
                        <div className="hidden sm:block col-span-2 text-right">
                            Last modified
                        </div>
                        <div className="col-span-2 text-right">Size</div>
                    </div>

                    {/* Rows */}
                    {files.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm">
                            No files yet. Click <span className="font-medium">New</span> to
                            upload your first file.
                        </div>
                    ) : (
                        <ul>
                            {files.map((file) => (
                                <li
                                    key={file._id}
                                    className="grid grid-cols-12 items-center px-4 py-2 text-sm text-slate-100 hover:bg-white/5 cursor-pointer group transition"
                                >
                                    {/* Name + actions */}
                                    <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 flex items-center justify-center text-[#f472b6] flex-shrink-0 border border-white/10">
                                            {getFileIcon(file)}
                                        </div>
                                        <div className="min-w-0">
                                            <a
                                                href={`/file/${file._id}`}
                                                className="block truncate font-medium hover:underline"
                                            >
                                                {file.originalname}
                                            </a>
                                            <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/file/${file._id}`;
                                                    }}
                                                    className="hover:text-white"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShareFileId(file._id);
                                                        setShowShare(true);
                                                    }}
                                                    className="hover:text-blue-300"
                                                >
                                                    Share
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteFile(file._id);
                                                    }}
                                                    className="hover:text-rose-300"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(file);
                                                    }}
                                                    className="hover:text-emerald-300"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner (placeholder: You) */}
                                    <div className="hidden md:block col-span-2 text-right text-xs text-gray-500 dark:text-gray-400">
                                        You
                                    </div>

                                    {/* Last modified */}
                                    <div className="hidden sm:block col-span-2 text-right text-xs text-slate-400">
                                        {new Date(file.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </div>

                                    {/* Size */}
                                    <div className="col-span-2 text-right text-xs text-slate-400">
                                        {Math.round(file.size / 1024)} KB
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
