import { useTranslation } from 'react-i18next';

import Footer from './Footer';
import { Reveal } from './shared/Reveal';

import video from '../images/video/Kamchatka.mp4';
import caviar from '../images/caviar/photo.png';
import caviar_1 from '../images/caviar/photo_1.png';
import caviar_2 from '../images/caviar/photo_2.png';
import styles from './styles/Home/Home.module.scss';



function HomePage() {
  const [t] = useTranslation("global");

  const handleButtonClick = (url: string) => {
    window.location.href = url;
  };

  
  return (
    <section className={styles.home_page}>
      <div className={styles.content}>
        <video src={video} className={styles.bg_video} muted autoPlay loop />
        <Reveal>
          <div className={styles.text_container}>
            <h1>{t("pages.home_page.company")}</h1>
            <h2>{t("pages.home_page.message")}</h2>
          </div>
        </Reveal>
      </div>
      <div className={styles.images_container}>
        <div className={`${styles.image_block} ${styles.first_image_block}`}>
          <img src={caviar} alt='caviar' className={styles.image} />
          <h4>{t("pages.home_page.caviar.caviar_1.name")}</h4>
          <p className={styles.image_text}>
            {t("pages.home_page.caviar.caviar_1.description")}
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/ba562a79-175c-4dff-9027-703cc09024cb")}>
              {t("buttons.detailed")}
          </button>
        </div>
        <div className={styles.image_block}>
          <img src={caviar_1} alt='caviar' className={styles.image} />
          <h4>{t("pages.home_page.caviar.caviar_2.name")}</h4>
          <p className={styles.image_text}>
            {t("pages.home_page.caviar.caviar_2.description")}
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/f599bfba-f1c9-4d61-9bfc-4de9253a1515")}>
              {t("buttons.detailed")}
          </button>
        </div>
        <div className={styles.image_block}>
          <img src={caviar_2} alt='caviar' className={styles.image} />
          <h4>{t("pages.home_page.caviar.caviar_3.name")}</h4>
          <p className={styles.image_text}>
            {t("pages.home_page.caviar.caviar_3.description")}
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/b6d694b5-f602-4d5f-a93f-a5e5c3b64148")}>
              {t("buttons.detailed")}
          </button>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default HomePage;
