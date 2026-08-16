import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setError("");
    };

    const validateForm = () => {
        const email = formData.email.trim();
        const password = formData.password;

        if (!email) {
            return "Please enter your email address.";
        }

        if (email.length > 100) {
            return "Email cannot exceed 100 characters.";
        }

        const emailRegex =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        if (!password) {
            return "Please enter your password.";
        }

        if (password.length < 6) {
            return "Password must contain at least 6 characters.";
        }

        if (password.length > 50) {
            return "Password cannot exceed 50 characters.";
        }

        if (/\s/.test(password)) {
            return "Password cannot contain spaces.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        const requestData = {
            email: formData.email.trim().toLowerCase(),
            password: formData.password
        };

        try {
            const response = await api.post(
                "/api/auth/login",
                requestData
            );

            const {
                token,
                name,
                email,
                role
            } = response.data;

            if (!token) {
                setError(
                    "Login successful, but authentication token was not received."
                );
                return;
            }

            localStorage.setItem("token", token);

            const user = {
                name: name || "User",
                email: email || requestData.email,
                role: role || "USER"
            };

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            navigate("/");

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Invalid email or password."
                );
            } else if (error.request) {
                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            } else {
                setError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">

                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-md">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="h-6 w-6 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 8.25h7.5M8.25 12h7.5M8.25 15.75h4.5"
                            />
                        </svg>

                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        InventoryPro
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Inventory Management System
                    </p>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Welcome Back
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Sign in to your account to continue.
                        </p>

                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.125 3.75h3.75l7.125 12.75A2.25 2.25 0 0 1 19.034 19.5H4.966a2.25 2.25 0 0 1-1.966-3L10.125 3.75Z"
                                />
                            </svg>

                            <p className="text-sm text-red-600">
                                {error}
                            </p>

                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        noValidate
                    >

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                maxLength={100}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    maxLength={50}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                                >

                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.8"
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c1.667 0 3.233-.385 4.623-1.07M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.774 3.162 10.066 7.5a10.523 10.523 0 0 1-4.293 5.273M6.228 6.228 3 3m3.228 3.228 3.055 3.055m0 0a3 3 0 1 0 4.243 4.243m0 0 3.055 3.055"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.8"
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7Z"
                                            />

                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            />
                                        </svg>
                                    )}

                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading ? (
                                <span className="flex items-center justify-center gap-2">

                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                                        />
                                    </svg>

                                    Signing In...

                                </span>
                            ) : (
                                "Sign In"
                            )}

                        </button>

                    </form>

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Create Account
                            </Link>

                        </p>

                    </div>

                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © 2026 InventoryPro. All rights reserved.
                </p>

            </div>

        </div>
    );
};

export default Login;