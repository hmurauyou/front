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
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/48aab4ee-941e-4018-bab6-7f7401f4798c")}>
              {t("buttons.detailed")}
          </button>
        </div>
        <div className={styles.image_block}>
          <img src={caviar_1} alt='caviar' className={styles.image} />
          <h4>{t("pages.home_page.caviar.caviar_2.name")}</h4>
          <p className={styles.image_text}>
            {t("pages.home_page.caviar.caviar_2.description")}
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/336c8983-bfa7-46c5-8e90-29e42d16233b")}>
              {t("buttons.detailed")}
          </button>
        </div>
        <div className={styles.image_block}>
          <img src={caviar_2} alt='caviar' className={styles.image} />
          <h4>{t("pages.home_page.caviar.caviar_3.name")}</h4>
          <p className={styles.image_text}>
            {t("pages.home_page.caviar.caviar_3.description")}
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/9c4a0810-b2b2-4fc1-97fd-b9c8f03fa08a")}>
              {t("buttons.detailed")}
          </button>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default HomePage;
