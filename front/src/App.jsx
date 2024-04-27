import React, { createContext, useState } from "react";
import AppLayout from "./layouts/appLayout/AppLayout.jsx";
import PageNotFound from "./pages/notFound/PageNotFound.jsx";
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import Home from "./pages/home/Home.jsx";
import { UserPage } from "./pages/userPage/UserPage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <PageNotFound />
    },
    {
        path: '/user-page',
        element: <UserPage />,
        errorElement: <PageNotFound />,
        children: [
            {
                path: 'stats',
                element: <UserPage />
            }
        ]
    }
])

export const UserContext = createContext();

const initialState = JSON.parse(localStorage.getItem('user'));

const App = () => {

    const [userContext, setUserContext] = useState(initialState);

    return(
        <UserContext.Provider value={{userContext, setUserContext}}>
            <AppLayout>
                <RouterProvider router={router} />
            </AppLayout>
        </UserContext.Provider>
    )
}

export default App;