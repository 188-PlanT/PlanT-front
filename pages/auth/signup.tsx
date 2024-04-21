import ButtonShort from '@components/atoms/ShortButton';
import TextInput from '@components/atoms/TextInput';
import AuthLayout from '@components/layouts/AuthLayout';
import { NextPageWithLayout } from 'pages/_app';
import styled from '@emotion/styled';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { checkEmail, checkNickname, signup, login, requestAuthenticationCode, checkAuthenticationCode } from '@apis/authApi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { MouseEvent, ChangeEvent, useCallback, useState } from 'react';
import AppColor from '@styles/AppColor';
import Link from 'next/link';
import Image from 'next/image';
import GoogleIcon from '@public/image/google_icon.png';
import NaverIcon from '@public/image/naver_icon.png';
import KakaoIcon from '@public/image/kakao_icon.png';

interface SignUpProps {}

const SignUp: NextPageWithLayout<SignUpProps> = ({}) => {
  const router = useRouter();
  
  const [step, setStep] = useState(1);

  const [checked, setChecked] = useState({ email: false });

  const [code, setCode] = useState('');
  const onChangeCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  });
  
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
    onSubmit: async (values) => {
      if (!checked.email) {
        toast.error('이메일 중복 체크를 진행해 주세요');
        return;
      }
      await requestAuthenticationCode({email: values.email})
        .then(() => {
          setStep(2);
        })
        .catch(error => console.error(error));
    },
  });

  const { mutate: _signup } = useMutation(signup, {
    onSuccess: async (data, valiable) => {
      toast.success('가입이 완료되었습니다.');
      await login({email: valiable.email, password: valiable.password})
        .then(() => {
          router.push('/auth/nickname');
        })
        .catch((error) => {
          console.error(error);
          toast.error('알 수 없는 오류가 발생했습니다.');
          router.push('/auth/login');
        });
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

  const onSubmitCode = useCallback(async () => {
    console.log(code, code.length);
    if (code.length !== 6) {
      toast.error('올바른 형식의 인증번호를 입력해 주세요');
      return;
    }
    await checkAuthenticationCode({email: values.email, code})
      .then(async (res) => {
        const params = {
          email: values.email,
          password: values.password,
        };
        console.log(res, params);
        _signup(params);
      })
      .catch((error) => console.error(error));
  }, [code, values]);
  
  const onReRequestCode = useCallback(async () => {
    setCode('');
    await requestAuthenticationCode({email: values.email})
      .catch(error => console.error(error));
  }, [values])
  
  const onResetStep = useCallback(() => {
    setStep(1);
  });
  
  return (
    <Container>
      {step === 1 ? (
        <>
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
                type='button'
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
              type='submit'
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
        </>
      ) : (
        <>
          <h1 style={{ color: AppColor.text.signature, fontSize: '50px', margin: '0' }}>{values.email}</h1>
          <p style={{color: AppColor.text.signature, fontSize: '32px'}}>입력해주신 이메일로 인증번호를 발송했어요</p>
          <p style={{color: AppColor.text.gray, fontSize: '16px'}}>발송된 인증번호 6자리를 입력해주세요</p>
        
          <div style={{position: 'relative', display: 'flex', columnGap: '10px', margin: '30px 0'}}>
            <Input value={code} onChange={onChangeCode} maxLength={6} />
            <CodeText>{code[0]}</CodeText>
            <CodeText>{code[1]}</CodeText>
            <CodeText>{code[2]}</CodeText>
            <CodeText>{code[3]}</CodeText>
            <CodeText>{code[4]}</CodeText>
            <CodeText>{code[5]}</CodeText>
          </div>
          <ButtonShort
            label='인증하기'
            type='button'
            onClick={onSubmitCode}
            buttonStyle={{
              backgroundColor: AppColor.main,
              width: '120px',
              height: '40px',
              fontSize: '16px',
              marginBottom: '24px',
            }}
          />
        
          <div style={{display: 'flex', fontSize: '14px', columnGap: '6px', marginBottom: '10px', color: AppColor.text.lightgray}}>
            <p>인증번호가 도착하지 않았나요?</p>
            <UnderbarTextButton onClick={onReRequestCode}>재발송하기</UnderbarTextButton>
          </div>
        
          <div style={{display: 'flex', fontSize: '14px', columnGap: '6px', color: AppColor.text.lightgray}}>
            <p>이메일 주소를 잘못 입력하셨나요?</p>
            <UnderbarTextButton onClick={onResetStep}>재입력하기</UnderbarTextButton>
          </div>
        </>
      )}
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

const UnderbarTextButton = styled.div`
  cursor: pointer;
  text-decoration: underline;
`;

const Input = styled.input`
  position: absolute;
  border: none;
  background-color: transparent;
  width: 410px;
  height: 72px;
  color: transparent;
  &:focus {
    outline: none;
  }
  &::selection {
    background-color: transparent;
    color: transparent;
  }
  &::-moz-selection {
    background-color: transparent;
    color: transparent;
  }  
`;

const CodeText = styled.div`
  width: 60px;
  height: 68px;
  border-radius: 8px;
  background-color: ${AppColor.background.lightgray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
`;
