import CommonLayout from '@components/layouts/CommonLayout';
import { NextPageWithLayout } from 'pages/_app';
import AppColor from '@styles/AppColor';
import MemberChip from '@components/MemberChip';
import PageName from '@components/PageName';
import Status from '@components/Status';
import TextInput from '@components/atoms/TextInput';
import ShortButton from '@components/atoms/ShortButton';
import ScheduleComment from '@components/ScheduleComment';
import { useState, useMemo, useCallback, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { formatDate } from '@utils/Utils';
import {ScheduleStatus, ScheduleStatusType } from '@customTypes/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SCHEDULE_QUERY_KEY, getScheduleDetailByScheduleId, updateScheduleState, deleteSchedule } from '@apis/scheduleApi';
import qs from 'qs';
import { toast } from 'react-toastify';

interface TeamScheduleProps {}

const TeamSchedule: NextPageWithLayout<TeamScheduleProps> = ({}) => {
  const router = useRouter();

  const {scheduleId, workspaceId} = useMemo(() => router.query, [router]);
  
  const {data} = useQuery({
    queryKey: [SCHEDULE_QUERY_KEY.GET_SCHEDULE_DETAIL_BY_SID, scheduleId],
    queryFn: () => getScheduleDetailByScheduleId({scheduleId}),
    enabled: !!scheduleId,
    initialData: {users: [], chatList: []},
    retry: 1,
    onError: () => {
      toast.error('접근 할 수 없거나 존재하지 않는 일정입니다.');
      router.push(`/workspace/${workspaceId}`);
    }
  });

  const [formattedDate, setFormattedDate] = useState({
    start: formatDate('', 'YYYY년 MM월 DD일 HH:mm'), 
    end: formatDate('', 'YYYY년 MM월 DD일 HH:mm'),
  });
  const [status, setStatus] = useState('TODO');
  useEffect(() => {
    if (data.startDate && data.endDate) {
      setFormattedDate({
        start: formatDate(data.startDate, 'YYYY년 MM월 DD일 HH:mm'),
        end: formatDate(data.endDate, 'YYYY년 MM월 DD일 HH:mm'),
      });
    }
    if (data.state) {
      setStatus(data.state);
    }
  }, [data]);
  
  const [comment, setComment] = useState('');
  const onChangeComment = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);
  const onSubmitComment = useCallback(() => {
    //TODO API 연결
    console.log(comment, '제출')
    setComment('');
  }, [comment]);
  
  const {mutate: _updateScheduleState} = useMutation(updateScheduleState, {
    onSuccess: (data, valiable) => {
      setStatus(valiable.state);
      toast.success('일정 진행 상태 변경 완료');
    },
  });
  const onClickStatus = useCallback((status: ScheduleStatusType) => () => {
    _updateScheduleState({scheduleId, state: status});
  }, [scheduleId, _updateScheduleState]);
  
  const {mutate: _deleteSchedule} = useMutation(deleteSchedule, {
    onSuccess: () => {
      toast.error('일정 삭제 완료');
      router.push(`/workspace/${workspaceId}`);
    }
  });
  const onClickDelete = useCallback(() => {
    _deleteSchedule({scheduleId});
  }, [scheduleId, _deleteSchedule]);
  
  const onClickEdit = useCallback(() => {
    const query = qs.stringify({
      scheduleId: data.scheduleId,
      workspaceId: data.workspaceId,
      workspaceName: data.workspaceName,
      name : data.name,
      users : data.users,
      startDate: data.startDate,
      endDate: data.endDate,
      content: data.content,
      state: data.state,
    });
    router.push(`/workspace/${data.workspaceId}/edit?${query}`);
  }, [data, router]);
  
  return (
    <div>
      <Container>
        <PageName pageName={data.workspaceName} additionalName={data.name} />
        
        <div style={{margin: '50px 18%'}}>
          <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Title>{data.name}</Title>
              <div style={{display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                {(['TODO', 'INPROGRESS', 'DONE'] as ScheduleStatusType[])
                  .map((s: ScheduleStatusType) => 
                       <StatusButton
                         key={s}
                         onClick={onClickStatus(s)}
                         style={{...(status === s && {border: `2px solid ${AppColor.border.black}`})}}
                       >
                         <Status size='30px' status={s} />
                       </StatusButton>
                  )
                }
              </div>
            </div>

            <div>
              <label style={{color: AppColor.text.secondary, fontSize: '12px'}}>참여 멤버</label>
              <div style={{display: 'flex', alignItems: 'center', columnGap: '8px', marginTop: '6px'}}>
                {data.users
                  .map((u, i) => 
                    <MemberChip
                      key={u.userId}
                      color={AppColor.memberChip[Object.keys(AppColor.memberChip)[i]]}
                      isEditable={false}
                      user={u}
                    />
                  )
                }
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', columnGap: '10px', fontWeight: '500', color: AppColor.text.secondary}}>
              <Date>{formattedDate.start}</Date>
              <div style={{marginTop: '2px', height: '1px', width: '40px', border: `1.5px solid ${AppColor.text.secondary}`, backgroundColor: AppColor.text.secondary}} />
              <Date>{formattedDate.end}</Date>
              <div style={{alignSelf: 'flex-end'}}>까지</div>
            </div>
            
            <CommentContainer>
              {data.chatList.map(c => <ScheduleComment key={c.chatId} chat={c} />)}
              <TextInput
                containerStyle={{backgroundColor: 'transparent', height: '30px', border: 'none', marginLeft: '-10px'}}
                style={{fontSize: '12px', backgroundColor: 'transparent'}}
                placeholder="댓글쓰기"
                value={comment}
                onChange={onChangeComment}
                endAdornment={
                  <CommentEnterButton
                    onClick={onSubmitComment}
                    style={{backgroundColor: comment ? AppColor.main : AppColor.background.gray}}
                  >
                    작성
                  </CommentEnterButton>
                }
              />
            </CommentContainer>
            
            <div style={{minHeight: '46vh', marginBottom: '10px'}}>
              <div dangerouslySetInnerHTML={{__html: data.content}}></div>
            </div>
          </div>
          <div style={{display: 'flex', columnGap: '14px', justifyContent: 'flex-end'}}>
            <ShortButton
              onClick={onClickDelete}
              label='삭제'
              buttonStyle={{
                backgroundColor: AppColor.text.error,
                width: '60px',
                height: '32px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                padding: '0',
              }}  
            />
            <ShortButton
              onClick={onClickEdit}
              label='수정'
              buttonStyle={{
                backgroundColor: AppColor.main,
                width: '60px',
                height: '32px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                padding: '0',
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TeamSchedule;

TeamSchedule.getLayout = page => <CommonLayout title='PLAN,T | 팀 워크스페이스'>{page}</CommonLayout>;

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 46px;
  font-weight: bold;
  margin: 0;
  color: ${AppColor.text.secondary};
`;

const Date = styled.div`
  font-size: 30px;
  font-weight: 500;
  color: ${AppColor.text.secondary};
  line-height: 1;
`;

const CommentContainer = styled.div`
  padding: 10px 0;
  margin: 0 auto;
  width: 86%;
  border: 1px solid ${AppColor.border.gray};
  border-left: none;
  border-right: none;
  color: ${AppColor.text.secondary};
  max-height: 240px; 
`;

const CommentEnterButton = styled.div`
  border-radius: 6px;
  width: 38px;
  height: 22px;
  font-size: 10px;
  line-height: 1.2;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${AppColor.etc.white};
  cursor: pointer;
`;

const StatusButton = styled.button`
  border: none;
  background: none;
  border-radius: 100%;
  cursor: pointer;
  width: 33px;
  height: 33px;
  padding: 0;
`;
