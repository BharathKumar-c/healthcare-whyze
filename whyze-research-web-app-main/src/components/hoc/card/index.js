import React from 'react';
import { Card, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './Card.scss';
import Title from './Title';

const CardComponent = ({
  title,
  tagtitle,
  children,
  compStyle,
  handleActionClick,
  className,
  isRename,
  handleRename,
  extra,
  tabList,
  activeTabKey,
  onTabChange,
}) => {
  return (
    <>
      <Row>
        <Col span={21}>
          <Card
            id="card_hoc"
            title={
              <Title
                title={title}
                tagtitle={tagtitle}
                isRename={isRename}
                handleRename={handleRename}
              />
            }
            extra={extra}
            style={{ ...compStyle }}
            onClick={() => handleActionClick()}
            className={className}
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            {children}
          </Card>
        </Col>
      </Row>
    </>
  );
};

CardComponent.propTypes = {
  title: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      case: PropTypes.string,
    }),
  ),
  tagtitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  compStyle: PropTypes.object,
  handleActionClick: PropTypes.func,
  handleSelectOption: PropTypes.func,
  isRename: PropTypes.bool,
  handleRename: PropTypes.func,
  extra: PropTypes.node,
  tabList: PropTypes.array,
  activeTabKey: PropTypes.string,
  onTabChange: PropTypes.func,
};

CardComponent.defaultProps = {
  title: {
    name: '',
    case: '',
  },
  tagtitle: '',
  children: null,
  className: '',
  compStyle: null,
  handleActionClick: () => {},
  handleSelectOption: () => {},
  isRename: false,
  extra: null,
  tabList: [],
  activeTabKey: '',
  onTabChange: () => {},
};

export default CardComponent;
