import React from "react";
import AppLayout from "./layouts/appLayout/AppLayout.jsx";
import PageNotFound from "./pages/notFound/PageNotFound.jsx";
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import { deleteUser, editUser, getAllTeachers, getAllUsers } from "./utils/api.js";

const router = createBrowserRouter([
    {
        path: '/',
        element: <div>pines</div>,
        errorElement: <PageNotFound />
    }
])

const App = () => {

    (async () => {
        console.log(await editUser({id: '661eb604ba75888351b97a27', firstName: 'pipipi'}))
    })()

    return(
        <AppLayout>
            <RouterProvider router={router} />
        </AppLayout>
    )
}

export default App;