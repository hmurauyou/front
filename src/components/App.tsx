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
                    <Route path="/privacypolicy" element={
                        <Suspense fallback={
                            <Loader />
                        }>
                            <PrivacyPolicy />
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
            {/* {!isHomePage && (
                <footer>
                    <Footer />
                </footer>
            )} */}
        </>
    );
}

export default App;
