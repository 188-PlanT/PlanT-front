import CommonLayout from '@components/layouts/CommonLayout';
import styled from '@emotion/styled';
import Head from 'next/head';
import AppColor from '@styles/AppColor';
import { NextPageWithLayout } from 'pages/_app';

interface InvitaionProps {}

const Invitaion: NextPageWithLayout<InvitaionProps> = ({}) => {
  const workspaceName = '테스트 워크스페이스1' //TEST 용
  
  return (
    <>
      <Head>
        <title>PLAN,T | 팀 초대</title>
      </Head>
      <Container>
        <h1 style={{ color: AppColor.text.signature, fontSize: '50px', margin: '0' }}>플래너 님, 반갑습니다!</h1>
        <p><strong>{workspaceName}</strong> 플랜팀에 초대되었어요.</p>
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
