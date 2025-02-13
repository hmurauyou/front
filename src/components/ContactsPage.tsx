import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


import swal from 'sweetalert';
import ReCAPTCHA from 'react-google-recaptcha';
import image from '../images/background/bears.jpg'
import styles from './styles/Contacts/Contacts.module.scss'
import "./styles/Bootstrap/button.scss"

interface FormValues {
    name: string;
    surname: string;
    email: string;
    contact_phone: string;
    message: string;
}



export default function ContactsPage() {
    const [values, setValues] = useState<FormValues>({
        name: "",
        surname: "",
        email: "",
        contact_phone: "",
        message: "",
      });
    const {t} = useTranslation("global")
    const [buttonText, setButtonText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMessageValid, setMessageValid] = useState<boolean>(true);
    const [focusedField, setFocusedField] =  useState<string | null>(null);
    const [notEmpty, setNotEmpty] = useState<{ [key: string]: boolean }>({});
    const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false); 
    const [maxCharsExceeded, setMaxCharsExceeded] = useState<{
        [key: string]: boolean;
    }>({
        name: false,
        surname: false,
        message: false,
    });
    const maxLengths = {
        name: 16,
        surname: 25,
        message: 180,
    }

    useEffect(() => {
        setButtonText(t("buttons.send"))
    }, [t])

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null); 
    };

    const sanitizeInput = (input: string) => {
        return input.replace(/[<>'";]/g, '');
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const maxLength = maxLengths[name as keyof typeof maxLengths];
    
        const truncatedValue = value.slice(0, maxLength);
    
        setValues({ ...values, [name]: truncatedValue });
    
        const isFieldNotEmpty = !!truncatedValue.trim();
        setNotEmpty(prevState => ({
            ...prevState,
            [name]: isFieldNotEmpty,
        }));
    
        const sanitizedValue = name === 'message' ? sanitizeInput(truncatedValue) : truncatedValue; 
        setValues({ ...values, [name]: sanitizedValue });
    
        setMaxCharsExceeded(prevState => ({
            ...prevState,
            [name]: truncatedValue.length >= maxLength,
        }));
    
    
        if (name === 'message') {
            setMessageValid(sanitizedValue.length >= 0 && sanitizedValue.length <= maxLength); 
        }
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();

        if (!isRecaptchaVerified) {
            swal({
                title: t("pages.contacts_page.errors.error"),
                text: t("pages.contacts_page.errors.error_message.text_three"),
                icon: "error",
                buttons: [""],
                timer: 3000
            });
            return;
        }

        if (!isMessageValid) {
            console.error('Invalid message length');
            return;
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://172.20.10.6:30001/contacts/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                swal({
                    title: t("messages.success"),
                    text: t("messages.success_msg"),
                    icon: "success",
                    buttons: [""],
                    timer: 4000
                });

                setValues({
                    name: "",
                    surname: "",
                    email: "",
                    contact_phone: "",
                    message: "",
                });
                setNotEmpty({});
                setFocusedField(null);

                setButtonText(t("messages.thank_you"));
                setTimeout(() => {
                    setButtonText(t("buttons.send"));
                    setIsLoading(false);
                }, 3000);
            } else if (response.status === 400 || 409) {
                swal({
                    title: t("pages.contacts_page.errors.error"),
                    text: t("pages.contacts_page.errors.error_message.text_one"),
                    icon: "error",
                    buttons: [""],
                    timer: 3000
                });
                setIsLoading(false);
            } else {
                console.error('Error sending form data:', response.statusText);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error sending form data:', error);
        } finally {
            setIsLoading(false); 
        }
    };

    
    return (
        <>
            <section className={styles.contact}>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <div className={styles.form_wrapper}>
                            <div className={styles.contact_heading}>
                                <h2>{t("pages.contacts_page.header")}<span>.</span></h2>
                                <p className={styles.text}>{t("pages.contacts_page.sub_header")} <span> </span>
                                    <a className={styles.link} href="mailto:">kamchatka.business@yandex.ru</a>
                                </p>
                            </div>
                            <form method="post" className={styles.contact_form} onSubmit={onSubmit}>
                                <div className={`
                                    ${styles.input_wrap} 
                                    ${focusedField === 'name' ? styles.focus : ""} 
                                    ${(focusedField === 'name' || notEmpty['name']) ? styles.not_empty : ""}
                                    ${maxCharsExceeded['name'] ? styles.max_chars_exceeded : ""}
                                `}>
                                    <input
                                        className={styles.contact_input}
                                        name="name"
                                        value={values["name" as keyof FormValues]}
                                        type="text"
                                        onChange={onChange}
                                        pattern="^[A-Za-zА-Яа-яЁё]{2,16}$"
                                        title="Name should be 2-16 characters long and must not include any special character."
                                        maxLength={maxLengths['name']}
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('name')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>{t("pages.contacts_page.name")}</label>
                                </div>
                                
                                <div className={`
                                    ${styles.input_wrap} 
                                    ${focusedField === 'surname' ? styles.focus : ''}
                                    ${(focusedField === 'surname' || notEmpty['surname']) ? styles.not_empty : ""}
                                    ${maxCharsExceeded['surname'] ? styles.max_chars_exceeded : ""}
                                `}>
                                    <input
                                        className={styles.contact_input}
                                        name="surname"
                                        value={values["surname" as keyof FormValues]}
                                        type="text"
                                        onChange={onChange}
                                        pattern="^[A-Za-zА-Яа-яЁё]{2,35}$$"
                                        title="Surname should be 2-25 characters long and must not include any special character."
                                        maxLength={maxLengths['surname']}
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('surname')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>{t("pages.contacts_page.surname")}</label>
                                </div>

                                <div className={`
                                    ${styles.input_wrap} 
                                    ${focusedField === 'email' ? styles.focus : ''}
                                    ${(focusedField === 'email' || notEmpty['email']) ? styles.not_empty : ""}
                                `}>
                                    <input
                                        className={`${styles.contact_input} ${focusedField === 'email' ? styles.focus : ''}`}
                                        name="email"
                                        value={values["email" as keyof FormValues]}
                                        type="email"
                                        onChange={onChange}
                                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                                        title="Email address is not valid..."
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('email')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>{t("pages.contacts_page.email")}</label>
                                </div>

                                <div className={`
                                    ${styles.input_wrap} 
                                    ${focusedField === 'contact_phone' ? styles.focus : ''}
                                    ${(focusedField === 'contact_phone' || notEmpty['contact_phone']) ? styles.not_empty : ""}
                                `}>
                                    <input
                                        className={`${styles.contact_input} ${focusedField === 'contact_phone' ? styles.focus : ''}`}
                                        name="contact_phone"
                                        value={values["contact_phone" as keyof FormValues]}
                                        type="tel"
                                        placeholder='+7 (777) 777-77-77'
                                        onChange={onChange} 
                                        pattern="^\+\d{1,4}(\d{7,12})$"
                                        title="Contact phone is not valid..."
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('contact_phone')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>{t("pages.contacts_page.contact_phone")}</label>
                                </div>

                                <div className={`
                                    ${styles.input_wrap} 
                                    ${styles.w_100} 
                                    ${focusedField === 'message' ? styles.focus : ''}
                                    ${(focusedField === 'message' || notEmpty['message']) ? styles.not_empty : ""}
                                    ${maxCharsExceeded['message'] ? styles.max_chars_exceeded : ""}
                                `}>
                                    <textarea 
                                        className={`${styles.contact_input} ${focusedField === 'message' ? styles.focus : ''}`}
                                        name="message"
                                        value={values['message' as keyof FormValues]}
                                        onChange={onChange}
                                        title="Message should be maximum 180 characters long..."
                                        autoComplete="off"
                                        maxLength={maxLengths['message']}
                                        onFocus={() => handleFocus('message')}
                                        onBlur={handleBlur} 
                                    >
                                    </textarea>
                                    <label className={styles.label}>{t("pages.contacts_page.message")}</label>
                                </div>

                                <div className={`${styles.submit_box} ${styles.w_100}`}>
                                    <input type="submit" className={styles.input_submit} value={isLoading ? t("messages.loading") : buttonText} disabled={isLoading} />
                                </div>
                            </form>
                                <ReCAPTCHA
                                    sitekey='6LcVRPopAAAAAA1iFWPCua1HJh9YZSEwX-8w3p3w'
                                    onChange={(val) => setIsRecaptchaVerified(!!val)}
                                    style={{
                                        marginTop: '20px',
                                        transform: 'scale(0.79)',
                                        WebkitTransform: 'scale(0.79)',
                                        transformOrigin: '0 0',
                                        WebkitTransformOrigin: '0 0',
                                    }}
                                />
                            <div className={`${styles.condition} ${styles.text}`}>
                                <p>{t("pages.contacts_page.privacy")} <Link className={styles.link} to="/privacy_policy">{t("pages.contacts_page.policy")}</Link>.</p>
                            </div>
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
        </>
    )
}