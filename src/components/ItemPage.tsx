import { useLocation, useNavigate } from 'react-router-dom';
import styles from './styles/item/ItemPage.module.scss';
import { useEffect, useState } from 'react';
// import AWS from 'aws-sdk';
import './styles/item/ItemPage.scss';
import "./styles/bootstrap/button.scss"
import { useTranslation } from 'react-i18next';
import { IoArrowUndo } from "react-icons/io5";

interface ItemData {
    id: string;
    category: string;
    product: string;
    name: string;
    description: string;
    composition: string;
    supplements: string;
    vitamins: string;
    energy_value: string;
    recommendation: string;
    country_id: string;
    price_byn?: number | null;
    net_weight?: string | null;
    shelf_life?: string | null;
    expiration_date?: string | null;
}

// const s3 = new AWS.S3({
//     accessKeyId: 'AKIA3H2FITPVTBIDJ54X',
//     secretAccessKey: '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',
//     region: 'eu-central-1', 
// });
  

export const ItemPage = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const [itemData, setItemData] = useState<ItemData | null>(null);
    // const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [t] = useTranslation("global")
    // const translatedName = t(`products.products_info.${itemData?.id}.name`);
    // const translatedDescription = t(`products.products_info.${itemData?.id}.description`);
    // const translatedCountry = t(`products.products_info.${itemData?.id}.country_id`);
    // const translatedShelfLife = t(`products.products_info.${itemData?.id}.shelf_life`);
 
    useEffect(() => {
        const fetchData = async () => {
            const pathParts = location.pathname.split('/');
            const category = pathParts[2]; 
            const id = pathParts[3];

            try {
                const response = await fetch(`http://localhost:1234/items/${category}/${id}`);
                const data = await response.json();
                console.log(data)
                setItemData(data);
            } catch (error) {
                console.error('Error fetching item data:', error);
            }
        };

        fetchData(); 

    }, [location.pathname]); 

    // useEffect(() => {
    //     const fetchImageUrls = async () => {
    //         if (window.innerWidth >= 991) {
    //             const storedUrls = localStorage.getItem(`itemImageUrls_${itemData?.id}`);
    //             if (storedUrls) {
    //                 setImageUrls(JSON.parse(storedUrls));
    //                 setIsLoading(false);
    //             } else {
    //                 try {
    //                     const objectsList = await s3.listObjectsV2({
    //                         Bucket: 'tradeocean',
    //                         Prefix: `photos/${itemData?.id}/all`, 
    //                     }).promise();
                
    //                     const urls = objectsList.Contents?.map((obj: any) => {
    //                         return s3.getSignedUrl('getObject', {
    //                             Bucket: 'tradeocean',
    //                             Key: obj.Key || '',
    //                             Expires: 604800,
    //                         });
    //                     }) || [];
        
    //                     setImageUrls(urls);
    //                     localStorage.setItem(`itemImageUrls_${itemData?.id}`, JSON.stringify(urls)); 
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
    
    //     if (itemData) {
    //         fetchImageUrls();
    //     }
    // }, [itemData]);

    if (!itemData) {
        return <div>Loading...</div>;
    }


    return (
        <div className={styles.wrapper}>
            <div className={`card mb-3 ${styles.item_card}`}>
                <button 
                    className={`${styles.prev_btn} btn btn-primary btn_inside`} 
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    <span>
                        <IoArrowUndo />
                    </span>
                </button>
                <div className={`row g-0 ${styles.card_init}`}>
                    <div className="col-md-4">
                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center loader-container" style={{ height: "400px" }}>
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div id="carouselExampleIndicators" className="carousel slide">
                                <div className="carousel-indicators">
                                    {/* {imageUrls.map((url, index) => (
                                        <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index.toString()} className={index === 0 ? 'active' : ''} aria-current={index === 0 ? 'true' : 'false'} aria-label={`Slide ${index + 1}`}></button>
                                    ))} */}
                                </div>
                                <div className="carousel-inner">
                                    {/* {imageUrls.map((url, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img src={url} className={`d-block w-100 ${styles.images}`} alt={`Slide ${index + 1}`} />
                                        </div>
                                    ))} */}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title"><span className={styles.name}>{itemData.name}</span></h5>
                            <p className="card-text"><b className={styles.data}>{t("products.description")}:</b> {itemData.description}</p>
                            <p className="card-text"><b className={styles.data}>Состав:</b> {itemData.composition}</p>
                            <p className="card-text"><b className={styles.data}>Добавки:</b> {itemData.supplements}</p>
                            <p className="card-text"><b className={styles.data}>Энергетическая ценность:</b> {itemData.energy_value}</p>
                            <p className='card-text'><b className={styles.data}>{t("products.country")}:</b> {itemData.country_id}</p>
                            <p className='card-text'><b className={styles.data}>Срок хранения:</b> {itemData.shelf_life}</p>
                            <p className='card-text'><b className={styles.data}>Рекомендация:</b> {itemData.recommendation}</p>
                            <p className='card-text'><b className={styles.data}>{t("products.shelf_life")}:</b> {itemData.expiration_date}</p>
                            <p className='card-text'><b className={styles.data}>{t("products.net_weight")}:</b> {itemData.net_weight}</p>
                            <div className="price-container">
                                <p className='card-text'><b className={styles.data}>{t("products.price")}:</b> <span className={styles.price}>{itemData.price_byn} BYN</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.prev_btn}>
                <button className="btn btn-primary btn_inside" type="button" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div> */}
        </div>
    );
}