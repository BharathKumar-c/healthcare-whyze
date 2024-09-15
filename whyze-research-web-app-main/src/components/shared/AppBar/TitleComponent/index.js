import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import WhyzeLogo from '../../../../assets/WhyzeLogo.svg';
import WhyzeTextLogo from '../../../../assets/WhyzeTextLogo.svg';
import { Image } from '../../../basic';

const TitleComponent = ({ title, onBack, currentPage }) => {
  const logo =
    currentPage === 'dashboard' ||
    currentPage === 'feasibility-studies-in-planning'
      ? WhyzeTextLogo
      : WhyzeLogo;

  return (
    <Row className="appbar-alignCenter">
      <Col>
        <Image preview={false} src={logo} />
      </Col>
      {currentPage !== 'dashboard' && (
        <Col>
          <ArrowLeftOutlined
            style={{ margin: '0px 25px 0 30px' }}
            onClick={() => onBack(currentPage)}
          />
        </Col>
      )}
      <Col>
        <Typography color="#2D3339">{title}</Typography>
      </Col>
    </Row>
  );
};

TitleComponent.propTypes = {
  title: PropTypes.string,
  currentPage: PropTypes.string,
  onBack: PropTypes.func,
};

TitleComponent.defalutProps = {
  title: '',
  currentPage: '',
  onBack: null,
};

export default TitleComponent;
