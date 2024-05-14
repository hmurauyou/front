import React from 'react';
import styles from './styles/home/Home.module.scss';
import video from '../images/video/q4k.mp4';
import { Reveal } from '../shared/Reveal';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const [t] = useTranslation("global")

  return (
    <section className={styles.home_page}>
      <div className={styles.content}>
        <video src={video} className={styles.bg_video} muted autoPlay loop />
          <Reveal>
            <div className={styles.text_container}>
              <h1>Aqua Grand</h1>
              <h2>{t("home.message")}</h2>
            </div>
          </Reveal>
      </div>
    </section>
  );
}

export default HomePage;
