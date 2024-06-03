import './styles/Card/Card.scss'
import styles from './styles/Card/Card.module.scss'
// import AWS from 'aws-sdk';
import { Link } from 'react-router-dom'
import { memo, useEffect, useState } from 'react';
import { LuFilePlus2 } from "react-icons/lu";


// const s3 = new AWS.S3({
//     accessKeyId: 'AKIA3H2FITPVTBIDJ54X',
//     secretAccessKey: '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',
//     region: 'eu-central-1', 
// });
  

export const Card = memo(({productData, t, lastFetchTime}: any) => {
    const { id, category } = productData;
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [minutesAgo, setMinutesAgo] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const minutesAgo = Math.floor((Date.now() - lastFetchTime) / 60000);
            setMinutesAgo(minutesAgo);
        }, 60000);
    
        return () => clearInterval(interval);
    }, [lastFetchTime]);
    

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
                {/* <div className={styles.add_button}>
                </div> */}
                <button className={`${styles.add_button} btn btn-primary btn_inside`} type="button">
                    <span><LuFilePlus2 /></span>
                </button>
                <Link to={`/products/${category}/${id}`}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center loader-container" style={{ height: "200px" }}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <img src={imageUrls[0] || 'placeholder_image_url'} className="card-img-top" alt="Product" />
                    )}
                </Link>
              <div className="card-body">
                    <div>
                        <Link className="link_card" to={`/products/${category}/${id}`}>
                            <h4 className="card-title">{productData.name}</h4>
                        </Link>
                    </div>
                    <div>
                        <p className="card-text">{t("products.net_weight")}: {productData.net_weight}</p>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                Last updated {
                                    minutesAgo < 60 ? (
                                        `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`
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