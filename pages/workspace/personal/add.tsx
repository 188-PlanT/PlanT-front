import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('@components/post/Editor'), { ssr: false });

import CommonLayout from '@components/layouts/CommonLayout';
import PageName from '@components/PageName';
import WorkspaceDropDown from '@components/WorkspaceDropDown';
import WorkspaceMemberDropDown from '@components/WorkspaceMemberDropDown';
import MemberChip from '@components/MemberChip';
import DatePicker from 'react-datepicker';
import TextInput from '@components/atoms/TextInput';
import ShortButton from '@components/atoms/ShortButton';
import Status from '@components/Status';
import { NextPageWithLayout } from 'pages/_app';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Image from 'next/image';
import FolderIcon from '@public/image/folder_icon.png';
import {useState, useCallback, ChangeEvent} from 'react';
import {ScheduleStatus, ScheduleStatusType} from '@customTypes/types';
import {useRouter} from 'next/router';
import useModal from '@hooks/useModal';
import ScheduleCreateStopModal from '@components/modals/ScheduleCreateStopModal';
import ScheduleCreateConfirmModal from '@components/modals/ScheduleCreateConfirmModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SCHEDULE_QUERY_KEY, createSchedule } from '@apis/scheduleApi';
import { WORKSPACE_QUERY_KEY, getWorkspaceUserByWId } from '@apis/workspaceApi';
import { USER_QUERY_KEY, getMyWorkspaceList } from '@apis/userApi';
import {toast} from 'react-toastify';
import dayjs from 'dayjs';

interface AddPersonalScheduleProps {}

