import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

interface Props {
  autoHideDuration?: number;
  onClose: () => void;
  renderPopup: (close: () => void) => React.ReactNode;
}

const Popup: React.FC<Props> = ({ autoHideDuration, onClose, renderPopup }) => {
  useEffect(() => {
    if (autoHideDuration && autoHideDuration > 0) {
      setTimeout(onClose, autoHideDuration);
    }
  }, [autoHideDuration, onClose]);

  return <>{renderPopup(onClose)}</>;
};

Popup.propTypes = {
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  renderPopup: PropTypes.func,
};

export default Popup;
