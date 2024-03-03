import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FocusedSettingIcon from '@public/image/setting_focused.png';
import SettingIcon from '@public/image/setting_no_focused.png';

interface SettingButtonProps {
  href?: string;
}

export default function SettingButton({href = '/mypage'}: SettingButtonProps) {
  const router = useRouter();
  
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (router.pathname === "/mypage") {
      setIsFocused(true);
      return;
    }
    setIsFocused(false);
  }, [router.pathname]);

  return (
    <Link href={href}>
      <Container style={{...(isFocused && {borderRadius: '10px', backgroundColor: AppColor.main})}}>
        <Image 
          src={isFocused ? FocusedSettingIcon : SettingIcon}
          alt='설정 버튼'
        />
      </Container>
    </Link>
  )
}

const Container = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: ${AppColor.background.gray};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
