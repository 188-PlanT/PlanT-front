import {formatDate} from '@utils/Utils';
import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useCallback, ChangeEvent } from 'react';
import useModal from '@hooks/useModal';
import TextInput from '@components/atoms/TextInput';
import CommentDeleteConfirmModal from '@components/modals/CommentDeleteConfirmModal';
import 'dayjs/locale/ko';
import { SCHEDULE_QUERY_KEY } from '@apis/scheduleApi';
import { updateComment, deleteComment } from '@apis/commentApi';
import MoreIcon from '@public/image/more_icon.png';

interface ScheduleCommentProps {
  scheduleId: number;
  chat: {chatId: number; userId: number; nickName: string; content: string; createDate: string;};
  isMine?: boolean;
}

export default function ScheduleComment({scheduleId, chat, isMine = false}: ScheduleCommentProps) {
  const [isOpened, openModal, closeModal] = useModal();
  
  const queryClient = useQueryClient();
  
  const formattedDate = useMemo(() => {
    return formatDate(chat.createDate, 'YYYY년 MM월 DD일 A hh:mm');
  }, [chat]);
  
  const [isToolTipOpened, setIsToolTipOpened] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState('');
  const onChangeContent = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  }, []);
  
  useEffect(() => {
    if (chat.content) {
      setContent(chat.content);
    }
  }, [chat]);
  
  const onClickEditButton = useCallback(() => {
    setIsEditable(true);
    setIsToolTipOpened(false);
  }, []);
  const onClickCancelEditButton = useCallback(() => {
    setIsEditable(false);
    setContent(chat.content);
  }, [chat]);
  
  const {mutate: _updateComment} = useMutation(updateComment, {
    onSuccess: (data, valiable) => {
      setIsEditable(false);
      setContent(valiable.content);
      queryClient.invalidateQueries({queryKey: [SCHEDULE_QUERY_KEY.GET_SCHEDULE_DETAIL_BY_SID, scheduleId]});
    },
  });
  const onEditComment = useCallback(() => {
    _updateComment({scheduleId, chatId: chat.chatId, content});
  }, [chat, scheduleId, content]);
  
  
  const {mutate: _deleteComment} = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [SCHEDULE_QUERY_KEY.GET_SCHEDULE_DETAIL_BY_SID, scheduleId]});
    },
  });
  const onDeleteComment = useCallback(() => {
    if (scheduleId && chat.chatId) {
      _deleteComment({scheduleId, chatId: chat.chatId});
      closeModal();
    }
  }, [chat, scheduleId, closeModal]);
  
  return (
    <Container>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{display: 'flex', marginBottom: '4px', alignItems: 'center', columnGap: '10px'}}>
            <NickName>{chat.nickName}</NickName>
            <Date>{formattedDate}</Date>
          </div>
          <Content>{chat.content}</Content>
        </div>

        {isMine && (
          <div style={{display: 'flex', columnGap: '4px', position: 'relative'}}>
            <Image src={MoreIcon} height={21} width={5} style={{cursor: 'pointer'}} onClick={() => setIsToolTipOpened(prev => !prev)} />
            {isToolTipOpened && (
              <ToolTip>
                <Button onClick={onClickEditButton}>
                  댓글 수정
                </Button>
                <Button
                  onClick={() => {
                    openModal();
                    setIsToolTipOpened(false);
                  }}
                >
                  댓글 삭제
                </Button>
              </ToolTip>
              )}
          </div>
        )}
      </div>
      {isEditable && (
        <TextInput
          wrapperStyle={{borderBottom: `1px solid ${AppColor.border.gray}`, width: '100%'}}
          containerStyle={{backgroundColor: 'transparent', height: '30px', border: 'none', marginTop: '10px', marginLeft: '-2px'}}
          style={{fontSize: '12px', backgroundColor: 'transparent'}}
          placeholder="댓글쓰기"
          value={content}
          onChange={onChangeContent}
          endAdornment={
            <div style={{display: 'flex', columnGap: '4px'}}>
              <CircleButton
                onClick={onEditComment}
                style={{backgroundColor: AppColor.main}}
              >
                ✔
              </CircleButton>
              <CircleButton
                onClick={onClickCancelEditButton}
                style={{backgroundColor: AppColor.text.error}}
              >
                ⨉
              </CircleButton>
            </div>
          }
        />
      )}
      <CommentDeleteConfirmModal isOpened={isOpened} closeModal={closeModal} onClick={onDeleteComment} />
    </Container>
  );
};

const Container = styled.div`
  color: ${AppColor.text.secondary};
  font-size: 14px;
  line-height: 1.2;
  display: flex;
  margin-bottom: 8px;
  padding: 0 8px;
  flex-direction: column;
  row-gap: 6px;
`;

const NickName = styled.div`
  font-weight: 500;
`;

const Date = styled.div`
  font-weight: 100;
  font-size: 12px;
  opacity: 0.75;
`;

const Content = styled.div`
`;

const ToolTip = styled.div`
  padding: 10px;
  width: 88px;
  position: absolute;
  background-color: ${AppColor.background.lightwhite};
  top: -2px;
  right: 10px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  z-index: 2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
`;

const Button = styled.div`
  font-size: 12px;
  line-height: 1.2;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${AppColor.text.main};
  cursor: pointer;
`;

const CircleButton = styled.div`
  border-radius: 100%;
  width: 26px;
  height: 26px;
  font-size: 10px;
  line-height: 1.2;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${AppColor.etc.white};
  cursor: pointer;
`; 