import { Reveal } from '../shared/Reveal'
import styles from './styles/about/About.module.scss'
import flowers from '../images/flowers/3flowers.png'
import flowers1 from '../images/flowers/3colorfull.png'
import flowers3 from '../images/flowers/3blue.png'
import rose from '../images/flowers/roseflower.png'
import orangeflower from '../images/flowers/orangeflower.png'
import { useTranslation } from 'react-i18next'


export default function AboutPage() {
    const [t] = useTranslation("global")

    return (
        <section className={styles.section_about}>
            <div className={styles.about}>
                <Reveal>
                    <div className={styles.con_first}>
                        <h1 className={styles.header1}>{t("about.section_1.header")}<span>?</span></h1>
                        <div className={styles.nested}>
                            <p className={styles.description}>{t("about.section_1.message")}</p>
                            <img className={styles.image} src={rose} alt='.' />
                        </div>
                    </div>
                </Reveal>
                <Reveal>
                    <div className={styles.con_second}>
                        <h1 className={styles.header2}>{t("about.section_2.header")}<span>.</span></h1>
                        <div className={styles.nested}>
                            <p className={styles.description}>{t("about.section_2.message")}</p>
                            <img className={styles.image} src={orangeflower} alt='.' />
                        </div>
                    </div>
                </Reveal>
                <Reveal>
                    <div className={styles.con_second}>
                        <h1 className={styles.header3}>{t("about.section_3.header")}<span>.</span></h1>
                        <div className={styles.nested}>
                            <p className={styles.description}>{t("about.section_3.message")}</p>
                            <img className={styles.image} src={flowers3} alt='.' />
                        </div>
                    </div>
                </Reveal>
                <Reveal>
                    <div className={styles.con_second}>
                        <h1 className={styles.header4}>{t("about.section_4.header")}<span>.</span></h1>
                        <div className={styles.nested}>
                            <p className={styles.description}>{t("about.section_4.message")}</p>
                            <img className={styles.image} src={flowers1} alt='.' />
                        </div>
                    </div>
                </Reveal>
                <Reveal>
                    <div className={styles.con_third}>
                        <h1 className={styles.header5}>{t("about.section_5.header")}<span>.</span></h1>
                        <div className={styles.nested}>
                            <p className={styles.description}>{t("about.section_5.message")}</p>
                            <img className={styles.image2} src={flowers} alt='.' />
                        </div>
                    </div>
                </Reveal>
            </div>    
        </section>
    )
}