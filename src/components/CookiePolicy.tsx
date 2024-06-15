import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './styles/Cookie/CookiePolicy.module.scss'



export default function CookiePolicy() {
    const navigate = useNavigate();
    const {t} = useTranslation("global")
    
    return (
        <div className={styles.main}>
            <h1>{t("cookie_policy.header")}</h1>
            <p>
                {t("cookie_policy.text_1")}
                <br/>
                {t("cookie_policy.text_2")}
            </p>
            <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => navigate(-1)}>
                <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
                {t("policy_privacy.back")}
            </button>
        </div>
    )
}