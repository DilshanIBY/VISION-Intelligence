import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@layouts/MainLayout';
import { DashboardPage } from '@pages/Dashboard';
import { MachineryCalculatorPage } from '@pages/MachineryCalculator';
import { FloorLayoutPage } from '@pages/FloorLayout';
import { AnalyticsPage } from '@pages/Analytics';
import { SettingsPage } from '@pages/Settings';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'calculator',
                element: <MachineryCalculatorPage />,
            },
            {
                path: 'floor-layout',
                element: <FloorLayoutPage />,
            },
            {
                path: 'analytics',
                element: <AnalyticsPage />,
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
        ],
    },
]);
