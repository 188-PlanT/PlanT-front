import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Link from 'next/link';
import {ScheduleStatus, ScheduleStatusType} from '@customTypes/types';
import Status from '@components/Status';
import {useState, useEffect} from 'react';

interface ToDoCardProps {
  workspaceId: number;
  scheduleId: number;
  workspaceName: string;
  scheduleName: string;
  status: ScheduleStatusType | string;
}

export default function ToDoCard({
  workspaceId,
  scheduleId,
  workspaceName,
  scheduleName,
  status,
}: ToDoCardProps) {
  const [statusArray, setStatusArray] = useState([0, 0, 1]);
  
  useEffect(() => {
    if (status === ScheduleStatus[2]) {
      setStatusArray([0, 2, 0]);
      return;
    }
    if (status === ScheduleStatus[3]) {
      setStatusArray([3, 0, 0]);
      return;
    }
    setStatusArray([0, 0, 1]);
  }, [status]);
  
  return (
    <Link href={`/workspace/${workspaceId}/${scheduleId}`}>
      <Container style={status !== ScheduleStatus[3] ? {backgroundColor: AppColor.background.lightwhite} : {backgroundColor: AppColor.background.lightgray}}>
        <div style={{display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 10px'}}>
          <WorkspaceName>{workspaceName}</WorkspaceName>
          <ScheduleName style={{...(status === ScheduleStatus[3] && {textDecoration: 'line-through'})}}>{scheduleName}</ScheduleName>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '10px'}}>
          {statusArray.map((v, i) => <Status key={i} status={ScheduleStatus[v]} />)}
        </div>
      </Container>
    </Link>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 160px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  display: flex;
  column-gap: 12px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const WorkspaceName = styled.div`
  font-size: 16px;
`;

const ScheduleName = styled.div`
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 84px;
  display: -webkit-box;
   -webkit-line-clamp: 3;
   -webkit-box-orient: vertical;
`;

const EndDate = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
