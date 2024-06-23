import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card } from "./shared/Card";
import { Loader } from "./loader/Loader";
import { Empty } from "./Empty";
import { Problem } from "./Problem";

import swal from 'sweetalert';
import { IoSearch } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io"
import { IoIosArrowBack } from "react-icons/io";
import { GiFishingBoat } from "react-icons/gi";
import { HiDocumentDownload } from "react-icons/hi";
import logo from "../images/logo/logo.png";
import styles from "./styles/products/Products.module.scss";



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
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);

    const toggleSidebar = useCallback(() => {
        const newIsSidebarOpen = !isSidebarOpen;
        setIsSidebarOpen(newIsSidebarOpen);
        sessionStorage.setItem('isSidebarOpen', newIsSidebarOpen.toString());
        if (!newIsSidebarOpen) {
            setIsSubmenuOpen(false);
        }
    }, [isSidebarOpen, setIsSidebarOpen, setIsSubmenuOpen]);

    useEffect(() => {
        const savedProductData = sessionStorage.getItem('productData');
        if (savedProductData) {
            setProductData(JSON.parse(savedProductData));
        }

        const savedSeafoodData = sessionStorage.getItem('seafoodData');
        if (savedSeafoodData) {
            setSeafoodData(JSON.parse(savedSeafoodData));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('productData', JSON.stringify(productData));
    }, [productData]);

    useEffect(() => {
        sessionStorage.setItem('seafoodData', JSON.stringify(seafoodData));
    }, [seafoodData]);

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
                    if (dataArray) {
                        if (productName) {
                            const filteredByProduct = dataArray.filter((item: any) => item.product === productName);
                            filteredData = [...filteredData, ...filteredByProduct];
                        } else {
                            filteredData = [...filteredData, ...dataArray];
                        }
                    }
                }
            }
        }
    
        if (searchQuery) {
            const searchQueryLowerCase = searchQuery.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchQueryLowerCase) ||
                t(`pages.products_page.${item.product}`).toLowerCase().includes(searchQueryLowerCase)
            );
        }

        return filteredData;
    };
    

    const dataFetch = async function(endpoint: any, setData:any) {
        try {
            const storedData = sessionStorage.getItem(endpoint);
            if (storedData) {
                setData(JSON.parse(storedData));
                setLoading(false);
            } else {
                const response = await fetch(`http://172.20.10.6:30001/items/${endpoint}`);
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                setData(data);
                setLoading(false);
    
                sessionStorage.setItem(endpoint, JSON.stringify(data));
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint} data:`, error)
            setError(true);
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
        }

        return () => {
            setProductData({});
            setSeafoodData([]);
        };
    }, [category, location.pathname, productName]); 
    
    const handleReset = useCallback(() => {
        setSearchQuery('');
        navigate("/products")
    }, [navigate]);

    const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleDownload = async () => {
        try {
            const response = await fetch('http://172.20.10.6:30001/price-list/download');
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'price-list.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
    
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
                throw new Error(`Download failed with status ${response.status}`);
            }
        } catch (error) {
            setTimeout(() => {
                swal({
                    title: t("messages.error"),
                    text: t("messages.error_msg"),
                    icon: "error",
                    buttons: [""],
                    timer: 4000
                });
            }, 1000)
            console.error('Download error:', error);
        }
    };
    

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
                    <h4>{t("pages.products_page.company")}</h4>
                    <p className={styles.title}>{t("pages.products_page.best_prices")}</p>
                </div>
            </div>
            <div className={styles.nav}>
                <div className={styles.menu}>
                    <p className={styles.title}>{t("pages.products_page.menu")}</p>
                    <ul className={styles.list}>
                        <li>
                            <div className={styles.link_container}>
                                <Link className={styles.special_link} to="/products/seafood">
                                    <GiFishingBoat className={styles.icon} />
                                    <span className={styles.text}>{t("pages.products_page.products_categories.seafood")}</span>
                                </Link>
                                <IoIosArrowUp className={`${styles.arrow} ${isSubmenuOpen ? styles.active : ""}`} onClick={toggleSubmenu} />
                            </div>
                            <ul className={`${styles.sub_menu} ${isSubmenuOpen ? styles.active : ''}`}>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/shrimps">
                                        <span className={styles.text}>{t("pages.products_page.products_names.shrimps")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/caviar">
                                        <span className={styles.text}>{t("pages.products_page.products_names.caviar")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.link} to="/products/seafood/product/crab">
                                        <span className={styles.text}>{t("pages.products_page.products_names.crab")}</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className={styles.menu}>
                    <p className={styles.title}>{t("pages.products_page.prices")}</p>
                    <ul className={styles.list}>
                        <li>
                            <Link className={styles.link} onClick={handleDownload} to="#">
                                <HiDocumentDownload  className={styles.icon} />
                                <span className={styles.text}>{t("pages.products_page.pricelist")}</span>
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
                <div className={styles.search_cards}>
                    <div className={styles.dataDisplay}>
                        <div className={styles.instructions}>
                            <div className={styles.search}>
                                <input 
                                    type="text" 
                                    placeholder={t("pages.products_page.instruments.search")}
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />
                                <IoSearch />
                            </div> 
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleReset}></button>
                        </div>
                        {error ? (
                            <Problem />
                        ) : (
                            <div className={styles.flexContainer}>
                                {location.pathname === '/products' && (
                                    filterData(productData, productName).length > 0 ? (
                                        filterData(productData, productName).map((item: any) => (
                                            <Card key={item.id} productData={item} lastFetchTime={lastFetchTime} />
                                        ))
                                    ) : (
                                        <Empty />
                                    )
                                )}
                                {location.pathname === '/products/seafood' && (
                                    filterData(seafoodData, productName).length > 0 ? (
                                        filterData(seafoodData, productName).map((item: any) => (
                                            <Card key={item.id} productData={item} lastFetchTime={lastFetchTime} />
                                        ))
                                    ) : (
                                        <Empty />
                                    )
                                )}
                                {location.pathname.startsWith('/products/seafood/product/') && (
                                    filterData(seafoodData, productName).length > 0 ? (
                                        filterData(seafoodData, productName).map((item: any) => (
                                            <Card key={item.id} productData={item} lastFetchTime={lastFetchTime} />
                                        ))
                                    ) : (
                                        <Empty />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

