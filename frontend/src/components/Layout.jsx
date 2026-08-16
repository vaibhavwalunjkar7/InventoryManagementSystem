import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";

const Layout = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userMenuRef = useRef(null);


   

    const [user, setUser] = useState({
        name: "User",
        email: "",
        role: "USER",
    });


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

            } else {

                // Fallback to JWT

                const decodedToken = jwtDecode(token);

                setUser({
                    name: decodedToken.name || "User",
                    email: decodedToken.sub || "",
                    role: decodedToken.role || "USER",
                });

            }

        } catch (error) {

            console.error("Invalid user data:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");
        }

    }, [navigate]);



    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUserMenuOpen(false);

        navigate("/login");
    };


    const getPageTitle = () => {

        if (location.pathname === "/") {
            return "Dashboard";
        }

        if (location.pathname.startsWith("/products")) {
            if (location.pathname === "/products/add") {
                return "Add Product";
            }

            if (location.pathname.startsWith("/products/edit")) {
                return "Edit Product";
            }

            return "Products";
        }

        if (location.pathname.startsWith("/categories")) {

            if (location.pathname === "/categories/add") {
                return "Add Category";
            }

            return "Categories";
        }

        return "Inventory";
    };


    const userName =
        user.name?.trim() || "User";

    const firstName =
        userName.split(" ")[0];

    const userInitial =
        firstName.charAt(0).toUpperCase();



    return (

        <div className="min-h-screen bg-slate-100">



            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />



            <div className="min-h-screen lg:ml-64">



                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">


                    {/* Mobile Menu */}

                    <button
                        onClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                        className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                    >

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
                                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                            />

                        </svg>

                    </button>


                  
                    <div className="ml-3 lg:ml-0">

                        <div className="flex items-center gap-2">

                            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                                {getPageTitle()}
                            </h2>

                        </div>

                    </div>


              

                    <div className="ml-auto flex items-center gap-3">




                        <div className="hidden h-8 w-px bg-slate-200 sm:block" />


                        <div
                            ref={userMenuRef}
                            className="relative"
                        >

                          
                            <button
                                onClick={() =>
                                    setUserMenuOpen(!userMenuOpen)
                                }
                                className={`group flex items-center gap-2 rounded-xl p-1.5 pr-2 transition-all hover:bg-slate-100 ${
                                    userMenuOpen
                                        ? "bg-slate-100"
                                        : ""
                                }`}
                            >

                                {/* Avatar */}

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm ring-2 ring-blue-100 transition group-hover:ring-blue-200">
                                    {userInitial}
                                </div>



                                <div className="hidden text-left sm:block">

                                    <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
                                        {firstName}
                                    </p>

                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        {user.role}
                                    </p>

                                </div>


                                

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${
                                        userMenuOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m6 9 6 6 6-6"
                                    />

                                </svg>

                            </button>


                            {userMenuOpen && (

                                <div className="absolute right-0 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">


                                    {/* User Header */}

                                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white ring-2 ring-white/20">
                                                {userInitial}
                                            </div>


                                            <div className="min-w-0">

                                                <p className="truncate font-semibold text-white">
                                                    {userName}
                                                </p>

                                                <p className="truncate text-xs text-blue-100">
                                                    {user.email || "No email available"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* User Information */}

                                    <div className="p-3">


                                        {/* Name */}

                                        <div className="flex items-center gap-3 rounded-xl px-3 py-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

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
                                                        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                                                    />

                                                </svg>

                                            </div>


                                            <div className="min-w-0">

                                                <p className="text-xs text-slate-400">
                                                    Name
                                                </p>

                                                <p className="truncate text-sm font-medium text-slate-700">
                                                    {userName}
                                                </p>

                                            </div>

                                        </div>


                                

                                        <div className="flex items-center gap-3 rounded-xl px-3 py-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

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
                                                        d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0L12 13.5 2.25 6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25"
                                                    />

                                                </svg>

                                            </div>


                                            <div className="min-w-0">

                                                <p className="text-xs text-slate-400">
                                                    Email
                                                </p>

                                                <p className="truncate text-sm font-medium text-slate-700">
                                                    {user.email || "Not available"}
                                                </p>

                                            </div>

                                        </div>



                                        <div className="flex items-center gap-3 rounded-xl px-3 py-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

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
                                                        d="M9 12.75 11.25 15 15 9.75m6.75 2.25a9.75 9.75 0 1 1-19.5 0 9.75 9.75 0 0 1 19.5 0Z"
                                                    />

                                                </svg>

                                            </div>


                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Role
                                                </p>

                                                <span className="mt-0.5 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                                    {user.role}
                                                </span>

                                            </div>

                                        </div>


                                    

                                        <div className="my-2 border-t border-slate-100" />


                                      
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

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
                                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
                                                    />

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 12h9m0 0-3-3m3 3-3 3"
                                                    />

                                                </svg>

                                            </div>

                                            <span>
                                                Logout
                                            </span>

                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </header>


              
                <Outlet />

            </div>

        </div>
    );
};

export default Layout;