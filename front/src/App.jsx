import React from "react";
import AppLayout from "./layouts/appLayout/AppLayout.jsx";
import PageNotFound from "./pages/notFound/PageNotFound.jsx";
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import Home from "./pages/home/Home.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <PageNotFound />
    }
])

const App = () => {
    return(
        <AppLayout>
            <RouterProvider router={router} />
        </AppLayout>
    )
}

export default App;