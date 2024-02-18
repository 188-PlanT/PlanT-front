import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import {ScheduleStatus} from '@types/types';
import {useEffect, useState, DivHTMLAttributes, DetailedHTMLProps} from 'react';

interface StatusProps {
  status: ScheduleStatus;
  size?: string;
}

export default function Status({status, size, ...props}: StatusProps & DetailedHTMLProps<DivHTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const [color, setColor] = useState(AppColor.status.todo);

  useEffect(() => {
    if (status === ScheduleStatus[1]) {
      setColor(AppColor.status.todo);
      return;
    }
    if (status === ScheduleStatus[2]) {
      setColor(AppColor.status.inProgress);
      return;
    }
    if (status === ScheduleStatus[3]) {
      setColor(AppColor.status.done);
      return;
    }
    setColor(AppColor.background.gray);
  }, [status]);
  
  return (
    <Circle {...props} style={{...props.style, backgroundColor: color, ...(size && {width: size, height: size, minWidth: size, minHeight: size})}} />
  );
};

const Circle = styled.div`
  border-radius: 100%;
  min-width: 16px;
  min-height: 16px;
  width: 16px;
  height: 16px;
`;
//16px, 28px