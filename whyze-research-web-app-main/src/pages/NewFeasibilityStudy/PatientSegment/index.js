import { SearchOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Location,
  Sites,
  Search,
  OutlinedClose,
  UserDelete,
  UserAdd,
} from '../../../assets';
import { Input, Text } from '../../../components/basic';
import CountryContainer from './CountryContainer';
import { NotConnectedPatients } from './NotConnectedPatients';
import SelectedCountries from './SelectedCountries';
import SiteAndCountryDetails from './SiteAndCountryDetails';
import './PatientSegment.scss';
import SiteOverview from './SiteOverview';
import { errorConstants } from '../../../constant';
import { useSelector } from 'react-redux';
import store from '../../../redux/store';

export default function PatientSegment({
  totalNoOfPatients,
  countriesList,
  tab,
  totalCountry,
  siteCount,
  noOfNotConncetedPatients,
}) {
  const [isSearch, setIsSearch] = useState(false);
  const [countries, setCountries] = useState(countriesList || []);
  const [isPinnedCountries, setIsPinnedCountries] = useState(false);
  const [filteredCountriesList, setFilteredCountriesList] = useState([]);
  const { activeSegment } = useSelector(
    (state) => state.feasibilityStudyReducer,
  );
  const { segments } = store.getState().feasibilityStudyReducer;

  const countriesLength = segments[activeSegment.index];
  const {
    preferredSites,
    sitesContacted,
    sitesInitiated,
    selectedCountries,
    sites,
    totalConnectedNotConnected,
  } = segments[activeSegment.index];
  const selectedCountriesList = selectedCountries?.map((ele) => ({
    country: ele.name,
    count: ele.count,
  }));

  let connectedSites = preferredSites?.reduce((a, b) => {
    return a + b.connected || 0;
  }, 0);

  let notConnectedSites = preferredSites?.reduce((a, b) => {
    return a + b.not_connected_sites || 0;
  }, 0);
  let totalConnectedAndNotConnected = connectedSites + notConnectedSites;

  useEffect(() => {
    setCountries(countriesList);
  }, [countriesList]);

  const topCountriesList =
    countries &&
    countries
      .sort((a, b) => Number(b.count) - Number(a.count))
      .filter((ele, idx) => !ele.isFavourite && idx <= 3);

  const handleChange = (event) => {
    if (event.target.value.length > 0) {
      setFilteredCountriesList(
        countries.filter(
          (ele) =>
            ele.country
              ?.toLowerCase()
              .includes(event.target.value.toLowerCase()) && !ele.isFavourite,
        ),
      );
    } else {
      setFilteredCountriesList([]);
    }
  };

  const handlePinCountry = (country) => {
    if (isSearch) {
      // To add a favorite country when opening the search filter
      const newFilteredCountries = [...filteredCountriesList];
      const deleteCountryIndex = newFilteredCountries.findIndex(
        (ele) => ele.country === country,
      );
      newFilteredCountries.splice(deleteCountryIndex, 1);

      setFilteredCountriesList(newFilteredCountries);
      const newCountries = [...countries];
      newCountries.forEach((ele) => {
        if (ele.country === country) {
          ele.isFavourite = true;
        }
      });
      setIsPinnedCountries(true);
      setCountries(newCountries);
    } else {
      const newCountries = [...countries];
      newCountries.forEach((ele) => {
        if (ele.country === country) {
          ele.isFavourite = true;
        }
      });
      setIsPinnedCountries(true);
      setCountries(newCountries);
    }
  };

  const handleUnPinCountry = (country) => {
    const newCountries = [...countries];
    newCountries.forEach((ele) => {
      if (ele.country === country) {
        ele.isFavourite = false;
      }
    });
    setCountries(newCountries);
    setIsPinnedCountries(countries.findIndex((ele) => ele.isFavourite) !== -1);
  };

  const handleCloseSearchField = () => {
    setFilteredCountriesList([]);
    setIsSearch(false);
  };

  useEffect(() => {
    // Finding if favorite countries are there on the list
    setIsPinnedCountries(countries.findIndex((ele) => ele.isFavourite) !== -1);
  }, []);

  return (
    <div className="patient-segment">
      <Row>
        <Text className="patient-segment-title" text="Patient segment" />
      </Row>
      <Row>
        <Text
          headerType={2}
          text={
            tab == 'feasibility'
              ? totalNoOfPatients?.feasibility || 0
              : tab === 'sites' ||
                (tab === 'location' && totalNoOfPatients?.location)
              ? totalNoOfPatients?.location
              : tab === 'preferredList'
              ? totalConnectedAndNotConnected || 0
              : !totalNoOfPatients?.feasibility
              ? 0
              : totalNoOfPatients?.feasibility
          }
        />
      </Row>
      {!(tab === 'feasibility' || tab === 'location') && (
        <Row>
          <Text className="patient-segment-title" text="Breakdown" />
        </Row>
      )}
      <Row className="site-country-container">
        <Col span={12}>
          <SiteAndCountryDetails
            icon={
              tab === 'feasibility' || tab === 'location' ? (
                <Sites />
              ) : (
                <UserAdd />
              )
            }
            value={
              tab === 'feasibility'
                ? siteCount?.feasibility
                : tab === 'location' &&
                  sites &&
                  Object.keys(sites)?.length !== 0
                ? siteCount?.location
                : tab === 'location' &&
                  (!sites || Object.keys(sites)?.length === 0) &&
                  selectedCountries?.length === 0
                ? siteCount?.feasibility
                : tab === 'location' &&
                  (!sites || Object.keys(sites)?.length === 0)
                ? 0
                : tab === 'sites'
                ? totalConnectedNotConnected?.connectedPatientCount || 0
                : tab === 'preferredList'
                ? connectedSites || 0
                : !siteCount?.feasibility
                ? 0
                : siteCount?.feasibility
            }
            title={
              tab === 'feasibility' || tab === 'location'
                ? 'Sites'
                : 'Connected to sites'
            }
            tab={tab}
          />
        </Col>
        <Col span={12}>
          <SiteAndCountryDetails
            icon={
              tab === 'feasibility' || tab === 'location' ? (
                <Location />
              ) : (
                <UserDelete />
              )
            }
            value={
              tab === 'feasibility'
                ? totalCountry || 0
                : tab === 'location' &&
                  countriesLength?.selectedCountries?.length > 0
                ? countriesLength?.selectedCountries?.length
                : tab === 'sites'
                ? totalConnectedNotConnected?.notConnectedPatientCount || 0
                : tab === 'preferredList'
                ? notConnectedSites || 0
                : !totalCountry
                ? 0
                : totalCountry
            }
            title={
              tab === 'feasibility' || tab === 'location'
                ? 'Countries'
                : 'Not connected to sites'
            }
            isInfo={!(tab === 'feasibility' || tab === 'location')}
            tab={tab}
          />
        </Col>
      </Row>
      {tab === 'feasibility' && (
        <>
          {isPinnedCountries && (
            <div className="pinned-country-container">
              <Text className="sub-title" text="Your pinned countries" />
              {countries.map((country, i) => (
                <>
                  {country.isFavourite && (
                    <CountryContainer
                      key={i}
                      isPinned
                      countryObj={country}
                      onUnPinCountry={handleUnPinCountry}
                    />
                  )}
                </>
              ))}
            </div>
          )}
          <Row className="country-title">
            <Col span={20}>
              {isSearch ? (
                <Input
                  name={'SearchCountries'}
                  placeholder="Search countries ..."
                  prefix={<SearchOutlined />}
                  handleInputChange={handleChange}
                />
              ) : (
                <Text
                  className="sub-title"
                  text={
                    countriesLength?.country?.length > 1
                      ? `Top ${countriesLength?.country?.length} countries`
                      : countriesLength?.country?.length === 1
                      ? `Top ${countriesLength?.country?.length} country`
                      : ''
                  }
                />
              )}
            </Col>
            <Col span={3} className="search-field">
              {isSearch ? (
                <OutlinedClose
                  onClick={handleCloseSearchField}
                  className="close-search-icon"
                />
              ) : (
                <Search onClick={() => setIsSearch(true)} />
              )}
            </Col>
          </Row>
          <div className="countries-list">
            {!isSearch &&
              topCountriesList.map((country, i) => (
                <>
                  {!country.isFavourite && (
                    <CountryContainer
                      key={i}
                      countryObj={country}
                      onPinCountry={handlePinCountry}
                    />
                  )}
                </>
              ))}
            {isSearch &&
              filteredCountriesList.length > 0 &&
              filteredCountriesList.map((country, i) => (
                <CountryContainer
                  key={i}
                  countryObj={country}
                  onPinCountry={handlePinCountry}
                />
              ))}
            {isSearch && filteredCountriesList.length === 0 && (
              <div className="error-message">
                <Text
                  className="patient-segment-pinned-title"
                  text={errorConstants.patientNullError}
                />
              </div>
            )}
          </div>
        </>
      )}
      {tab === 'location' && noOfNotConncetedPatients ? (
        <NotConnectedPatients />
      ) : null}
      {tab === 'preferredList' && (
        <SiteOverview
          preferredSitesCount={preferredSites?.length}
          sitesContactedCount={sitesContacted?.length}
          sitesInitiatedCount={sitesInitiated?.length}
        />
      )}
      {(tab === 'sites' || tab === 'preferredList') && (
        <SelectedCountries
          countriesList={selectedCountriesList}
          isShowSwitch={tab === 'preferredList'}
        />
      )}
    </div>
  );
}

PatientSegment.propTypes = {
  totalNoOfPatients: PropTypes.object,
  countriesList: PropTypes.array,
  tab: PropTypes.string,
  totalCountry: PropTypes.number,
  connetedSites: PropTypes.number,
  siteCount: PropTypes.object,
  noOfNotConncetedPatients: PropTypes.number,
};

PatientSegment.defaultProps = {
  totalNoOfPatients: {},
  countriesList: [],
  tab: '',
  totalCountry: 0,
  connetedSites: 0,
  siteCount: {},
  noOfNotConncetedPatients: 0,
};
