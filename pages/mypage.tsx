import CommonLayout from '@components/layouts/CommonLayout';
import styled from '@emotion/styled';
import PageName from '@components/PageName';
import ButtonShort from '@components/atoms/ShortButton';
import TextInput from '@components/atoms/TextInput';
import { NextPageWithLayout } from 'pages/_app';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import AppColor from '@styles/AppColor';
import {useState} from 'react';
import { toast } from 'react-toastify';

interface MyPageProps {}

const MyPage: NextPageWithLayout<MyPageProps> = ({}) => {
  const email = "abcd1234@gmail.com"; //TEST 용
  const nickname = "민혁";
  const profile = '';
  // const profile = "https://proxy.goorm.io/service/659153b0a304480d411a9131_d4drKhidbvkV1Nc3HZz.run.goorm.io/9080/file/load/naver_icon.png?path=d29ya3NwYWNlJTJGMTg4X3Byb2plY3RfZnJvbnQlMkZwdWJsaWMlMkZpbWFnZSUyRm5hdmVyX2ljb24ucG5n&docker_id=d4drKhidbvkV1Nc3HZz&secure_session_id=FwAk5nbeqzeCsQeB1gYNcmHCbmXTAtq4";
  
  const router = useRouter();

  const [checked, setChecked] = useState({ nickname: false });
  
  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldError } = useFormik({
    initialValues: {
      nickname,
      currentPassword: '',
      password: '',
      rePassword: '',
    },
    validationSchema: Yup.object({
      nickname: Yup.string().max(8, '8자 이내 닉네임을 입력해 주세요.'),
      currentPassword: Yup.string()
        .min(8, '비밀번호는 8자리 이상입니다.')
        .max(16, '비밀번호는 16자리 이하입니다.')
        .required('현재 비밀번호를 입력해 주세요.'),
      password: Yup.string()
        .min(8, '8자리 이상 비밀번호를 입력해 주세요.')
        .max(16, '16자리 이하 비밀번호를 입력해 주세요.'),
      rePassword: Yup.string(),
    }),
    validate: values => {
      const error: { rePassword?: string } = {};
      // if (values.password && values.rePassword) {
      //   if (values.password !== values.rePassword) {
      //     error.rePassword = '비밀번호가 일치하지 않습니다.';
      //   }
      // }
      return error;
    },
    onSubmit: values => {
      console.log('제출');
      if (!checked.nickname) {
        toast.error('닉네임 중복 체크를 진행해 주세요');
        return;
      }
      const params = {
        password: values.password,
        nickname: values.nickname,
      };
      console.log(params);
      // _signup(params);
    },
  });
  
  return (
    <Container style={{width: '100%'}}>
      <PageName pageName='개인 환경설정' />
      <div style={{margin: '50px 18%', display: 'flex', flexDirection: 'column', rowGap: '28px'}}>        
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', rowGap: '18px'}}>
          <Circle>
            {profile ? (
              <Image width={112} height={112} src={profile} alt='프로필 이미지' />
            ) : nickname[0]}
          </Circle>
          <ButtonShort
            buttonStyle={{
              width: '96px',
              height: '36px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: AppColor.main,
            }}
            label='사진 변경'
            onClick={() => {}}
          />
        </div>
        
        <div>
          <Label>닉네임</Label>
          <TextInput
              name='nickname'
              placeholder='닉네임을 입력해 주세요'
              wrapperStyle={{ width: '100%', minWidth: '280px' }}
              type='nickname'
              error={Boolean(touched.nickname && errors.nickname)}
              helperText={errors.nickname}
              value={values.nickname}
              onBlur={handleBlur}
              onChange={e => {
                handleChange(e);
                setChecked(prev => ({ ...prev, nickname: false }));
              }}
          />
        </div>
        
        <div>
          <Label>가입된 이메일</Label>
          <div style={{marginTop: '6px', display: 'flex', columnGap: '8px', alignItems: 'center'}}>
            <div style={{width: '20px', height: '20px', backgroundColor: AppColor.background.darkgray}}></div>
            <Email>{email}</Email>
          </div>
        </div>
        
        <div>
          <Label>현재 비밀번호</Label>
          <TextInput
              name='currentPassword'
              placeholder='현재 비밀번호를 입력해 주세요'
              wrapperStyle={{ width: '100%', minWidth: '280px' }}
              type='currentPassword'
              error={Boolean(touched.currentPassword && errors.currentPassword)}
              helperText={errors.currentPassword}
              value={values.currentPassword}
              onBlur={handleBlur}
              onChange={handleChange}
          />
        </div>
        <div>
          <Label>새 비밀번호</Label>
          <TextInput
              name='password'
              placeholder='새 비밀번호를 입력해 주세요'
              wrapperStyle={{ width: '100%', minWidth: '280px' }}
              type='password'
              error={Boolean(touched.password && errors.password)}
              helperText={errors.password}
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
          />
        </div>
        <div>
          <Label>새 비밀번호 확인</Label>
          <TextInput
              name='rePassword'
              placeholder='새 비밀번호를 한번 더 입력해 주세요'
              wrapperStyle={{ width: '100%', minWidth: '280px' }}
              type='rePassword'
              error={Boolean(touched.rePassword && errors.rePassword)}
              helperText={errors.rePassword}
              value={values.rePassword}
              onBlur={handleBlur}
              onChange={handleChange}
          />
        </div>
        
        <div style={{display: 'flex', marginTop: '20px', columnGap: '120px', justifyContent: 'center'}}>
          <ButtonShort
            buttonStyle={{
              width: '100px',
              height: '38px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: AppColor.main,
            }}
            label='수정 완료'
            onClick={() => {}}
          />
          <ButtonShort
            buttonStyle={{
              width: '100px',
              height: '38px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: AppColor.text.error,
            }}
            label='회원 탈퇴'
            onClick={() => {}}
          />
        </div>
      </div>
    </Container>
  );
};

export default MyPage;

MyPage.getLayout = page => <CommonLayout title='PLAN,T | 개인 환경설정'>{page}</CommonLayout>;

const Container = styled.div`
  width: 100%;
`;

const Label = styled.label`
  font-size: 18px;
  color: ${AppColor.text.signature};
`;

const Email = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${AppColor.text.signature};
`

const Circle = styled.div`
  width: 112px;
  height: 112px;
  border-radius: 100%;
  background-color: ${AppColor.background.gray};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${AppColor.text.signature};
  font-size: 40px;
  font-weight: bold;
`