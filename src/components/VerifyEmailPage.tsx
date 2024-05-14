import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './styles/verify/VerifyEmail.module.scss';
import { useTranslation } from 'react-i18next';

const VerifyEmailPage = () => {
    const [t] = useTranslation("global")
    const location = useLocation();
    const [fetchSuccess, setFetchSuccess] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailId = searchParams.get('email_id');
        const secretCode = searchParams.get('secret_code');

        const fetchData = async () => {
            try {
                const response = await fetch(`http://0.0.0.0:1234/contacts/verify_email?email_id=${emailId}&secret_code=${secretCode}`);
                if (response.ok) {
                    setFetchSuccess(true);
                } else {
                    throw new Error('Failed to verify email');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [location.search]);

    return (
        <div className={styles.wrapper}>
            {fetchSuccess ? (
                <h1>{t("verify.message")}<span>.</span></h1>
            ) : (
                <h1>{t("verify.error")}<span>...</span></h1>
            )}
        </div>
    );
};

export default VerifyEmailPage;
