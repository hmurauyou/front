import { useNavigate } from 'react-router-dom';
import styles from './styles/cookie/CookiePolicy.module.scss'
import { useTranslation } from 'react-i18next';

export default function CookiePolicy() {
    const navigate = useNavigate();
    const {t} = useTranslation("global")
    
    return (
        <div className={styles.main}>
            <h1>Политика использования файлов cookie</h1>
            <p>
                Cookie - файлы - это текстовая строка информации, которую веб-сервер передает в браузер Вашего устройства (компьютер, ноутбук, смартфон, планшет), и которая далее хранится там.
                Наш сайт использует файлы cookie и похожие технологии, чтобы гарантировать максимальное удобство пользователям, предоставляя персонализированную информацию, запоминая предпочтения в области маркетинга и продукции, а также помогая получить правильную информацию.
                <br/>При использовании данного сайта, вы подтверждаете свое согласие на использование файлов cookie в соответствии с настоящим уведомлением в отношении данного типа файлов.
                Если вы не согласны с тем, чтобы мы использовали данный тип файлов, то вы должны соответствующим образом установить настройки вашего браузера или не использовать данный сайт.
            </p>
            <button className={`btn btn-primary btn_inside ${styles.btn_width}`} type="button" onClick={() => navigate(-1)}>
                <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
                {t("policy_privacy.back")}
            </button>
        </div>
    )
}