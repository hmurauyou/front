import { memo } from "react";
import styles from './styles/Problem/Problem.module.scss'
import { useTranslation } from "react-i18next";
import down from "../../images/background/server_down.png"

export const Problem = memo(() => {
    const [t] = useTranslation("global")

    return (
        <div className={styles.error}>
            <p className={styles.error_text}>{t("products.error_msg")}</p>
            <img src={down} alt="empty" className={styles.error_img}/>
        </div>
    )
})