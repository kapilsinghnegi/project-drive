import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [previewInfo, setPreviewInfo] = useState("");

    // Fetch files when component loads
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const res = await axios.get("/api/files", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFiles(res.data.files || []);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return alert("Please select a file");

        const formData = new FormData();
        formData.append("file", uploadFile);

        await axios.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        setShowUpload(false);
        fetchFiles();
    };

    const deleteFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;

        await axios.delete(`/api/file/${fileId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        fetchFiles();
    };

    return (
        <main className="p-4 md:p-8 bg-gray-100 dark:bg-gray-800 min-h-screen w-full">
            {/* Top Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
                <button
                    onClick={() => setShowUpload(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full md:w-auto"
                >
                    Upload file
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="bg-gray-700 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full md:w-auto"
                >
                    Logout
                </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                Your Files
            </h1>

            {/* Upload Popup Modal */}
            {showUpload && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
                    <div className="relative w-full md:w-96 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                        <form onSubmit={handleUpload}>
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setUploadFile(file);
                                        setPreviewInfo(file ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)` : "");
                                    }}
                                />
                                <label htmlFor="file" className="text-center text-gray-400 dark:text-gray-300">
                                    <i className="ri-upload-cloud-2-line text-3xl"></i>
                                    <p>{previewInfo || "Click or drag file here"}</p>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded w-full"
                            >
                                Upload
                            </button>
                        </form>
                        <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-3 right-3 text-gray-500 dark:text-gray-300"
                        >
                            <i className="ri-close-large-line text-2xl"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* File List */}
            <div className="grid grid-cols-1 gap-2 mt-4">
                {files.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-2">
                        No files uploaded yet.
                    </div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file._id}
                            className="flex justify-between items-center py-2 px-4 rounded-md bg-white dark:bg-gray-800 shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <h1 className="font-medium truncate">{file.originalname}</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    {new Date(file.createdAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="hidden sm:block text-sm text-gray-500">
                                    {Math.round(file.size / 1024)} KB
                                </span>
                                <a href={`/file/${file._id}`}>
                                    <i className="ri-eye-line text-blue-500 hover:text-blue-700"></i>
                                </a>
                                <button onClick={() => deleteFile(file._id)}>
                                    <i className="ri-delete-bin-line text-red-500 hover:text-red-700"></i>
                                </button>
                                <a href={`/download/${file.path}`} download={file.originalname}>
                                    <i className="ri-download-line text-green-500 hover:text-green-700"></i>
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
