import CommonLayout from '@components/layouts/CommonLayout';
import PageName from '@components/PageName';
import Status from '@components/Status';
import PlusButton from '@components/PlusButton';
import DateCarousel from '@components/DateCarousel';
import PersonalToDoCard from '@components/PersonalToDoCard';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import { ScheduleStatus } from '@customTypes/types';
import { useState, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { useAppSelector } from '@store/configStore';
import {selectNickName} from '@store/slices/user';
import { useQuery } from '@tanstack/react-query';
import { getMyScheduleList, USER_QUERY_KEY } from '@apis/userApi';
import dayjs from 'dayjs';

interface PersonalWorkspaceProps {}

const PersonalWorkspace: NextPageWithLayout<PersonalWorkspaceProps> = ({}) => {
  const nickName = useAppSelector(selectNickName);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  const { data : {schedules}, refetch } = useQuery(
    [USER_QUERY_KEY.GET_MY_SCHEDULE_LIST],
    () => getMyScheduleList({month: dayjs(selectedYear.toString() + selectedMonth.toString()).format('YYYYMM').toString()}),
    {
      skip: !selectedYear || !selectedMonth,
      initialData: {},
    }
  );
  const [scheduleData, setScheduleData] = useState({
    toDo: [],
    inProgress: [],
    done: [],
  });
  useEffect(() => {
    if (schedules) {
      setScheduleData(schedules);
    }
  }, [schedules]);
  useEffect(() => {
    refetch();
  }, [selectedMonth, refetch]);
  
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
  
  return (
    <div style={{width: '100%'}}>
      <PageName pageName={`${nickName}의 개인 워크스페이스`} />
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '36px 6%'}}>
        <DateCarousel selectedYear={selectedYear} selectedMonth={selectedMonth} onClickPrevMonth={onClickPrevMonth} onClickNextMonth={onClickNextMonth} />
        <PlusButton path='/workspace/personal/add' color={AppColor.etc.white} backgroundColor={AppColor.main} />
      </div>
      
      <div style={{display: 'grid', columnGap: '4%', padding: '20px 10%', width:'100%', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <div>
          <div>
            <Status status={ScheduleStatus[1]} style={{margin: '0 auto 20px'}} size="28px" />
          </div>
          <CardContainer>
            {scheduleData.toDo.map(
              (s) => <PersonalToDoCard
                       key={s.scheduleId}
                       workspaceId={s.workspaceId}
                       scheduleId={s.scheduleId}
                       workspaceName={s.workspaceName}
                       scheduleName={s.scheduleName}
                       endDate={s.endDate}
                     />
            )}
          </CardContainer>
        </div>
        <div>
          <div>
            <Status status={ScheduleStatus[2]} style={{margin: '0 auto 20px'}} size="28px" />
          </div>
          <CardContainer>
            {scheduleData.inProgress.map(
              (s) => <PersonalToDoCard
                       key={s.scheduleId}
                       workspaceId={s.workspaceId}
                       scheduleId={s.scheduleId}
                       workspaceName={s.workspaceName}
                       scheduleName={s.scheduleName}
                       endDate={s.endDate}
                     />
            )}
          </CardContainer>
        </div>
        <div>
          <div>
            <Status status={ScheduleStatus[3]} style={{margin: '0 auto 20px'}} size="28px" />
          </div>
          <CardContainer>
            {scheduleData.done.map(
              (s) => <PersonalToDoCard
                       key={s.scheduleId}
                       workspaceId={s.workspaceId}
                       scheduleId={s.scheduleId}
                       workspaceName={s.workspaceName}
                       scheduleName={s.scheduleName}
                       endDate={s.endDate}
                     />
            )}
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

export default PersonalWorkspace;

PersonalWorkspace.getLayout = page => <CommonLayout title='PLAN,T | 개인 워크스페이스'>{page}</CommonLayout>;

const Container = styled.div`
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  padding: 10px 30px;
  overflow-y: scroll;
  height: calc(100vh - 280px);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  };
`;
