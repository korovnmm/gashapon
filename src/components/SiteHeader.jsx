import {
    useEffect,
    useState
} from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import { NavBar } from "components";

function SiteHeader(props) {
    const location = useLocation().pathname;
    const [headerIsHidden, hideHeader] = useState(false);

    useEffect(() => {
        if (location === "/login" || location === "/signup") {
            hideHeader(true);
            document.body.classList.add("login-bg");
        } else {
            hideHeader(false);
            document.body.classList.remove("login-bg");
        }

    }, [location]);

    return (
        <header hidden={headerIsHidden}>
            <NavBar />
            <div className="kattapon">カッタ</div>
            <div className="banner" />
        </header>
    );
}

export default SiteHeader;