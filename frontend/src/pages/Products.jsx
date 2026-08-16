import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Products = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/products/list"
            );

            setProducts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(error);

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
                "Unable to load products."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchProducts();

    }, []);

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {

            setDeletingId(id);

            await api.delete(
                `/api/products/delete/${id}`
            );

            setProducts((prev) =>
                prev.filter(
                    (product) => product.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");

                return;
            }

            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );

        } finally {

            setDeletingId(null);

        }
    };

    const getStatus = (quantity) => {

        const stock = Number(quantity) || 0;

        if (stock === 0) {

            return {
                label: "Out of Stock",
                color: "red",
                badge:
                    "bg-red-50 text-red-600 ring-red-500/10",
                dot: "bg-red-500",
            };

        }

        if (stock <= 10) {

            return {
                label: "Low Stock",
                color: "amber",
                badge:
                    "bg-amber-50 text-amber-600 ring-amber-500/10",
                dot: "bg-amber-500",
            };

        }

        return {
            label: "In Stock",
            color: "emerald",
            badge:
                "bg-emerald-50 text-emerald-600 ring-emerald-500/10",
            dot: "bg-emerald-500",
        };
    };

    const filteredProducts = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        return products.filter((product) => {

            const name =
                product.name?.toLowerCase() || "";

            const description =
                product.description?.toLowerCase() || "";

            const matchesSearch =
                !value ||
                name.includes(value) ||
                description.includes(value);

            const quantity =
                Number(product.quantity) || 0;

            let matchesFilter = true;

            if (filter === "IN_STOCK") {
                matchesFilter = quantity > 10;
            }

            if (filter === "LOW_STOCK") {
                matchesFilter =
                    quantity > 0 && quantity <= 10;
            }

            if (filter === "OUT_OF_STOCK") {
                matchesFilter = quantity === 0;
            }

            return matchesSearch && matchesFilter;

        });

    }, [products, search, filter]);

    const totalProducts =
        products.length;

    const totalQuantity =
        products.reduce(
            (sum, product) =>
                sum +
                (Number(product.quantity) || 0),
            0
        );

    const lowStock =
        products.filter(
            (product) => {
                const quantity =
                    Number(product.quantity) || 0;

                return quantity > 0 && quantity <= 10;
            }
        ).length;

    const outOfStock =
        products.filter(
            (product) =>
                Number(product.quantity) === 0
        ).length;

    const inventoryValue =
        products.reduce(
            (sum, product) => {

                const price =
                    Number(product.price) || 0;

                const quantity =
                    Number(product.quantity) || 0;

                return sum + price * quantity;

            },
            0
        );


    const getInitial = (name) => {

        return (
            name
                ?.trim()
                ?.charAt(0)
                ?.toUpperCase() || "P"
        );

    };


    return (

        <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#f6f8fc] p-4 sm:p-6 lg:p-8">


            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

            <div className="relative">

                <section className="mb-8">

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">


                        <div>

                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1.5 backdrop-blur">

                                <span className="relative flex h-2 w-2">

                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />

                                </span>

                                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                                    Inventory
                                </span>

                            </div>


                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">

                                Products

                            </h1>


                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">

                                Keep your inventory organized,
                                monitor stock levels, and manage
                                your products from one place.

                            </p>

                        </div>


                        <Link
                            to="/products/add"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-blue-600/20"
                        >

                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />

                                </svg>

                            </span>

                            Add Product

                        </Link>

                    </div>

                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_8px_30px_rgb(15,23,42,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(15,23,42,0.08)]">

                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/5 transition duration-500 group-hover:scale-150" />

                        <div className="relative">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Total Products
                                    </p>

                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {loading ? "..." : totalProducts}
                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">

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
                                            d="m21 7.5-9-4.5-9 4.5m18 0-9 4.5m9-4.5v9l-9 4.5m0-9L3 7.5m9 4.5v9m-9-13.5v9l9 4.5"
                                        />

                                    </svg>

                                </div>

                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                All products in catalog
                            </p>

                        </div>

                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_8px_30px_rgb(15,23,42,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(15,23,42,0.08)]">

                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/5 transition duration-500 group-hover:scale-150" />

                        <div className="relative">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Total Units
                                    </p>

                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {loading ? "..." : totalQuantity}
                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">

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
                                            d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 9h8M8 12h8M8 15h5"
                                        />

                                    </svg>

                                </div>

                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                Total available quantity
                            </p>

                        </div>

                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_8px_30px_rgb(15,23,42,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(15,23,42,0.08)]">

                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-500/5 transition duration-500 group-hover:scale-150" />

                        <div className="relative">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Stock Alerts
                                    </p>

                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {loading
                                            ? "..."
                                            : lowStock + outOfStock
                                        }
                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">

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

                            </div>

                            <div className="mt-3 flex gap-3 text-xs">

                                <span className="font-medium text-amber-600">
                                    {lowStock} low
                                </span>

                                <span className="text-slate-300">
                                    |
                                </span>

                                <span className="font-medium text-red-500">
                                    {outOfStock} empty
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_8px_30px_rgb(15,23,42,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(15,23,42,0.08)]">

                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/5 transition duration-500 group-hover:scale-150" />

                        <div className="relative">

                            <div className="flex items-start justify-between">

                                <div className="min-w-0">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Inventory Value
                                    </p>

                                    <p className="mt-3 truncate text-2xl font-black text-slate-900">

                                        {loading
                                            ? "..."
                                            : `₹${inventoryValue.toLocaleString("en-IN")}`
                                        }

                                    </p>

                                </div>


                                <div className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">

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
                                            d="M12 6v12m3-9.75c0-1.243-1.343-2.25-3-2.25s-3 1.007-3 2.25 1.343 2.25 3 2.25 3 1.007 3 2.25-1.343 2.25-3 2.25-3 1.007-3 2.25 1.343 2.25 3 2.25 3-1.007 3-2.25"
                                        />

                                    </svg>

                                </div>

                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                Current inventory worth
                            </p>

                        </div>

                    </div>

                </section>


                <section className="mt-6 overflow-hidden rounded-2xl border border-white/80 bg-white/75 shadow-[0_10px_40px_rgb(15,23,42,0.05)] backdrop-blur-xl">

                    <div className="border-b border-slate-200/70 p-4 sm:p-5">

                        <div className="flex flex-col gap-4">


                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                                <div>

                                    <div className="flex items-center gap-2">

                                        <h2 className="text-base font-bold text-slate-900">
                                            Product Inventory
                                        </h2>

                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                                            {filteredProducts.length}
                                        </span>

                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                        View and manage all your products.
                                    </p>

                                </div>

                                <div className="relative w-full lg:w-80">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                        stroke="currentColor"
                                        className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
                                    >

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                                        />

                                    </svg>


                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search products..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                    />


                                    {search && (

                                        <button
                                            onClick={() =>
                                                setSearch("")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                        >

                                            ×

                                        </button>

                                    )}

                                </div>

                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1">

                                {[
                                    ["ALL", "All Products"],
                                    ["IN_STOCK", "In Stock"],
                                    ["LOW_STOCK", "Low Stock"],
                                    ["OUT_OF_STOCK", "Out of Stock"],
                                ].map(
                                    ([value, label]) => (

                                        <button
                                            key={value}
                                            onClick={() =>
                                                setFilter(value)
                                            }
                                            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                                filter === value
                                                    ? "bg-slate-900 text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                            }`}
                                        >

                                            {label}

                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {error && (

                        <div className="m-5 rounded-xl border border-red-100 bg-red-50 p-4">

                            <div className="flex gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">

                                    !

                                </div>

                                <div>

                                    <p className="text-sm font-bold text-red-700">
                                        Unable to load products
                                    </p>

                                    <p className="mt-1 text-xs text-red-600">
                                        {error}
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                    {loading && (

                        <div className="p-5">

                            <div className="space-y-3">

                                {[1, 2, 3, 4, 5].map(
                                    (item) => (

                                        <div
                                            key={item}
                                            className="flex animate-pulse items-center gap-4 rounded-xl bg-slate-50 p-4"
                                        >

                                            <div className="h-11 w-11 rounded-xl bg-slate-200" />

                                            <div className="flex-1">

                                                <div className="h-3 w-40 rounded bg-slate-200" />

                                                <div className="mt-2 h-2 w-24 rounded bg-slate-100" />

                                            </div>

                                            <div className="hidden h-3 w-16 rounded bg-slate-200 sm:block" />

                                            <div className="hidden h-6 w-20 rounded-full bg-slate-200 sm:block" />

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                    {!loading &&
                        !error &&
                        filteredProducts.length > 0 && (

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[760px]">

                                    <thead>

                                        <tr className="border-b border-slate-100 bg-slate-50/50">

                                            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Product
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Price
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Quantity
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Status
                                            </th>

                                            <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {filteredProducts.map(
                                            (product) => {

                                                const quantity =
                                                    Number(
                                                        product.quantity
                                                    ) || 0;

                                                const price =
                                                    Number(
                                                        product.price
                                                    ) || 0;

                                                const status =
                                                    getStatus(
                                                        quantity
                                                    );

                                                return (

                                                    <tr
                                                        key={product.id}
                                                        className="group transition duration-150 hover:bg-blue-50/30"
                                                    >

                                                        <td className="px-5 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-sm">

                                                                    {getInitial(
                                                                        product.name
                                                                    )}

                                                                </div>


                                                                <div className="min-w-0">

                                                                    <p className="truncate text-sm font-bold text-slate-800">
                                                                        {product.name ||
                                                                            "Unnamed Product"}
                                                                    </p>

                                                                    {product.description && (

                                                                        <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                                                                            {
                                                                                product.description
                                                                            }
                                                                        </p>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span className="text-sm font-bold text-slate-700">
                                                                ₹
                                                                {price.toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span className={`text-sm font-bold ${
                                                                quantity === 0
                                                                    ? "text-red-500"
                                                                    : quantity <= 10
                                                                        ? "text-amber-500"
                                                                        : "text-slate-700"
                                                            }`}>
                                                                {quantity}
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${status.badge}`}
                                                            >

                                                                <span
                                                                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                                                />

                                                                {status.label}

                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="flex justify-end gap-1">

                                                                <Link
                                                                    to={`/products/edit/${product.id}`}
                                                                    title="Edit"
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-100 hover:text-blue-600"
                                                                >

                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.8"
                                                                        stroke="currentColor"
                                                                        className="h-4.5 w-4.5"
                                                                    >

                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="m16.862 4.487 1.687-1.688a2.121 2.121 0 0 1 3 3l-9.192 9.193-3.897.866.866-3.897 7.536-7.474Z"
                                                                        />

                                                                    </svg>

                                                                </Link>


                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingId ===
                                                                        product.id
                                                                    }
                                                                    title="Delete"
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-40"
                                                                >

                                                                    {deletingId ===
                                                                    product.id ? (

                                                                        <svg
                                                                            className="h-5 w-5 animate-spin"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                        >

                                                                            <circle
                                                                                cx="12"
                                                                                cy="12"
                                                                                r="9"
                                                                                stroke="currentColor"
                                                                                strokeWidth="3"
                                                                                className="opacity-25"
                                                                            />

                                                                            <path
                                                                                d="M21 12a9 9 0 0 0-9-9"
                                                                                stroke="currentColor"
                                                                                strokeWidth="3"
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
                                                                                d="M6 7.5h12m-10.5 0v11.25A2.25 2.25 0 0 0 9.75 21h4.5a2.25 2.25 0 0 0 2.25-2.25V7.5m-6-3h2.999A1.5 1.5 0 0 1 15 6v1.5H9V6a1.5 1.5 0 0 1 1.5-1.5Z"
                                                                            />

                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M10.5 11.25v6m3-6v6"
                                                                            />

                                                                        </svg>

                                                                    )}

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    {!loading &&
                        !error &&
                        filteredProducts.length === 0 && (

                            <div className="flex min-h-[400px] flex-col items-center justify-center px-5 text-center">

                                <div className="relative">

                                    <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-xl" />

                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-slate-100">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-9 w-9 text-slate-300"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m21 7.5-9-4.5-9 4.5m18 0-9 4.5m9-4.5v9l-9 4.5m0-9L3 7.5m9 4.5v9m-9-13.5v9l9 4.5"
                                            />

                                        </svg>

                                    </div>

                                </div>


                                <h3 className="mt-6 text-lg font-bold text-slate-800">

                                    {search
                                        ? "No products found"
                                        : "Your inventory is empty"
                                    }

                                </h3>


                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">

                                    {search
                                        ? "Try another search term or clear your filters."
                                        : "Add your first product and start managing your inventory."
                                    }

                                </p>


                                {search ? (

                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setFilter("ALL");
                                        }}
                                        className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
                                    >
                                        Clear Filters
                                    </button>

                                ) : (

                                    <Link
                                        to="/products/add"
                                        className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                                    >
                                        Add First Product
                                    </Link>

                                )}

                            </div>

                        )}

                </section>


                {!loading && products.length > 0 && (

                    <div className="mt-4 flex flex-col gap-2 px-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                        <span>
                            Showing{" "}
                            <strong className="text-slate-500">
                                {filteredProducts.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="text-slate-500">
                                {products.length}
                            </strong>{" "}
                            products
                        </span>


                        <span>
                            Inventory value{" "}
                            <strong className="text-slate-500">
                                ₹
                                {inventoryValue.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </span>

                    </div>

                )}

            </div>

        </main>
    );
};

export default Products;