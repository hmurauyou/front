import { Link } from "react-router-dom";
import styles from "./styles/navbar/Navbar.module.scss";
import './styles/navbar/navbar.css';
import logo from '../images/logo/logo_footer.png'
import { useTranslation } from "react-i18next";
import { CiShoppingCart } from "react-icons/ci";
import Cart from "./shared/Cart";

export default function Navbar() {
    const [t, i18next] = useTranslation("global")

    const handleChangeLanguage = (lang: string) => {
        i18next.changeLanguage(lang)
    }

    return (
        <>
            <nav className={`navbar navbar-expand-lg fixed-top`}>
                <div className="container">
                    <Link className="navbar-brand me-auto" to="/"><img src={logo} className={styles.logo} alt="."></img></Link>
                    <div className="offcanvas offcanvas-end" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel"><img src={logo} className={styles.logo} alt="."></img></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body close">
                            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                                <li className="nav-item" data-bs-dismiss="offcanvas">
                                    <Link className="nav-link mx-lg-2" aria-current="page" to="/">{t("header.navbar.home")}</Link>
                                </li>
                                <li className="nav-item" data-bs-dismiss="offcanvas">
                                    <Link className="nav-link mx-lg-2" to="/products">{t("header.navbar.products")}</Link>
                                </li>
                                <li className="nav-item" data-bs-dismiss="offcanvas">
                                    <Link className="nav-link mx-lg-2" to="./contacts">{t("header.navbar.contacts")}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.addition}>
                        <span className={styles.switch}>
                            <input 
                                type="checkbox" 
                                id="switcher" 
                                onChange={() => handleChangeLanguage(i18next.language === "en" ? "rus" : "en")}
                                checked={i18next.language === "rus"}
                            />
                            <label htmlFor="switcher"></label>
                        </span>
                        <div className={styles.cart} data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                            <CiShoppingCart />
                            <div className={styles.total}><span>0</span></div>
                        </div>
                    </div>
                    <button className="navbar-toggler pe-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
            <Cart/>
        </>
    );
}
