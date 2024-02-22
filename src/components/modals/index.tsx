import {ReactNode, cloneElement, useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import styled from '@emotion/styled';

export interface ModalProps {
  isOpened: boolean;
  closeModal: () => void;
  backdropClose?: boolean;
}

interface ModalWrapperProps {
  children: ReactNode;
  isOpened: boolean;
  closeModal?: (() => void) | null;
}

export default function Modal({children, isOpened, closeModal}: ModalWrapperProps) {
  // if (typeof window === 'undefined') return <></>;
  const [body, setBody] = useState<Element | null>(null);
  const [portalRoot, setPortalRoot] = useState<Element | null>(null);

  useEffect(() => {
    setPortalRoot(document.querySelector('#modal-root') || null);
    setBody(document.querySelector('body') || null);
  }, [portalRoot, body]);
  
  useEffect(() => {
    if (isOpened) {
      body?.classList.add('scroll-lock');
    } else {
      body?.classList.remove('scroll-lock');
    }
  }, [isOpened, body]);
  
  if (!portalRoot) return <></>;
  
  return (
    <>
      {isOpened && createPortal(
        <Backdrop onClick={closeModal ? closeModal : () => {}}>
          {children}
        </Backdrop>
       , portalRoot)}
    </>
  );
};

const Backdrop = styled.div`
  background-color: rgb(0, 0, 0, 0.25);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;
