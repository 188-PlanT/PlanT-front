import {useState, useCallback} from 'react';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Image from 'next/image';
import TextInput from '@components/atoms/TextInput';
import DropDownIcon from '@public/image/dropdown_icon.png';
import FolderIcon from '@public/image/folder_icon.png';

interface WorkspaceDropDownProps {
  workspaceList: {workspaceName: string; workspaceId: number}[];
  value: {workspaceName: string; workspaceId: number};
  onChangeValue: () => {};
}

export default function WorkspaceDropDown({workspaceList, value, onChangeValue}: WorkspaceDropDownProps) {
  const [isOpend, setIsOpend] = useState(false);
  
  return (
    <div style={{position: 'relative', cursor: 'pointer', width: '100%'}} onClick={() => setIsOpend(prev => !prev)}>
      <TextInput
        containerStyle={{backgroundColor: 'transparent'}}
        style={{backgroundColor: 'transparent', fontWeight: 'bold'}}
        placeholder='일정을 추가할 워크스페이스를 선택해 주세요'
        disabled
        onClick={() => {setIsOpend(prev => !prev)}}
        value={value.workspaceName ? value.workspaceName : ''}
        endAdornment={<Image src={DropDownIcon} width={20} height={20} alt='드롭다운 아이콘' />}
      />
      {isOpend && (
        <DropDownList>
          {workspaceList.map((w) => <Item onClick={onChangeValue(w)} key={w.workspaceId}>{w.workspaceName}</Item>)}
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