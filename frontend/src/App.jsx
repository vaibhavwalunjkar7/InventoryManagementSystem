import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import Categories from "./pages/Categories";
import AddCategory from "./pages/AddCategory";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";


function App() {

    return (

        <BrowserRouter>

            <Routes>

             

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


            

                <Route element={<ProtectedRoute />}>

                

                    <Route element={<Layout />}>

                      

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />


                      

                        <Route
                            path="/products"
                            element={<Products />}
                        />

                        <Route
                            path="/products/add"
                            element={<AddProduct />}
                        />

                        <Route
                            path="/products/edit/:id"
                            element={<EditProduct />}
                        />



                        <Route
                            path="/categories"
                            element={<Categories />}
                        />

                        <Route
                            path="/categories/add"
                            element={<AddCategory />}
                        />

                    </Route>

                </Route>


                

                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;