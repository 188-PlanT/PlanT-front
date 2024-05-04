import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@public/image/logo.png';
import WorkspaceProfile from '@components/WorkspaceProfile';
import PlusButton from '@components/PlusButton';
import SettingButton from '@components/SettingButton';
import {WorkspaceSimpleDto} from '@customTypes/WorkspaceSimpleDto';

import TestImage from '@public/image/kakao_icon.png';

interface SideBarProps {
  nickName: string;
  profile: string;
  workspaces: WorkspaceSimpleDto[];
}

export default function SideBar({
    nickName,
    profile,
    workspaces,
  }: SideBarProps) {
  return (
    <Container>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Link href='/workspace/personal'>
          <Image src={Logo} alt='플랜티 로고' style={{cursor: 'pointer'}} width={52} height={13} />
        </Link>

        <div style={{marginTop: '26px'}}>
          <WorkspaceProfile isMine workspaceName={`${nickName}의 워크스페이스`} imageUrl={profile} />
        </div>

        <Line/>

      </div>
      <WorkspaceWrapper>
        {workspaces.map(w => 
                        <WorkspaceProfile
                          key={w.workspaceId}
                          workspaceName={`${w.workspaceName}의 워크스페이스1`}
                          workspaceId={w.workspaceId}
                          imageUrl={w.profile}
                        />)}          
        <PlusButton path='/workspace/create' />
      </WorkspaceWrapper>
      
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
  flex: 1;
  flex-direction: column;
  row-gap: 24px;
  overflow-y: scroll;
   -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  };
`