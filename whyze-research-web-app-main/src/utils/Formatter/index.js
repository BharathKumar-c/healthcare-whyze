// Location history tree formatter
import { totalPatientFormatter } from '../calculations';

const cityFormatter = (cities, key, isLocation) =>
  cities.map((c, i) => {
    return {
      title: isLocation
        ? `${c.name} (${totalPatientFormatter(c.count || 0)})`
        : c.name,
      key: `${key}-${i}`,
      count: c.count,
    };
  });

export const locationHistoryTreeFormatter = (data, isLocation) => {
  const locations = [{ title: 'Location', key: '0', children: [] }];
  locations[0].children = data?.map((ele, i) => {
    return {
      title: isLocation
        ? `${ele.name} (${totalPatientFormatter(ele.count || 0)})`
        : ele.name,
      key: `0-${i}`,
      children:
        ele?.city?.length > 0
          ? cityFormatter(ele.city, `0-${i}`, isLocation)
          : [],
      count: ele?.count,
    };
  });

  return locations;
};

// Feasibility history tree formatter
export const feasibilityHistoryTreeFormater = (data) => {
  let history = [];
  data?.map((d, i) => {
    const title = d.name;
    const key = `${d.condition}_${i}`;
    const caseName = d.caseName;
    let children = [];
    let count = d.count;

    if (d.caseName && d.caseName != '') {
      const newTitle = d.caseName;
      const newkey = `${key}_0`;
      children.push({
        title: newTitle,
        key: newkey,
        children: [],
      });
    }
    if (d.child?.length > 0) {
      if (d.caseName) {
        children[0].children = childFormater(d.child, children[0].key);
      } else {
        children = childFormater(d.child, key);
      }
    }

    history.push({
      title,
      caseName,
      children,
      key,
      count,
    });
  });

  return history;
};

const childFormater = (child, child_key) => {
  let res = [];
  let children = [];
  child.map((c, j) => {
    if (c.child?.length >= 0) {
      children = childFormater(c.child, `${child_key}_${j}`);
    }

    if (c.condition !== '') {
      res.push({
        title: c.condition,
        key: `${child_key}_${j}`,
        count: c.count,
        children,
      });
    }
  });

  return res;
};

// Update selectedCountries data with selected countries on location page

export const updateSelectedCountries = (values) => {
  const { data, value, key, selectedCountries } = values;
  const splittedKey = key.split('-');

  if (splittedKey.length === 2) {
    const index = selectedCountries?.findIndex(
      (ele) => ele.name === data[splittedKey[1]].name,
    );
    if (value) {
      if (index === -1) {
        selectedCountries.push(data[splittedKey[1]]);
      } else {
        selectedCountries[index] = data[splittedKey[1]];
      }
    } else {
      selectedCountries.splice(index, 1);
    }
  }

  if (splittedKey.length === 3) {
    const index = selectedCountries?.findIndex(
      (ele) => ele.name === data[splittedKey[1]].name,
    );

    if (value) {
      const city = {
        name: data[splittedKey[1]].city[splittedKey[2]].name,
        count: data[splittedKey[1]].city[splittedKey[2]].count,
      };
      if (index === -1) {
        selectedCountries.push({
          name: data[splittedKey[1]].name,
          count: data[splittedKey[1]].city[splittedKey[2]].count,
          city: [city],
        });
      } else {
        let countryCount = 0;
        selectedCountries[index].city.forEach((ele) => {
          countryCount += ele.count;
        });

        selectedCountries[index].count = countryCount += city.count;
        selectedCountries[index].city.push(city);
      }
    } else {
      const stateIndex = selectedCountries[index].city.findIndex(
        (ele) => ele.name === data[splittedKey[1]].city[splittedKey[2]].name,
      );
      selectedCountries[index].count -=
        selectedCountries[index].city[stateIndex].count;
      selectedCountries[index].city.splice(stateIndex, 1);
      if (selectedCountries[index].city.length === 0) {
        selectedCountries.splice(index, 1);
      }
    }
  }

  return selectedCountries;
};

// Get the selected location keys

export const getSelectedLocationKeys = (data) => {
  const { locations, selectedCountries } = data;
  const checkedKeys = [];

  selectedCountries?.forEach((selectedCountry) => {
    const country = locations.find(
      (location) =>
        location.title.replace(/\s*\(\d+\)$/, '') === selectedCountry.name,
    );

    if (country) {
      const selectedCities = selectedCountry.city
        .map((city) => city.name)
        .sort();
      const countryCities = country.children
        ?.map((city) => city.title.replace(/\s*\(\d+\)$/, ''))
        .sort();

      if (JSON.stringify(selectedCities) === JSON.stringify(countryCities)) {
        checkedKeys.push(country.key);
      }

      selectedCountry.city.forEach((selectedCity) => {
        const city = country.children?.find(
          (location) =>
            location.title.replace(/\s*\(\d+\)$/, '') === selectedCity.name,
        );

        if (city) {
          checkedKeys.push(city.key);
        }
      });
    }
  });

  return checkedKeys;
};

// Rearrange the selected countries when changing the feasibility and location

export const filterSelectedCountries = (location, selectedCountries) => {
  const reArrangeSelectedCountries = [...selectedCountries];
  selectedCountries.forEach((ele) => {
    const countryIndex = location.findIndex((lcn) => lcn.name === ele.name);

    if (countryIndex === -1) {
      const selectedCountryIndex = reArrangeSelectedCountries.findIndex(
        (elem) => elem.name === ele.name,
      );
      reArrangeSelectedCountries.splice(selectedCountryIndex, 1);
    } else {
      const cities = location[countryIndex]?.city.map((lcn) => lcn.name);
      if (ele?.city && ele?.city?.length > 0) {
        ele.city.forEach((cty) => {
          if (!cities.includes(cty.name)) {
            const deleteCountryIndex = reArrangeSelectedCountries.findIndex(
              (cnt) => cnt.name === ele.name,
            );
            const cityIndex = reArrangeSelectedCountries[
              deleteCountryIndex
            ].city.findIndex((city) => city.name === cty.name);
            reArrangeSelectedCountries[deleteCountryIndex].count -= 1;
            reArrangeSelectedCountries[deleteCountryIndex].city.splice(
              cityIndex,
              1,
            );
          }
        });
      }
    }
  });

  return reArrangeSelectedCountries;
};

// getCount count for caseStudy cards

export function getPatientCount(caseStudy) {
  if (!caseStudy?.child || caseStudy.child?.length === 0) {
    return caseStudy.count;
  }

  if (caseStudy.name === 'Demographics') {
    const childIndex =
      caseStudy.child[1].ageRange.min && caseStudy.child[1].ageRange.max
        ? 1
        : 0;
    return caseStudy.child[childIndex].count;
  }

  if (caseStudy.child?.length > 0) {
    return getPatientCount(caseStudy.child[caseStudy.child.length - 1]);
  }

  return 0;
}
