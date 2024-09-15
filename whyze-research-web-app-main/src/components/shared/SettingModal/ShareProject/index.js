import React, { useState } from 'react';
import { Select } from '../../../basic';
import PropTypes from 'prop-types';
import './Projectlink.scss';
import { AddIconBlackSmall, Restricted } from '../../../../assets';
import {
  accessPermissionList,
  accessPermissionmessage,
  PeopleAccess,
} from '../../../../constant';
import SelectedPeoples from './SelectedPeople';
import { shareProjectConstants } from '../../../../constant/ConstantTexts';

const Projectlink = (props) => {
  const [infotag, setInfotag] = useState('');
  const [activeCard, setActivateCard] = useState(null);
  const handleSelectedOption = (value) => {
    const tagvalue = accessPermissionmessage?.find(
      (ele) => ele.value === value,
    );
    setInfotag(tagvalue);
  };
  const handleSelected = (value) => {
    props.handleSend((previousState) => ({
      ...previousState,
      isSubComp: value.length > 0,
    }));
  };
  return (
    <>
      {props?.isSubcomp ? (
        <SelectedPeoples />
      ) : (
        <div className="share-project-container" id="share-project-container">
          <div>
            <Select
              className={'share-project-input'}
              mode="tags"
              name="share-project"
              ariaLabel="share-project"
              getPopupContainer={() =>
                document.getElementById('share-project-container')
              }
              placeholder={shareProjectConstants.addPeoplePlaceHolder}
              suffixIcon={<AddIconBlackSmall />}
              handleSelect={handleSelected}
            />
          </div>
          <h5>{shareProjectConstants.accessPeopleText}</h5>

          {props?.user?.map((element, index) => (
            <>
              <div
                className={
                  activeCard === index
                    ? 'share-project-access-wrapper_active'
                    : 'share-project-access-wrapper'
                }
                onClick={() => setActivateCard(index)}
              >
                <img src={element.image} key={index} />
                <div className="share-project-access-wrapper_email-space">
                  <h4>{element.name}</h4>
                  <p>{element.email}</p>
                </div>
                {element.role === 'owner' ? (
                  <h4>{element.role}</h4>
                ) : (
                  <Select
                    className="condition-container-custom-select"
                    options={PeopleAccess}
                    getPopupContainer={() =>
                      document.getElementById('share-project-container')
                    }
                    defaultValue={PeopleAccess[0].value}
                  />
                )}
              </div>
            </>
          ))}

          <div id="access-permission-wrapper">
            <h5>Access permissions</h5>
            <Select
              className="condition-container-custom-select"
              options={accessPermissionList}
              getPopupContainer={() =>
                document.getElementById('access-permission-wrapper')
              }
              ariaLabel="custom-select-projectSetting"
              handleSelect={handleSelectedOption}
              defaultValue={accessPermissionList[0].value}
            />
            <div className="share-project-container_message-with-icon">
              {infotag?.icon || <Restricted />}
              <p>
                {infotag?.message ||
                  'Only people with access can edit with the link '}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
Projectlink.propTypes = {
  username: PropTypes.string,
  isOpen: PropTypes.bool,
  isSubcomp: PropTypes.bool,
  handleSend: PropTypes.func,
  user: PropTypes.node,
};
Projectlink.defaultProps = {
  username: '',
  handleSend: () => {},
  isOpen: false,
  isSubcomp: false,
  user: null,
};
export default Projectlink;
