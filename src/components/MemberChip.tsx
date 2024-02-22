import styled from '@emotion/styled';
import {useState, useCallback} from 'react';
import AppColor from '@styles/AppColor';

interface MemberChipProps {
  isEditable: boolean;
  user: {nickName: string; userId: number};
  onEdit?: (userId: number) => () => void;
  color: string;
}

export default function MemberChip({isEditable = false, user, onEdit, color = AppColor.memberChip.red}: MemberChipProps) {
  return (
    <Container style={{backgroundColor: color}}>
      {isEditable && <DeleteButton  onClick={onEdit && onEdit(user.userId)}>x</DeleteButton>}
      {user.nickName}
    </Container>
  );
};

const Container = styled.div`
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${AppColor.text.main};
  opacity: 0.9;
  padding: 4px 8px;
  position: relative;
`;

const DeleteButton = styled.button`
  width: 12px;
  height: 12px;
  background-color: ${AppColor.background.gray};
  border: none;
  border-radius: 100%;
  position: absolute;
  color: ${AppColor.etc.white};
  font-size: 2px;
  top: -6px;
  right: -6px;
  line-height: 0.4;
  padding: 0;
  cursor: pointer;
`;
