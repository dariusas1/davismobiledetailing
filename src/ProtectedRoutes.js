import { useLocation, Outlet, Navigate } from 'react-router';
import { AppContext } from './App';
import { useContext } from 'react';

const ProtectedRoutes = () => {
    const location = useLocation();
    const {
        user
    } = useContext(AppContext);
    return (
        user
            ?
            <Outlet />
            :
            <Navigate to="/" state={{ from: location }} replace />
    );
};

export default ProtectedRoutes;