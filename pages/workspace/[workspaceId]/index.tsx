import CommonLayout from '@components/layouts/CommonLayout';
import TextInput from '@components/atoms/TextInput';
import PageName from '@components/PageName';
import ToDoCard from '@components/ToDoCard';
import PlusButton from '@components/PlusButton';
import DateCarousel from '@components/DateCarousel';
import SettingButton from '@components/SettingButton';
import ShortButton from '@components/atoms/ShortButton';
import Day from '@components/Day';
import WorkspaceWithdrawConfirmModal from '@components/modals/WorkspaceWithdrawConfirmModal';
import useModal from '@hooks/useModal';
import { NextPageWithLayout } from 'pages/_app';
import AppColor from '@styles/AppColor';
import { useRouter } from 'next/router';
import { useCallback, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { makeCalendarArray } from '@utils/Utils';
import { ScheduleStatusType } from '@customTypes/types';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@apis/userApi';
import { WORKSPACE_QUERY_KEY, deleteWorkspaceUser, getWorkspaceCalendarByMonth, getWorkspaceSchedulesByDate } from '@apis/workspaceApi';
import { useAppSelector } from '@store/configStore';
import { selectUserId } from '@store/slices/user';

interface TeamWorkspaceProps {}

const TeamWorkspace: NextPageWithLayout<TeamWorkspaceProps> = ({}) => {
  const router = useRouter();
  
  const myUserId = useAppSelector(selectUserId);
  const workspaceId = useMemo(() => router.query.workspaceId, [router]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const month = useMemo(() => selectedYear.toString() + selectedMonth.toString().padStart(2, '0'), [selectedYear, selectedMonth]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateFormatMMDD = useMemo(() => dayjs(selectedDate).format('MM/DD'), [selectedDate]);
  
  const {data: scheduleData} = useQuery({
    queryKey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_CALENDAR_BY_MONTH, month],
    queryFn: () => getWorkspaceCalendarByMonth({workspaceId, month}),
    enabled: !!(selectedYear && selectedMonth && workspaceId),
    initialData: {workspaceName: '', role: 'USER', schedules: []},
  });
  const calendarData = useMemo(() => {
    const calendarArray = makeCalendarArray(selectedYear, selectedMonth);
    return calendarArray.map(
      d => (
        {
          date: d,
          scheduleData: scheduleData.schedules,
        }
      )
    );
  }, [selectedYear, selectedMonth]);
  const workspaceName = useMemo(() => scheduleData.workspaceName, [scheduleData]);
  
  const isAdmin = useMemo(() => scheduleData.role === 'ADMIN', [scheduleData]);
  
  const {data: selectedDateScheduleData} = useQuery({
    queryKey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_SCHEDULES_BY_DATE, selectedDate],
    queryFn: () => getWorkspaceSchedulesByDate({workspaceId, date: dayjs(selectedDate).format('YYYYMMDD').toString()}),
    enabled: !!(selectedDate && workspaceId),
    initialData: {workspaceName: '', schedules: []},
  });

  const onClickPrevMonth = useCallback(() => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
      return;
    }
    setSelectedMonth(prev => prev - 1);
  }, [selectedMonth]);
  
  const onClickNextMonth = useCallback(() => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
      return;
    }
    setSelectedMonth(prev => prev + 1);
  }, [selectedMonth]);

  const onChangeSelectedDate = useCallback((_date: Date) => () => {
    setSelectedDate(_date);
  }, []);
  
  const queryClient = useMemo(() => new QueryClient(), []);
  
  const {mutate: _deleteWorkspaceUser} = useMutation(deleteWorkspaceUser, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({querykey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_USERS_BY_WID, workspaceId], refetchType: 'inactive'});
      console.log(res);
    },
  });
  const [withdrawModalIsOpened, withdrawModalOpen, withdrawModalClose] = useModal();
  const onClickWithdraw = useCallback(async () => {
    await deleteWorkspaceUser({
      workspaceId,
      userId: myUserId,
    }).then(() => {
      queryClient.invalidateQueries({queryKey: [USER_QUERY_KEY.GET_MY_WORKSPACE_LIST]});
      router.push('/workspace/personal');
    }).catch((error) => {
      toast.error(error.message);
    });
    withdrawModalClose();
  }, [withdrawModalClose, router, workspaceId, myUserId]);
  
  return (
    <div>
      <PageName pageName={workspaceName} />
      
      <div style={{display: 'flex', padding: '20px 30px', columnGap: '20px'}}>
        <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '14px'}}>
          <TextInput 
            wrapperStyle={{width: '100%'}}
            placeholder="일정 검색하기"
          />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '100%'}}>
            {
              isAdmin ? 
                <SettingButton href={`/workspace/${workspaceId}/setting`} /> : 
                <ShortButton 
                  label='팀 나가기'
                  buttonStyle={{backgroundColor: AppColor.text.error, height: '40px'}}
                  onClick={withdrawModalOpen} />
            }
            <DateCarousel selectedYear={selectedYear} selectedMonth={selectedMonth} onClickPrevMonth={onClickPrevMonth} onClickNextMonth={onClickNextMonth} />
            <PlusButton 
              path={{
                pathname: `/workspace/${workspaceId}/add`,
                query: {
                  workspaceName,
                },
              }}
              color={AppColor.etc.white}
              backgroundColor={AppColor.main}
            />
          </div>
          <Calendar>
            <Weekly>
              <DayTime>Sun</DayTime>
              <DayTime>Mon</DayTime>
              <DayTime>Tue</DayTime>
              <DayTime>Wed</DayTime>
              <DayTime>Thu</DayTime>
              <DayTime>Fri</DayTime>
              <DayTime>Sat</DayTime>
            </Weekly>
            <DateContainer>
              {calendarData.map(
                (d) => 
                  <Day
                    key={d.date}
                    onClick={onChangeSelectedDate(new Date(d.date))}
                    scheduleData={d.scheduleData}
                    date={new Date(d.date)}
                    isSelected={dayjs(new Date(d.date)).isSame(dayjs(selectedDate), 'day')}
                  />
              )}
            </DateContainer>
          </Calendar>
        </div>
        
        <SelectedDateListContainer>
          <SelectedDateText>{selectedDateFormatMMDD} 플랜</SelectedDateText>
          {selectedDateScheduleData.schedules.map(
            (schedule) => 
              <ToDoCard 
                workspaceId={workspaceId} 
                scheduleId={schedule.scheduleId} 
                workspaceName={workspaceName} 
                scheduleName={schedule.scheduleName} 
                status={schedule.state} 
              />
          )}
        </SelectedDateListContainer>
      </div>
      <WorkspaceWithdrawConfirmModal isOpened={withdrawModalIsOpened} closeModal={withdrawModalClose} onClick={onClickWithdraw} />
    </div>
  );
};

export default TeamWorkspace;

TeamWorkspace.getLayout = page => <CommonLayout title='PLAN,T | 팀 워크스페이스'>{page}</CommonLayout>;

const Calendar = styled.div`
  width: 100%;
  height: 700px;
`;

const Weekly = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin: 8px 0;
`;

const DayTime = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
`;

const DateContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-row-gap: 4px;
`;

const SelectedDateListContainer = styled.div`
  width: 25%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  background-color: ${AppColor.background.lightwhite};
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: calc(100vh - 90px);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  };
`;

const SelectedDateText = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: ${AppColor.text.main};
`;
