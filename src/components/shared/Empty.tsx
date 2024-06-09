import { memo } from "react";
import empty from '../../images/background/no_data.png'
import styles from './styles/Empty/Empty.module.scss'
import { useTranslation } from "react-i18next";

export const Empty = memo(() => {
    const [t] = useTranslation("global")

    return (
        <div className={styles.empty_component}>
            <p className={styles.empty_text}>{t("products.empty")}</p>
            <img src={empty} alt="empty" className={styles.empty_img}/>
        </div>
    )
})