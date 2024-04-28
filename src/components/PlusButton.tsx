import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Link from 'next/link';
import {BaseHTMLAttributes, DetailedHTMLProps} from 'react';

interface PlusButtonProps {
  path: string | {pathname: string; query: any};
  backgroundColor?: string;
  color?: string;
}

export default function PlusButton({path, backgroundColor, color, ...props}: PlusButtonProps & DetailedHTMLProps<BaseHTMLAttributes<HTMLDivElement>, HTMLDivElement>) {

  return (
    <Link href={path}>
      <Container {...props} style={{...props.style, ...(color && {color}), ...(backgroundColor && { backgroundColor })}}>
        <span style={{marginBottom: '6px'}}>+</span>
      </Container>
    </Link>
  )
}

const Container = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${AppColor.background.gray};
  color : ${AppColor.text.gray};
  padding: 10px;
  font-size: 28px;
  font-weight: bold;
  line-height: 0.8;
  cursor: pointer;
`
