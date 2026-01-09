import { Navigate, Outlet, useNavigate } from "react-router";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../webservices/auth/api";
import { socket } from "../webservices/webSocket/socket";

export default function ProtectedRoute() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let auth = window.localStorage.getItem("token");
    const { status, loggedUser } = useSelector(store => store.user);

    const fetchProfile = useCallback(async () => {
        if (auth && !status) {
            let response = await getProfile();
            if (!response.success) {
                window.localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            dispatch({ type: "userSlice/SET_USER", payload: response.data })
        }
    }, [auth, dispatch, navigate, status])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile]);


    useEffect(() => {
        if (auth && status) {
            socket.connect();
            socket.emit("join", loggedUser._id);

            return () => {
                socket.disconnect()
            }
        }

    }, [loggedUser._id, auth, status])

    return (
        <>
            {auth ? <Outlet /> : <Navigate to="/login" />}
        </>
    )

}
