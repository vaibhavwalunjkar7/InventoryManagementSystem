import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const Dashboard = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [user, setUser] = useState({
        name: "User",
        email: "",
        role: "USER",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            const savedUser = localStorage.getItem("user");

            if (savedUser) {

                const parsedUser = JSON.parse(savedUser);

                setUser({
                    name: parsedUser.name || "User",
                    email: parsedUser.email || "",
                    role: parsedUser.role || "USER",
                });

                return;
            }

            const decodedToken = jwtDecode(token);

            setUser({
                name: decodedToken.name || "User",
                email: decodedToken.sub || "",
                role: decodedToken.role || "USER",
            });

        } catch (error) {

            console.error("Invalid user data:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");
        }

    }, [navigate]);

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const [
                    productsResponse,
                    categoriesResponse
                ] = await Promise.all([
                    api.get("/api/products/list"),
                    api.get("/api/categories/getAll")
                ]);

                setProducts(
                    Array.isArray(productsResponse.data)
                        ? productsResponse.data
                        : []
                );

                setCategories(
                    Array.isArray(categoriesResponse.data)
                        ? categoriesResponse.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Dashboard data error:",
                    error
                );

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                }

            } finally {

                setLoading(false);

            }
        };

        fetchDashboardData();

    }, [navigate]);

    const lowStockProducts = products.filter(
        (product) =>
            Number(product.quantity || 0) <= 10
    );


    const outOfStockProducts = products.filter(
        (product) =>
            Number(product.quantity || 0) === 0
    );


    const inventoryValue = products.reduce(
        (total, product) => {

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(product.quantity) || 0;

            return total + (price * quantity);

        },
        0
    );

    const userName =
        user.name?.trim() || "User";

    const userInitial =
        userName.charAt(0).toUpperCase();

    const getProductStatus = (quantity) => {

        if (quantity === 0) {
            return {
                text: "Out of Stock",
                className:
                    "bg-red-50 text-red-700 ring-red-600/10",
            };
        }

        if (quantity <= 10) {
            return {
                text: "Low Stock",
                className:
                    "bg-amber-50 text-amber-700 ring-amber-600/10",
            };
        }

        return {
            text: "In Stock",
            className:
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
        };
    };

    if (loading) {

        return (

            <main className="p-4 sm:p-6 lg:p-8">

                <div className="mb-8">

                    <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />

                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {[1, 2, 3, 4].map((item) => (

                        <div
                            key={item}
                            className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
                        />

                    ))}

                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-3">

                    <div className="h-96 animate-pulse rounded-2xl bg-white xl:col-span-2" />

                    <div className="h-96 animate-pulse rounded-2xl bg-white" />

                </div>

            </main>
        );
    }


    return (

        <main className="p-4 sm:p-6 lg:p-8">

            <section className="mb-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Inventory Overview
                            </span>

                        </div>


                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">

                            Welcome back,{" "}

                            <span className="text-blue-600">
                                {userName}
                            </span>

                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Here's what's happening with your inventory today.
                            Keep track of your products, stock levels and inventory value.
                        </p>

                    </div>

                    <Link
                        to="/products/add"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 sm:w-auto"
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

                        Add Product

                    </Link>

                </div>

            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-150" />

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Products
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                {products.length}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Products in inventory
                            </p>

                        </div>


                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

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
                                    d="m21 7.5-9-4.5-9 4.5m18 0-9 4.5m9-4.5v9l-9 4.5m0-9L3 7.5m9 4.5v9m-9-13.5v9l9 4.5"
                                />

                            </svg>

                        </div>

                    </div>

                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-50 transition-transform duration-300 group-hover:scale-150" />

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Categories
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                {categories.length}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Product categories
                            </p>

                        </div>


                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

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

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 transition-transform duration-300 group-hover:scale-150" />

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Low Stock
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                {lowStockProducts.length}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Need attention
                            </p>

                        </div>


                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

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
                                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.125 3.75h3.75l7.125 12.75A2.25 2.25 0 0 1 19.034 19.5H4.966a2.25 2.25 0 0 1-1.966-3L10.125 3.75Z"
                                />

                            </svg>

                        </div>

                    </div>

                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 transition-transform duration-300 group-hover:scale-150" />

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Inventory Value
                            </p>

                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                ₹{inventoryValue.toLocaleString("en-IN")}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                Total stock value
                            </p>

                        </div>


                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

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
                                    d="M12 6v12m3-9.75c0-1.243-1.343-2.25-3-2.25s-3 1.007-3 2.25 1.343 2.25 3 2.25 3 1.007 3 2.25-1.343 2.25-3 2.25-3 1.007-3 2.25 1.343 2.25 3 2.25 3-1.007 3-2.25"
                                />

                            </svg>

                        </div>

                    </div>

                </div>

            </section>

            {outOfStockProducts.length > 0 && (

                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">

                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">

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
                                    d="M12 9v3m0 3h.01M10.29 3.86l-7.82 13.5A1.5 1.5 0 0 0 3.77 19.6h16.46a1.5 1.5 0 0 0 1.29-2.24l-7.82-13.5a1.5 1.5 0 0 0-2.58 0Z"
                                />

                            </svg>

                        </div>


                        <div>

                            <p className="font-semibold text-red-800">
                                Stock alert
                            </p>

                            <p className="mt-0.5 text-sm text-red-600">
                                {outOfStockProducts.length} product
                                {outOfStockProducts.length > 1 ? "s are" : " is"} currently out of stock.
                            </p>

                        </div>

                    </div>


                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        View Products
                    </Link>

                </div>

            )}

            <section className="mt-6 grid gap-6 xl:grid-cols-3">

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <h2 className="font-semibold text-slate-900">
                                    Recent Products
                                </h2>

                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                    {products.length}
                                </span>

                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                Latest products in your inventory
                            </p>

                        </div>


                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >

                            View All

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
                                    d="M5 12h14m-6-6 6 6-6 6"
                                />

                            </svg>

                        </Link>

                    </div>

                    {products.length === 0 ? (

                        <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-8 w-8 text-slate-400"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 7.5-9-4.5-9 4.5m18 0-9 4.5m9-4.5v9l-9 4.5m0-9L3 7.5m9 4.5v9m-9-13.5v9l9 4.5"
                                    />

                                </svg>

                            </div>


                            <h3 className="mt-4 font-semibold text-slate-700">
                                No products yet
                            </h3>


                            <p className="mt-1 max-w-sm text-sm text-slate-400">
                                Add your first product to start managing your inventory.
                            </p>


                            <Link
                                to="/products/add"
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >

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
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />

                                </svg>

                                Add Product

                            </Link>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[600px] text-left text-sm">

                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">

                                    <tr>

                                        <th className="px-5 py-3 font-semibold">
                                            Product
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Price
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Quantity
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {products
                                        .slice(0, 5)
                                        .map((product) => {

                                            const quantity =
                                                Number(product.quantity) || 0;

                                            const price =
                                                Number(product.price) || 0;

                                            const status =
                                                getProductStatus(quantity);

                                            return (

                                                <tr
                                                    key={product.id}
                                                    className="group transition hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-semibold text-blue-600">

                                                                {product.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() || "P"}

                                                            </div>


                                                            <div className="min-w-0">

                                                                <p className="truncate font-semibold text-slate-800">
                                                                    {product.name}
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-slate-400">
                                                                    Product #{product.id}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="px-5 py-4 font-medium text-slate-700">

                                                        ₹
                                                        {price.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </td>

                                                    <td className="px-5 py-4 text-slate-600">

                                                        {quantity}

                                                    </td>

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
                                                        >

                                                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                                                            {status.text}

                                                        </span>

                                                    </td>

                                                </tr>

                                            );
                                        })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-5 py-5">

                        <h2 className="font-semibold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Manage your inventory faster
                        </p>

                    </div>


                    <div className="space-y-3 p-5">

                        <Link
                            to="/products/add"
                            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm"
                        >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

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

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-slate-800">
                                    Add Product
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Add a new product
                                </p>

                            </div>


                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14m-6-6 6 6-6 6"
                                />

                            </svg>

                        </Link>

                        <Link
                            to="/categories/add"
                            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
                        >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">

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

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-slate-800">
                                    Add Category
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Create a category
                                </p>

                            </div>


                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-purple-600"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14m-6-6 6 6-6 6"
                                />

                            </svg>

                        </Link>

                        <Link
                            to="/products"
                            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
                        >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">

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
                                        d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12 18.25 18.75 12 18.75 2.25 12 2.25 12Z"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.75"
                                    />

                                </svg>

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-slate-800">
                                    View Products
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Manage inventory
                                </p>

                            </div>


                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14m-6-6 6 6-6 6"
                                />

                            </svg>

                        </Link>

                    </div>

                    <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-4">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs font-medium text-slate-500">
                                    Stock Health
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">

                                    {products.length === 0
                                        ? "No products"
                                        : lowStockProducts.length === 0
                                            ? "All products healthy"
                                            : `${lowStockProducts.length} need attention`
                                    }

                                </p>

                            </div>


                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">

                                <div
                                    className={`h-3 w-3 rounded-full ${
                                        lowStockProducts.length === 0
                                            ? "bg-emerald-500"
                                            : "bg-amber-500"
                                    }`}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Dashboard;