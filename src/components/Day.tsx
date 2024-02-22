import styled from '@emotion/styled';
import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import AppColor from '@styles/AppColor';
import {ScheduleStatus, ScheduleStatusType} from '@customTypes/types';

interface DayProps {
  isSelected: boolean;
  date: Date;
  scheduleData: {scheduleId: number; scheduleName: string; state: string | ScheduleStatusType}[];
  onClick: () => void;
}

export default function Day({
  isSelected = false,
  date,
  scheduleData = [],
  onClick,
}: DayProps) {
  const extractedDate = useMemo(() => dayjs(date).get('date'), [date]);
  
  const selectColor = useCallback((status: ScheduleStatusType | string) => {
    if (status === ScheduleStatus[1]) return AppColor.status.todo;
    if (status === ScheduleStatus[2]) return AppColor.status.inProgress;
    if (status === ScheduleStatus[3]) return AppColor.status.done;
    return AppColor.background.gray;
  } ,[])
  
  return (  
    <Container onClick={onClick}>
      <DateWrapper style={{...(isSelected && {backgroundColor: AppColor.background.green})}}>
        {extractedDate}
      </DateWrapper>
      {scheduleData.slice(0, 3).map((s, i) => (
        <ScheduleBar key={s.scheduleId} style={{backgroundColor: selectColor(s.state)}} />
      ))}
      {(scheduleData.length > 3) && (<MoreScheduleBar />)}
    </Container>
  );
};

const Container = styled.div`
  min-height: 120px;
  cursor: pointer;
`;

const DateWrapper = styled.div`
  margin: 4px;
  border-radius: 100%;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`;

const ScheduleBar = styled.div`
  border-radius: 4px;
  height: 20px;
  width: 100%;
  margin-bottom: 4px;
  box-shadow: rgb(0, 0, 0, 0.1) 2px 2px 2px;
`;

const MoreScheduleBar = styled.div`
  border-radius: 2px;
  background-color: ${AppColor.background.gray};
  width: 72%;
  height: 6px;
  margin: 0 auto;
  line-height: 1;
`;
