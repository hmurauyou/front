import styles from './styles/contacts/Contacts.module.scss';
import video from '../images/video/ocean.mp4';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface FormValues {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    contact_phone: string;
}

export default function ContactsPage() {
    const [values, setValues] = useState<FormValues>({
        name: "",
        surname: "",
        patronymic: "",
        email: "",
        contact_phone: "",
      });
    const [t] = useTranslation("global")
    const [buttonText, setButtonText] = useState<string>(t("contacts.send"));
    const [isLoading, setIsLoading] = useState(false);

    const inputs = [
        {
            id: 1,
            name: 'name',
            type: 'text',
            errorMessage: 'Name should be 3-16 characters and shouldn\'t include any special character!',
            pattern: '^[A-Za-zА-Яа-яЁё]{3,16}$',
            required: true,
            icon: <i className='bx bxs-user'></i>,
        },
        {
            id: 2,
            name: 'surname',
            type: 'text',
            errorMessage: 'Surname should be 3-25 characters and shouldn\'t include any special character!',
            pattern: '^[A-Za-zА-Яа-яЁё]{3,25}$$',
            required: false,
        },
        {
            id: 3,
            name: 'patronymic',
            type: 'text',
            errorMessage: 'Patronymic should be 5-25 characters and shouldn\'t include any special character!',
            pattern: '^[A-Za-zА-Яа-яЁё]{5,25}$',
            required: false,
        },
        {
            id: 4,
            name: 'email',
            type: 'email',
            errorMessage: 'It should be a valid email address!',
            pattern: '\\S+@\\S+\\.\\S+',
            required: true,
            icon: <i className='bx bxs-envelope'></i>,
        },
        {
            id: 5,
            name: 'contact_phone',
            type: 'tel',
            errorMessage: 'It should be a valid phone number!',
            pattern: '^\\+?[0-9]{1,3}[0-9]{9,14}$',
            required: true,
            icon: <i className='bx bx-phone' ></i>,
        },
    ];

    const onChange = (e: any) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
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
                    patronymic: "",
                    email: "",
                    contact_phone: "",
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
            <div className={styles.wrapper}>
                <video src={video} className={styles.bg_video} muted autoPlay loop />
                <form className={styles.contact_box} onSubmit={onSubmit}>
                    <div className={styles.contact_header}>
                        <span>{t("contacts.header")}</span>
                    </div>
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
                                required={input.required}
                                placeholder={t(`contacts.${input.name}`)}
                            />
                            <label htmlFor={input.name} className={styles.label}>
                                {t(`contacts.${input.name}`)}
                            </label>
                            <div className={styles.input_icon}>{input.icon}</div>
                        </div>
                    ))}
                    <div className={styles.input_box}>
                        <input type="submit" className={styles.input_submit} value={isLoading ? t("contacts.loading") : buttonText} disabled={isLoading} />
                    </div>
                </form>
            </div>
        </>
    )
}