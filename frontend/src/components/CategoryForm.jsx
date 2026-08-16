 import { useEffect, useState } from "react";

const CategoryForm = ({
    initialData = {},
    onSubmit,
    loading = false,
    submitText = "Create Category"
}) => {

    const [name, setName] = useState("");


    

    useEffect(() => {

        setName(initialData?.name || "");

    }, [initialData]);



    const handleSubmit = (e) => {

        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        onSubmit({
            name: name.trim()
        });

    };


    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

          

            <div>

                <label
                    htmlFor="categoryName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Category Name
                </label>

                <input
                    id="categoryName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Electronics"
                    maxLength={100}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-2 flex justify-between">

                    <p className="text-xs text-slate-400">
                        Enter a clear category name.
                    </p>

                    <span className="text-xs text-slate-400">
                        {name.length}/100
                    </span>

                </div>

            </div>


       

            <button
                type="submit"
                disabled={loading || !name.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

                {loading ? (

                    <>
                        <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
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

                        Saving...

                    </>

                ) : (

                    <>
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

                        {submitText}

                    </>

                )}

            </button>

        </form>
    );
};

export default CategoryForm;