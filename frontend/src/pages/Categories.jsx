import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Categories = () => {

    const navigate = useNavigate();



    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(null);


   

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    "/api/categories/getAll"
                );

                setCategories(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Category fetch error:",
                    error
                );

        
                if (error.response?.status === 403) {

                    setError(
                        "You are not authorized to view categories."
                    );

                    return;
                }

                if (error.response?.status !== 401) {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load categories."
                    );
                }

            } finally {

                setLoading(false);

            }
        };

        fetchCategories();

    }, []);



    const filteredCategories = useMemo(() => {

        const value = search
            .trim()
            .toLowerCase();

        if (!value) {
            return categories;
        }

        return categories.filter(
            (category) =>
                category.name
                    ?.toLowerCase()
                    .includes(value)
        );

    }, [categories, search]);


  
    const categoryColors = [
        "bg-blue-50 text-blue-600 ring-blue-100",
        "bg-violet-50 text-violet-600 ring-violet-100",
        "bg-emerald-50 text-emerald-600 ring-emerald-100",
        "bg-orange-50 text-orange-600 ring-orange-100",
        "bg-pink-50 text-pink-600 ring-pink-100",
        "bg-cyan-50 text-cyan-600 ring-cyan-100"
    ];

    const getCategoryColor = (index) => {

        return categoryColors[
            index % categoryColors.length
        ];

    };



    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeleteLoading(id);
            setError("");

            const response = await api.delete(
                `/api/categories/delete/${id}`
            );

            console.log(
                "Category deleted:",
                response.data
            );

            setCategories((previous) =>
                previous.filter(
                    (category) =>
                        category.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete category error:",
                error
            );

            if (error.response?.status === 401) {

                return;
            }

            if (error.response?.status === 403) {

                alert(
                    "You are logged in, but you are not authorized to delete this category."
                );

                return;
            }

            if (error.response?.status === 404) {

                alert(
                    "Category not found."
                );

                return;
            }

            if (error.response?.status >= 500) {

                alert(
                    "Server error. Please try again."
                );

                return;
            }

            alert(
                error.response?.data?.message ||
                "Unable to delete category."
            );

        } finally {

            setDeleteLoading(null);

        }
    };

    return (

        <div className="min-h-full bg-slate-50">

            <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

                <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-blue-600" />

                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                Inventory
                            </span>

                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Categories
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500">
                            Organize and manage your inventory categories.
                        </p>

                    </div>


                    <Link
                        to="/categories/add"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >

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
                                d="M12 4.5v15m7.5-7.5h-15"
                            />

                        </svg>

                        Add Category

                    </Link>

                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Total Categories
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {loading
                                        ? "..."
                                        : categories.length}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Categories in inventory
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">

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
                                        d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3.19c.597 0 1.17.237 1.591.659l7.81 7.81a2.25 2.25 0 0 1 0 3.182l-4.69 4.69a2.25 2.25 0 0 1-3.182 0l-7.81-7.81A2.25 2.25 0 0 1 3 9.94V6.75A2.25 2.25 0 0 1 4.5 5.25Z"
                                    />

                                </svg>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                                    Search Results
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {filteredCategories.length}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Matching categories
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">

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
                                        d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0Z"
                                    />

                                </svg>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                    System Status
                                </p>

                                <div className="mt-2 flex items-center gap-2">

                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                    <p className="text-xl font-bold text-slate-900">
                                        Active
                                    </p>

                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Inventory system is running
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">

                                ✓

                            </div>

                        </div>

                    </div>

                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-5 sm:p-6">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                        All Categories
                                    </h2>

                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                                        {categories.length}
                                    </span>

                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    View and manage your inventory categories.
                                </p>

                            </div>

                          <div className="relative w-full lg:w-80">

    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35m2.1-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
        />
    </svg>

    <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
    />

</div>

                        </div>

                    </div>

                    {error && (

                        <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                            <p className="text-sm font-semibold text-red-700">
                                Error
                            </p>

                            <p className="mt-1 text-xs text-red-600">
                                {error}
                            </p>

                        </div>

                    )}

                    {loading && (

                        <div className="flex min-h-[320px] flex-col items-center justify-center">

                            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="mt-4 text-sm font-medium text-slate-600">
                                Loading categories...
                            </p>

                        </div>

                    )}

                    {!loading &&
                        !error &&
                        filteredCategories.length === 0 && (

                            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-7 w-7"
                                    >

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3.19c.597 0 1.17.237 1.591.659l7.81 7.81a2.25 2.25 0 0 1 0 3.182l-4.69 4.69a2.25 2.25 0 0 1-3.182 0l-7.81-7.81A2.25 2.25 0 0 1 3 9.94V6.75A2.25 2.25 0 0 1 4.5 5.25Z"
                                        />

                                    </svg>

                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                    {search
                                        ? "No categories found"
                                        : "No categories yet"}
                                </h3>

                                <p className="mt-1 max-w-sm text-xs text-slate-400">
                                    {search
                                        ? "Try searching with another category name."
                                        : "Create your first category to organize your products."}
                                </p>

                                {!search && (

                                    <Link
                                        to="/categories/add"
                                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                    >
                                        Add Category
                                    </Link>

                                )}

                            </div>

                        )}

                    {!loading &&
                        filteredCategories.length > 0 && (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b border-slate-100 bg-slate-50/70">

                                            <th className="w-20 px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                #
                                            </th>

                                            <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                Category
                                            </th>

                                            <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                Category ID
                                            </th>

                                            <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {filteredCategories.map(
                                            (category, index) => (

                                                <tr
                                                    key={category.id}
                                                    className="transition-colors hover:bg-slate-50/80"
                                                >

                                                    <td className="px-6 py-4">

                                                        <span className="text-xs font-semibold text-slate-400">
                                                            {String(
                                                                index + 1
                                                            ).padStart(2, "0")}
                                                        </span>

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ring-1 ${getCategoryColor(index)}`}
                                                            >
                                                                {category.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() ||
                                                                    "C"}
                                                            </div>

                                                            <div>

                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    {category.name ||
                                                                        "Unnamed Category"}
                                                                </p>

                                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                                    Inventory category
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[11px] text-slate-500">
                                                            #{category.id}
                                                        </span>

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <div className="flex justify-end">

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    deleteLoading ===
                                                                    category.id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id
                                                                    )
                                                                }
                                                                className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >

                                                                {deleteLoading ===
                                                                category.id ? (

                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

                                                                ) : (

                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.8"
                                                                        stroke="currentColor"
                                                                        className="h-4 w-4"
                                                                    >

                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21H8.084a2.25 2.25 0 0 1-2.244-1.327L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.13 0a48.11 48.11 0 0 1 3.478-.397m0 0V4.5A2.25 2.25 0 0 1 9.35 2.25h5.3a2.25 2.25 0 0 1 2.25 2.25v.893"
                                                                        />

                                                                    </svg>

                                                                )}

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    {!loading &&
                        filteredCategories.length > 0 && (

                            <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <p className="text-xs text-slate-500">

                                    Showing{" "}

                                    <span className="font-semibold text-slate-700">
                                        {filteredCategories.length}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {categories.length}
                                    </span>

                                    {" "}categories

                                </p>


                                {search && (

                                    <button
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Clear search
                                    </button>

                                )}

                            </div>

                        )}

                </section>

            </main>

        </div>
    );
};

export default Categories;