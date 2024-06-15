import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './styles/Cookie/CookiePolicy.module.scss'



export default function CookiePolicy() {
    const navigate = useNavigate();
    const {t} = useTranslation("global")
    
    return (
        <div className={styles.main}>
            <h1>{t("pages.cookie_policy_page.header")}</h1>
            <p>
                {t("pages.cookie_policy_page.text_1")}
                <br/>
                {t("pages.cookie_policy_page.text_2")}
            </p>
            <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => navigate(-1)}>
                {t("buttons.back")}
            </button>
        </div>
    )
}