import { useState } from 'react';

const useModal: () => [visible: boolean, toggleModal: () => void] = () => {
  const [visible, setVisible] = useState(false);

  const toggleModal = () => {
    setVisible(!visible);
  }

  return [visible, toggleModal];
};

export default useModal;
