import './styles/Card/Card.scss'
import styles from './styles/Card/Card.module.scss'
// import AWS from 'aws-sdk';
import { Link } from 'react-router-dom'
import { memo, useEffect, useState } from 'react';
import { LuFilePlus2 } from "react-icons/lu";
import { useCart } from '../providers/CartProvider';
import { useTranslation } from 'react-i18next';


// const s3 = new AWS.S3({
//     accessKeyId: 'AKIA3H2FITPVTBIDJ54X',
//     secretAccessKey: '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',
//     region: 'eu-central-1', 
// });
  

interface ProductData {
    id: string;
    name: string;
    category: string;
    product: string;
    quantity: number;
    price_byn: number;
    net_weight: string;
}

interface CardProps {
    productData: ProductData;
    lastFetchTime: number;
}

export const Card = memo(({productData, lastFetchTime}: CardProps) => {
    const [t] = useTranslation("global")
    const translatedName = t(`products.products_info.${productData?.id}.name`);
    const translatedNetWeight = t(`products.products_info.${productData?.id}.net_weight`);

    const { id, category } = productData;
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
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
    

    // const [elapsedTime, setElapsedTime] = useState<number>(0);

    // useEffect(() => {
    //     // Calculate the time difference when the component mounts
    //     const currentTime = new Date().getTime();
    //     const diffInMinutes = Math.floor((currentTime - lastFetchTime) / (1000 * 60));
    //     setElapsedTime(diffInMinutes);

    //     // No need to recalculate on subsequent renders
    // }, [lastFetchTime]);
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth); 
    
    // const translatedName = t(`products.products_info.${productData.id}.name`);
    // const translatedCountryRUS = t(`products.products_info.${productData.id}.country_id`);

    // useEffect(() => {
    //     const fetchImageUrls = async () => {
    //         if (windowWidth >= 991) { 
    //             let cachedUrls = localStorage.getItem(`imageUrls_${id}`);
    //             if (cachedUrls) {
    //                 setImageUrls(JSON.parse(cachedUrls));
    //                 setIsLoading(false);
    //             } else {
    //                 try {
    //                     const objectsList = await s3.listObjectsV2({
    //                         Bucket: 'tradeocean',
    //                         Prefix: `photos/${id}/preview`,
    //                     }).promise();

    //                     const urls = objectsList.Contents?.map(obj => {
    //                         return s3.getSignedUrl('getObject', {
    //                             Bucket: 'tradeocean',
    //                             Key: obj.Key || '',
    //                             Expires: 604800,
    //                         });
    //                     }) || [];

    //                     setImageUrls(urls);
    //                     localStorage.setItem(`imageUrls_${id}`, JSON.stringify(urls));
    //                     setIsLoading(false);
    //                 } catch (error) {
    //                     console.error('Error fetching image URLs:', error);
    //                     setIsLoading(false);
    //                 }
    //             }
    //         } else {
    //             setIsLoading(false);
    //         }
    //     };

        // fetchImageUrls();

    //     return () => {
    //         setImageUrls([]);
    //     };
    // }, [id, windowWidth]);

    return (
            <div className="card">
                <button 
                    className={`${styles.add_button} btn btn-primary btn_inside`} 
                    type="button"
                    onClick={handleAddToCart}
                >
                    <span><LuFilePlus2 /></span>
                </button>
                <Link to={`/products/${category}/${id}`}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center loader-container" style={{ height: "200px" }}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">{t("card_item.loading")}</span>
                            </div>
                        </div>
                    ) : (
                        <img src={imageUrls[0] || 'placeholder_image_url'} className="card-img-top" alt="Product" />
                    )}
                </Link>
                <div className="card-body">
                    <div>
                        <Link className="link_card" to={`/products/${category}/${id}`}>
                            <h4 className="card-title">{translatedName}</h4>
                        </Link>
                    </div>
                    <div>
                        <p className="card-text">{t("products.net_weight")}: {translatedNetWeight}</p>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                {t("card_item.updated")} {
                                    minutesAgo < 60 ? (
                                        `${minutesAgo} ${minutesAgo === 1 ? t("card_item.minute") : t("card_item.minutes")}`
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