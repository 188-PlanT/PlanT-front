import CommonLayout from '@components/layouts/CommonLayout';
import { NextPageWithLayout } from 'pages/_app';
import AppColor from '@styles/AppColor';
import MemberChip from '@components/MemberChip';
import PageName from '@components/PageName';
import Status from '@components/Status';
import TextInput from '@components/atoms/TextInput';
import ShortButton from '@components/atoms/ShortButton';
import ScheduleComment from '@components/ScheduleComment';
import {useState, useMemo, useCallback} from 'react';
import {useRouter} from 'next/router';
import styled from '@emotion/styled';
import {formatDate} from '@utils/Utils';
import {ScheduleStatus} from '@types/types';
import qs from 'qs';
import useModal from '@hooks/useModal';
import WorkspaceWithdrawConfirmModal from '@components/modals/WorkspaceWithdrawConfirmModal'; //TEST 용

interface TeamScheduleProps {}

const TeamSchedule: NextPageWithLayout<TeamScheduleProps> = ({}) => {
  const router = useRouter();
  
  const [isOpend, openModal, closeModal] = useModal();

  const isAdmin = true; //TODO 테스트용
  const data = { //TODO 테스트용
    scheduleId : 1,
    workspaceId : 1,
    workspaceName: 'testWorkspace1',
    name : 'testSchedule1',
    users : [
      {
        userId : 1,
        nickName : "test11",
      },
      {
        userId : 2,
        nickName : "test22",
      },
    ],
    startDate : "20240101:00:00",
    endDate : "20240101:00:00",
    content : "<p>asdadas</p><p>asdasdasda</p><p>asddskㅇ닝ㅁ닝ㅁㄴ</p><p>ㅏ나안ㅇㄴ</p><p>ㅁ낭미나어미ㅏ너이만ㅇ미너이만ㅇ</p><p>ㅁ나어ㅣㅏㅁㄴ이마너</p><p>ㅁㄴㅇㅁㅇㅁㄴㅇ</p><p>ㄴㅇㄴㅇㄴㅇ</p>",
    images : [],
    state : "TODO",
    chatList : [
      {
        chatId : 1,
        userId: 1,
        nickName : "test11",
        content : "test chat",
        createdAt: '20240208:10:34',
      },
      {
        chatId : 2,
        userId: 2,
        nickName : "test22",
        content : "test chat",
        createdAt: '20240211:13:15',
      },
    ],
  };
  
  const formedDate = useMemo(() => {
    const start = formatDate(data.startDate, 'YYYY년 MM월 DD일 HH:mm');
    const end = formatDate(data.endDate, 'YYYY년 MM월 DD일 HH:mm');
    return {start, end};
  }, [data]);
  
  const [comment, setComment] = useState('');
  const onChangeComment = useCallback((e) => {
    setComment(e.target.value);
  }, []);
  const onSubmitComment = useCallback(() => {
    //TODO API 연결
    console.log(comment, '제출')
    setComment('');
  }, [comment]);
  
  const onClickStatus = useCallback((status: ScheduleStatus) => () => {
    //TODO API 연결
    console.log(status);
  }, []);
  
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
  }, [data]);
  
  return (
    <div>
      <Container>
        <PageName pageName={data.workspaceName} additionalName={data.name} />
        
        <div style={{margin: '50px 18%'}}>
          <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Title>{data.name}</Title>
              <div style={{display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                {['TODO', 'INPROGRESS', 'DONE']
                  .map(s =>
                       <StatusButton
                         key={s}
                         onClick={onClickStatus(s)}
                         style={{...(data.state === s && {border: `2px solid ${AppColor.border.black}`})}}
                       >
                         <Status size='30px' status={s} />
                       </StatusButton>
                  )
                }
              </div>
            </div>

            <div>
              <label style={{color: AppColor.text.secondary, fontSize: '12px', color: AppColor.text.main}}>참여 멤버</label>
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
              <Date>{formedDate.start}</Date>
              <div style={{marginTop: '2px', height: '1px', width: '40px', border: `1.5px solid ${AppColor.text.secondary}`, backgroundColor: AppColor.text.secondary}} />
              <Date>{formedDate.end}</Date>
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
          
          {isAdmin && (
            <div style={{display: 'flex', columnGap: '14px', justifyContent: 'flex-end'}}>
              <ShortButton
                onClick={openModal}
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
          )}
        </div>
        <WorkspaceWithdrawConfirmModal isOpened={isOpend} closeModal={closeModal} />
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
