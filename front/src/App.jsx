import React from "react";
import AppLayout from "./layouts/appLayout/AppLayout.jsx";
import PageNotFound from "./pages/notFound/PageNotFound.jsx";
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: <div>pines</div>,
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