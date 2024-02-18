import CommonLayout from '@components/layouts/CommonLayout';
import TextInput from '@components/atoms/TextInput';
import PageName from '@components/PageName';
import ToDoCard from '@components/ToDoCard';
import PlusButton from '@components/PlusButton';
import DateCarousel from '@components/DateCarousel';
import Day from '@components/Day';
import { NextPageWithLayout } from 'pages/_app';
import AppColor from '@styles/AppColor';
import {useRouter} from 'next/router';
import {useCallback, useState, useMemo} from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { makeCalendarArray } from '@utils/Utils';

interface TeamWorkspaceProps {}

const TeamWorkspace: NextPageWithLayout<TeamWorkspaceProps> = ({}) => {
  const router = useRouter();
  
  const workspaceName = "김성훈의 마지막 잎새";  //TEST 용
  const workspaceId = useMemo(() => router.query.workspaceId, [router]);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateFormatMMDD = useMemo(() => dayjs(selectedDate).format('MM/DD'), [selectedDate]);
  
  const calendarData = useMemo(() => {
    const calendarArray = makeCalendarArray(selectedYear, selectedMonth);
    return calendarArray.map(d => ({date: d, scheduleData: [{scheduleId: 1, scheduleName: 'string', state: 'DONE'}, {scheduleId: 1, scheduleName: 'string', state: 'INPROGRESS'}, {scheduleId: 1, scheduleName: 'string', state: 'TODO'}]}));
  }, [selectedYear, selectedMonth]);
  
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
  
  return (
    <div>
      <PageName pageName={workspaceName} />
      
      <div style={{display: 'flex', padding: '20px 30px', columnGap: '20px'}}>
        <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '14px'}}>
          <TextInput 
            wrapperStyle={{width: '100%'}}
            placeholder="일정 검색하기"
          />
          <div style={{display: 'flex', justifyContent: 'center', position: 'relative', width: '100%'}}>
            <DateCarousel selectedYear={selectedYear} selectedMonth={selectedMonth} onClickPrevMonth={onClickPrevMonth} onClickNextMonth={onClickNextMonth} />
            <PlusButton style={{position: 'absolute', top: '10px', right: '00px'}} path={`/workspace/${workspaceId}/add`} color={AppColor.etc.white} backgroundColor={AppColor.main} />
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
                    key={d}
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
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'DONE'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'INPROGRESS'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'INPROGRESS'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'INPROGRESS'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'INPROGRESS'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'TODO'} />
          <ToDoCard workspaceId={1} scheduleId={1} workspaceName={workspaceName} scheduleName={'일정 이름 일정 이름'} status={'DONE'} />
        </SelectedDateListContainer>
      </div>
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
`;

const SelectedDateText = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: ${AppColor.text.main};
`;
