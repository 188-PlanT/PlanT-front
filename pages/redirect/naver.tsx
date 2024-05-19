import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { naverLogin } from '@apis/authApi';
import { toast } from 'react-toastify';

export default function NaverRedirect() {
  const router = useRouter();
  
  const code = useMemo(() => router.query?.code || '', [router]);
  
  useEffect(() => {
    if (code) {
      (async() => {
        await naverLogin({code})
          .then(() => {
            toast.success('로그인 성공');
            router.push('/workspace/personal');
          })
          .catch(error => {
            console.error(error);
            toast.error('네이버 로그인에 실패하였습니다. 잠시후 다시 시도해주세요.');
            router.push('/auth/login');
          });
      })();
    }
  }, [router, code]);
  
  return (
    <div style={{display: 'flex', width: '100%', height: '400px', alignItems: 'center', justifyContent: 'center'}}>
      네이버 로그인 중...
    </div>
  );
}