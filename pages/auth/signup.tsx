import ButtonShort from '@components/atoms/ShortButton';
import TextInput from '@components/atoms/TextInput';
import AuthLayout from '@components/layouts/AuthLayout';
import { NextPageWithLayout } from 'pages/_app';
import styled from '@emotion/styled';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { checkEmail, checkNickname, signup } from '@apis/authApi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { MouseEvent, useCallback, useState } from 'react';
import AppColor from '@styles/AppColor';
import Link from 'next/link';
import Image from 'next/image';
import GoogleIcon from '@public/image/google_icon.png';
import NaverIcon from '@public/image/naver_icon.png';
import KakaoIcon from '@public/image/kakao_icon.png';

interface SignUpProps {}

const SignUp: NextPageWithLayout<SignUpProps> = ({}) => {
  const router = useRouter();

  const [checked, setChecked] = useState({ email: false });

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldError } = useFormik({
    initialValues: {
      email: '',
      password: '',
      rePassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('올바른 형식의 이메일을 입력해 주세요.').required('이메일을 입력해 주세요.'),
      password: Yup.string()
        .min(8, '8자리 이상 비밀번호를 입력해 주세요.')
        .max(16, '16자리 이하 비밀번호를 입력해 주세요.')
        .required('8-16자 비밀번호를 입력해 주세요.'),
      rePassword: Yup.string().required('비밀번호를 한번 더 입력해 주세요.'),
    }),
    validate: values => {
      const error: { rePassword?: string } = {};
      if (values.password && values.rePassword) {
        if (values.password !== values.rePassword) {
          error.rePassword = '비밀번호가 일치하지 않습니다.';
        }
      }
      return error;
    },
    onSubmit: values => {
      if (!checked.email) {
        toast.error('이메일 중복 체크를 진행해 주세요');
        return;
      }
      const params = {
        email: values.email,
        password: values.password,
      };
      //TODO 인증 페이지로 데이터 넘기고 거기서 회원가입 요청
      _signup(params);
    },
  });

  const { mutate: _signup } = useMutation(signup, {
    onSuccess: () => {
      toast.success('가입이 완료되었습니다.');
      router.push('/auth/login');
    },
  });

  const { mutate: _checkEmail } = useMutation(checkEmail, {
    onSuccess: res => {
      if (res) {
        toast.success('사용 가능한 이메일입니다.')
        setChecked(prev => ({ ...prev, email: true }));
      } else {
        setFieldError('email', '이미 사용 중인 이메일입니다.');
      }
    },
  });

  const onCheckEmail = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!values.email) return;
      _checkEmail({ email: values.email });
    },
    [values.email, _checkEmail],
  );

  return (
    <Container>
      <h1 style={{ color: AppColor.text.signature, fontSize: '50px', margin: '0 0 32px' }}>회원가입</h1>
      <Form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', position: 'relative' }}>
          <TextInput
            name='email'
            placeholder='이메일 주소를 입력해 주세요'
            wrapperStyle={{ width: '100%', minWidth: '280px' }}
            type='email'
            error={Boolean(touched.email && errors.email)}
            helperText={errors.email}
            value={values.email}
            onBlur={handleBlur}
            onChange={e => {
              handleChange(e);
              setChecked(prev => ({ ...prev, email: false }));
            }}
          />
          <ButtonShort
            buttonStyle={{
              position: 'absolute',
              left: '290px',
              width: '100px',
              height: '40px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              ...(!checked.email && {backgroundColor: AppColor.main})
            }}
            label='중복 확인'
            onClick={onCheckEmail}
            disabled={checked.email}
          />
        </div>
        <TextInput
          name='password'
          placeholder='비밀번호를 입력해 주세요'
          wrapperStyle={{ width: '100%', minWidth: '280px' }}
          type='password'
          error={Boolean(touched.password && errors.password)}
          helperText={errors.password}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <TextInput
          name='rePassword'
          placeholder='비밀번호를 확인해 주세요'
          wrapperStyle={{ width: '100%', minWidth: '280px' }}
          type='password'
          error={Boolean(touched.rePassword && errors.rePassword)}
          helperText={errors.rePassword}
          value={values.rePassword}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <ButtonShort
            label='가입하기'
            buttonStyle={{
              backgroundColor: AppColor.main,
              width: '120px',
              height: '40px',
              fontSize: '16px'
            }}
          /> 
      </Form>
      <div style={{ 
        marginTop: '20px',
        minWidth: '280px',
        fontSize: '12px',
        color: AppColor.text.gray,
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
            <SocialLoginButton onClick={() => {console.log('구글 로그인')}}>
              <Image width='50px' height='50px' alt='구글 로그인 로고' src={GoogleIcon} />
            </SocialLoginButton>
            <SocialLoginButton onClick={() => {console.log('네이버 로그인')}}>
              <Image width='50px' height='50px' alt='네이버 로그인 로고' src={NaverIcon} />
            </SocialLoginButton>
          </div>
          
          <div>
            전에도 이용하신 적이 있나요?
              <Link href='/auth/login'>
                <span style={{marginLeft: '6px', cursor: 'pointer', borderBottom: `1px solid ${AppColor.text.gray}`}}>
                  로그인
                </span>
            </Link>
          </div>
        </div>
    </Container>
  );
};

export default SignUp;

SignUp.getLayout = page => <AuthLayout title='PLAN,T | 회원가입'>{page}</AuthLayout>;

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
`;

/* 
<div style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
  <TextInput
    name='nickname'
    placeholder='사용하실 닉네임을 입력해 주세요.'
    error={Boolean(touched.nickname && errors.nickname)}
    helperText={errors.nickname}
    value={values.nickname}
    onBlur={handleBlur}
    onChange={e => {
      handleChange(e);
      setChecked(prev => ({ ...prev, nickname: false }));
    }}
  />
  <ButtonShort buttonStyle={{ width: '64px' }} label='중복 체크' onClick={onCheckNickname} disabled={checked.nickname} />
</div>
<div style={{ display: 'flex', columnGap: '10px' }}>
  <TextInput
    name='email'
    placeholder='이메일 주소를 입력해 주세요'
    error={Boolean(touched.email && errors.email)}
    helperText={errors.email}
    value={values.email}
    onBlur={handleBlur}
    onChange={e => {
      handleChange(e);
      setChecked(prev => ({ ...prev, email: false }));
    }}
  />
  <ButtonShort buttonStyle={{ width: '64px' }} label='중복 체크' onClick={onCheckEmail} disabled={checked.email} />
</div>
*/