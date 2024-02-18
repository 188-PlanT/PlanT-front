import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import Link from 'next/link';

interface PersonalToDoCardProps {
  workspaceId: number;
  scheduleId: number;
  workspaceName: string;
  scheduleName: string;
  endDate: string;
}

export default function PersonalToDoCard({
  workspaceId,
  scheduleId,
  workspaceName,
  scheduleName,
  endDate,
}: PersonalToDoCardProps) {
  return (
    <Link href={`/workspace/${workspaceId}/${scheduleId}`}>
      <Container>
        <WorkspaceName>{workspaceName}</WorkspaceName>
        <ScheduleName>{scheduleName}</ScheduleName>
        <EndDate>{endDate} 까지</EndDate>
      </Container>
    </Link>
  );
};

const Container = styled.div`
  width: 100%;
  height: 180px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  background-color: ${AppColor.background.lightwhite};
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 4px;
  justify-content: space-between;
  cursor: pointer;
`

const WorkspaceName = styled.div`
  font-size: 16px;
`

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
`

const EndDate = styled.div`
  font-size: 14px;
  font-weight: 500;
`