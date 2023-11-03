import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Surveys from "./views/Surveys";
import Login from "./views/Login";
import Signup from "./views/Signup";
import GuestLayout from "./layouts/GuestLayout";
import DefaultLayout from "./layouts/DefaultLayout";

const router = createBrowserRouter ([

    {
        path:'/',
        element:<DefaultLayout />,
        children:[
            {
                path:'/',
                element: <Navigate to='/dashboard'/>
            },
            {
                path:'/dashboard',
                element: <Dashboard />
            },
            
            {
                path:'/surveys',
                element: <Surveys />
            }
        ]
    },
    {
        path:'/',
        element: <GuestLayout />,
        children:[
            {
                path:'/login',
                element: <Login />
            },
            
            {
                path:'/signup',
                element: <Signup />
            }
        ]
    },
    
    
]);

export default router;