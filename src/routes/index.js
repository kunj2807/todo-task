import { useRoutes } from "react-router-dom";
import Register from "../views/auth/Register";
import Login from "../views/auth/Login";
import ProtectedRoute from "../views/auth/ProtectedRoute";
import Dashboard from "../views/dashboard";
import Theme from "../components/theme";

const routes = [
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <ProtectedRoute />,
        children:[
            {
                path:"/",
                element:<Theme/>,
                children:[
                    {
                        path:"/",
                        element:<Dashboard/>
                    }
                ]
            }
        ]
    }
]

const Routes = () => {
   return useRoutes(routes)
}
export default Routes