const AddPersonalSchedule: NextPageWithLayout<AddPersonalScheduleProps> = ({}) => {
  const router = useRouter();
  
  const { data: {workspaces: workspaceList} } = useQuery([USER_QUERY_KEY.GET_MY_WORKSPACE_LIST], getMyWorkspaceList, {
    initialData: {userId: 0, workspaces: []},
  });

  const [stopModalIsOpened, stopModalOpenModal, stopModalCloseModal] = useModal();
  const [confirmModalIsOpened, confirmModalOpenModal, confirmModalCloseModal] = useModal();
  
  const [name, setName] = useState('');
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {setName(e.target.value)}, []);

  const [selectedWorkspace, setSelectedWorkspace] = useState<{workspaceName: string; workspaceId: number} | null>(null);
  
  const [selectedMemberList, setSelectedMemberList] = useState<{nickName: string; userId: number}[]>([]);
  const onSelectMember = useCallback(
    (user: {nickName: string; userId: number}) => () => {
      if (selectedMemberList.filter(u => u.userId === user.userId).length !== 0) return;
      setSelectedMemberList(prev => [...prev, user]);
    }, [selectedMemberList]);
  const onCancelMember = useCallback(
    (userId: number) => () => {
      const updatedList = selectedMemberList.filter(user => user.userId !== userId);
      setSelectedMemberList(updatedList);
  }, [selectedMemberList]);
  
  const {data: memberList} = useQuery(
    [WORKSPACE_QUERY_KEY.GET_WORKSPACE_USERS_BY_WID, selectedWorkspace?.workspaceId],
    async () => {
      const result = await getWorkspaceUserByWId({workspaceId: Number(selectedWorkspace?.workspaceId)});
      return result.users.map(u => ({userId: u.userId, nickName: u.nickName}));
    },
    {
      initialData: [],
      enabled: !!selectedWorkspace,
    },
  );
  
  const [selectedDate, setSelectedDate] = useState({start: '', end: ''});
  const onChangeStartDate = useCallback((date) => {
    if (date > selectedDate.end) {
      setSelectedDate({start: date, end: date});
      return;
    }
    setSelectedDate(prev => ({...prev, start: date}))
  }, [selectedDate]);
  const onChangeEndDate = useCallback((date) => {
    if (selectedDate.start > date) {
      setSelectedDate({start: date, end: date});
      return;
    }
    setSelectedDate(prev => ({...prev, end: date}))
  }, [selectedDate]);
  
  const [contentHtml, setContentHtml] = useState('');
  
  const [selectedStatus, setSelectedStatus] = useState<ScheduleStatusType>('TODO');
  
  const onClickCancel = useCallback(() => {
    stopModalOpenModal();
  }, [stopModalOpenModal]);
  const onClickCancelConfirm = useCallback(() => {
    router.back();
    stopModalCloseModal();
  }, [router, stopModalCloseModal]);
  
  const onClickSubmit = useCallback(() => {
    if (!name) {
      toast.error('일정의 이름을 입력해 주세요.');
      return;
    }
    if (!selectedWorkspace) {
      toast.error('일정을 추가할 워크스페이스를 선택해 주세요.');
      return;
    }
    if (selectedMemberList.length === 0) {
      toast.error('일정에 참여하는 멤버를 1명 이상 정해 주세요.');
      return;
    }
    if (!(selectedDate.start && selectedDate.end)) {
      toast.error('일정의 시작일, 종료일을 바르게 입력해 주세요.');
      return;
    }
    if (!contentHtml || contentHtml === '<p><br></p>') {
      toast.error('일정의 내용을 입력해 주세요.');
      return;
    }
    if (!selectedStatus) {
      toast.error('일정의 상태를 선택해 주세요.');
      return;
    }
    confirmModalOpenModal();
  }, [selectedWorkspace, name, selectedMemberList, selectedDate, contentHtml, selectedStatus, confirmModalOpenModal]);
  
  const {mutate: _createSchedule} = useMutation(createSchedule, {
    onSuccess: (data, valiable) => {
      router.push(`/workspace/${valiable.workspaceId}/${data.scheduleId}`);
    },
  });
  const onClickSubmitconfirm = useCallback(() => {
    if (!selectedWorkspace) return;
    _createSchedule({
      workspaceId: selectedWorkspace.workspaceId,
      name,
      users: selectedMemberList.map(user => user.userId),
      startDate: dayjs(selectedDate.start).format('YYYYMMDD:HH:mm').toString(),
      endDate: dayjs(selectedDate.end).format('YYYYMMDD:HH:mm').toString(),
      state : selectedStatus,
      content : contentHtml,
    });
    confirmModalCloseModal();
  }, [selectedWorkspace, name, selectedMemberList, selectedDate, contentHtml, selectedStatus, confirmModalCloseModal, _createSchedule]);
  
  return (
    <Container>
      <PageName pageName={selectedWorkspace?.workspaceName ? selectedWorkspace.workspaceName : '일정 생성하기'} additionalName={name} />
      
      <div style={{margin: '50px 18%'}}>
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px'}}>
          <TextInput
            placeholder='일정 이름을 입력해 주세요'
            containerStyle={{marginLeft: '-10px', backgroundColor: 'transparent', height: '72px', border: 'none'}}
            style={{fontSize: '46px',backgroundColor: 'transparent', fontWeight: 'bold'}}
            value={name}
            onChange={onChangeName}
          />

          <div style={{display: 'flex', alignItems: 'center', marginTop: '10px', columnGap: '16px'}}>
            <Image src={FolderIcon} alt='폴더 이모지' width={46} height={32} />
            <WorkspaceDropDown
              workspaceList={workspaceList}
              value={selectedWorkspace}
              onChangeValue={(value) => () => setSelectedWorkspace(value)}
            />
          </div>

          <WorkspaceMemberDropDown
            memberList={memberList}
            onClickItem={onSelectMember}
          />
          <div style={{display: 'flex', alignItems: 'center', columnGap: '8px', marginTop: '-10px'}}>
            {selectedMemberList
              .map((u, i) => 
                <MemberChip
                  key={u.userId}
                  color={AppColor.memberChip[Object.keys(AppColor.memberChip)[i]]}
                  isEditable
                  user={u}
                  onEdit={onCancelMember}
                />
              )
            }
          </div>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <StyledDatePicker
              shouldCloseOnSelect
              showIcon
              placeholderText="시작일"
              dateFormat="YYYY/MM/dd HH:mm"
              selected={selectedDate.start}
              onChange={onChangeStartDate}
              showTimeInput
              timeInputLabel="시작시각 :"
            />
            <div style={{height: '1px', margin: '0 16px', width: '46px', border: `1px solid ${AppColor.border.gray}`}} />
            <StyledDatePicker
              shouldCloseOnSelect
              showIcon
              placeholderText="종료일"
              dateFormat="YYYY/MM/dd HH:mm"
              selected={selectedDate.end}
              onChange={onChangeEndDate}
              showTimeInput
              timeInputLabel="종료시각 :"
            />
          </div>
        </div>
        <div style={{height: '1px', margin: '20px auto', width: '86%', border: `1px solid ${AppColor.border.gray}`}} />
        <div>
          <Editor html={contentHtml} setHtml={setContentHtml} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0'}}>
          <div style={{display: 'flex', alignItems: 'center', columnGap: '14px'}}>
            <div style={{color: AppColor.text.main, fontSize: '18px', fontWeight: 'bold', opacity: '0.9'}}>진행도</div>
            <StatusButton
              onClick={() => {setSelectedStatus(ScheduleStatus[1] as ScheduleStatusType)}}
              style={{...(selectedStatus === ScheduleStatus[1] && {border: '2px solid black'})}}
            >
              <Status size={'22px'} status={ScheduleStatus[1] as ScheduleStatusType} />
            </StatusButton>
            <StatusButton
              onClick={() => {setSelectedStatus(ScheduleStatus[2] as ScheduleStatusType)}}
              style={{...(selectedStatus === ScheduleStatus[2] && {border: '2px solid black'})}}
            >
              <Status size={'22px'} status={ScheduleStatus[2] as ScheduleStatusType} />
            </StatusButton>
            <StatusButton
              onClick={() => {setSelectedStatus(ScheduleStatus[3] as ScheduleStatusType)}}
              style={{...(selectedStatus === ScheduleStatus[3] && {border: '2px solid black'})}}
            >
              <Status size={'22px'} status={ScheduleStatus[3] as ScheduleStatusType} />
            </StatusButton>
          </div>
          
          <div style={{display: 'flex', columnGap: '14px'}}>
            <ShortButton
              onClick={onClickCancel}
              label='취소'
              buttonStyle={{
                width: '80px',
                height: '34px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                padding: '0',
                color: AppColor.text.main,
                backgroundColor: AppColor.background.gray,
              }}  
            />
            <ShortButton
              onClick={onClickSubmit}
              label='추가하기'
              buttonStyle={{
                backgroundColor: AppColor.main,
                width: '80px',
                height: '34px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                padding: '0',
              }}
            />
          </div>
        </div>
      </div>
      <ScheduleCreateStopModal
        isOpened={stopModalIsOpened}
        closeModal={stopModalCloseModal}
        onClick={onClickCancelConfirm}
      />
      <ScheduleCreateConfirmModal
        isOpened={confirmModalIsOpened}
        closeModal={confirmModalCloseModal}
        onClick={onClickSubmitconfirm}
      />
    </Container>
  );
};

export default AddPersonalSchedule;

AddPersonalSchedule.getLayout = page => <CommonLayout title='PLAN,T | 개인 일정 추가'>{page}</CommonLayout>;

const Container = styled.div`
  width: 100%;
`;

const StyledDatePicker = styled(DatePicker)`
  border: 1px solid ${AppColor.border.gray};
  border-radius: 8px;
  height: 36px;
  color: ${AppColor.text.main};
  width: 180px;
  font-size: 14px;
  background-color: ${AppColor.background.main};
`;

const StatusButton = styled.button`
  border: none;
  background: none;
  border-radius: 100%;
  cursor: pointer;
  width: 26px;
  height: 26px;
  padding: 0;
`;
