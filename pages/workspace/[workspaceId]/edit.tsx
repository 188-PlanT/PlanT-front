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
import { useState, useCallback, useMemo, useEffect, ChangeEvent } from 'react';
import { ScheduleStatus, ScheduleStatusType } from '@customTypes/types';
import {useRouter} from 'next/router';
import qs from 'qs';
import { formatDate } from '@utils/Utils';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SCHEDULE_QUERY_KEY, updateSchedule } from '@apis/scheduleApi';
import { WORKSPACE_QUERY_KEY, getWorkspaceUserByWId } from '@apis/workspaceApi';

interface EditTeamScheduleProps {}

const EditTeamSchedule: NextPageWithLayout<EditTeamScheduleProps> = ({}) => {
  const router = useRouter();
  
  const query = useMemo(() => qs.parse(router.query), [router]);
  
  const scheduleId = useMemo(() => router.query.scheduleId, [router]);
  const workspaceId = useMemo(() => router.query.workspaceId, [router]);
  const workspaceName: string = useMemo(() => String(router.query.workspaceName), [router]);
  
  const [name, setName] = useState('');
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {setName(e.target.value)}, []);
  
  const {data: memberList} = useQuery({
    queryKey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_USER_BY_WID],
    queryFn: async () => {
      const result = await getWorkspaceUserByWId({workspaceId: workspaceId});
      return result.users.map(u => ({userId: u.userId, nickName: u.nickName}));
    },
    initialData: [],
    enabled: !!workspaceId,
  });
  const [selectedMemberList, setSelectedMemberList] = useState<{nickName: string; userId: number}[]>([]);
  const onSelectMember = useCallback(
    (user: {nickName: string; userId: number}) => () => {
      if (selectedMemberList.filter(u => +u.userId === +user.userId).length !== 0) return;
      setSelectedMemberList(prev => [...prev, user]);
    }, [selectedMemberList]);
  const onCancelMember = useCallback(
    (userId: number) => () => {
      const updatedList = selectedMemberList.filter(user => user.userId !== userId);
      setSelectedMemberList(updatedList);
  }, [selectedMemberList]);
  
  const [selectedDate, setSelectedDate] = useState<{start: Date | string; end: Date | string;}>({start: '', end: ''});
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
  
  useEffect(() => {
    if (Object.keys(query).length === 0) return;

    setName(query.name ? query.name as string : '');
    setSelectedMemberList(query.users ? query.users.map(u => ({...u, userId: +u.userId})) as any : []);
    setSelectedDate(
      (query.startDate && query.endDate) ?
        {
          start: new Date(formatDate(query.startDate as string, 'YYYY.MM.DD HH:mm')),
          end: new Date(formatDate(query.endDate as string, 'YYYY.MM.DD HH:mm')),
        } : {
          start: '',
          end: '',
        }
    );
    setContentHtml(query.content ? query.content as string : '');
    setSelectedStatus(query.state ? query.state as ScheduleStatusType : 'TODO');
  }, [query]);
  
  const onClickCancel = useCallback(() => {
    router.back();
  }, [router]);
  
  const {mutate: _updateSchedule} = useMutation(updateSchedule, {
    onSuccess: () => {
      toast.success('수정 완료');
      router.push(`/workspace/${workspaceId}/${scheduleId}`);
    },
  });
  const onSubmitEdit = useCallback(() => {
    const params = {
      scheduleId,
      name: name,
      users: selectedMemberList.map(u => u.userId),
      startDate: formatDate(selectedDate.start, 'YYYYMMDD:HH:mm'),
      endDate: formatDate(selectedDate.end, 'YYYYMMDD:HH:mm'),
      content: contentHtml,
      state: selectedStatus,
    };
    console.log(params);
    _updateSchedule(params);
  }, [scheduleId, name, selectedMemberList, selectedDate, contentHtml, selectedStatus]);
  
  return (
    <Container>
      <PageName pageName={workspaceName} additionalName={name} />
      
      <div style={{margin: '50px 18%'}}>
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px'}}>
          <TextInput
            placeholder='일정 이름을 입력해 주세요'
            containerStyle={{marginLeft: '-10px', backgroundColor: 'transparent', height: '72px', border: 'none'}}
            style={{fontSize: '46px',backgroundColor: 'transparent', fontWeight: 'bold'}}
            value={name}
            onChange={onChangeName}
          />

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
              onClick={onSubmitEdit}
              label='수정완료'
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
    </Container>
  );
};

export default EditTeamSchedule;

EditTeamSchedule.getLayout = page => <CommonLayout title='PLAN,T | 팀 일정 추가'>{page}</CommonLayout>;

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
