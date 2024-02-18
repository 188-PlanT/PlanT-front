import dayjs from 'dayjs';

export function formatDate(date: string, format: string = 'YYYY월 MM월 DD일 HH:mm') {
  dayjs.locale('ko');
  return dayjs(date).format(format);
}

export function formatMoney(price: string | number) {
  const _price = String(price);
  return _price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function transrateAuthority(authority: string) {
  if (authority === "USER") return "일반멤버";
  if (authority === "ADMIN") return "관리자";
  if (authority === "PENDING") return "수락대기";
  return '알수없음';
}

export function makeCalendarArray(year: number, month: number): string[] {
  const result = Array(42).fill('');
  //1월: 0 ~ 12월: 11
  //일: 0 ~ 토: 6
  const firstDate = dayjs(new Date(year, month - 1, 1));
  const dayOfFirstDate = dayjs(new Date(year, month - 1, 1)).day();
  const dateOfFirstIndex = firstDate.subtract(dayOfFirstDate, 'day');
  for (let i = 0; i < 42; i++) {
    result[i] = dateOfFirstIndex.add(i, 'day').format('YYYY-MM-DD');
  }
  return result;
}