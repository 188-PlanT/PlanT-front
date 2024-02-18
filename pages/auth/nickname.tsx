import TextInput from '@components/atoms/TextInput';
import AuthLayout from '@components/layouts/AuthLayout';
import styled from '@emotion/styled';
import { NextPageWithLayout } from 'pages/_app';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ShortButton from '@components/atoms/ShortButton';
import AppColor from '@styles/AppColor';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { login } from '@apis/authApi';
import { useMutation } from '@tanstack/react-query';
import { checkNickname, setNickname } from '@apis/authApi';
import { MouseEvent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

interface NicknameProps {}

const Nickname: NextPageWithLayout<NicknameProps> = ({}) => {
  const router = useRouter();

  const [checked, setChecked] = useState({ nickname: false });
  const [isFirstStep, setIsFirstStep] = useState(true);
  
  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldError } = useFormik({
    initialValues: {
      nickname: '',
    },
    validationSchema: Yup.object({
      nickname: Yup.string().max(8, '8자 이내 닉네임을 입력해 주세요.').required('8자 이내 닉네임을 입력해 주세요.'),
    }),
    onSubmit: values => console.log(values),
  });

  const { mutate: _setNickname } = useMutation(setNickname, {
    onSuccess: () => {
      toast.success('닉네임 설정 완료');
      router.push('/auth/login');
    },
  });

  const { mutate: _checkNickname } = useMutation(checkNickname, {
    onSuccess: res => {
      if (!res) return;
      if (res.message) {
        setFieldError('nickname', res.message);
      } else {
        setChecked(prev => ({ ...prev, nickname: true }));
      }
    },
  });

  const onCheckNickname = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!values.nickname) return;
      _checkNickname({ nickname: values.nickname });
    },
    [values.nickname, _checkNickname],
  );
  
  const onSetNickname = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      _setNickname({nickname: values.nickname});
  }, [values.nickname, _setNickname]);
  
  const onClickNext = useCallback(() => {
    setIsFirstStep(false);
  }, []);
  
  const onClickRetry = useCallback(() => {
    setIsFirstStep(true);
  }, []);
  
  return (
    isFirstStep ? 
    (
      <Container>
        <h1 style={{ color: AppColor.text.signature, fontSize: '50px', margin: '0' }}>어서오세요!</h1>
        <h2 style={{ color: AppColor.text.signature, fontSize: '30px', margin: '6px 0' }}>
          시작하기 전 사용하실 멋진 이름을 알려주세요
        </h2>
        <h3  style={{ color: AppColor.text.gray, fontSize: '16px', fontWeight: 'bold', margin: '4px 0 32px' }}>
          알려주신 닉네임은 다른 유저분들도 볼 수 있어요
        </h3>
        <Form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', columnGap: '10px' }}>
            <TextInput
              name='nickname'
              placeholder='사용하실 닉네임을 입력해주세요 (8자 이내)'
              wrapperStyle={{ width: '300px' }}
              error={Boolean(touched.nickname && errors.nickname)}
              helperText={errors.nickname}
              value={values.nickname}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ShortButton
                buttonStyle={{
                  width: '100px',
                  height: '40px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: AppColor.main,
                }}
                label='중복 확인'
                onClick={onCheckNickname}
                disabled={checked.nickname}
              />
          </div>
          <ShortButton
            onClick={onClickNext}
            label='정했어요!'
            disabled={!checked.nickname}
            buttonStyle={{
              backgroundColor: checked.nickname ? AppColor.main : AppColor.border.lightgray,
              width: '120px',
              height: '40px',
              fontSize: '16px',
              margin: '24px auto',
            }}
          />
        </Form>
      </Container>
    ) : 
    (
      <Container>
        <h1 style={{ color: AppColor.text.main, fontSize: '50px', margin: '0' }}>{values.nickname}</h1>
        <h2 style={{ color: AppColor.text.main, fontSize: '30px', margin: '6px 0' }}>
          멋있는 닉네임이네요! 이 닉네임으로 시작하시겠어요?
        </h2>
        <h3  style={{ color: AppColor.text.gray, fontSize: '16px', fontWeight: 'bold', margin: '4px 0 32px' }}>
          환경설정에서 언제든 바꿀 수 있어요
        </h3>
        <div style={{display: 'flex', columnGap: '40px', marginTop: '48px'}}>
          <ShortButton
            onClick={() => {}}
            label='좋아요!'
            buttonStyle={{
              backgroundColor: AppColor.main,
              width: '120px',
              height: '40px',
              fontSize: '16px',
            }}
          />
          <ShortButton
            onClick={onClickRetry}
            label='다시 정하기'
            buttonStyle={{
              backgroundColor: AppColor.etc.white,
              border: `1px solid ${AppColor.main}`,
              color: AppColor.main,
              width: '120px',
              height: '40px',
              fontSize: '16px',
            }}
          />
        </div>
      </Container>
    )
    
  );
};

export default Nickname;

Nickname.getLayout = page => <AuthLayout title='PLAN,T | 닉네임 설정'>{page}</AuthLayout>;

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
`;
