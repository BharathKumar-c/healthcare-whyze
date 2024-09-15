import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import './Modal.scss';

const modalComponenet = ({
  title,
  className,
  children,
  onClose,
  isOpen,
  width,
  handleActionClick,
  cancelButtonLabel,
  okButtonLabel,
  confirmLoading,
  closable,
  footer, // if user need more then 2 button's footer is the only option
}) => {
  return (
    <Modal
      className={className}
      title={<h3>{title}</h3>}
      closable={closable}
      open={isOpen}
      width={width}
      maskClosable
      confirmLoading={confirmLoading}
      onCancel={onClose}
      onOk={handleActionClick}
      okText={okButtonLabel}
      okButtonProps={{
        style: {
          color: 'white ',
          textTransform: 'capitalize',
          backgroundColor: '#0D5959',
          borderRadius: '1rem',
          border: '1px solid #0D5959',
          fontSize: '12px ',
          fontWeight: '700 ',
          padding: '0rem 4rem 0rem 4rem ',
        },
      }}
      cancelButtonProps={{
        style: {
          color: '#0D5959',
          textTransform: 'capitalize',
          backgroundColor: 'white',
          borderRadius: '1rem ',
          border: '1px solid #0D5959 ',
          fontSize: '12px ',
          fontWeight: '700 ',
          padding: '0rem 4rem 0rem 4rem ',
        },
      }}
      cancelText={cancelButtonLabel}
      footer={footer.length > 0 ? footer : undefined}
      centered={true}
    >
      {children}
    </Modal>
  );
};

modalComponenet.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  cancelButtonLabel: PropTypes.string,
  okButtonLabel: PropTypes.string,
  handleActionClick: PropTypes.func,
  isOpen: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  onClose: PropTypes.func,
  closable: PropTypes.bool,

  footer: PropTypes.array,
};
modalComponenet.defaultProps = {
  title: null,
  className: '',
  label: '',
  confirmLoading: false,
  cancelButtonLabel: '',
  okButtonLabel: '',
  children: null,
  handleActionClick: () => {},
  isOpen: false,
  onClose: () => {},
  closable: false,
  footer: [],
};
export default modalComponenet;
