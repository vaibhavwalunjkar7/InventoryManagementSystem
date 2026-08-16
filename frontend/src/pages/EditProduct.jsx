import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: ""
    });

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                setCategoryLoading(true);
                setError("");

                const [productResponse, categoryResponse] =
                    await Promise.all([
                        api.get(`/api/products/${id}`),
                        api.get("/api/categories/getAll")
                    ]);

                const product = productResponse.data;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price ?? "",
                    quantity: product.quantity ?? "",
                    categoryId:
                        product.categoryId ??
                        product.category?.id ??
                        ""
                });

                setCategories(
                    Array.isArray(categoryResponse.data)
                        ? categoryResponse.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Edit product loading error:",
                    error
                );


                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");

                    return;
                }


                if (error.response?.status === 404) {

                    setError(
                        "Product not found."
                    );

                } else {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load product details."
                    );
                }

            } finally {

                setLoading(false);
                setCategoryLoading(false);
            }

        };


        if (id) {
            fetchData();
        }

    }, [id, navigate]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.name.trim()) {

            setError(
                "Please enter the product name."
            );

            return;
        }


        if (formData.price === "") {

            setError(
                "Please enter the product price."
            );

            return;
        }


        if (Number(formData.price) < 0) {

            setError(
                "Price cannot be negative."
            );

            return;
        }


        if (
            formData.quantity === "" ||
            Number(formData.quantity) < 0
        ) {

            setError(
                "Please enter a valid quantity."
            );

            return;
        }


        if (!formData.categoryId) {

            setError(
                "Please select a category."
            );

            return;
        }


        setSaving(true);


        try {

            const requestData = {

                name: formData.name.trim(),

                description:
                    formData.description.trim(),

                price: Number(formData.price),

                quantity: Number(formData.quantity),

                categoryId:
                    Number(formData.categoryId)
            };


            console.log(
                "Updating product:",
                requestData
            );


            const response = await api.put(
                `/api/products/update/${id}`,
                requestData
            );


            console.log(
                "Product updated:",
                response.data
            );


            setSuccess(
                "Product updated successfully."
            );

            setTimeout(() => {

                navigate("/products");

            }, 800);


        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


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
                "Unable to update product. Please try again."
            );

        } finally {

            setSaving(false);
        }
    };

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-100">

                <div className="lg:ml-64">

                    <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Edit Product
                        </h2>

                    </header>


                    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">

                        <div className="flex flex-col items-center">

                            <svg
                                className="h-8 w-8 animate-spin text-blue-600"
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


                            <p className="mt-3 text-sm text-slate-500">
                                Loading product...
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-slate-100">

            <div className="lg:ml-64">

                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            Edit Product
                        </h2>

                    </div>


                    <div className="ml-auto">

                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >

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
                                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                />

                            </svg>

                            Back to Products

                        </Link>

                    </div>

                </header>

                <main className="p-4 sm:p-6 lg:p-8">


                    <div className="mb-8">

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Edit Product
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the details of your product.
                        </p>

                    </div>


                    <div className="mx-auto max-w-4xl">

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

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
                                                d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L8.25 19.464 3 21l1.536-5.25L16.862 4.487Z"
                                            />

                                        </svg>

                                    </div>


                                    <div>

                                        <h2 className="font-semibold text-slate-900">
                                            Product Information
                                        </h2>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Update the information below and save your changes.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="p-6"
                            >

                                {error && (

                                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

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

                                {success && (

                                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.8"
                                            stroke="currentColor"
                                            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 4.5 4.5 10.5-10.5"
                                            />

                                        </svg>

                                        <p className="text-sm text-emerald-600">
                                            {success}
                                        </p>

                                    </div>

                                )}

                                <div className="grid gap-6 md:grid-cols-2">

                                    <div className="md:col-span-2">

                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Product Name
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter product name"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    <div>

                                        <label
                                            htmlFor="price"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Price
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                                ₹
                                            </span>

                                            <input
                                                id="price"
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-8 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <label
                                            htmlFor="quantity"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Quantity
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="quantity"
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            placeholder="Enter quantity"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    <div className="md:col-span-2">

                                        <label
                                            htmlFor="categoryId"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Category
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            disabled={categoryLoading}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        >

                                            <option value="">
                                                {categoryLoading
                                                    ? "Loading categories..."
                                                    : "Select a category"
                                                }
                                            </option>


                                            {categories.map(
                                                (category) => (

                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="md:col-span-2">

                                        <label
                                            htmlFor="description"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Enter product description..."
                                            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>

                                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

                                    <Link
                                        to="/products"
                                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </Link>


                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {saving ? (

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

                                                Saving Changes...

                                            </>

                                        ) : (

                                            <>
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
                                                        d="m4.5 12.75 4.5 4.5 10.5-10.5"
                                                    />

                                                </svg>

                                                Save Changes
                                            </>

                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default EditProduct;