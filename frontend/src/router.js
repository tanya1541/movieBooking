import { createBrowserRouter } from "react-router-dom";

import Register from './components/auth/register';
import Login from './components/auth/login';
import App from "./App";

const router = createBrowserRouter([
    {path: '', element: <App/>},
    {path: 'register', element: <Register/>},
    {path: 'login', element: <Login/>}
]);

export default router;