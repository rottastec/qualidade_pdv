import Dashboard from './pages/Dashboard';
import PDVs from './pages/PDVs';
import NovoRelatorio from './pages/NovoRelatorio';
import Relatorios from './pages/Relatorios';
import VisualizarRelatorio from './pages/VisualizarRelatorio';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import Users from './pages/Users';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "PDVs": PDVs,
    "NovoRelatorio": NovoRelatorio,
    "Relatorios": Relatorios,
    "VisualizarRelatorio": VisualizarRelatorio,
    "Users": Users,
    "Login": Login,
    "Register": Register,
    "ForgotPassword": ForgotPassword,
    "ResetPassword": ResetPassword,
    "Unauthorized": Unauthorized,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};