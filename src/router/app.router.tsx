import { createHashRouter, Navigate } from "react-router";

import { HomePage } from "../heroes/pages/home/HomePage";
import { HeroPage } from "../heroes/pages/hero/HeroPage";
import { HeroesLayout } from "../heroes/layouts/HeroesLayout";
import { AdminLayout } from "../admin/layouts/AdminLayout";
import { lazy } from "react";

const SearchPage = lazy(() => import("../heroes/pages/search/SearchPage"));
const AdminPage = lazy(() => import("../admin/pages/AdminPage"));

// export const router = createBrowserRouter([
export const router = createHashRouter([
    {
        path: '/',
        element: <HeroesLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'heroes/:idSlug',
                element: <HeroPage />
            },
            {
                path: 'search',
                element: <SearchPage />
            },
            {
                path: '*',
                // element: <h1>404</h1>
                element: <Navigate to="/" />
            },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminPage />
            },
        ],
    },
])