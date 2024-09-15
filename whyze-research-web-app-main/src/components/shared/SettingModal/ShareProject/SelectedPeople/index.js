import { Row, Col } from 'antd';
import React, { useState } from 'react';
import { PeopleAccess } from '../../../../../constant';
import {
  Checkbox,
  Image,
  Select,
  Tag,
  Text,
  TextArea,
} from '../../../../basic';
import baseavatar from '../../../../../assets/base_avatar.png';
import './SelectedPeople.scss';
import { selectedPeoplesConstants } from '../../../../../constant/ConstantTexts';

const SelectedPeoples = () => {
  const [isnotify, setIsNotify] = useState(false);

  const tagRender = (props) => {
    const { label, closable, onClose } = props; // eslint-disable-line react/prop-types

    return (
      <Tag className="tag-container" closable={closable} onClose={onClose}>
        <Image
          preview={false}
          src={baseavatar}
          width={16}
          height={16}
          style={{ margin: '0 0 4px' }}
        />
        <Text text={label} />
      </Tag>
    );
  };
  return (
    <div className="SelectedPeoples-container">
      <Row>
        <Col span={19} id="SelectedPeoples-container_col-1">
          <Select
            mode="tags"
            placeholder={selectedPeoplesConstants.addPeople}
            tagRender={tagRender}
            getPopupContainer={() =>
              document.getElementById('SelectedPeoples-container_col-1')
            }
            ariaLabel="Add-people-ariaLabel"
          />
        </Col>
        <Col span={4} id="SelectedPeoples-container_col-2">
          <Select
            className="condition-container-custom-select"
            getPopupContainer={() =>
              document.getElementById('SelectedPeoples-container_col-2')
            }
            options={PeopleAccess}
            defaultValue={PeopleAccess[0].value}
          />
        </Col>
      </Row>
      <div className="SelectedPeoples-container_checkbox">
        <Checkbox
          name={'Notify people'}
          lable={selectedPeoplesConstants.notifyPeopleLabel}
          value={isnotify}
          handleChecked={(value) => setIsNotify(value.target.checked)}
        />

        <TextArea
          className="SelectedPeoples-container_textArea"
          lable={selectedPeoplesConstants.messageLabel}
        />
      </div>
    </div>
  );
};

export default SelectedPeoples;
