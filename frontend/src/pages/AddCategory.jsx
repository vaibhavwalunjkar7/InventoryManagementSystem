import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AddCategory = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Validation
        const categoryName = name.trim();

        if (!categoryName) {
            setError("Please enter a category name.");
            return;
        }


        if (categoryName.length < 2) {
            setError(
                "Category name must contain at least 2 characters."
            );
            return;
        }


        setLoading(true);


        try {

            const response = await api.post(
                "/api/categories/add",
                {
                    name: categoryName
                }
            );


            console.log(
                "Category created:",
                response.data
            );


            setSuccess(
                "Category created successfully!"
            );

            setName("");


            // Redirect after successful creation
            setTimeout(() => {
                navigate("/categories");
            }, 1000);


        } catch (error) {

            console.error(
                "Add category error:",
                error
            );


            // Unauthorized / Forbidden
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");

                return;
            }


            setError(
                error.response?.data?.message ||
                "Failed to create category. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


 

    return (

        <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/40">

            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">


              

                <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">

                    <Link
                        to="/"
                        className="font-medium text-slate-400 transition-colors duration-200 hover:text-blue-600"
                    >
                        Dashboard
                    </Link>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-3.5 w-3.5 text-slate-300"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9 5 7 7-7 7"
                        />
                    </svg>

                    <Link
                        to="/categories"
                        className="font-medium text-slate-400 transition-colors duration-200 hover:text-blue-600"
                    >
                        Categories
                    </Link>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-3.5 w-3.5 text-slate-300"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9 5 7 7-7 7"
                        />
                    </svg>

                    <span className="font-semibold text-slate-700">
                        Add Category
                    </span>

                </div>


             

                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="mb-3 flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-200">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="h-4 w-4 text-white"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />

                                </svg>

                            </span>

                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                                New Category
                            </span>

                        </div>


                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Add Category
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Create a category to keep your inventory
                            organized and easy to manage.
                        </p>

                    </div>


                  

                    <Link
                        to="/categories"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md sm:w-auto"
                    >

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                        >

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />

                        </svg>

                        Back to Categories

                    </Link>

                </div>



                <div className="grid gap-6 lg:grid-cols-12">


                

                    <div className="lg:col-span-4">

                        <div className="relative h-full min-h-[430px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-7 text-white shadow-2xl shadow-blue-200/60">


                        

                            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />

                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5" />

                            <div className="absolute right-12 top-40 h-20 w-20 rounded-full bg-white/5 blur-2xl" />


                            <div className="relative flex h-full flex-col">


                           

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.7"
                                        stroke="currentColor"
                                        className="h-7 w-7"
                                    >

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3.19c.597 0 1.17.237 1.591.659l7.81 7.81a2.25 2.25 0 0 1 0 3.182l-4.69 4.69a2.25 2.25 0 0 1-3.182 0l-7.81-7.81A2.25 2.25 0 0 1 3 9.94V6.75A2.25 2.25 0 0 1 4.5 5.25Z"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7.5 7.5h.008v.008H7.5V7.5Z"
                                        />

                                    </svg>

                                </div>


                                <h2 className="mt-7 text-2xl font-bold tracking-tight">
                                    Organize Your Inventory
                                </h2>


                                <p className="mt-3 text-sm leading-6 text-blue-100">
                                    Categories make it easier to group,
                                    search and manage your products.
                                </p>



                                <div className="mt-8 space-y-5">


                                    {/* Feature */}

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m5 12 4 4L19 6"
                                                />

                                            </svg>

                                        </div>


                                        <div>

                                            <p className="text-sm font-semibold">
                                                Easy organization
                                            </p>

                                            <p className="mt-0.5 text-xs text-blue-200">
                                                Keep products grouped logically.
                                            </p>

                                        </div>

                                    </div>


                                
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m5 12 4 4L19 6"
                                                />

                                            </svg>

                                        </div>


                                        <div>

                                            <p className="text-sm font-semibold">
                                                Faster searching
                                            </p>

                                            <p className="mt-0.5 text-xs text-blue-200">
                                                Find products quickly by category.
                                            </p>

                                        </div>

                                    </div>


                                
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m5 12 4 4L19 6"
                                                />

                                            </svg>

                                        </div>


                                        <div>

                                            <p className="text-sm font-semibold">
                                                Better management
                                            </p>

                                            <p className="mt-0.5 text-xs text-blue-200">
                                                Maintain a clean inventory structure.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                            

                            </div>

                        </div>

                    </div>



                    <div className="lg:col-span-8">

                        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">


                            {/* Form Header */}

                            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-white via-white to-blue-50/60 px-5 py-6 sm:px-8">

                                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl" />

                                <div className="relative flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-200">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.8"
                                                stroke="currentColor"
                                                className="h-6 w-6"
                                            >

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />

                                            </svg>

                                        </div>


                                        <div>

                                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                                Category Information
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                                Enter the details for your new category.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 sm:flex">

                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                            Required
                                        </span>

                                    </div>

                                </div>

                            </div>


                     

                            <form
                                onSubmit={handleSubmit}
                                className="p-5 sm:p-8"
                            >


                                {/* ERROR */}

                                {error && (

                                    <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50">

                                        <div className="flex items-start gap-3 p-4">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

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
                                                        d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.125 3.75h3.75l7.125 12.75A2.25 2.25 0 0 1 19.034 19.5H4.966a2.25 2.25 0 0 1-1.966-3L10.125 3.75Z"
                                                    />

                                                </svg>

                                            </div>


                                            <div className="min-w-0">

                                                <p className="text-sm font-bold text-red-700">
                                                    Unable to create category
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-red-600">
                                                    {error}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )}


                             

                                {success && (

                                    <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">

                                        <div className="flex items-start gap-3 p-4">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m5 12 4 4L19 6"
                                                    />

                                                </svg>

                                            </div>


                                            <div>

                                                <p className="text-sm font-bold text-emerald-700">
                                                    Category created successfully
                                                </p>

                                                <p className="mt-1 text-xs text-emerald-600">
                                                    Redirecting to categories...
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )}


                                <div>

                                    <div className="mb-3 flex items-center justify-between">

                                        <label
                                            htmlFor="name"
                                            className="text-sm font-bold text-slate-800"
                                        >

                                            Category Name

                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>

                                        </label>


                                        <span
                                            className={`rounded-md px-2 py-1 text-xs font-semibold ${
                                                name.length >= 90
                                                    ? "bg-orange-50 text-orange-500"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {name.length}/100
                                        </span>

                                    </div>


                                    <div className="group relative">

                                      

                                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600">

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
                                                    d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3.19c.597 0 1.17.237 1.591.659l7.81 7.81a2.25 2.25 0 0 1 0 3.182l-4.69 4.69a2.25 2.25 0 0 1-3.182 0l-7.81-7.81A2.25 2.25 0 0 1 3 9.94V6.75A2.25 2.25 0 0 1 4.5 5.25Z"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7.5 7.5h.008v.008H7.5V7.5Z"
                                                />

                                            </svg>

                                        </div>


                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => {

                                                setName(e.target.value);

                                                if (error) {
                                                    setError("");
                                                }

                                                if (success) {
                                                    setSuccess("");
                                                }

                                            }}
                                            placeholder="e.g. Electronics"
                                            autoComplete="off"
                                            maxLength={100}
                                            required
                                            disabled={loading}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-800 shadow-inner shadow-slate-100 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:shadow-none focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                    </div>


                                    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                        <p className="text-xs leading-5 text-slate-400">

                                            Use a short and meaningful name such as

                                            <span className="ml-1 font-semibold text-slate-500">
                                                Electronics, Clothing, Furniture
                                            </span>

                                        </p>

                                    </div>

                                </div>


                                {/* Divider */}

                                <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />



                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                  

                                    <Link
                                        to="/categories"
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                                    >
                                        Cancel
                                    </Link>


                                 

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                    >

                                        {loading ? (

                                            <>

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

                                                Creating...

                                            </>

                                        ) : (

                                            <>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
                                                >

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 4.5v15m7.5-7.5h-15"
                                                    />

                                                </svg>

                                                Create Category

                                            </>

                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            

            </main>

        </div>
    );
};

export default AddCategory;