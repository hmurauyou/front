import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import styles from "./styles/products/Products.module.scss";
import styles from "./styles/products/test.module.scss"
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
/* Logo */
import logo from "../images/logo/250x250.png";
/* Icons */
import { IoIosArrowUp } from "react-icons/io"
import { IoIosArrowBack } from "react-icons/io";
import { GiFoodChain } from "react-icons/gi";
import { GiOlive } from "react-icons/gi";
import { GiSaucepan } from "react-icons/gi";
import { GiWaterFlask } from "react-icons/gi";
import { FaCloudDownloadAlt } from "react-icons/fa";

import "./styles/products/Products.scss"
// import { Card } from "../shared/Card";
// import { Loader } from "./loader/Loader";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    accessKeyId: "AKIA3H2FITPVTBIDJ54X",
    secretAccessKey: "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",
    region: "eu-central-1", 
});

export default function ProductsPage() {
    const navigate = useNavigate()
    // const location = useLocation()
    const [t] = useTranslation("global")
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
        sessionStorage.getItem('isSidebarOpen') === 'true'
    );
    // const { category, productName } = useParams();
    // const [productData, setProductData] = useState([]);
    // const [seafoodData, setSeafoodData] = useState([]);
    // const [saucesData, setSaucesData] = useState([]);
    // const [oilData, setOilData] = useState([]);
    // const [waterData, setWaterData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // const [loading, setLoading] = useState(true);
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const toggleSidebar = useCallback(() => {
        const newIsSidebarOpen = !isSidebarOpen;
        setIsSidebarOpen(newIsSidebarOpen);
        sessionStorage.setItem('isSidebarOpen', newIsSidebarOpen.toString());
        if (!newIsSidebarOpen) {
            setIsSubmenuOpen(false);
        }
    }, [isSidebarOpen, setIsSidebarOpen, setIsSubmenuOpen]);

    const toggleSubmenu = useCallback(() => {
        if (!isSidebarOpen) {
            return; 
        }
        setIsSubmenuOpen(prevState => !prevState);
    }, [isSidebarOpen]);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (windowWidth >= 992) {
    //         fetchData(category, setProductData);
            
    //         if (location.pathname === '/products') {
    //             fetchData('seafood', setSeafoodData);
    //             fetchData('sauces', setSaucesData);
    //             fetchData('liquid_oil', setOilData);
    //             fetchData('water', setWaterData);
    //         }
    //     }

    //     return () => {
    //         setProductData([]);
    //         setSeafoodData([]);
    //         setSaucesData([]);
    //         setOilData([]);
    //         setWaterData([]);
    //     };
    // }, [category, location.pathname]); 
    
    // const fetchData = async (endpoint: any, setData:any) => {
    //     try {
    //         const response = await fetch(`http://0.0.0.0:1234/items/${endpoint}`);
    //         const data = await response.json();
    //         setData(data);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error(`Error fetching ${endpoint} data:`, error)
    //         setLoading(false);
    //     }
    // };

    // const filterData = (data: any, productName: any) => {
    //     let filteredData = data;
    //     if (productName) {
    //         filteredData = data.filter((item: any) => item.product === productName);
    //     }
    //     if (searchQuery) {
    //         const searchQueryLowerCase = searchQuery.toLowerCase();
    //         filteredData = filteredData.filter((item: any) =>
    //             item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //             t(`products.${item.product}`).toLowerCase().includes(searchQueryLowerCase)
    //         );
    //     }
    //     return filteredData;
    // };

    const handleReset = useCallback(() => {
        setSearchQuery('');
        navigate("/products")
    }, [navigate]);

    const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 780) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleDownload = async () => {
        try {
            const key = 'price_list/price_list.xlsx';
            const url = await s3.getSignedUrlPromise('getObject', {
                Bucket: 'tradeocean',
                Key: key,
                Expires: 604800, 
            });

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'price_list.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); 
        } catch (error) {
            console.error('Ошибка скачивания файла:', error);
        }
    };

    const sidebarContent = useMemo(() => (
        <aside className={isSidebarOpen ? styles.sidebar : `${styles.sidebar} ${styles.active}`}>
            <div className={`${styles.menu_btn} ${isSidebarOpen ? styles.active : ""}`} onClick={toggleSidebar}>
                <IoIosArrowBack className={styles.arrow} />
            </div>
            <div className={styles.head}>
                <div className={styles.head_logo}>
                    <img src={logo} alt="" />
                </div>
                <div className={styles.head_details}>
                    <h4>Aqua Grand</h4>
                    <p className={styles.title}>Best Prices</p>
                </div>
            </div>
            <div className={styles.nav}>
                <div className={styles.menu}>
                    <p className={styles.title}>Меню</p>
                    <ul className={styles.list}>
                        <li>
                            <Link className={styles.link} onClick={toggleSubmenu} to="/products/seafood">
                                <GiFoodChain className={styles.icon} />
                                <span className={styles.text}>{t("products.seafood")}</span>
                                <IoIosArrowUp className={`${styles.arrow} ${isSubmenuOpen ? styles.active : ""}`} />
                            </Link>
                            <ul className={`${styles.sub_menu} ${isSubmenuOpen ? styles.active : ''}`}>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/cocktail">
                                        <span className={styles.text}>{t("products.cocktail")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/shrimps">
                                        <span className={styles.text}>{t("products.shrimps")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/mussels">
                                        <span className={styles.text}>{t("products.mussels")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/caviar">
                                        <span className={styles.text}>{t("products.caviar")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/crab">
                                        <span className={styles.text}>{t("products.crab")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/fish">
                                        <span className={styles.text}>{t("products.fish")}</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link className={styles.link} to="/products/liquid_oil">
                                <GiOlive className={styles.icon} />
                                <span className={styles.text}>{t("products.liquid_oil")}</span>
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.link} to="/products/sauces">
                                <GiSaucepan className={styles.icon} />
                                <span className={styles.text}>{t("products.sauces")}</span>
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.link} to="/products/water">
                                <GiWaterFlask className={styles.icon} />
                                <span className={styles.text}>{t("products.water")}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.menu}>
                    <p className={styles.title}>Prices</p>
                    <ul className={styles.list}>
                        <li>
                            <Link className={styles.link} onClick={handleDownload} to="#">
                                <FaCloudDownloadAlt  className={styles.icon} />
                                <span className={styles.text}>PriceList</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    ), [isSidebarOpen, isSubmenuOpen, t, toggleSubmenu, toggleSidebar])

    // if (loading) {
    //     return <Loader />
    // }

    return (
        <div className={styles.container}>
            {sidebarContent}
            <div className={styles.content}>
                <div className={styles.search_cards}>
                    <div className={styles.instructions}>
                        <div className={styles.search}>
                            <input 
                                type="text" 
                                placeholder={t("products.searchPlaceholder")}
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                            <i className='bx bx-search-alt'></i>
                        </div> 
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleReset}></button>
                    </div>
                    {/* <div className={styles.dataDisplay}>
                    {location.pathname === '/products' && (
                            <div className={styles.flexContainer}>
                                {filterData(seafoodData, productName).map((item: any) => (
                                    <Card key={item.id} productData={item} t={t} />
                                ))}
                                {filterData(oilData, productName).map((item: any) => (
                                    <Card key={item.id} productData={item} t={t} />
                                ))}
                                {filterData(saucesData, productName).map((item: any) => (
                                    <Card key={item.id} productData={item} t={t} />
                                ))}
                                {filterData(waterData, productName).map((item: any) => (
                                    <Card key={item.id} productData={item} t={t} />
                                ))}
                            </div>
                        )}
                        {location.pathname.startsWith('/products') && (
                            <div className={styles.flexContainer}>
                                {filterData(productData, productName).map((item: any) => (
                                    <Card key={item.id} productData={item} t={t} />
                                ))}
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    )
}

