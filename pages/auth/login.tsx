import TextInput from '@components/atoms/TextInput';
import AuthLayout from '@components/layouts/AuthLayout';
import styled from '@emotion/styled';
import { NextPageWithLayout } from 'pages/_app';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback } from 'react';
import ButtonShort from '@components/atoms/ShortButton';
import AppColor from '@styles/AppColor';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { login } from '@apis/authApi';
import { useMutation } from '@tanstack/react-query';
import NaverIcon from '@public/image/naver_icon.png';
import { toast } from 'react-toastify';
import axiosInstance from '@utils/axios';

interface LoginProps {}

const Login: NextPageWithLayout<LoginProps> = ({}) => {
  const router = useRouter();

  const { values, errors, touched, handleSubmit, handleChange, handleBlur } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('올바른 형식의 이메일을 입력해 주세요.').required('이메일을 입력해 주세요.'),
      password: Yup.string().min(6, '6자리 이상 비밀번호를 입력해 주세요.').required('비밀번호를 입력해 주세요.'),
    }),
    onSubmit: values => _login(values),
  });

  const { mutate: _login } = useMutation(login, {
    onSuccess: () => {
      toast.success('로그인 성공');
      router.push('/workspace/personal');
    },
    onError: (e: {message: string; code: number}) => {
      toast.error(e.message ? e.message : '로그인에 실패하였습니다. 잠시후 다시 시도해주세요.');
    },
  });

  return (
    <Container>
      <h1 style={{ color: AppColor.text.signature, fontSize: '50px', margin: '0 0 32px' }}>로그인</h1>
      <Form onSubmit={handleSubmit}>
        <TextInput
          name='email'
          placeholder='이메일을 입력해 주세요.'
          wrapperStyle={{ width: '100%', minWidth: '280px' }}
          error={Boolean(touched.email && errors.email)}
          helperText={errors.email}
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <TextInput
          name='password'
          placeholder='비밀번호를 입력해 주세요.'
          wrapperStyle={{ width: '100%', minWidth: '280px' }}
          type='password'
          error={Boolean(touched.password && errors.password)}
          helperText={errors.password}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <ButtonShort
          label='로그인하기'
          type='submit'
          buttonStyle={{
            backgroundColor: AppColor.main,
            width: '120px',
            height: '40px',
            fontSize: '16px',
          }}
        />
      </Form>
      <div style={{ 
          marginTop: '20px',
          fontSize: '12px',
          color: AppColor.text.gray,
          minWidth: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '20px'
        }}>
          <div style={{padding: '0px 12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{backgroundColor: AppColor.border.black, opacity: '48%', width: '48px', height: '1px'}}></div>
            <div>또는 소셜 아이디로 로그인</div>
            <div style={{backgroundColor: AppColor.border.black, opacity: '48%', width: '48px', height: '1px'}}></div>
          </div>
          
          <div style={{display:'flex', justifyContent: 'center', columnGap: '40px', width: '100%', padding: '0px 28px'}}>
            <SocialLoginButton>
              <Link href={`https://nid.naver.com/oauth2.0/authorize?response_type=code&state=null&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`}>
                <Image width='50px' height='50px' alt='네이버 로그인 로고' src={NaverIcon} />
              </Link>
            </SocialLoginButton>
          </div>
          
          <div>
            처음 이용하시나요?
              <Link href='/auth/signup'>
                <span style={{marginLeft: '6px', cursor: 'pointer', borderBottom: `1px solid ${AppColor.text.gray}`}}>
                  회원가입
                </span>
            </Link>
          </div>
        </div>
    </Container>
  );
};

export default Login;

Login.getLayout = page => <AuthLayout title='PLAN,T | 로그인'>{page}</AuthLayout>;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 110px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  align-items: center;
`;

const SocialLoginButton = styled.button`
  padding: 0px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: none;
  cursor: pointer;
`;

// <ButtonShort
//             label='회원가입'
//             buttonStyle={{
//               width: '100%',
//               height: '48px',
//               fontSize: '16px',
//               color: AppColor.text.main,
//               backgroundColor: AppColor.etc.white,
//             }}
//             onClick={e => {
//               e.preventDefault();
//               router.push('/auth/signup');
//             }}
//           />