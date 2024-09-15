import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import {
  ChangeTo,
  Contact,
  Delete,
  Initiated,
  LeftArrow,
  RightArrow,
} from '../../../../assets';
import { Checkbox, Text } from '../../../../components/basic';

export default function PaginationAndOptions(props) {
  const {
    tab,
    totalPage,
    currentPage,
    noOfSelectedSites,
    isCheckedAll,
    isShowOptions,
    setCurrentPage,
    handleDelete,
    handleCheckAllData,
    onClickCheckedPreferredSitesData,
    onClickCheckedContactedData,
    onClickCheckedInitiatedData,
    onTabChange,
  } = props;

  return (
    <div className="preferred-list-pagination-container">
      <div
        className={
          isShowOptions
            ? 'preferred-list-alignment'
            : 'preferred-list-checkbox-alignment'
        }
      >
        <div className="preferred-list-alignment">
          <Checkbox
            className="preferred-list-checkbox"
            name={'sites'}
            lable={`${noOfSelectedSites} Sites`}
            value={isCheckedAll}
            handleChecked={handleCheckAllData}
          />
          <Divider
            className={
              isShowOptions
                ? 'preferred-list-divider'
                : 'preferred-list-divider-hide'
            }
            type="vertical"
          />
        </div>
      </div>
      <div
        className={
          isShowOptions
            ? 'preferred-list-options'
            : 'preferred-list-options-hide'
        }
      >
        <div
          className="preferred-list-option-alignment"
          onClick={() => handleDelete()}
        >
          <div className="preferred-list-option">
            <div className="preferred-list-icon">
              <Delete />
            </div>
            <Text className="preferred-list-text" text="Delete" />
          </div>
        </div>
        {tab !== 'preferredSites' && (
          <div
            className="preferred-list-option-alignment"
            onClick={() => {
              if (noOfSelectedSites > 0) {
                onClickCheckedPreferredSitesData();
                onTabChange('preferredSites');
              }
            }}
          >
            <div className="preferred-list-option">
              <div className="preferred-list-icon">
                <ChangeTo />
              </div>
              <Text
                className="preferred-list-text"
                text="Move to preferred sites"
              />
            </div>
          </div>
        )}
        {tab !== 'contacted' && (
          <div
            className="preferred-list-option-alignment"
            onClick={() => {
              if (noOfSelectedSites > 0) {
                onClickCheckedContactedData();
                onTabChange('sitesContacted');
              }
            }}
          >
            <div className="preferred-list-option">
              <div className="preferred-list-icon">
                <Contact />
              </div>
              <Text className="preferred-list-text" text="Mark contacted" />
            </div>
          </div>
        )}
        {tab !== 'initiated' && (
          <div
            className="preferred-list-option-alignment"
            onClick={() => {
              if (noOfSelectedSites > 0) {
                onClickCheckedInitiatedData();
                onTabChange('sitesInitiated');
              }
            }}
          >
            <div className="preferred-list-option">
              <div className="preferred-list-icon">
                <Initiated />
              </div>
              <Text className="preferred-list-text" text="Mark initiated" />
            </div>
          </div>
        )}
      </div>
      <div className="preferred-list-alignment">
        <Text
          className="preferred-list-pagination-text"
          text={`${currentPage}-${totalPage} of ${totalPage}`}
        />

        <div className="preferred-list-arrow-icon">
          <LeftArrow
            className="preferred-list-arrow-left"
            onClick={() =>
              currentPage !== 1
                ? setCurrentPage((previousPage) => previousPage - 1)
                : null
            }
          />
          <RightArrow
            className="preferred-list-arrow-right"
            onClick={() =>
              currentPage !== totalPage
                ? setCurrentPage((previousPage) => previousPage + 1)
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}

PaginationAndOptions.propTypes = {
  tab: PropTypes.string,
  totalPage: PropTypes.number,
  currentPage: PropTypes.number,
  noOfSelectedSites: PropTypes.number,
  isCheckedAll: PropTypes.bool,
  isShowOptions: PropTypes.bool,
  setCurrentPage: PropTypes.func,
  handleCheckAllData: PropTypes.func,
  handleDelete: PropTypes.func,
  onClickCheckedPreferredSitesData: PropTypes.func,
  onClickCheckedContactedData: PropTypes.func,
  onClickCheckedInitiatedData: PropTypes.func,
  onTabChange: PropTypes.func,
};

PaginationAndOptions.defaultProps = {
  tab: 'preferredSites',
  totalPage: 0,
  currentPage: 0,
  noOfSelectedSites: 0,
  isCheckedAll: false,
  isShowOptions: false,
  setCurrentPage: () => {},
  handleDelete: () => {},
  handleCheckAllData: () => {},
  onClickCheckedPreferredSitesData: () => {},
  onClickCheckedContactedData: () => {},
  onClickCheckedInitiatedData: () => {},
  onTabChange: () => {},
};
