import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Logo from '@public/image/logo.png';
import useMe from '@hooks/useMe';
import { ReactNode, useEffect } from 'react';

interface AuthLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function AuthLayout({ children, title = '', description }: AuthLayoutProps) {
  const router = useRouter();
  
  const { isLoggedIn } = useMe();
  
  useEffect(() => {
    if (isLoggedIn && !router.pathname.includes('/auth/nickname')) {
      router.push('/workspace/personal');
      return;
    }
    if (router.pathname.includes('/auth/nickname') && !isLoggedIn) {
      router.push('/auth/login');
      return;
    }
  }, [isLoggedIn, router]);
  
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name='description' content={description} />}
      </Head>
      <ImageContainer>
        <Image 
          src={Logo}
          width={158}
          height={40}
          alt="플랜티 로고"
        />
      </ImageContainer>
      <Container>{children}</Container>
    </>
  );
}

const Container = styled.div`
  min-width: 300px;
  width: 100vw;
  min-height: 300px;
  margin: 0px auto;
`;

const ImageContainer = styled.div`
  margin-left: 32px;
  margin-top: 24px;
`