import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  orderPending,
  orderContent,
  clearOrderModalData
} from '../../services/slices/ordersSlice';
import {
  editorBuns,
  editorIngredients,
  resetEditor
} from '../../services/slices/editorSlice';
import { getUser } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const bun = useSelector(editorBuns);
  const ingredients = useSelector(editorIngredients);
  const constructorItems = {
    bun,
    ingredients
  };

  const orderRequest = useSelector(orderPending);

  const orderModalData = useSelector(orderContent);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: 'location.pathname' } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const newOrderIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(newOrderIds));
  };
  const closeOrderModal = () => {
    dispatch(resetEditor());
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
