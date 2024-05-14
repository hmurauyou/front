import styles from './styles/footer/Footer.module.scss';
import logo from '../images/logo/500x500.png';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const [t] = useTranslation("global")

    return (
        <>
            <div className={styles.footer_container}>
                <div className={styles.part1}>
                    <div className={styles.company}>
                        <img src={logo} alt="." />
                        <p>{t("footer.website.message")}</p>
                    </div>
                    <div className={styles.info}>
                        <h4>{t("footer.information.subject")}</h4>
                        <p>{t("footer.information.message")}</p>
                    </div>
                    <div className={styles.company_info}>
                        <h4>{t("footer.contacts.subject")}</h4>
                        <div>
                            <p>+375(77)-777-77-77 (BY)</p>
                            <p>+7(993)-777-77-77 (RUS)</p>
                        </div>
                        <div className={styles.contact_section}>
                            <p>{t("footer.contacts.message")}</p>
                            <div className={styles.contacts}>
                                <div className={styles.contacts_box}>
                                    <i className='bx bxl-telegram bx-tada-hover'></i>
                                    <p>@hmurauyou</p>
                                </div>
                                <div className={styles.contacts_box}>
                                    <i className='bx bxs-envelope bx-tada-hover' ></i>
                                    <p>tradeocean.org@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rights}>{t("footer.rights.message")}</div>
            </div>
        </>
    )
}