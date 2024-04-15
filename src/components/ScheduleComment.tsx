import {formatDate} from '@utils/Utils';
import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import {useMemo} from 'react';
import 'dayjs/locale/ko';

interface ScheduleCommentProps {
  chat: {chatId: number; nickName: string; content: string; createDate: string;};
}

//TODO 편집 기능 추가
export default function ScheduleComment({chat}: ScheduleCommentProps) {
  const formattedDate = useMemo(() => {
    return formatDate(chat.createDate, 'YYYY년 MM월 DD일 A hh:mm');
  }, [chat]);
  
  return (
    <Container>
      <div style={{display: 'flex', alignItems: 'center', columnGap: '6px'}}>
        <NickName>{chat.nickName}</NickName>
        <Date>{formattedDate}</Date>
      </div>
      <Content>{chat.content}</Content>
    </Container>
  );
};

const Container = styled.div`
  color: ${AppColor.text.secondary};
  font-size: 14px;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  margin-bottom: 8px;
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
