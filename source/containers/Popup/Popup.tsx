import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

interface Props {
  autoHideDuration?: number;
  onClose: () => void;
  renderPopup: (close: () => void) => React.ReactNode;
}

const Popup = ({ autoHideDuration, onClose, renderPopup }: Props) => {
  useEffect(() => {
    if (autoHideDuration && autoHideDuration > 0) {
      setTimeout(onClose, autoHideDuration);
    }
  }, [autoHideDuration, onClose]);

  return renderPopup(onClose);
};

Popup.propTypes = {
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  renderPopup: PropTypes.func,
};

export default Popup;
