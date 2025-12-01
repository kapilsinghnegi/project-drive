import { Link } from "react-router-dom";

export default function Index() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Project Drive
                </h1>

                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Go to the{" "}
                    <Link
                        to="/home"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Home Page
                    </Link>{" "}
                    to view your files.
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Register
                    </Link>{" "}
                    now!
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Login
                    </Link>{" "}
                    to access your files.
                </p>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Note: You can only access the home page after logging in.
                </p>
            </div>
        </div>
    );
}
