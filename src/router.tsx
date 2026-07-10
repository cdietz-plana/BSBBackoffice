import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';
import { Login } from '@/pages/Login';
import { ScoreCard } from '@/pages/ScoreCard';
import { NotFound } from '@/pages/NotFound';
import { RouteError } from '@/components/ErrorBoundary';
import { VNext } from '@/vnext/VNext';
import {
  PitPage,
  MachinePage,
  GameTypePage,
  TablePage,
  SignageGroupPage,
  LocationPage,
  PitLocationPage,
} from '@/pages/maintenance/pages';
import {
  ShoeDataPage,
  GameDataPage,
  CardDataPage,
  EventDataPage,
  UserActivityDataPage,
} from '@/pages/enquiry/pages';
import { TableHeartbeat } from '@/pages/enquiry/TableHeartbeat';
import { Profile } from '@/pages/account/Profile';
import { ChangePassword } from '@/pages/account/ChangePassword';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

export const router = createBrowserRouter(
  [
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '/login', element: <Login /> },
    { path: '/score-card', element: <ScoreCard /> },
    { path: '/vnext', element: <VNext /> },
    {
      path: '/app',
      element: <AppLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <Navigate to="maintenance/pit" replace /> },
        // Maintenance
        { path: 'maintenance/pit-location', element: <PitLocationPage /> },
        { path: 'maintenance/game-type', element: <GameTypePage /> },
        { path: 'maintenance/machine', element: <MachinePage /> },
        { path: 'maintenance/signage-group', element: <SignageGroupPage /> },
        { path: 'maintenance/pit', element: <PitPage /> },
        { path: 'maintenance/table', element: <TablePage /> },
        { path: 'maintenance/location', element: <LocationPage /> },
        // Enquiry
        { path: 'enquiry/shoe-data', element: <ShoeDataPage /> },
        { path: 'enquiry/game-data', element: <GameDataPage /> },
        { path: 'enquiry/card-data', element: <CardDataPage /> },
        { path: 'enquiry/event-data', element: <EventDataPage /> },
        { path: 'enquiry/user-activity-data', element: <UserActivityDataPage /> },
        { path: 'enquiry/table-heartbeat', element: <TableHeartbeat /> },
        // Account
        { path: 'account/profile', element: <Profile /> },
        { path: 'account/password', element: <ChangePassword /> },
      ],
    },
    { path: '*', element: <NotFound /> },
  ],
  { basename },
);
