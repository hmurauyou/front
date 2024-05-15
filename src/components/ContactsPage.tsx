// import styles from './styles/contacts/Contacts.module.scss';
import styles from './styles/contacts/test.module.scss'
// import video from '../images/video/ocean.mp4';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

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
    const [t] = useTranslation("global")
    const [buttonText, setButtonText] = useState<string>(t("contacts.send"));
    const [isLoading, setIsLoading] = useState(false);
    const [isMessageValid, setMessageValid] = useState<boolean>(true);

    const inputs = [
        {
            id: 1,
            name: 'name',
            type: 'text',
            errorMessage: 'Name should be 3-16 characters and shouldn\'t include any special character.',
            pattern: '^[A-Za-zА-Яа-яЁё]{3,16}$',
            required: true,
            icon: <i className='bx bxs-user'></i>,
        },
        {
            id: 2,
            name: 'surname',
            type: 'text',
            errorMessage: 'Surname should be 3-25 characters and shouldn\'t include any special character.',
            pattern: '^[A-Za-zА-Яа-яЁё]{2,35}$$',
            required: false,
        },
        {
            id: 3,
            name: 'email',
            type: 'email',
            errorMessage: 'email address is not valid...',
            pattern: '\\S+@\\S+\\.\\S+',
            required: true,
            icon: <i className='bx bxs-envelope'></i>,
        },
        {
            id: 4,
            name: 'contact_phone',
            type: 'tel',
            errorMessage: 'phone number is not valid...',
            pattern: '^\\+?[0-9]{1,3}[0-9]{9,14}$',
            required: true,
            icon: <i className='bx bx-phone' ></i>,
        },
    ];

    const sanitizeInput = (input: string) => {
        return input.replace(/[<>'";]/g, '');
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = name === 'message' ? sanitizeInput(value) : value; 
        setValues({ ...values, [name]: sanitizedValue });
        if (name === 'message') {
            setMessageValid(sanitizedValue.length >= 4 && sanitizedValue.length <= 124); 
        }
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();

        if (!isMessageValid) {
            console.error('Invalid message length');
            return;
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://0.0.0.0:1234/contacts/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const responseData = await response.json()

                const emailId = responseData.email_id;
                const secretCode = responseData.secret_code;
    
                const verificationLink = `http://localhost:3000/contacts/verify_email?email_id=${emailId}&secret_code=${secretCode}`;
                console.log('Verification Link:', verificationLink);
                setValues({
                    name: "",
                    surname: "",
                    email: "",
                    contact_phone: "",
                    message: "",
                });
                setButtonText(t("contacts.thankYou"));
                setTimeout(() => {
                    setButtonText(t("contacts.send"));
                }, 3000);
            } else {
                console.error('Error sending form data:', response.statusText);
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
                                <h1>Let's keep in touch</h1>
                                <p className={styles.text}>Or reach us via: <span> </span>
                                    <a href="mailto:">georgiemurauyou@gmail.com</a>
                                </p>
                            </div>
                            <form action='index.html' method="post" className={styles.contact_form} onSubmit={onSubmit}>
                                <div className={styles.inputs}>
                                    {inputs.map((input) => (
                                        <div key={input.id} className={styles.input_box}>
                                            <input
                                                type={input.type}
                                                id={input.name}
                                                name={input.name}
                                                value={values[input.name as keyof FormValues]}
                                                onChange={onChange}
                                                className={styles.input_field}
                                                pattern={input.pattern}
                                                title={input.errorMessage}
                                                autoComplete="off"
                                                required={input.required}
                                                placeholder={t(`contacts.${input.name}`)}
                                            />
                                            <label htmlFor={input.name} className={styles.label}>
                                                {t(`contacts.${input.name}`)}
                                            </label>
                                            <div className={styles.input_icon}>{input.icon}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.input_box}>
                                    <textarea 
                                        id={styles.textarea}
                                        name="message"
                                        value={values['message' as keyof FormValues]}
                                        onChange={onChange}
                                        className={styles.input_field}
                                        // pattern="^[A-Za-zА-Яа-яЁё]{4,124}$$"
                                        title="Message should be 4-124 characters long..."
                                        autoComplete="off"
                                        required
                                        placeholder={t(`contacts.message`)}
                                    >
                                    </textarea>
                                    <label className={styles.label}>Message</label>
                                </div>
                                <div className={styles.input_box}>
                                    <input type="submit" className={styles.input_submit} value={isLoading ? t("contacts.loading") : buttonText} disabled={isLoading} />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className={styles.right}></div>
                </div>
            </section>
        </>
    )
}