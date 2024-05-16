// import styles from './styles/contacts/Contacts.module.scss';
import styles from './styles/contacts/test.module.scss'
import image from '../images/background/img.jpg'
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
    const [focusedField, setFocusedField] =  useState<string | null>(null);
    const [notEmpty, setNotEmpty] = useState<{ [key: string]: boolean }>({});

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
        const isFieldNotEmpty = !!value.trim();
    setNotEmpty(prevState => ({
        ...prevState,
        [name]: isFieldNotEmpty,
    }));
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
                                <h1>Let's keep in touch<span>.</span></h1>
                                <p className={styles.text}>Or reach us via: <span> </span>
                                    <a href="mailto:">georgiemurauyou@gmail.com</a>
                                </p>
                            </div>
                            <form method="post" className={styles.contact_form} onSubmit={onSubmit}>
                                <div className={`
                                    ${styles.input_wrap} 
                                    ${focusedField === 'name' ? styles.focus : ""} 
                                    ${(focusedField === 'name' || notEmpty['name']) ? styles.not_empty : ""}
                                `}>
                                    <input
                                        className={styles.contact_input}
                                        name="name"
                                        value={values["name" as keyof FormValues]}
                                        type="text"
                                        onChange={onChange}
                                        pattern="^[A-Za-zА-Яа-яЁё]{2,16}$"
                                        title="Name should be 2-16 characters long and must not include any special character."
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('name')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>Name</label>
                                </div>
                                
                                <div className={`
                                    ${styles.input_wrap} 
                                    ${focusedField === 'surname' ? styles.focus : ''}
                                    ${(focusedField === 'surname' || notEmpty['surname']) ? styles.not_empty : ""}
                                `}>
                                    <input
                                        className={styles.contact_input}
                                        name="surname"
                                        value={values["surname" as keyof FormValues]}
                                        type="text"
                                        onChange={onChange}
                                        pattern="^[A-Za-zА-Яа-яЁё]{2,35}$$"
                                        title="Surname should be 2-35 characters long and must not include any special character."
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('surname')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>Surname</label>
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
                                        pattern="\\S+@\\S+\\.\\S+"
                                        title="Email address is not valid..."
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('email')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>Email</label>
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
                                        onChange={onChange}
                                        pattern="^\\+?[0-9]{1,3}[0-9]{9,14}$"
                                        title="Contact phone is not valid..."
                                        autoComplete="off"
                                        required
                                        onFocus={() => handleFocus('contact_phone')}
                                        onBlur={handleBlur} 
                                    />
                                    <label>Contact Phone</label>
                                </div>

                                <div className={`
                                    ${styles.input_wrap} 
                                    ${styles.w_100} 
                                    ${focusedField === 'message' ? styles.focus : ''}
                                    ${(focusedField === 'message' || notEmpty['message']) ? styles.not_empty : ""}
                                `}>
                                    <textarea 
                                        className={`${styles.contact_input} ${focusedField === 'message' ? styles.focus : ''}`}
                                        name="message"
                                        value={values['message' as keyof FormValues]}
                                        // id={styles.textarea}
                                        onChange={onChange}
                                        title="Message should be 4-124 characters long..."
                                        autoComplete="off"
                                        // placeholder={t(`contacts.message`)}
                                        onFocus={() => handleFocus('message')}
                                        onBlur={handleBlur} 
                                    >
                                    </textarea>
                                    <label className={styles.label}>Message</label>
                                </div>
                                
                                {/* <div className={styles.inputs}>
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
                                </div> */}
                                {/* <div className={styles.input_box}>
                                    <input type="submit" className={styles.input_submit} value={isLoading ? t("contacts.loading") : buttonText} disabled={isLoading} />
                                </div> */}
                            </form>
                        </div>
                    </div>
                    <div className={styles.right}>
                        {/* <div className={styles.image_wrapper}>
                            <img src={image} alt="" />
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    )
}