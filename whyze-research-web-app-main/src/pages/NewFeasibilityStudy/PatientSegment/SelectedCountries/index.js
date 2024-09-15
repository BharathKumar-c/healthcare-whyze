import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Switch } from 'antd';
import { Location } from '../../../../assets';
import { Text } from '../../../../components/basic';

export default function SelectedCountries({ countriesList, isShowSwitch }) {
  return (
    <div className="selected-countries-container">
      <Text className="selected-countries-title" text="Selected countries" />
      {countriesList.map((country, index) => (
        <Row
          key={index}
          className={
            isShowSwitch
              ? 'selected-countries-component-border'
              : 'selected-countries-component'
          }
        >
          <Col span={isShowSwitch ? 24 : 15}>
            <Row>
              <Col span={4}>
                <Location className="selected-countries-location-icon" />
              </Col>
              <Col className="selected-countries-text" span={20}>
                {country?.country}
              </Col>
            </Row>
          </Col>
          <Col span={9}>
            {!isShowSwitch && (
              <Row>
                <Col className="selected-countries-no-of-patients" span={15}>
                  {country?.count}
                </Col>
                <Col span={9}>
                  <Switch size="small" />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      ))}
    </div>
  );
}

SelectedCountries.propTypes = {
  countriesList: PropTypes.array,
  isShowSwitch: PropTypes.bool,
};

SelectedCountries.defaultProps = {
  countriesList: [],
  isShowSwitch: false,
};
