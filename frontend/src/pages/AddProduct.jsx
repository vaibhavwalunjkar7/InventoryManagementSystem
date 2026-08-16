import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductForm from "../components/ProductForm";

const AddProduct = () => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [categoryLoading, setCategoryLoading] =
        useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setCategoryLoading(true);
                setError("");

                const response = await api.get(
                    "/api/categories/getAll"
                );

                const data = response.data;

                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Category loading error:",
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
                    "Unable to load categories."
                );

            } finally {

                setCategoryLoading(false);

            }

        };

        fetchCategories();

    }, [navigate]);



    const handleSubmit = async (formData) => {

        try {

            setLoading(true);
            setError("");

           

            const requestData = {

                name: formData.name.trim(),

                sku: formData.sku.trim(),

                price: Number(formData.price),

                quantity: Number(formData.quantity),

                categoryId:
                    Number(formData.categoryId)
            };


            console.log(
                "Product request:",
                requestData
            );


            const response = await api.post(
                "/api/products/add",
                requestData
            );


            console.log(
                "Product added:",
                response.data
            );


            navigate("/products");

        } catch (error) {

            console.error(
                "Add product error:",
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
                "Unable to add product."
            );

        } finally {

            setLoading(false);

        }

    };


   

    return (

        <main className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-4xl">

              

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                            Inventory
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            Add Product
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Add a new product to your inventory.
                        </p>

                    </div>


                    <Link
                        to="/products"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border border-slate-300
                            bg-white
                            px-4 py-2.5
                            text-sm font-semibold
                            text-slate-700
                            shadow-sm
                            transition
                            hover:bg-slate-50
                        "
                    >
                        ←
                        Back to Products
                    </Link>

                </div>



                {error && (

                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                        <p className="text-sm font-medium text-red-700">
                            {error}
                        </p>

                    </div>

                )}



                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* CARD HEADER */}

                    <div className="border-b border-slate-200 px-6 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">
                                +
                            </div>

                            <div>

                                <h2 className="font-semibold text-slate-900">
                                    Product Information
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Enter the details of your new product.
                                </p>

                            </div>

                        </div>

                    </div>


                   

                    <div className="p-6 sm:p-8">

                        {categoryLoading ? (

                            <div className="flex flex-col items-center justify-center py-12">

                                <div className="
                                    h-8 w-8
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-slate-200
                                    border-t-blue-600
                                " />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading categories...
                                </p>

                            </div>

                        ) : categories.length === 0 ? (

                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">

                                <p className="font-semibold text-amber-700">
                                    No categories available.
                                </p>

                                <p className="mt-1 text-sm text-amber-600">
                                    Create a category before adding a product.
                                </p>

                                <Link
                                    to="/categories/add"
                                    className="
                                        mt-3
                                        inline-flex
                                        font-semibold
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Create Category →
                                </Link>

                            </div>

                        ) : (

                            <ProductForm
                                categories={categories}
                                onSubmit={handleSubmit}
                                loading={loading}
                                submitText="Add Product"
                            />

                        )}

                    </div>

                </div>

            </div>

        </main>
    );
};

export default AddProduct;