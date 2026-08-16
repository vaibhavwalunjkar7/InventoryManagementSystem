import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "User",
        email: ""
    });


    useState(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {

            const decodedToken = jwtDecode(token);

            setUser({
                name: decodedToken.name || "User",
                email: decodedToken.sub || ""
            });

        } catch (error) {

            console.error("Invalid JWT:", error);

        }

    });


   

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };


    const userName = user.name || "User";

    const userInitial = userName
        .trim()
        .charAt(0)
        .toUpperCase();


    return (

        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">

         

            <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Open menu"
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

                <h2 className="text-lg font-semibold text-slate-900">
                    Dashboard
                </h2>

            </div>


         

            <div className="ml-auto flex items-center gap-3">

                <div className="hidden text-right sm:block">

                    <p className="text-sm font-semibold text-slate-800">
                        {userName}
                    </p>

                    <p className="text-xs text-slate-500">
                        {user.email}
                    </p>

                </div>


             
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 ring-4 ring-blue-50 transition hover:bg-blue-200"
                >
                    {userInitial}
                </button>

            </div>

        </header>
    );
};

export default Navbar;