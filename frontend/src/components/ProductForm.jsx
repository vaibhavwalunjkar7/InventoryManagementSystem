import { useEffect, useState } from "react";

const ProductForm = ({
    initialData = null,
    categories = [],
    onSubmit,
    loading = false,
    submitText = "Save Product"
}) => {

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        price: "",
        quantity: "",
        categoryId: ""
    });

    useEffect(() => {

        if (!initialData) {
            return;
        }

        setFormData({
            name: initialData.name || "",
            sku: initialData.sku || "",
            price: initialData.price ?? "",
            quantity: initialData.quantity ?? "",
            categoryId:
                initialData.categoryId ??
                initialData.category?.id ??
                ""
        });

    }, [
        initialData?.name,
        initialData?.sku,
        initialData?.price,
        initialData?.quantity,
        initialData?.categoryId,
        initialData?.category?.id
    ]);



    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


   

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log("FORM DATA:", formData);

        onSubmit(formData);

    };


    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            

            <div>

                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Product Name
                    <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    autoComplete="off"
                    className="
                        w-full rounded-lg
                        border border-slate-300
                        bg-white px-4 py-3
                        text-sm text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                />

            </div>


         
            <div>

                <label
                    htmlFor="sku"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    SKU
                    <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                    id="sku"
                    name="sku"
                    type="text"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Enter product SKU"
                    required
                    autoComplete="off"
                    className="
                        w-full rounded-lg
                        border border-slate-300
                        bg-white px-4 py-3
                        text-sm text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                />

                <p className="mt-1.5 text-xs text-slate-400">
                    Enter a unique SKU for this product.
                </p>

            </div>



            <div className="grid gap-5 sm:grid-cols-2">

          
                <div>

                    <label
                        htmlFor="price"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Price
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">

                        <span className="
                            absolute left-4 top-1/2
                            -translate-y-1/2
                            text-sm text-slate-500
                        ">
                            ₹
                        </span>

                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            className="
                                w-full rounded-lg
                                border border-slate-300
                                bg-white
                                py-3 pl-9 pr-4
                                text-sm text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>

                </div>


                {/* QUANTITY */}

                <div>

                    <label
                        htmlFor="quantity"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Quantity
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        required
                        className="
                            w-full rounded-lg
                            border border-slate-300
                            bg-white px-4 py-3
                            text-sm text-slate-900
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />

                </div>

            </div>


        

            <div>

                <label
                    htmlFor="categoryId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Category
                    <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    disabled={categories.length === 0}
                    className="
                        w-full rounded-lg
                        border border-slate-300
                        bg-white px-4 py-3
                        text-sm text-slate-900
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                    "
                >

                    <option value="">
                        {categories.length === 0
                            ? "No categories available"
                            : "Select a category"
                        }
                    </option>

                    {categories.map((category) => (

                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>

            </div>



            <div className="
                flex flex-col-reverse
                gap-3
                border-t border-slate-200
                pt-6
                sm:flex-row
                sm:justify-end
            ">

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={loading}
                    className="
                        rounded-lg
                        border border-slate-300
                        bg-white px-5 py-3
                        text-sm font-semibold
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        disabled:opacity-60
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={loading || categories.length === 0}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-6 py-3
                        text-sm font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {loading ? "Saving..." : `+ ${submitText}`}

                </button>

            </div>

        </form>
    );
};

export default ProductForm;