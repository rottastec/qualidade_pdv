import Dashboard from './pages/Dashboard';
import PDVs from './pages/PDVs';
import NovoRelatorio from './pages/NovoRelatorio';
import Relatorios from './pages/Relatorios';
import VisualizarRelatorio from './pages/VisualizarRelatorio';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "PDVs": PDVs,
    "NovoRelatorio": NovoRelatorio,
    "Relatorios": Relatorios,
    "VisualizarRelatorio": VisualizarRelatorio,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};