import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserData } from '../../services/slices/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthChecked, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(getUserData());
    }
  }, [dispatch, isAuthChecked]);

  return { isAuthChecked, user };
};
