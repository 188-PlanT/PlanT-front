import Image from 'next/image';
import styled from '@emotion/styled';
import RightChevron from '@public/image/right_chevron.png';
import LeftChevron from '@public/image/left_chevron.png';
import AppColor from '@styles/AppColor';

interface DateCarouselProps {
  selectedYear: number;
  selectedMonth: number;
  onClickPrevMonth: () => {};
  onClickNextMonth: () => {};
}

export default function DateCarousel({
  selectedYear,
  selectedMonth,
  onClickPrevMonth,
  onClickNextMonth,
}: DateCarouselProps) {
  return (
    <div style={{display: 'flex', alignItems: 'flex-end'}}>
      <TransparentButton onClick={onClickPrevMonth}>
        <Image src={LeftChevron} alt='이전 달로 이동' width={28} height={46} />
      </TransparentButton>
      <div style={{margin: '0px 12px', display: 'flex', alignItems: 'flex-end', color: AppColor.text.signature}}>
        <div style={{fontSize: '44px', textAlign: 'center'}}>{selectedYear + '년'}</div>
        <div style={{width: '106px', fontSize: '46px', fontWeight: 'bold', textAlign: 'right'}}>{selectedMonth + '월'}</div>
      </div>
      <TransparentButton onClick={onClickNextMonth}>
        <Image src={RightChevron} alt='다음 달로 이동' width={28} height={46} />
      </TransparentButton>
    </div>
  );
};

const TransparentButton = styled.button`
  background-color: transparent;
  border: none;
`