import CommonLayout from '@components/layouts/CommonLayout';
import styled from '@emotion/styled';
import PageName from '@components/PageName';
import ButtonShort from '@components/atoms/ShortButton';
import TextInput from '@components/atoms/TextInput';
import AuthorityDropDown from '@components/AuthorityDropDown';
import { NextPageWithLayout } from 'pages/_app';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SearchIcon from '@public/image/search_icon.png';
import AppColor from '@styles/AppColor';
import { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react';
import { transrateAuthority } from '@utils/Utils';
import { USER_QUERY_KEY, searchUser } from '@apis/userApi';
import { uploadImage } from '@apis/fileApi';
import { createWorkspace } from '@apis/workspaceApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface CreateWorkspaceProps {}

const CreateWorkspace: NextPageWithLayout<CreateWorkspaceProps> = ({}) => {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState('');
  const {data: {users: searchResults}, refetch} = useQuery(
    [USER_QUERY_KEY.SEARCH_USER],
    () => searchUser({keyword: searchKeyword}),
    {
      enabled: !!searchKeyword,
      initialData: {users: []},
    });

  useEffect(() => {
    if (!!searchKeyword) {
      refetch();
    }
  }, [searchKeyword, refetch]);
  
  const [candidateUserList, setCandidateUserList] = useState<{userId: number; nickName: string; email: string}[]>([]);

  const { values, errors, touched, handleChange, handleBlur, setFieldError } = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(30, '30자 이내 팀 이름을 입력해 주세요.').required('30자 이내 팀 이름을 입력해 주세요.'),
    }),
  });
  
  const [profile, setProfile] = useState('');
  const onChangeImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;
    console.log(files, name);
    // TODO 이미지 업로드 연동 진행 중
    if (files && files.length > 0) {
      const image = files[0];
      const formData = new FormData();
      formData.enctype='multipart/form-data';
      formData.append('image', image);
      console.log(formData);
      await uploadImage(formData)
          .then((res: string) => {
            console.log(res);
            setProfile(res);
            return;
          })
          .catch((error) => {
            console.error(error);
          });
    }
  }, []);
  
  const onChangeSearchInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  }, []);
  
  const onClickAddUser = useCallback(
    (user) => () => {
      setSearchKeyword('');
      if (candidateUserList.filter(u => u.userId === user.userId).length !== 0) return;
      setCandidateUserList(prev => [...prev, user]);
    }, [candidateUserList]);
  
  const onClickCancelUser = useCallback(
    (userId: number) => () => {
      const updatedList = candidateUserList.filter(user => user.userId !== userId);
      setCandidateUserList(updatedList);
    }, [candidateUserList]);
  
  const queryClient = useQueryClient();
  const { mutate: _createWorkspace } = useMutation(createWorkspace, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({querykey: [USER_QUERY_KEY.GET_MY_WORKSPACE_LIST]});
      console.log(res);
      router.push(`/workspace/${res.workspaceId}`);
    },
  });
  
  const onCreateWorkspace = useCallback(async () => {
    if (!values.name) {
      toast.error('30자 이내 팀 이름을 입력해 주세요.');
      return;
    }
    if (candidateUserList.length === 0) {
      toast.error('팀에 참여할 멤버를 한 명 이상 선택해 주세요.');
      return;
    }
    const memberUIdList = candidateUserList.map(user => user.userId);
    await _createWorkspace({users: memberUIdList, name: values.name, ...(profile && {profile})});
  }, [values, candidateUserList, profile]);
  
  return (
    <Container>
      <PageName pageName='새로운 플랜팀 만들기' />
      
      <div style={{margin: '50px 18%', display: 'flex', flexDirection: 'column', rowGap: '28px'}}>
        <div style={{display: 'flex', margin: '20px 0', justifyContent: 'space-between'}}>
          <ButtonShort
            buttonStyle={{
              color: AppColor.text.error,
              width: '100px',
              height: '38px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: AppColor.etc.white,
              border: `1px solid ${AppColor.text.error}`
            }}
            label='취소하기'
            onClick={() => {router.back()}}
          />
          <ButtonShort
            buttonStyle={{
              width: '100px',
              height: '38px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: AppColor.main,
            }}
            label='생성하기'
            onClick={onCreateWorkspace}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', rowGap: '18px'}}>
          <Circle>
            {profile ? (
              <Image width={112} height={112} src={profile} alt='프로필 이미지' />
            ) : values.name[0]}
          </Circle>
          <ImageUploadButton>
            <label htmlFor='워크스페이스 프로필 이미지 업로드'>사진 변경</label>
            <input
              style={{ display: 'none' }}
              label='사진 변경'
              id='워크스페이스 프로필 이미지 업로드'
              name='워크스페이스 프로필 이미지 업로드'
              onChange={onChangeImage}
              type='file'
              accept='image/png, image/jpg, image/jpeg'
            />
          </ImageUploadButton>
        </div>
        
        <div>
          <Label style={{marginBottom: '10px'}}>플랜팀 이름</Label>
          <TextInput
              name='name'
              placeholder='플랜팀 이름을 입력해 주세요'
              wrapperStyle={{ width: '100%', minWidth: '280px' }}
              type='name'
              error={Boolean(touched.name && errors.name)}
              helperText={errors.name}
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
          />
        </div>

        <div>
          <div style={{display: 'flex', columnGap: '6px', alignItems: 'flex-end', marginBottom: '10px'}}>
            <Label>멤버 목록</Label>
            <div>{candidateUserList.length}명</div>
          </div>
          <div style={{position: 'relative'}}>
            <TextInput
                placeholder='찾으실 멤버의 닉네임 또는 초대하실 멤버의 이메일을 입력해주세요'
                wrapperStyle={{ width: '100%', minWidth: '280px' }}
                value={searchKeyword}
                onChange={onChangeSearchInput}
                endAdornment={<Image src={SearchIcon} alt="검색 버튼 아이콘" width={20} height={20} />}
            />
            {searchKeyword ? (searchResults.length > 0 ? (
              <DropDownList>
                {searchResults.map((user) => (
                  <Item key={user.userId}>
                    <div>{user.nickName}</div>
                    <div style={{flex: 1}}>{user.email}</div>
                    <AddUserButton onClick={onClickAddUser(user)}>+</AddUserButton>
                  </Item>
                ))}
              </DropDownList>
            ) : (
              <DropDownList>
                  <Item style={{padding: '20px 0'}}>해당하는 사용자가 없습니다.</Item>
              </DropDownList>
            )) : <></>}
          </div>
          
          <div style={{marginTop: '20px'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '16px'}}>
              <tbody style={{fontWeight: '500'}}>
                {candidateUserList.map(({userId, nickName, email}) => (
                  <tr key={userId} style={{borderBottom: `1px solid ${AppColor.border.gray}`, padding: '4px 0px'}}>
                    <td style={{width: '16%', padding: '10px'}}>{nickName}</td>
                    <td>{email}</td>
                    <td style={{width: '6%'}}>
                      <CancelButton onClick={onClickCancelUser(userId)}>x</CancelButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateWorkspace;

CreateWorkspace.getLayout = page => <CommonLayout title='PLAN,T | 워크스페이스 추가'>{page}</CommonLayout>;

const Container = styled.div`
  width: 100%;
`;

const Label = styled.div`
  font-size: 18px;
  color: ${AppColor.text.signature};
`;

const Email = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${AppColor.text.signature};
`;

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
`;

const ImageUploadButton = styled.div`
  width: 96px;
  height: 36px;
  border-radius: 8px;
  background-color: ${AppColor.main};
  font-weight: bold;
  font-size: 14px;
  font-weight: bold;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${AppColor.etc.white};
`;


const DropDownList = styled.ul`
  list-style: none;
  padding: 0 10px;
  position: absolute;
  width: 100%;
  background-color: ${AppColor.background.lightwhite};
  top: 24px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  border-radius: 10px;
  z-index: 1;
`;

const Item = styled.li`
  padding: 10px 0px;
  display: flex;
  column-gap: 30px;
`;

const AddUserButton = styled.button`
  background-color: ${AppColor.main};
  border: none;
  border-radius: 100%;
  width: 20px;
  height: 20px;
  aspect-ratio: 1;
  font-size: 14px;
  color: ${AppColor.etc.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: ${AppColor.text.error};
  border: none;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  color: ${AppColor.etc.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;