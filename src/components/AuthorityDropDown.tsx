import {useState, useCallback} from 'react';
import {transrateAuthority} from '@utils/Utils';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Image from 'next/image';
import DropDownIcon from '@public/image/dropdown_icon.png';
import AuthorityChangeConfirmModal from '@components/modals/AuthorityChangeConfirmModal';
import useModal from '@hooks/useModal';

interface AuthorityDropDownProps {
  authority: 'ADMIN' | 'USER' | 'PENDING';
  userId: number;
}

export default function AuthorityDropDown({authority, userId}: AuthorityDropDownProps) {
  const [isDropDownOpened, setIsDropDownOpened] = useState(false);
  
  const [isModalOpened, openModal, closeModal] = useModal();
  
  const onChangeRole = useCallback(
    (_authority: 'ADMIN' | 'USER') => () => {
      openModal();
      
      if (authority === _authority) return;
      const params = {
        userId,
        authority: _authority,
      };
      console.log(params);
    }, [authority, userId]);
  
  return (
    <div style={{position: 'relative', cursor: 'pointer'}} onClick={() => setIsDropDownOpened(prev => !prev)}>
      <div style={{display: 'flex', justifyContent: 'center', columnGap: '10px'}}>
        <div style={{flex: 1}}>{transrateAuthority(authority)}</div>
        <Image src={DropDownIcon} width={20} height={20} alt='드롭다운 아이콘' />
      </div>
      {isDropDownOpened && (
        <DropDownList>
          <Item onClick={onChangeRole('ADMIN')}>
            관리자
          </Item>
          <Item onClick={onChangeRole('USER')}>
            일반멤버
          </Item>
        </DropDownList>
      )}
      <AuthorityChangeConfirmModal isOpened={isModalOpened} closeModal={closeModal} onClickChange={() => {}} />
    </div>
  );
}

const DropDownList = styled.ul`
  list-style: none;
  padding: 0 20px 0 0;
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
  padding: 10px 0px;
  cursor: pointer;
`;