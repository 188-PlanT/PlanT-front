import CommonLayout from '@components/layouts/CommonLayout';
import { NextPageWithLayout } from './_app';
import PostComponent from '@components/post/PostComponent';
import styled from '@emotion/styled';
import { PostSimpleDto } from '@_types/PostDto';
import { getAllPosts } from '@apis/postApi';
import AppColor from '@styles/AppColor';
import ShortButton from '@components/atoms/ShortButton';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
//import useMe from '@hooks/useMe';
import { useCallback } from 'react';
import Logo from '@public/image/logo.png';
import IntroImage1 from '@public/image/intro_image1.png';
import IntroImage2 from '@public/image/intro_image2.png';

interface HomeProps {
}

/* export async function getServerSideProps() {
  const data = await getAllPosts();
  return {
    props: {
      data,
    },
  };
}
*/
const Home: NextPageWithLayout<HomeProps> = ({ data = [] }) => {
  // const { isLoggedIn } = useMe();

  const router = useRouter();

  const onClickSignUp = useCallback(() => {
    router.push('/auth/signup');
  }, [router]);

  const onClickLogin = useCallback(() => {
    router.push('/auth/login');
  }, [router]);
  
  return (
    <>
      <Head>
          <title>PLAN,T</title>
          {false && <meta name='description' content={description} />}
        </Head>
      <main>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '24px 32px'}}>
          <Image 
            src={Logo}
            width={158}
            height={40}
            alt="플랜티 로고"
          />
          <div style={{display: 'flex', columnGap: '16px'}}>
            <ShortButton
              style={{
                width: '86px',
                borderRadius: '8px',
                backgroundColor: AppColor.main,
                fontWeight: 'bold'
              }}
              label='회원가입'
              onClick={onClickSignUp}
            />
            <ShortButton
              style={{
                width: '86px',
                borderRadius: '8px',
                backgroundColor: AppColor.background.whitegray,
                color: AppColor.main,
                fontWeight: 'bold'
              }}
              label='로그인'
              onClick={onClickLogin}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '200px 0' }}>
          <Image src={IntroImage1} alt='플랜티 소개글 이미지1' />
        </div>
        <div style={{width: '100%', marginBottom: '100px'}}>
            <Image src={IntroImage2} layout='responsive' alt='플랜티 소개글 이미지2' />
        </div>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = page => page;

const ImageContainer = styled.div`
  margin-left: 32px;
  margin-top: 24px;
`