import CommonLayout from '@components/layouts/CommonLayout';
import { NextPageWithLayout } from 'pages/_app';

interface InvitaionProps {}

const Invitaion: NextPageWithLayout<InvitaionProps> = ({}) => {
  return (
    <div>
      <h1>초대 받은 화면</h1>
    </div>
  );
};

export default Invitaion;

Invitaion.getLayout = page => <CommonLayout title='PLAN,T | 팀 워크스페이스'>{page}</CommonLayout>;
