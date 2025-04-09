import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

const useSessionTimer = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sessionExpiresAt } = useSelector((state) => state.auth);

    useEffect(() => {
        let interval;

        const updateTime = () => {
            if (!sessionExpiresAt) return;

            const remainingTime = sessionExpiresAt - Date.now();
            if (remainingTime <= 2000) {
                setTimeLeft(0);
                clearInterval(interval);
                dispatch(logoutUser())
                    .then(() => navigate("/login"))
                    .catch(error => console.error("Automatic logout failed", error));
            } else {
                setTimeLeft(remainingTime);
            }
        };

        if (sessionExpiresAt) {
            updateTime();
            interval = setInterval(updateTime, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [sessionExpiresAt, navigate, dispatch]);

    return timeLeft;
};

export default useSessionTimer;