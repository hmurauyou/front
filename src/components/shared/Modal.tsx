import React, { useEffect, useState, useRef } from 'react';

import { useCart } from '../providers/CartProvider';

import swal from 'sweetalert';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './styles/Modal/Modal.module.scss'
import './styles/Modal/Modal.scss'


interface CartItem {
    id: string;
    name: string;
    category: string;
    product: string;
    quantity: number;
    price_byn: number;
    net_weight: string;
}

interface ModalProps {
    id: string;
    title: string;
    cartItems: CartItem[];
    quantities: number[];
    t: (key: string) => string;
    offcanvasCartRef: any;
}

interface FormValues {
    name: string;
    surname: string;
    email: string;
    contact_phone: string;
}

const SharedModal: React.FC<ModalProps> = ({ id, title, cartItems, quantities, t, offcanvasCartRef }) => {
    const [values, setValues] = useState<FormValues>({
        name: "",
        surname: "",
        email: "",
        contact_phone: "",
      });
    const [buttonText, setButtonText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] =  useState<string | null>(null);
    const [notEmpty, setNotEmpty] = useState<{ [key: string]: boolean }>({});
    const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false); 
    const [maxCharsExceeded, setMaxCharsExceeded] = useState<{
        [key: string]: boolean;
    }>({
        name: false,
        surname: false,
    });
    const maxLengths = {
        name: 16,
        surname: 25,
    }
    const { clearCart } = useCart();
    const modalRef = useRef<HTMLDivElement>(null);

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

        setIsLoading(true)

        const orderData = {
            name: values.name,
            surname: values.surname,
            email: values.email,
            contact_phone: values.contact_phone,
            items: cartItems.map((item, index) => ({
                id: item.id,
                category: item.category,
                product: item.product,
                quantity: quantities[index],
            })),
        };

        try {
            const response = await fetch('http://172.20.10.6:30001/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                setValues({
                    name: "",
                    surname: "",
                    email: "",
                    contact_phone: ""
                });
                setNotEmpty({});
                setFocusedField(null);

                setButtonText(t("messages.thank_you"));
                setTimeout(() => {
                    setButtonText(t("buttons.send"));
                    setIsLoading(false);

                    const modalElement = modalRef.current;
                    if (modalElement) {
                        modalElement.classList.remove('show');
                        modalElement.style.display = 'none';
                        const modalBackdrop = document.querySelector('.modal-backdrop');
                        if (modalBackdrop) {
                            modalBackdrop.remove();
                        }
                    }
    
                    clearCart();
                    offcanvasCartRef.current?.classList.remove('show');
                    const offcanvasBackdrop = document.querySelector('.offcanvas-backdrop');
                    if (offcanvasBackdrop) {
                        offcanvasBackdrop.classList.remove('show');
                    }
                
                    link.setAttribute('download', 'order.pdf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    document.body.removeAttribute('data-bs-overflow');
                    document.body.removeAttribute('data-bs-padding-right');
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, 1000);
                setTimeout(() => {
                    swal({
                        title: t("messages.success"),
                        text: t("messages.success_msg"),
                        icon: "success",
                        buttons: [""],
                        timer: 4000
                    });
                }, 1000)
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
        <div className="modal fade" id={id} data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true" ref={modalRef}>
            <div className={`modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id={`${id}Label`}>{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                <div className={`modal-body ${styles.modal_body}`}>
                    <div className={styles.section_one}>
                        <div className={styles.order_heading}>
                            <h3>{t("components.cart.print")}<span>.</span></h3>
                        </div>
                        <div className={styles.list_items}>
                            <table className={styles.content_table}>
                                <thead>
                                    <th>{t("components.cart.category")}</th>
                                    <th>{t("components.cart.product")}</th>
                                    <th>{t("components.cart.name")}</th>
                                    <th>{t("components.cart.quantity")}</th>
                                </thead>
                                <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{t(`pages.products_page.products_info.${item.id}.category`)}</td>
                                        <td>{t(`pages.products_page.products_info.${item.id}.product`)}</td>
                                        <td>{t(`pages.products_page.products_info.${item.id}.name`)}</td>
                                        <td>{quantities[index]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.total_cost}>
                            <p><strong>{t("components.cart.total")}:</strong></p>
                            <p>{cartItems.reduce((total, item, index) => total + (item.price_byn * quantities[index]), 0).toFixed(2)} BYN</p>
                        </div>
                        <div className={`${styles.condition} ${styles.text}`}>
                            <p>{t("components.cart.warning")}</p>
                        </div>
                    </div> 
                    <div className={styles.section_two}>
                        <div className={styles.order_heading}>
                            <h3>{t("components.cart.form")}<span>.</span></h3>
                        </div>
                        <div className={styles.form_wrapper}>
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
                                <p>{t("pages.contacts_page.privacy")} <a className={styles.link} href="/privacy_policy" target="_blank">{t("pages.contacts_page.policy")}</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default SharedModal;