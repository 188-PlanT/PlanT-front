import CommonLayout from '@components/layouts/CommonLayout';
import { NextPageWithLayout } from 'pages/_app';

interface PersonalScheduleProps {}

const PersonalSchedule: NextPageWithLayout<PersonalScheduleProps> = ({}) => {
  return (
    <div>
      <h1>개인 워크스페이스의 일정 상세</h1>
    </div>
  );
};

export default PersonalSchedule;

PersonalSchedule.getLayout = page => <CommonLayout title='PLAN,T | 개인 워크스페이스'>{page}</CommonLayout>;
