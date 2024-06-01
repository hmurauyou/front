import React, { Suspense, lazy, useEffect } from 'react';
import Navbar from './Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import NotFoundPage from './NotFoundPage';
// import Footer from './Footer';
import { ItemPage } from './ItemPage';
import { Loader } from './loader/Loader';
import PrivacyPolicy from './PrivacyPolicy';

const LazyHomePage = lazy(() => import('./HomePage'));
// const LazyAboutPage = lazy(() => import('./AboutPage'));
const LazyContactsPage = lazy(() => import('./ContactsPage'));
const LazyConfirmationPage = lazy(() => import('./ConfirmationPage'));
const LazyProductsPage = lazy(() => import('./ProductsPage'));

function App() {
    const location = useLocation();
    // const isHomePage = location.pathname === '/';

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
                    <Route path="/products/:category" element={<ProductsPage />} />
                    <Route path="/products/:category/product/:productName" element={<ProductsPage />} /> 
                    <Route path="/products/:category/:id" element={<ItemPage />} /> 
                    {/* <Route path="/about" element={
                            <Suspense fallback={
                                <Loader />
                            }>
                                <LazyAboutPage />
                            </Suspense>
                        } 
                    /> */}
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
                    {/* <Route path="/contacts/verify_email" element={<ConfirmationPage />} />  */}
                    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </main>
            {/* {!isHomePage && (
                <footer>
                    <Footer />
                </footer>
            )} */}
        </>
    );
}

export default App;
