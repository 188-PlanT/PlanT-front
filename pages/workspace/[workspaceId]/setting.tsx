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
import {useState, useCallback, useMemo, useEffect, ChangeEvent} from 'react';
import {transrateAuthority} from '@utils/Utils';
import useModal from '@hooks/useModal';
import WorkspaceDeleteConfirmModal from '@components/modals/WorkspaceDeleteConfirmModal';
import WorkspaceWithdrawConfirmModal from '@components/modals/WorkspaceWithdrawConfirmModal';
import KickMemberConfirmModal from '@components/modals/KickMemberConfirmModal';
import { USER_QUERY_KEY, searchUser } from '@apis/userApi';
import { uploadImage } from '@apis/fileApi';
import { WORKSPACE_QUERY_KEY, changeWorkspace, getWorkspaceUserByWId, addWorkspaceUser, deleteWorkspaceUser, deleteWorkspace } from '@apis/workspaceApi';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAppSelector } from '@store/configStore';
import {selectUserId} from '@store/slices/user';

interface WorkspaceSettingProps {}

const WorkspaceSetting: NextPageWithLayout<WorkspaceSettingProps> = ({}) => {
  const [deleteModalIsOpened, deleteModalOpen, deleteModalClose] = useModal();
  const [withdrawModalIsOpened, withdrawModalOpen, withdrawModalClose] = useModal();
  const [kickModalIsOpened, kickModalOpen, kickModalClose] = useModal();
  
  const router = useRouter();

  const myUserId = useAppSelector(selectUserId);
  
  const workspaceId = useMemo(() => router.query.workspaceId, [router]);
  
  const {data: workspaceData} = useQuery({
      queryKey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_USERS_BY_WID, workspaceId],
      queryFn: () => getWorkspaceUserByWId({workspaceId}),
      enabled: !!workspaceId,
      onError: () => {
        toast.error('해당 워크스페이스의 관리자가 아닙니다. 관리자에게 문의해 주세요.');
        router.push(`/workspace/${workspaceId}`);
      },
      initialData: {users: [], workspaceName: '', profile: ''},
    });
  
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldError } = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(30, '30자 이내 팀 이름을 입력해 주세요.').required('30자 이내 팀 이름을 입력해 주세요.'),
    }),
  });
  
  useEffect(() => {
    if (workspaceData.workspaceName) {
      setFieldValue('name', workspaceData.workspaceName)
    }
  }, [workspaceData, setFieldValue]);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const {data: {users: searchResults}, refetch} = useQuery({
    queryKey: [USER_QUERY_KEY.SEARCH_USER],
    queryFn: () => searchUser({keyword: searchKeyword}),
    enabled: !!searchKeyword,
    initialData: {users: []},
  });

  useEffect(() => {
    if (!!searchKeyword) {
      refetch();
    }
  }, [searchKeyword, refetch]);
  
  const onChangeSearchInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  }, []);
  
  const queryClient = useMemo(() => new QueryClient(), []);
  const {mutate: _addWorkspaceUser} = useMutation(addWorkspaceUser, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({querykey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_USERS_BY_WID, workspaceId], refetchType: 'inactive'});
      console.log(res);
    },
  })
  const onClickAddUser = useCallback(
    (user) => async () => {
      setSearchKeyword('');
      
      const memberUIdList = workspaceData.users.map((u) => u.userId);
      if (memberUIdList.filter(id => id === user.userId).length !== 0) {
        toast.error('이미 초대된 사용자입니다.');
        return;
      }

      await _addWorkspaceUser({
        workspaceId,
        userId: user.userId,
      });
      // if (candidateUserList.filter(u => u.userId === user.userId).length !== 0) return;
      // setCandidateUserList(prev => [...prev, user]);
    }, [workspaceData, workspaceId, _addWorkspaceUser]);
  
  
  const {mutate: _deleteWorkspaceUser} = useMutation(deleteWorkspaceUser, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({querykey: [WORKSPACE_QUERY_KEY.GET_WORKSPACE_USERS_BY_WID, workspaceId], refetchType: 'inactive'});
      console.log(res);
    },
  });
  const [selectedKickedUserId, setSelectedKickedUserId] = useState<number | null>(null);
  const onClickKickUser = useCallback(
    (userId) => () => {
      setSelectedKickedUserId(userId);
      kickModalOpen();
    }, [kickModalOpen]);
  const onKickUser = useCallback(() => {
    _deleteWorkspaceUser({
        workspaceId,
        userId: selectedKickedUserId,
      });
    kickModalClose();
  }, [selectedKickedUserId, kickModalClose, _deleteWorkspaceUser, workspaceId]);
  
  useEffect(() => {
    if (!kickModalIsOpened) {
      setSelectedKickedUserId(null);
    }
  }, [kickModalIsOpened]);
  
  const onClickWithdraw = useCallback(async () => {
    await deleteWorkspaceUser({
      workspaceId,
      userId: myUserId,
    }).then(() => {
      queryClient.invalidateQueries({queryKey: [USER_QUERY_KEY.GET_MY_WORKSPACE_LIST]});
      router.push('/workspace/personal');
    }).catch((error) => {
      toast.error(error.message);
    });
    withdrawModalClose();
  }, [withdrawModalClose, router, workspaceId, myUserId]);
  
  const {mutate: _deleteWorkspace} = useMutation(deleteWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [USER_QUERY_KEY.GET_MY_WORKSPACE_LIST]});
      router.push('/workspace/personal')
    },
  });
  const onClickDelete = useCallback(() => {
    _deleteWorkspace({workspaceId});
    deleteModalClose();
    router.push('/workspace/personal');
  }, [deleteModalClose, router, _deleteWorkspace, workspaceId]);
  
  const [profile, setProfile] = useState('');
  useEffect(() => {
    if (workspaceData?.profile) {
      setProfile(workspaceData.profile);
    }
  }, [workspaceData])
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
  
  return (
    <Container style={{width: '100%'}}>
      <PageName pageName={workspaceData.workspaceName} additionalName='플랜팀 설정' />
      <div style={{margin: '50px 18%', display: 'flex', flexDirection: 'column', rowGap: '28px'}}>        
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', rowGap: '18px'}}>
          <Circle>
            {profile ? (
              <Image width={112} height={112} style={{borderRadius: '100%'}} src={profile} alt='프로필 이미지' />
            ) : workspaceData.workspaceName[0]}
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
            onClick={onChangeImage}
          />
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
            <div>{workspaceData.users.length}명</div>
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
                {workspaceData.users.map(({userId, nickName, authority, email}) => (
                  <tr key={userId} style={{borderBottom: `1px solid ${AppColor.border.gray}`, padding: '4px 0px'}}>
                    <td style={{width: '16%', padding: '10px'}}>{nickName}</td>
                    <td>{email}</td>
                    {myUserId !== userId ? (
                      <>
                        <td style={{width: '14%', textAlign: 'center', padding: '10px 0px', color: AppColor.text.lightblack}}>
                          <AuthorityDropDown authority={authority} userId={userId} />
                        </td>
                        <td style={{width: '20%', textAlign: 'center'}}>
                          <KickButton onClick={onClickKickUser(userId)} >
                            내보내기
                          </KickButton>
                        </td>
                      </>
                    ) : (<></>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        
        <div style={{display: 'flex', marginTop: '20px', columnGap: '120px', justifyContent: 'center'}}>
          <ButtonShort
            buttonStyle={{
              width: '100px',
              height: '38px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: AppColor.text.error,
            }}
            label='팀 나가기'
            onClick={withdrawModalOpen}
          />
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
            label='팀 삭제'
            onClick={deleteModalOpen}
          />
        </div>
      </div>
      <WorkspaceWithdrawConfirmModal isOpened={withdrawModalIsOpened} closeModal={withdrawModalClose} onClick={onClickWithdraw} />
      <WorkspaceDeleteConfirmModal isOpened={deleteModalIsOpened} closeModal={deleteModalClose} onClick={onClickDelete} />
      <KickMemberConfirmModal isOpened={kickModalIsOpened} closeModal={kickModalClose} onClick={onKickUser} />
    </Container>
  );
};

export default WorkspaceSetting;

WorkspaceSetting.getLayout = page => <CommonLayout title='PLAN,T | 플랜팀 설정'>{page}</CommonLayout>;

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

const KickButton = styled.button`
  border: 0px;
  background-color: transparent;
  color: ${AppColor.text.error};
  font-weight: bold;
  text-decoration: underline;
  font-size: 16px;
  padding: 0px;
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
  font-size: 14px;
  color: ${AppColor.etc.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;