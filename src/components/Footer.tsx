import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import styles from './styles/Footer/Footer.module.scss';


export default function Footer() {
    const [t] = useTranslation("global")

    return (
        <>
            <div className={styles.footer_container}>
                <div className={styles.rights}>
                    <div className={styles.links_container}>
                        <p>
                            <Link to="/privacy_policy" className={styles.link}>
                                {t("footer.rules.one")}
                            </Link>
                        </p>
                        <p>
                            <Link to="/website_policy" className={styles.link}>
                                {t("footer.rules.two")}
                            </Link>
                        </p>
                        <p>
                            <Link to="/cookie_policy" className={styles.link}>
                                {t("footer.rules.three")}
                            </Link>
                        </p>
                    </div>
                    <p>
                        {t("footer.rules.four")}
                    </p>
                </div>
                <div className={styles.contacts}>
                    <div className={styles.adress}>
                        <p>
                            <strong>
                                {t("footer.address")}:
                            </strong>
                        </p>
                        <p>
                            688 713 Камчатский край, Карагинский р-н, с. Ивашка,
                            ул.Береговая, 2
                        </p>
                    </div>
                    <div className={styles.email}>
                        <p>
                            <strong>
                                {t("footer.email")}:
                            </strong>
                        </p>
                        <p>
                            <a className={styles.link} href="mailto:">kamchatka.business@yandex.ru</a>
                        </p>
                    </div>
                    <div className={styles.phone}>
                        <p>
                            <strong>
                                {t("footer.phone")}:
                            </strong>
                        </p>
                        <p>
                            8 (025) 777−87-37
                        </p>
                        <p>
                            8 (993) 992−17-78
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}