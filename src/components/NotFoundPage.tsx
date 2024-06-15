import { useTranslation } from "react-i18next";

import styles from "./styles/NotFound/Notfound.module.scss";



export default function NotFoundPage() {
    const [t] = useTranslation("global")
    
    return (
        <>
            <div className={styles.error_page}>
                <h1 data-h1="404">404</h1>
                <p data-p="Page Not Found">{t("pages.not_found_page.message")}<span>.</span></p>
            </div>
        </>
    )
}