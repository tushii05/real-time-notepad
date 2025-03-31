import { useEffect, useState } from "react";
import { fetchUser, logOut } from "../api/auth";
import { useNavigate } from "react-router-dom";

const useSessionTimer = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;

        const getSessionExpiry = async () => {
            try {
                const res = await fetchUser();
                const expiresAt = res.sessionExpiresAt;

                const updateTime = async () => {
                    const remainingTime = expiresAt - Date.now();
                    if (remainingTime <= 2000) {
                        setTimeLeft(0);
                        clearInterval(interval);
                        try {
                            await logOut();
                            navigate("/login");
                        } catch (error) {
                            console.error("Automatic logout failed", error);
                        }
                    } else {
                        setTimeLeft(remainingTime);
                    }
                };

                await updateTime();
                interval = setInterval(updateTime, 1000);
            } catch (error) {
                console.error("Error fetching session time", error);
            }
        };

        getSessionExpiry();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [navigate]);

    return timeLeft;
};

export default useSessionTimer;