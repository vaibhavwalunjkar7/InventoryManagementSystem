import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

    const navigate = useNavigate();


    // =========================================
    // Logout
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };


    // =========================================
    // Navigation item
    // =========================================

    const navClass = ({ isActive }) => {

        return `
            mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5
            text-sm font-medium transition
            ${
                isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }
        `;

    };


    return (

        <>

            {/* Sidebar */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-64 flex-col
                    bg-slate-950
                    transition-transform duration-300
                    lg:translate-x-0
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* =====================================
                    LOGO
                ====================================== */}

                <div className="flex h-16 shrink-0 items-center border-b border-slate-800 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="h-5 w-5 text-white"
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


                        <span className="text-lg font-bold tracking-tight text-white">
                            InventoryPro
                        </span>

                    </div>

                </div>


                {/* =====================================
                    NAVIGATION
                ====================================== */}

                <nav className="flex-1 px-4 py-6">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Main Menu
                    </p>


                    {/* Dashboard */}

                    <NavLink
                        to="/"
                        onClick={() => setSidebarOpen(false)}
                        className={navClass}
                    >

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
                                d="M3 13.125h6V21H3v-7.875ZM15 3h6v18h-6V3ZM9 8.062h6V21H9V8.062Z"
                            />

                        </svg>

                        Dashboard

                    </NavLink>


                    {/* Products */}

                    <NavLink
                        to="/products"
                        onClick={() => setSidebarOpen(false)}
                        className={navClass}
                    >

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

                        Products

                    </NavLink>


                    {/* Categories */}

                    <NavLink
                        to="/categories"
                        onClick={() => setSidebarOpen(false)}
                        className={navClass}
                    >

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

                        Categories

                    </NavLink>

                </nav>


                {/* =====================================
                    LOGOUT
                ====================================== */}

                <div className="shrink-0 border-t border-slate-800 p-4">

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
                    >

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
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v15A2.25 2.25 0 0 0 7.5 22.5h6a2.25 2.25 0 0 0 2.25-2.25V16.5"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9l3 3m0 0-3 3m3-3H3"
                            />

                        </svg>

                        Logout

                    </button>

                </div>

            </aside>


            {/* Mobile Overlay */}

            {sidebarOpen && (

                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
                />

            )}

        </>
    );
};

export default Sidebar;