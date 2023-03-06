import { useLocation, Outlet, Navigate } from 'react-router';
import { AppContext } from './App';
import { useContext } from 'react';

const PublicRoutes = () => {
    const location = useLocation();
    const {
        user
    } = useContext(AppContext);
    return (
        !user
            ?
            <Outlet />
            :
            <Navigate to="/dashboard" state={{ from: location }} replace />
    );
};

export default PublicRoutes;