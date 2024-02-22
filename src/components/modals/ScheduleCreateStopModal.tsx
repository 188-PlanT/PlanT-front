import Modal, {ModalProps} from '@components/modals';
import ShortButton from '@components/atoms/ShortButton';
import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import {useCallback, MouseEvent} from 'react';

export default function ScheduleCreateStopModal({
    isOpened,
    closeModal,
    backdropClose = true,
  }: ModalProps) {
  const onClickContainer = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Modal isOpened={isOpened} closeModal={backdropClose ? closeModal : null}>
      <Container onClick={onClickContainer}>
        <Content>
          정말 권한을 변경하시겠어요?
        </Content>
        
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <ShortButton
            onClick={() => {}}
            label='네'
            buttonStyle={{
              backgroundColor: AppColor.main,
              width: '140px',
              height: '46px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '0',
            }}  
          />
          <ShortButton
            onClick={closeModal}
            label='아니요'
            buttonStyle={{
              backgroundColor: AppColor.background.gray,
              width: '140px',
              height: '46px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '0',
              color: AppColor.main,
            }}
          />
        </div>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  border-radius: 14px;
  padding: 40px;
  box-shadow: rgb(0, 0, 0, 0.15) 3px 4px 18px 1px;
  background-color: ${AppColor.etc.white};
  width: 400px;
`;

const Content = styled.div`
  width: 100%;
  font-size: 20px;
  color: ${AppColor.text.main};
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
`;
