import { useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);

  function toggleModal() {
    setVisible(!visible);
  }

  return [visible, toggleModal];
};

export default useModal;
