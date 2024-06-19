import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Loader } from './loader/Loader';
import { IoArrowUndo } from "react-icons/io5";

import styles from './styles/Item/ItemPage.module.scss';
import './styles/Item/ItemPage.scss';


interface ItemData {
    id: string;
    category: string;
    product: string;
    name: string;
    description: string;
    composition: string;
    supplements: string;
    vitamins: string;
    food_value: string;
    energy_value: string;
    recommendation: string;
    country_id: string;
    price_byn: number | null;
    net_weight: string | null;
    shelf_life: string | null;
    expiration_date: string | null;
}



export default function ItemPage() {
    const location = useLocation(); 
    const navigate = useNavigate();
    const [itemData, setItemData] = useState<ItemData | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadImageFromSessionStorage = (id: string): string[] | null => {
        const imageUrlsStr = sessionStorage.getItem(`itemImageUrls_${id}`);
        if (imageUrlsStr) {
            return JSON.parse(imageUrlsStr);
        }
        return null;
    };
    const saveImageToSessionStorage = (id: string, urls: string[]): void => {
        sessionStorage.setItem(`itemImageUrls_${id}`, JSON.stringify(urls));
    };
    const clearImageFromSessionStorage = (id: string): void => {
        sessionStorage.removeItem(`itemImageUrls_${id}`);
    };

    const [t] = useTranslation("global")
    const translatedName = t(`pages.products_page.products_info.${itemData?.id}.name`);
    const translatedDescription = t(`pages.products_page.products_info.${itemData?.id}.description`);
    const translatedComposition = t(`pages.products_page.products_info.${itemData?.id}.composition`);
    const translatedSupplements = t(`pages.products_page.products_info.${itemData?.id}.supplements`);
    const translatedFoodVaue = t(`pages.products_page.products_info.${itemData?.id}.food_value`);
    const translatedVitamins = t(`pages.products_page.products_info.${itemData?.id}.vitamins`);
    const translatedEnergyValue = t(`pages.products_page.products_info.${itemData?.id}.energy_value`);
    const translatedCountry = t(`pages.products_page.products_info.${itemData?.id}.country_id`);
    const translatedRecommendation = t(`pages.products_page.products_info.${itemData?.id}.recommendation`);
    const translatedShelfLife = t(`pages.products_page.products_info.${itemData?.id}.shelf_life`);
    const translatedExpirationDate = t(`pages.products_page.products_info.${itemData?.id}.expiration_date`);
    const translatedNetWeight = t(`pages.products_page.products_info.${itemData?.id}.net_weight`);
    const goBack = t("buttons.back")
 
    useEffect(() => {
        const fetchData = async () => {
            const pathParts = location.pathname.split('/');
            const category = pathParts[2]; 
            const id = pathParts[3];

            try {
                const response = await fetch(`http://172.20.10.6:30001/items/${category}/${id}`);
                const data = await response.json();
                setItemData(data);
            } catch (error) {
                console.error('Error fetching item data:', error);
            }
        };

        fetchData(); 

    }, [location.pathname]); 

    useEffect(() => {
        const fetchImageUrls = async () => {
            const pathParts = location.pathname.split('/');
            const id = pathParts[3];

            const storedImageUrls = loadImageFromSessionStorage(id);
            if (!storedImageUrls) {
                try {
                    const response = await fetch(`http://172.20.10.6:30001/photo/${id}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    const data = await response.json();
                    const imageUrlsFromServer = data;

                    setImageUrls(imageUrlsFromServer);
                    saveImageToSessionStorage(id, imageUrlsFromServer);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching image URLs:', error);
                    setIsLoading(false);
                }
            } else {
                setImageUrls(storedImageUrls);
                setIsLoading(false);
            }
        };

        if (itemData) {
            fetchImageUrls();
        }

        return () => {
            const pathParts = location.pathname.split('/');
            const id = pathParts[3];
            clearImageFromSessionStorage(id);
            setImageUrls([]);
        };
    }, [itemData, location.pathname]);

    if (!itemData) {
        return <Loader />
    }

    if (isLoading) {
        return <Loader />
    }


    return (
        <div className={styles.wrapper}>
            <div className={`card mb-3 ${styles.item_card}`}>
                <button 
                    className={`${styles.prev_btn} btn btn-primary btn_inside`} 
                    type="button"
                    onClick={() => navigate(-1)}
                    data-content={goBack}
                >
                    <span>
                        <IoArrowUndo />
                    </span>
                </button>
                <div className={`row g-0 ${styles.card_init}`}>
                    <div className={`col-md-5 ${styles.image_box}`}>
                        <div id="carouselExampleIndicators" className="carousel slide">
                            <div className="carousel-indicators">
                                {imageUrls.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to={index.toString()}
                                        className={index === 0 ? 'active' : ''}
                                        aria-current={index === 0 ? 'true' : 'false'}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>
                            <div className="carousel-inner">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img src={url} className={`d-block mx-auto ${styles.images} img-fluid`} alt={`Slide ${index + 1}`} />
                                    </div>
                                ))}
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
                    </div>
                    <div className="col-md-7">
                        <div className="card-body">
                            <div>
                                <h5 className="card-title"><span className={styles.name}>{translatedName}</span></h5>
                            </div>
                            <div>
                                <p className="card-text"><b className={styles.data}>{t("pages.item_page.description")}: </b>{translatedDescription}</p>
                            </div>
                            <div>
                                <p className="card-text"><b className={styles.data}>{t("pages.item_page.composition")}: </b>{translatedComposition}</p>
                                <p className="card-text"><b className={styles.data}>{t("pages.item_page.vitamins")}: </b>{translatedVitamins}</p>
                                <p className="card-text"><b className={styles.data}>{t("pages.item_page.supplements")}: </b>{translatedSupplements}</p>
                            </div>
                            <div>
                                <p className="card-text"><b className={styles.data}>{t("pages.item_page.energy_value")}: </b>{translatedEnergyValue}</p>
                                <p className="card-text"><b className={styles.data}>{t("pages.item_page.food_value")}: </b>{translatedFoodVaue}</p>
                            </div>
                            <div>
                                <p className='card-text'><b className={styles.data}>{t("pages.item_page.shelf_life")}: </b>{translatedShelfLife}</p>
                                <p className='card-text'><b className={styles.data}>{t("pages.item_page.recommendation")}: </b>{translatedRecommendation}</p>
                                <p className='card-text'><b className={styles.data}>{t("pages.item_page.expiration_date")}: </b>{translatedExpirationDate}</p>
                            </div>
                            <div>
                                <p className='card-text'><b className={styles.data}>{t("pages.item_page.country")}: </b>{translatedCountry}</p>
                                <p className='card-text'><b className={styles.data}>{t("pages.item_page.net_weight")}: </b>{translatedNetWeight}</p>
                            </div>
                            <div className="price-container">
                                <p className='card-text'><b className={styles.data}>{t("pages.item_page.price")}: </b><span className={styles.price}>{itemData.price_byn} BYN</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}