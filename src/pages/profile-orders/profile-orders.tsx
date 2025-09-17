import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  ordersItems,
  ordersIsLoading
} from '../../services/slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(ordersItems);
  const ordersLoading = useSelector(ordersIsLoading);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (ordersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
