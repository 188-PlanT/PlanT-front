import {useState, useCallback} from 'react';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Image from 'next/image';
import TextInput from '@components/atoms/TextInput';
import DropDownIcon from '@public/image/dropdown_icon.png';
import FolderIcon from '@public/image/folder_icon.png';

interface WorkspaceMemberDropDownProps {
  memberList: {nickName: string; userId: number}[];
  onClickItem: (user: {nickName: string; userId: number}) => () => void;
}

export default function WorkspaceMemberDropDown({memberList, onClickItem}: WorkspaceMemberDropDownProps) {
  const [isOpend, setIsOpend] = useState(false);
  
  const onClickAddAll = useCallback(() => {
    memberList.map(u => onClickItem(u)());
  }, [memberList, onClickItem]);
  
  return (
    <div style={{position: 'relative', cursor: 'pointer', width: '100%'}} onClick={() => setIsOpend(prev => !prev)}>
      <TextInput
        containerStyle={{backgroundColor: 'transparent'}}
        style={{backgroundColor: 'transparent', fontWeight: 'bold'}}
        placeholder='일정에 추가할 멤버를 정해주세요 (지정한 워크스페이스에서만 추가할 수 있어요)'
        disabled
        onClick={() => {setIsOpend(prev => !prev)}}
        value={''}
        endAdornment={<Image src={DropDownIcon} width={20} height={20} alt='드롭다운 아이콘' />}
      />
      {isOpend && (
        <DropDownList>
          {memberList.length === 0 ?
            <Item>선택할 수 있는 멤버가 없습니다. 워크스페이스를 선택해 주세요.</Item> :
            <>
              <Item onClick={onClickAddAll}>모두 추가</Item>
              {memberList.map((u) => <Item onClick={onClickItem(u)} key={u.userId}>{u.nickName}</Item>)}
            </>
          }
        </DropDownList>
      )}
    </div>
  );
}

const DropDownList = styled.ul`
  list-style: none;
  padding: 10px;
  position: absolute;
  width: 100%;
  background-color: ${AppColor.background.whitegray};
  top: 24px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  border-radius: 10px;
  z-index: 1;
`;

const Item = styled.li`
  padding: 10px 0px;
  cursor: pointer;
  font-size: 14px;
`;