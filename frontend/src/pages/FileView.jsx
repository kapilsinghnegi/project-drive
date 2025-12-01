import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function FileView() {
    const { id } = useParams(); // file id from URL
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await axios.get(`/api/file/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setFile(res.data.file);
            } catch (error) {
                console.error("Error fetching file:", error);
            }
        };

        fetchFile();
    }, [id]);

    if (!file)
        return (
            <div className="text-center text-gray-600 dark:text-gray-300 mt-20">
                Loading...
            </div>
        );

    // Generate public URL (Supabase format, same as EJS)
    const publicUrl = `${import.meta.env.VITE_SUPABASE_URL.replace(
        ".co",
        ".co/storage/v1/object/public"
    )}/drive-storage/${file.path}`;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8 min-h-screen">
            <div className="max-w-xl w-full mx-auto bg-white dark:bg-gray-800 rounded shadow p-4 sm:p-6">
                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to="/home"
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
            text-gray-900 dark:text-white px-2 py-1 rounded transition-colors"
                    >
                        <i className="ri-arrow-left-s-line text-xl sm:text-2xl"></i>
                    </Link>

                    <a
                        href={publicUrl}
                        download={file.originalname}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                    >
                        <i className="ri-download-line text-sm sm:text-base"></i>
                    </a>
                </div>

                {/* File Preview */}
                <div className="my-4 sm:my-6 flex">
                    {file.mimetype.startsWith("image/") ? (
                        <img
                            src={publicUrl}
                            alt={file.originalname}
                            className="max-w-full w-full rounded shadow border border-gray-200 dark:border-gray-700 object-contain"
                        />
                    ) : file.mimetype === "application/pdf" ? (
                        <iframe
                            src={publicUrl}
                            width="100%"
                            height="450px"
                            className="rounded border border-gray-200 dark:border-gray-700"
                        />
                    ) : (
                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 
              dark:hover:text-blue-300 transition-colors block text-center"
                        >
                            Open File
                        </a>
                    )}
                </div>

                {/* File Metadata */}
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {file.originalname}
                </h1>
                <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    <p>Type: {file.mimetype}</p>
                    <p>Size: {Math.round(file.size / 1024)} KB</p>
                    <p>
                        Uploaded:{" "}
                        {new Date(file.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
