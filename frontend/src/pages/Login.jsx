import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/api/user/login", formData);

            // Save token
            localStorage.setItem("token", res.data.token);

            // Redirect to home page
            navigate("/home");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md mx-auto px-6 py-8 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Login
                </h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="John"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
          focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center 
          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
