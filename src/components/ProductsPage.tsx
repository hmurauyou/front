import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import styles from "./styles/products/Products.module.scss";
import styles from "./styles/products/test.module.scss"
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
/* Logo */
import logo from "../images/logo/logo.png";
/* Icons */
import { IoIosArrowUp } from "react-icons/io"
import { IoIosArrowBack } from "react-icons/io";
import { GiFishingBoat } from "react-icons/gi";
import { GiOlive } from "react-icons/gi";
import { HiDocumentDownload } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";

import { Card } from "../shared/Card";
import { Loader } from "./loader/Loader";
import { Empty } from "../shared/Empty";



export default function ProductsPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [t] = useTranslation("global")
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
        sessionStorage.getItem('isSidebarOpen') === 'true'
    );
    const { category, productName } = useParams();
    const [productData, setProductData] = useState({});
    const [seafoodData, setSeafoodData] = useState([]);
    const [liquidOilData, setLiquidOilData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);

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

    const filterData = (data: any, productName: any) => {
        let filteredData: any[] = [];
    
        if (Object.keys(data).length === 0) {
            return filteredData;
        }

        if (Array.isArray(data)) {
            filteredData = data.filter(item => item.product === productName);
        }

        if (Array.isArray(data)) {
            filteredData = data;
        } else {
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const dataArray = data[key];
                    if (productName) {
                        const filteredByProduct = dataArray.filter((item: any) => item.product === productName);
                        filteredData = [...filteredData, ...filteredByProduct];
                    } else {
                        filteredData = [...filteredData, ...dataArray];
                    }
                }
            }
        }
    
        if (searchQuery) {
            const searchQueryLowerCase = searchQuery.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchQueryLowerCase) ||
                t(`products.${item.product}`).toLowerCase().includes(searchQueryLowerCase)
            );
        }

        return filteredData;
    };
    

    const dataFetch = async function(endpoint: any, setData:any) {
        try {
            const response = await fetch(`http://127.0.0.1:1234/items/${endpoint}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error(`Error fetching ${endpoint} data:`, error)
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentTime = Date.now();
        setLastFetchTime(currentTime);

        if (location.pathname === '/products') {
            dataFetch('all', setProductData);
        } else if (location.pathname === '/products/seafood') {
            dataFetch('seafood', setSeafoodData);
        } else if (location.pathname.startsWith('/products/seafood/product/')) {
            const productName = location.pathname.split('/').pop()?.toLowerCase();

            dataFetch('seafood', (seafood:any) => {
                const filteredSeafood = seafood.filter((item:any) => item.product === productName);
                setSeafoodData(filteredSeafood);
            });
        } else if (location.pathname === '/products/liquid_oil') {
            dataFetch('liquid_oil', setLiquidOilData)
        }

        return () => {
            setProductData([]);
            setSeafoodData([]);
            setLiquidOilData([]);
        };
    }, [category, location.pathname, productName]); 
    
    const handleReset = useCallback(() => {
        setSearchQuery('');
        navigate("/products")
    }, [navigate]);

    const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    // const handleDownload = async () => {
    //     try {
    //         const key = 'price_list/price_list.xlsx';
    //         const url = await s3.getSignedUrlPromise('getObject', {
    //             Bucket: process.env.REACT_APP_BUCKET_NAME,
    //             Key: key,
    //             Expires: 604800, 
    //         });

    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'price_list.xlsx');
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link); 
    //     } catch (error) {
    //         console.error('Download error:', error);
    //     }
    // };

    const sidebarContent = useMemo(() => (
        <aside className={isSidebarOpen ? styles.sidebar : `${styles.sidebar} ${styles.active}`}>
            <div className={`${styles.menu_btn} ${isSidebarOpen ? styles.active : ""}`} onClick={toggleSidebar}>
                <IoIosArrowBack className={styles.arrow} />
            </div>
            <div className={styles.head}>
                <div className={styles.head_logo}>
                    <img src={logo} className={styles.image_logo} alt="" />
                </div>
                <div className={styles.head_details}>
                    <h4>Восточный Берег</h4>
                    <p className={styles.title}>{t("products.best")}</p>
                </div>
            </div>
            <div className={styles.nav}>
                <div className={styles.menu}>
                    <p className={styles.title}>{t("products.menu")}</p>
                    <ul className={styles.list}>
                        <li>
                            <div className={styles.link_container}>
                                <Link className={styles.special_link} to="/products/seafood">
                                    <GiFishingBoat className={styles.icon} />
                                    <span className={styles.text}>{t("products.seafood")}</span>
                                </Link>
                                <IoIosArrowUp className={`${styles.arrow} ${isSubmenuOpen ? styles.active : ""}`} onClick={toggleSubmenu} />
                            </div>
                            <ul className={`${styles.sub_menu} ${isSubmenuOpen ? styles.active : ''}`}>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/shrimps">
                                        <span className={styles.text}>{t("products.shrimps")}</span>
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
                            </ul>
                        </li>
                        <li>
                            <Link className={styles.link} to="/products/liquid_oil">
                                <GiOlive className={styles.icon} />
                                <span className={styles.text}>{t("products.liquid_oil")}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.menu}>
                    <p className={styles.title}>{t("products.prices")}</p>
                    <ul className={styles.list}>
                        <li>
                            <Link className={styles.link} /*onClick={handleDownload}*/ to="#">
                                <HiDocumentDownload  className={styles.icon} />
                                <span className={styles.text}>{t("products.pricelist.name")}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    ), [isSidebarOpen, isSubmenuOpen, t, toggleSubmenu, toggleSidebar])

    if (loading) {
        return <Loader />
    }

    return (
        <div className={styles.container}>
            {sidebarContent}
            <div className={styles.content}>
                    <div className={styles.instructions}>
                        <div className={styles.search}>
                            <input 
                                type="text" 
                                placeholder={t("products.searchPlaceholder")}
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                            <IoSearch />
                        </div> 
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleReset}></button>
                    </div>
                <div className={styles.search_cards}>
                    <div className={styles.dataDisplay}>
                        {location.pathname === '/products' && (
                            <div className={styles.flexContainer}>
                                {filterData(productData, productName).length > 0 ? (
                                    filterData(productData, productName).map((item: any) => (
                                        <Card key={item.id} productData={item} t={t} lastFetchTime={lastFetchTime} />
                                    ))
                                ) : (
                                    <Empty />
                                )}
                            </div>
                        )}
                        {location.pathname === '/products/seafood' && (
                            <div className={styles.flexContainer}>
                                {filterData(seafoodData, productName).length > 0 ? (
                                    filterData(seafoodData, productName).map((item: any) => (
                                        <Card key={item.id} productData={item} t={t} lastFetchTime={lastFetchTime} />
                                    ))
                                ) : (
                                    <Empty />
                                )}
                            </div>
                        )}
                        {location.pathname.startsWith('/products/seafood/product/') && (
                            <div className={styles.flexContainer}>
                                {filterData(seafoodData, productName).length > 0 ? (
                                    filterData(seafoodData, productName).map((item: any) => (
                                        <Card key={item.id} productData={item} t={t} lastFetchTime={lastFetchTime} />
                                    ))
                                ) : (
                                    <Empty />
                                )}
                            </div>
                        )}
                        {location.pathname === '/products/liquid_oil' && (
                            <div className={styles.flexContainer}>
                                {filterData(liquidOilData, productName).length > 0 ? (
                                    filterData(liquidOilData, productName).map((item: any) => (
                                        <Card key={item.id} productData={item} t={t} lastFetchTime={lastFetchTime} />
                                    ))
                                ) : (
                                    <Empty />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

