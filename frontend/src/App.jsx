import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { GuideProvider } from './context/GuideContext';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import WishlistPage from './pages/WishlistPage';
import BagPage from './pages/BagPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <GuideProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/bag" element={<BagPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </GuideProvider>
      </BrowserRouter>
    </AppProvider>
  );
}
