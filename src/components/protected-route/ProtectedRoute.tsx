import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { useLocation, Navigate } from 'react-router-dom';
import { Preloader } from '@ui';
import React from 'react';
import { useAuth } from '../../services/hooks/useAuth';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, user } = useAuth();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
