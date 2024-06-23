import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import image from '../images/background/bears.jpg'
import styles from './styles/Confirmation/Confirmation.module.scss';



const ConfirmationPage = () => {
    const [t] = useTranslation("global")
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailId = searchParams.get('email_id');
        const secretCode = searchParams.get('secret_code');

        if (!emailId || !secretCode) {
            navigate('/not_found');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.20.10.6:30001/contacts/confirmation?email_id=${emailId}&secret_code=${secretCode}`);
                console.log(response)
                if (response.status === 400) {
                    navigate("/not_found")
                    throw new Error('Contact has been already verified...');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate("/not_found")
            }
        };

        fetchData();
    }, [location.search, navigate]);

    
    return (
        <section className={styles.confirmation}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.confirmation_heading}>
                        <h1>{t("pages.confirmation_page.message")}<span>.</span></h1>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.image_wrapper}>
                        <img src={image} alt="" />
                        <div className={styles.wave_wrap}>
                            <svg className={styles.wave} viewBox="0 0 783 1536" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path id={styles.wave} d="M236.705 1356.18C200.542 1483.72 64.5004 1528.54 1 1535V1H770.538C793.858 63.1213 797.23 196.197 624.165 231.531C407.833 275.698 274.374 331.715 450.884 568.709C627.393 805.704 510.079 815.399 347.561 939.282C185.043 1063.17 281.908 1196.74 236.705 1356.18Z" />
                            </svg>
                        </div>
                        <svg className={styles.dashed_wave} viewBox="0 0 345 877" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id={styles.dashed_wave} d="M0.5 876C25.6667 836.167 73.2 739.8 62 673C48 589.5 35.5 499.5 125.5 462C215.5 424.5 150 365 87 333.5C24 302 44 237.5 125.5 213.5C207 189.5 307 138.5 246 87C185 35.5 297 1 344.5 1" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConfirmationPage;
 