import CommonLayout from '@components/layouts/CommonLayout';
import styled from '@emotion/styled';
import Head from 'next/head';
import AppColor from '@styles/AppColor';
import ShortButton from '@components/atoms/ShortButton';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useCallback, useMemo } from 'react';

interface InvitaionProps {}

const Invitaion: NextPageWithLayout<InvitaionProps> = ({}) => {
  const router = useRouter();
  
  const {} = useMemo(() => router.query, [router]);
  
  const profile = ''; //TEST 용
  const workspaceName = '테스트 워크스페이스1' //TEST 용
  
  const onAcceptInvitaion = useCallback(async () => {
    console.log('초대 수락');
    //TODO 구현
  }, [router]);
  
  //TODO 프로필에 로고 추가 + 파비콘 추가
  return (
    <>
      <Head>
        <title>PLAN,T | 팀 초대</title>
      </Head>
      <Container>
        <Circle>
          {profile && (
            <Image width={124} height={124} src={profile} alt='프로필 이미지' />
          )}
        </Circle>
        <h1 style={{ color: AppColor.text.signature, fontSize: '50px', margin: '50px 0 10px' }}>플래너 님, 반갑습니다!</h1>
        <p style={{ color: AppColor.text.signature, fontSize: '32px' }}><strong>{workspaceName}</strong> 플랜팀에 초대되었어요.</p>
        <ShortButton
          label="참여하기"
          buttonStyle={{
            borderRadius: '8px',
            width: '112px',
            height: '40px',
            marginTop: '72px',
            fontSize: '14px',
            backgroundColor: AppColor.main,
          }}
          onClick={onAcceptInvitaion}
        />
      </Container>
    
    </>
  );
};

export default Invitaion;

Invitaion.getLayout = page => page;

const Container = styled.div`
  margin: 200px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.div`
  width: 124px;
  height: 124px;
  border-radius: 100%;
  background-color: ${AppColor.background.gray};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${AppColor.text.signature};
  font-size: 40px;
  font-weight: bold;
`;
