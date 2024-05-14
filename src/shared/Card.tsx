import './styles/Card.scss'
import AWS from 'aws-sdk';
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import styles from './styles/Card.module.scss';


const s3 = new AWS.S3({
    accessKeyId: 'AKIA3H2FITPVTBIDJ54X',
    secretAccessKey: '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',
    region: 'eu-central-1', 
});
  

export const Card = ({productData, t}: any) => {
    const { id, category } = productData;
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); 
    
    const translatedName = t(`products.products_info.${productData.id}.name`);
    const translatedCountryRUS = t(`products.products_info.${productData.id}.country_id`);

    useEffect(() => {
        const fetchImageUrls = async () => {
            if (windowWidth >= 991) { 
                let cachedUrls = localStorage.getItem(`imageUrls_${id}`);
                if (cachedUrls) {
                    setImageUrls(JSON.parse(cachedUrls));
                    setIsLoading(false);
                } else {
                    try {
                        const objectsList = await s3.listObjectsV2({
                            Bucket: 'tradeocean',
                            Prefix: `photos/${id}/preview`,
                        }).promise();

                        const urls = objectsList.Contents?.map(obj => {
                            return s3.getSignedUrl('getObject', {
                                Bucket: 'tradeocean',
                                Key: obj.Key || '',
                                Expires: 604800,
                            });
                        }) || [];

                        setImageUrls(urls);
                        localStorage.setItem(`imageUrls_${id}`, JSON.stringify(urls));
                        setIsLoading(false);
                    } catch (error) {
                        console.error('Error fetching image URLs:', error);
                        setIsLoading(false);
                    }
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchImageUrls();

        return () => {
            setImageUrls([]);
        };
    }, [id, windowWidth]);

    return (
             <div className="card">
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
                    <Link className="link_card" to={`/products/${category}/${id}`}>
                        <h4 className="card-title">{translatedName}</h4>
                    </Link>
                    <div>
                        <p className="card-text">{t("products.country")}: {translatedCountryRUS}</p>
                        <p className="card-text">{t("products.net_weight")}: {productData.net_weight}</p>
                        <p className="card-text">{t("products.price")}: <span className={styles.price}>{productData.price_byn} BYN</span></p>
                    </div>
                    {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
              </div>
            </div>
    )
}