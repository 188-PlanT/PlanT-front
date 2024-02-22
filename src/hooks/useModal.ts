import { useState, useCallback, ReactNode } from 'react';

export default function useModals(): [boolean, () => void, () => void] {

  const [isOpened, setIsOpened] = useState(false);

  const openModal = useCallback(() => {
    setIsOpened(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpened(false);
  }, []);

  return [
    isOpened,
    openModal,
    closeModal,
  ];
}
