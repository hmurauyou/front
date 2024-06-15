import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import ProductsPage from './ProductsPage';
import NotFoundPage from './NotFoundPage';
import Footer from './Footer';
import ItemPage from './ItemPage';
import PrivacyPolicy from './PrivacyPolicy';
import CookiePolicy from './CookiePolicy';
import WebsiteRules from './WebsiteRules';
import { Loader } from './loader/Loader';

import "./styles/Bootstrap/button.scss";


const LazyHomePage = lazy(() => import('./HomePage'));
const LazyContactsPage = lazy(() => import('./ContactsPage'));
const LazyConfirmationPage = lazy(() => import('./ConfirmationPage'));
const LazyProductsPage = lazy(() => import('./ProductsPage'));



function App() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isContactsPage = location.pathname === '/contacts';
    const isConfirmationPage = location.pathname === '/contacts/confirmation';

    useEffect(() => {
        window.scrollTo(0, 0); 
    }, [location.pathname]);

    
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Routes>
                    <Route path="/" element={
                            <Suspense fallback={
                                <Loader />
                            }>
                                <LazyHomePage />
                            </Suspense>
                        } 
                    />
                    <Route path="/products" element={
                            <Suspense fallback={
                                <Loader />
                            }>
                                <LazyProductsPage />
                            </Suspense>
                        } 
                    />
                    <Route path="/products/:category" element={
                        <Suspense fallback={
                                <Loader />
                            }>
                                <ProductsPage />
                            </Suspense>
                    } />
                    <Route path="/products/:category/product/:productName" element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <ProductsPage />
                        </Suspense>
                    } /> 
                    <Route path="/products/:category/:id" element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <ItemPage />
                        </Suspense>
                    } />
                    <Route path="/contacts" element={
                            <Suspense fallback={
                                <Loader />
                            }>
                                <LazyContactsPage />
                            </Suspense>
                        } 
                    />
                    <Route path="/contacts/confirmation" element={
                            <Suspense fallback={
                                <Loader />
                            }>
                                <LazyConfirmationPage />
                            </Suspense>
                        } 
                    />
                    <Route path="/privacy_policy" element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <PrivacyPolicy />
                        </Suspense>
                    } />
                    <Route path='/cookie_policy' element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <CookiePolicy />
                        </Suspense>
                    } />
                    <Route path='website_policy' element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <WebsiteRules />
                        </Suspense>
                    } />
                    <Route path='*' element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <NotFoundPage />
                        </Suspense>
                    } />
                </Routes>
            </main>
            {!isHomePage && !isContactsPage && !isConfirmationPage && (
                <footer>
                    <Footer />
                </footer>
            )}
        </>
    );
}

export default App;
