import './styles/Card/Card.scss'
import styles from './styles/Card/Card.module.scss'
import { Link } from 'react-router-dom'
import { memo, useEffect, useState } from 'react';
import { LuFilePlus2 } from "react-icons/lu";
import { useCart } from '../providers/CartProvider';
import { useTranslation } from 'react-i18next';


interface ProductData {
    id: string;
    name: string;
    category: string;
    product: string;
    quantity: number;
    price_byn: number;
    net_weight: string;
    preview_url: string;
}

interface CardProps {
    productData: ProductData;
    lastFetchTime: number;
}

export const Card = memo(({productData, lastFetchTime}: CardProps) => {
    const [t] = useTranslation("global")
    const translatedName = t(`pages.products_page.products_info.${productData?.id}.name`);
    const translatedNetWeight = t(`pages.products_page.products_info.${productData?.id}.net_weight`);
    const addToCartText = t("buttons.add");

    const { id, category } = productData;
    const [minutesAgo, setMinutesAgo] = useState<number>(0);
    const { addToCart } = useCart();

    useEffect(() => {
        const interval = setInterval(() => {
            const minutesAgo = Math.floor((Date.now() - lastFetchTime) / 60000);
            setMinutesAgo(minutesAgo);
        }, 60000);
    
        return () => clearInterval(interval);
    }, [lastFetchTime]);

    const handleAddToCart = () => {
        addToCart(productData);
    };

    return (
            <div className="card">
                <button 
                    className={`${styles.add_button} btn btn-primary btn_inside`} 
                    type="button"
                    onClick={handleAddToCart}
                    data-content={addToCartText}
                >
                    <span><LuFilePlus2 /></span>
                </button>
                <Link to={`/products/${category}/${id}`}>
                    <img src={productData.preview_url || 'placeholder_image_url'} className={`card-img-top ${styles.image}`} alt="Product" />
                </Link>
                <div className="card-body">
                    <div>
                        <Link className="link_card" to={`/products/${category}/${id}`}>
                            <h4 className="card-title">{translatedName}</h4>
                        </Link>
                    </div>
                    <div>
                        <p className="card-text">{t("pages.products_page.net_weight")}: {translatedNetWeight}</p>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                {t("components.card_item.updated")} {
                                    minutesAgo < 60 ? (
                                        `${minutesAgo} ${minutesAgo === 1 ? t("components.card_item.minute") : t("components.card_item.minutes")}`
                                    ) : (
                                        `${Math.floor(minutesAgo / 60)} ${Math.floor(minutesAgo / 60) === 1 ? 'hour' : 'hours'} ago`
                                    )
                                }
                            </small>
                        </p>
                    </div>
                </div>
            </div>
    )
});