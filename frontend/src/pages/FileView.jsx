import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../apiClient";
import { useToast } from "../toastContext";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { SlArrowLeftCircle } from "react-icons/sl";


export default function FileView() {
    const { id } = useParams(); // file id from URL
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchFileAndContent = async () => {
            try {
                setError("");
                setLoading(true);
                // Fetch file metadata
                const res = await api.get(`/api/file/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const fileData = res.data.file;
                setFile(fileData);

                // Fetch actual file content from backend download endpoint
                const downloadRes = await api.get(
                    `/api/file/download/${encodeURIComponent(fileData.path)}`,
                    {
                        responseType: "blob",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                // downloadRes.data is already a Blob with correct type from server
                const blobUrl = window.URL.createObjectURL(downloadRes.data);
                setFileUrl(blobUrl);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Error fetching file:", err);
                setError("Failed to load file");
                toast.error("Failed to load file");
            } finally {
                setLoading(false);
            }
        };

        fetchFileAndContent();
    }, [id]);

    // Cleanup object URL on unmount / change
    useEffect(() => {
        return () => {
            if (fileUrl) {
                window.URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);

    if (error) {
        return (
            <div className="text-center text-red-500 dark:text-red-400 mt-20">
                {error}
            </div>
        );
    }

    if (loading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0b1224] via-[#111c33] to-[#1b1b3a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-100 text-sm">
                    <div className="h-10 w-10 border-4 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading file preview...</span>
                </div>
            </div>
        );

    if (!file || !fileUrl)
        return null;

    return (
        <div className="bg-gradient-to-br from-[#0b1224] via-[#111c33] to-[#1b1b3a] p-4 md:p-8 min-h-screen">
            <div className="max-w-4xl w-full mx-auto bg-[#0b1426]/90 rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 text-white">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <Link
                            to="/home"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] text-white p-2 rounded-full shadow-lg shadow-purple-500/30 transition-colors">
                                <SlArrowLeftCircle className="text-white text-lg" />
                            </div>

                        </Link>
                        <div>
                            <p className="text-xs font-medium text-slate-300">
                                File preview
                            </p>
                            <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-sm">
                                {file.originalname}
                            </p>
                        </div>
                    </div>

                    <a
                        href={fileUrl}
                        download={file.originalname}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full transition-colors shadow-lg shadow-purple-500/30"
                    >
                        <i className="ri-download-line" />
                        <span>Download</span>
                    </a>
                </div>

                {/* File Preview */}
                <div className="my-4 sm:my-6 flex">
                    {file.mimetype?.startsWith("image/") ? (
                        <img
                            src={fileUrl}
                            alt={file.originalname}
                            className="max-w-full w-full rounded shadow border border-white/10 object-contain"
                        />
                    ) : file.mimetype === "application/pdf" ? (
                        <iframe
                            src={fileUrl}
                            width="100%"
                            height="450px"
                            className="rounded border border-white/10 bg-white"
                        />
                    ) : file.mimetype?.startsWith("text/") ? (
                        <iframe
                            src={fileUrl}
                            width="100%"
                            height="300px"
                            className="rounded border border-white/10 bg-white"
                        />
                    ) : (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#a855f7] underline hover:text-[#f472b6] transition-colors block text-center"
                        >
                            Open File
                        </a>
                    )}
                </div>

                {/* File Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-3 mt-2 text-slate-200">
                    <div>
                        <h1 className="text-base sm:text-lg font-semibold text-white">
                            {file.originalname}
                        </h1>
                        <p className="text-xs text-slate-400">
                            {file.mimetype} • {Math.round(file.size / 1024)} KB
                        </p>
                    </div>
                    <div className="text-xs text-slate-400">
                        Uploaded{" "}
                        {new Date(file.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
