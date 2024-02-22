import CommonLayout from '@components/layouts/CommonLayout';
import PageName from '@components/PageName';
import Status from '@components/Status';
import PlusButton from '@components/PlusButton';
import DateCarousel from '@components/DateCarousel';
import PersonalToDoCard from '@components/PersonalToDoCard';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import { ScheduleStatus } from '@customTypes/types';
import { useState, useCallback } from 'react';
import { NextPageWithLayout } from 'pages/_app';

interface PersonalWorkspaceProps {}

const PersonalWorkspace: NextPageWithLayout<PersonalWorkspaceProps> = ({}) => {
  const nickname = '민혁';
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
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
      <PageName pageName={`${nickname}의 개인 워크스페이스`} additionalName={"asdasda"} />
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '36px 6%'}}>
        <DateCarousel selectedYear={selectedYear} selectedMonth={selectedMonth} onClickPrevMonth={onClickPrevMonth} onClickNextMonth={onClickNextMonth} />
        <PlusButton path='/workspace/personal/add' color={AppColor.etc.white} backgroundColor={AppColor.main} />
      </div>
      
      <div style={{display: 'flex', columnGap: '50px', padding: '20px 8%', width:'100%', justifyContent: 'space-around'}}>
        <div>
          <div>
            <Status status={ScheduleStatus[1]} style={{margin: '0 auto 20px'}} size="28px" />
          </div>
          <CardContainer>
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일' endDate='2024/02/13' />
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
          </CardContainer>
        </div>
        <div>
          <div>
            <Status status={ScheduleStatus[2]} style={{margin: '0 auto 20px'}} size="28px" />
          </div>
          <CardContainer>
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
          </CardContainer>
        </div>
        <div>
          <div>
            <Status status={ScheduleStatus[3]} style={{margin: '0 auto 20px'}} size="28px" />
          </div>
          <CardContainer>
            <PersonalToDoCard workspaceId={1} scheduleId={1} workspaceName='워크스페이스명' scheduleName='일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 일정 이름 v일정 이름' endDate='2024/02/13' />
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
  overflow-x: hidden;
  height: calc(100vh - 280px);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
