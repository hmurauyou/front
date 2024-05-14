import { useTranslation } from "react-i18next";
import styles from "./styles/notfound/Notfound.module.scss";

export default function NotFoundPage() {
    const [t] = useTranslation("global")
    
    return (
        <>
            <div className={styles.error_page}>
                <h1 data-h1="404">404</h1>
                <p data-p="Page Not Found">{t("not_found.message")}</p>
            </div>
        </>
    )
}