import { Outlet, useNavigation } from "react-router-dom";
import Loading from "./Loading";
import Footer from "../pages/Footer";
import Header from "../pages/Header";


const AppLayout = () => {
    const navigation = useNavigation();

    if (navigation.state === "loading") return <Loading />;

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default AppLayout;

