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
      if (res.state === 'PENDING') {
        setIsLogedIn(false);
        router.push('/auth/nickname');
        return;
      }
      setIsLogedIn(true);
      dispatch(setMyInfo(res));
    },
    onError: () => {
      setIsLogedIn(false);
      router.push('/auth/login');
    },
    enabled: !router.pathname.includes('/auth/'),
    retry: false,
    initialData: null,
  });

  return { me, isLoggedIn };
}
