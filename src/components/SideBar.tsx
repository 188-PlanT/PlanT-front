import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Image from 'next/image';
import Logo from '@public/image/logo.png';
import WorkspaceProfile from '@components/WorkspaceProfile';
import PlusButton from '@components/PlusButton';
import SettingButton from '@components/SettingButton';

import TestImage from '@public/image/kakao_icon.png';

interface SideBarProps {
}

export default function SideBar({}: SideBarProps) {
  const nickname = "민혁"; //TEST 용
  
  //TODO 워크스페이스 리스트 요청
  
  
  return (
    <Container>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Image src={Logo} alt='플랜티 로고' width={52} height={13} />

        <div style={{marginTop: '26px'}}>
          <WorkspaceProfile isMine workspaceName={`${nickname}의 워크스페이스`} />
        </div>

        <Line/>

        <WorkspaceWrapper>
          <WorkspaceProfile workspaceName={`${nickname}의 워크스페이스1`} workspaceId={1} imageUrl={TestImage} />
          <WorkspaceProfile workspaceName={`${nickname}의 워크스페이스2`} workspaceId={2} />
          <WorkspaceProfile workspaceName={`${nickname}의 워크스페이스3`} workspaceId={3} imageUrl={TestImage} />
          <WorkspaceProfile workspaceName={`${nickname}의 워크스페이스4`} workspaceId={4} imageUrl={TestImage} />
          <WorkspaceProfile workspaceName={`${nickname}의 워크스페이스5`} workspaceId={5} />
          <WorkspaceProfile workspaceName={`${nickname}의 워크스페이스5`} workspaceId={6} />
          
          <PlusButton path='/workspace/create' />
        </WorkspaceWrapper>
      </div>
      
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Line/>

        <SettingButton />
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  border-right: solid 2px ${AppColor.border.gray};
  padding: 8px 8px 16px;
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: fixed;
`

const Line = styled.div`
  width: 38px;
  border: 1px solid ${AppColor.border.gray};
  margin: 18px 0px;
`

const WorkspaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`