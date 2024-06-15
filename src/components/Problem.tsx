import { memo } from "react";
import { useTranslation } from "react-i18next";

import down from "../images/background/server_down.png"
import styles from './styles/Problem/Problem.module.scss'



export const Problem = memo(() => {
    const [t] = useTranslation("global")

    return (
        <div className={styles.error}>
            <p className={styles.error_text}>{t("pages.products_page.errors.error_msg")}</p>
            <img src={down} alt="empty" className={styles.error_img}/>
        </div>
    )
})