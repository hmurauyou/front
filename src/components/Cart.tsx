import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import SharedModal from './shared/Modal';
import { useCart } from './providers/CartProvider';

import empty from '../images/background/empty_cart.png'
import styles from './styles/Cart/Cart.module.scss';


interface CartItem {
    id: string;
    name: string;
    category: string;
    product: string;
    quantity: number;
    price_byn: number;
    net_weight: string;
}



export default function Cart() {
    const [t] = useTranslation("global")
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [quantities, setQuantities] = useState(() => {
        const storedQuantities = JSON.parse(localStorage.getItem('cartItems') || '[]');
        return storedQuantities.map((item: CartItem) => item.quantity);
    });

    useEffect(() => {
        const storedQuantities: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setQuantities(storedQuantities.map(item => item.quantity));
    }, [cartItems]);

    const handleQuantityChange = (index: number, value: string) => {
        const newValue = value.replace(/\D/, '');
        const parsedValue = parseInt(newValue, 10) || 1;
        const limitedValue = Math.min(parsedValue, 999);

        setQuantities((prevQuantities: number[]) => prevQuantities.map((qty, i) => i === index ? limitedValue : qty));

        const updatedCartItems = cartItems.map((item, i) => {
            if (i === index) {
                return { ...item, quantity: limitedValue };
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const handleIncrement = (index: number) => {
        const updatedQuantities = quantities.map((qty: number, i: number) => (i === index ? qty + 1 : qty));
        setQuantities(updatedQuantities);
    
        const updatedCartItems = cartItems.map((item, i) => {
            if (i === index) {
                return { ...item, quantity: updatedQuantities[i] };
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const handleDecrement = (index: number) => {
        const updatedQuantities = quantities.map((qty: number, i: number) => (i === index ? Math.max(1, qty - 1) : qty));
        setQuantities(updatedQuantities);
    
        const updatedCartItems = cartItems.map((item, i) => {
            if (i === index) {
                return { ...item, quantity: updatedQuantities[i] }; 
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const offcanvasCartRef = useRef<HTMLDivElement>(null);

    
    return (
        <>
            <div className="offcanvas offcanvas-end custom-offcanvas" id="offcanvasCart" aria-labelledby="offcanvasCartLabel" ref={offcanvasCartRef}>
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title" id="offcanvasCartLabel">{t("cart.cart")}</h2>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {cartItems.length === 0 ? (
                        <div className={styles.empty_section}>
                            <p className={styles.empty_msg}>{t("cart.empty")}</p>
                            <img src={empty} alt='empty' className={styles.empty_img} />
                        </div>
                    ) : (
                        <div className={styles.card_container}>
                            {cartItems.map((item, index) => (
                                <div className={styles.cart_card} key={index}>
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img  className="img-fluid rounded-start" alt="img" />
                                        </div>
                                        <div className="col-md-8">
                                            <div className={`card-body ${styles.card_body}`}>
                                                <div className={styles.close_section}>
                                                    <h6 className="card-title">{t(`products.products_info.${item.id}.name`)}</h6>
                                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => removeFromCart(item.id)}></button>
                                                </div>
                                                <div className={styles.product_info}>
                                                    <p className="card-text">{t("cart.category")}: {t(`products.products_info.${item.id}.category`)}</p>
                                                    <p className="card-text">{t("cart.product")}: {t(`products.products_info.${item.id}.product`)}</p>
                                                    <p className="card-text">{t("cart.net_weight")}: {t(`products.products_info.${item.id}.net_weight`)}</p>
                                                </div>
                                                <div className={styles.wrapper}>
                                                    <span className={styles.plus} onClick={() => handleIncrement(index)}>+</span>
                                                    <input
                                                        type="text"
                                                        className={styles.numInput}
                                                        value={quantities[index]}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                    />
                                                    <span className={styles.minus} onClick={() => handleDecrement(index)}>-</span>
                                                </div>
                                                <p className={`card-text ${styles.price}`}>
                                                    <small className="text-body-secondary">
                                                        {t("cart.price")}: {(item.price_byn * quantities[index]).toFixed(2)} BYN
                                                    </small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className={styles.buttons}>
                                <button type="button" className={`btn btn-primary btn_inside ${styles.btn_width}`} onClick={clearCart}>
                                    <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
                                    {t("cart.clear")}
                                </button>
                                <button type="button" className={`btn btn-primary ${styles.btn_width}`} data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <i className='bx bx-left-arrow-alt bx-xs bx-fade-left'></i>
                                    {t("cart.checkout")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SharedModal 
                id="staticBackdrop"
                title={t("cart.title")}
                cartItems={cartItems}
                quantities={quantities}
                t={t}
                offcanvasCartRef={offcanvasCartRef}
            />
        </>
    )
}