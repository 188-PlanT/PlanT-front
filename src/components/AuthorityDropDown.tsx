import {useState, useCallback, useMemo} from 'react';
import {transrateAuthority} from '@utils/Utils';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Image from 'next/image';
import DropDownIcon from '@public/image/dropdown_icon.png';
import AuthorityChangeConfirmModal from '@components/modals/AuthorityChangeConfirmModal';
import useModal from '@hooks/useModal';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WORKSPACE_QUERY_KEY, changeWorkspaceUserAuthority } from '@apis/workspaceApi';

interface AuthorityDropDownProps {
  workspaceId: number;
  authority: string | 'ADMIN' | 'USER' | 'PENDING';
  userId: number;
}

export default function AuthorityDropDown({workspaceId, authority, userId}: AuthorityDropDownProps) {
  const [isDropDownOpened, setIsDropDownOpened] = useState(false);
  
  const [isModalOpened, openModal, closeModal] = useModal();
  
  const [selectedAuthority, setSelectedAuthority]  = useState<'ADMIN' | 'USER'>('USER'); 
  
  const onClickDropDown = useCallback(() => {
    if(authority === 'PENDING') {
      toast.error('아직 초대에 응답하지 않은 사용자 입니다.');
      return;
    };
    setIsDropDownOpened(prev => !prev);
  }, [authority]);
  
  const onClickRole = useCallback(
    (_authority: 'ADMIN' | 'USER') => () => {
      if (authority === _authority) {
        const auth = _authority === 'ADMIN' ? '관리자' : '일반멤버';
        toast.error(`이미 ${auth} 권한을 가진 사용자 입니다.`);
        return;
      };
      setSelectedAuthority(_authority);
      openModal();
    }, [openModal, authority]);
  
  const queryClient = useQueryClient();
  
  const {mutate: _changeWorkspaceUserAuthority} = useMutation(changeWorkspaceUserAuthority, {
    onSuccess: (res) => {
      queryClient.invalidateQueries([WORKSPACE_QUERY_KEY.GET_WORKSPACE_USERS_BY_WID, workspaceId]);
      console.log(res);
    },
  });
  
  const onClickChange = useCallback(() => {
    const params = {
      workspaceId,
      userId,
      authority: selectedAuthority,
    };
    _changeWorkspaceUserAuthority(params);
    closeModal();
  }, [workspaceId, userId, selectedAuthority, closeModal, _changeWorkspaceUserAuthority]);
  
  return (
    <div style={{position: 'relative', cursor: 'pointer'}} onClick={onClickDropDown}>
      <div style={{display: 'flex', justifyContent: 'center', columnGap: '10px'}}>
        <div style={{flex: 1}}>{transrateAuthority(authority)}</div>
        <Image src={DropDownIcon} width={20} height={20} alt='드롭다운 아이콘' />
      </div>
      {isDropDownOpened && (
        <DropDownList>
          <Item onClick={onClickRole('ADMIN')}>
            관리자
          </Item>
          <Item onClick={onClickRole('USER')}>
            일반멤버
          </Item>
        </DropDownList>
      )}
      <AuthorityChangeConfirmModal isOpened={isModalOpened} closeModal={closeModal} selectedAuthority={selectedAuthority} onClickChange={onClickChange} />
    </div>
  );
}

const DropDownList = styled.ul`
  list-style: none;
  padding: 0 0 0 10px;
  position: absolute;
  width: 100%;
  background-color: ${AppColor.background.lightwhite};
  top: 14px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 1;
`;

const Item = styled.li`
  text-align: left;
  padding: 10px 0px;
  cursor: pointer;
`;