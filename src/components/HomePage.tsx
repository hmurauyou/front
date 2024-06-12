import React from 'react';
import styles from './styles/home/Home.module.scss';
import video from '../images/video/Kamchatka.mp4';
import { Reveal } from './shared/Reveal';
import { useTranslation } from 'react-i18next';
import caviar from '../images/caviar/photo.png';
import caviar_1 from '../images/caviar/photo_1.png';
import caviar_2 from '../images/caviar/photo_2.png';
import Footer from './Footer';

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
            <h1>{t("home.company")}</h1>
            <h2>{t("home.message")}</h2>
          </div>
        </Reveal>
      </div>
      <div className={styles.images_container}>
        <div className={`${styles.image_block} ${styles.first_image_block}`}>
          <img src={caviar} alt='caviar' className={styles.image} />
          <h4>Горбуша</h4>
          <p className={styles.image_text}>
            Горбуша - наиболее распространенный представитель семейства лососевых, 
            именно поэтому икра этой рыбы является самой популярной для большинства. 
            Обладает по истине классическим вкусом, c легким оттенком горечи.
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/a90dd4fe-0deb-421a-b9bf-09447488f298")}>
            <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
            Подробнее
          </button>
        </div>
        <div className={styles.image_block}>
          <img src={caviar_1} alt='caviar' className={styles.image} />
          <h4>Кета</h4>
          <p className={styles.image_text}>
            Настоящий деликатес, который высоко ценится среди других видов, 
            по размеру уступает только икре чавычи, занесенной в Красную книгу. 
            Не даром икру кеты называют царской, за ее янтарный блеск, 
            крупные зерна и нежный сливочный вкус.
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/78361fc8-9e24-44c7-ba6a-21414f15422b")}>
            <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
            Подробнее
          </button>
        </div>
        <div className={styles.image_block}>
          <img src={caviar_2} alt='caviar' className={styles.image} />
          <h4>Нерка</h4>
          <p className={styles.image_text}>
            Икра нерки является самой дефицитной из всех видов, 
            обладает насыщенными вкусовыми красками, с выраженным оттенком горечи, 
            тем не менее она так нежна, что в буквальном смысле слова, тает во рту.
          </p>
          <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => handleButtonClick("/products/seafood/22d070c5-fc24-4843-9a28-6a2770530714")}>
            <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
            Подробнее
          </button>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default HomePage;
