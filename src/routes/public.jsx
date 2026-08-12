import { Navigate, Outlet } from "react-router";
import Header from "../components/header";
import Footer from "../components/footer";

export default function PublicRoute() {

    if (window.localStorage.getItem("token")) {
        return <Navigate to="/c" />
    }

    return (
        <div className="dark flex flex-col min-h-screen bg-slate-950 text-slate-100 transition-colors duration-200">
            <Header />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}
