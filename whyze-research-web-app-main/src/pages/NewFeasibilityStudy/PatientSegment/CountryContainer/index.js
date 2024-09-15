import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { Star, StarFilled, Tick } from '../../../../assets';
import { Text } from '../../../../components/basic';
import { totalPatientFormatter } from '../../../../utils/calculations';
import { PlusOutlined } from '@ant-design/icons';

export default function CountryContainer({
  isPinned,
  countryObj,
  onUnPinCountry,
  onPinCountry,
}) {
  const { country, count } = countryObj;
  return (
    <div className="country-container">
      <Row>
        <Col span={18}>
          <Row className="">
            <Col
              className="country-container-column"
              span={4}
              style={{ cursor: 'pointer' }}
            >
              {isPinned ? (
                <StarFilled
                  onClick={() => onUnPinCountry(country)}
                  className="favorite-isFilled"
                />
              ) : (
                <Star
                  onClick={() => onPinCountry(country)}
                  className="favorite-notFilled"
                />
              )}
            </Col>
            <Col
              span={20}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Text
                className={
                  isPinned
                    ? 'patient-segment-pinned-title'
                    : 'patient-segment-title'
                }
                text={country ? country : 'Country not found'}
              />
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row style={{ alignItems: 'flex-end' }}>
            <Col
              span={14}
              className={
                isPinned ? 'no-of-patients' : 'country-container-no-of-patients'
              }
            >
              {totalPatientFormatter(count)}
            </Col>
            <Col span={10} style={{ cursor: 'pointer' }}>
              {isPinned ? (
                <Tick
                  onClick={() => console.log('tick', country)}
                  className="Tick-icon"
                />
              ) : (
                <PlusOutlined
                  onClick={() => console.log('add', country)}
                  className="Pluse-Icon"
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

CountryContainer.propTypes = {
  isPinned: PropTypes.bool,
  countryObj: PropTypes.objectOf(
    PropTypes.shape({
      country: PropTypes.object,
      count: PropTypes.number,
    }),
  ),
  onUnPinCountry: PropTypes.func,
  onPinCountry: PropTypes.func,
};

CountryContainer.defaultProps = {
  isPinned: false,
  countryObj: {
    country: '',
    count: 0,
  },
  onUnPinCountry: () => {},
  onPinCountry: () => {},
};
