import { getMyInfo, USER_QUERY_KEY } from '@apis/userApi';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@store/configStore';
import { setMyInfo } from '@store/slices/user';

export default function useMe() {
  const router = useRouter();
  
  const [isLoggedIn, setIsLogedIn] = useState(false);
  
  const dispatch = useAppDispatch();

  const { data: me } = useQuery([USER_QUERY_KEY.GET_MY_INFO], () => getMyInfo(), {
    onSuccess: (res) => {
      if (!res) return;
      setIsLogedIn(true);
      if (res.state === 'PENDING') {
        router.push('/auth/nickname');
        return;
      }
      dispatch(setMyInfo(res));
    },
    onError: () => {
      setIsLogedIn(false);
      router.push('/auth/login');
    },
    enabled: !['/auth/login', '/auth/signup'].includes(router.pathname),
    retry: false,
    initialData: null,
  });

  return { me, isLoggedIn };
}
