import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Image from 'next/image';
import RightChevron from '@public/image/right_chevron.png';

interface PageNameProps {
  pageName: string;
  additionalName?: string;
}

export default function PageName({pageName, additionalName}: PageNameProps) {

  return (
    <Container>
      <FirstName>{pageName}</FirstName>
      {additionalName && (
      <div style={{display: 'flex', columnGap: '10px', alignItems: 'center'}}>
        <Image src={RightChevron} alt="오른쪽 화살표" width={8} height={12} />
        <SecondName>{additionalName}</SecondName>
      </div>
      )}
    </Container>
  )
}

const Container = styled.header`
  display: flex;
  width: 100%;
  column-gap: 10px;
  align-items: center;
  border-bottom: solid 2px ${AppColor.border.gray};
  padding: 5px 10px;
  position: sticky;
  top: 0;
  background: ${AppColor.background.main};
  z-index: 1;
`

const FirstName = styled.span`
  color: ${AppColor.text.signature};
  font-weight: bold;
`

const SecondName = styled.span`
  color: ${AppColor.text.main};
`