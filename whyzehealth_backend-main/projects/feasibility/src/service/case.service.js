const { QueryTypes } = require('sequelize');
const APP_CONST = require('./../constants');
const { getSequlize, getModelByName } = require('./../config/db');

const getFeasibilityDetails = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      let result = [];
      var query = `SELECT  "${APP_CONST.COUNTRY_COL}" , COUNT("${APP_CONST.ID_COL}") FROM "${APP_CONST.USERS_TABLE}" where `;
      var replacements = {};
      for (let i = 0; i < data.length; i++) {
        if (data[i].case === APP_CONST.INDICATION && data[i].caseName !== '') {
          if (data[i].condition === APP_CONST.INCLUSION) {
            query = `${query} "${APP_CONST.ID_COL}" IN`;
          } else {
            query = `${query} "${APP_CONST.ID_COL}" NOT IN`;
          }
          query = `${query} (SELECT DISTINCT "${APP_CONST.PATIENT_ID_COL}" FROM "${APP_CONST.PATIENT_CONSITION_TABLE}" WHERE "${APP_CONST.NAME_COL}" = :PatientCondition_Name_${i}`;
          replacements = {
            ...replacements,
            [`PatientCondition_Name_${i}`]: data[i].caseName,
          };
          const indication = await getIndication(
            data[i],
            i,
            query,
            replacements,
          );

          result.push(indication.data);
          query = indication.query;
          replacements = {
            ...replacements,
            ...indication.replacements,
          };
        }

        if (data[i].case === APP_CONST.DEMOGRAPHICS) {
          const demographics = await getDemographics(
            data[i],
            i,
            query,
            replacements,
          );
          result.push(demographics.data);
          query = demographics.query;
          replacements = {
            ...replacements,
            ...demographics.replacements,
          };
        }

        if (data[i].case === APP_CONST.MEDICATION && data[i].caseName !== '') {
          const medication = await getMedication(
            data[i],
            i,
            query,
            replacements,
          );
          result.push(medication.data);
          query = medication.query;
          replacements = {
            ...replacements,
            ...medication.replacements,
          };
        }

        if (data[i].case === APP_CONST.WEIGTH) {
          const { min, max } = data[i].child[0].weightRange;
          if (min || max) {
            const weight = await getWeight(data[i], i, query, replacements);
            result.push(weight.data);
            query = weight.query;
            replacements = {
              ...replacements,
              ...weight.replacements,
            };
          }
        }
        if (data[i].case === APP_CONST.BMI) {
          const range = data[i].child[0].bmiRange;
          if (range) {
            const bmi = await getBmi(data[i], i, query, replacements);
            result.push(bmi.data);
            query = bmi.query;
            replacements = {
              ...replacements,
              ...bmi.replacements,
            };
          }
        }
        if (i === data.length - 1) {
          var countryQueryResult = await queryExecuter(
            query,
            replacements,
            true,
          );
        }
      }
      resolve({ caseStudy: result, country: countryQueryResult });
    } catch (error) {
      console.error('-------Error at getFeasibilityDetails-----');
      console.error(error);
      reject(error);
    }
  });

const getIndication = (data, index, query, replacements) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.child.length > 0) {
        for (let i = 0; i < data.child.length; i++) {
          if (
            data.child[i].condition === APP_CONST.INDICATION_DIAGNOSED ||
            data.child[i].condition === APP_CONST.INDICATION_RECOVERED
          ) {
            if (i > 0) {
              query = query.slice(0, -1);
            }
            let columnName, value, period;
            if (data.child[i].condition === APP_CONST.INDICATION_RECOVERED) {
              columnName = APP_CONST.RECOVERY_DATE_COL;
              period = data.child[i].recovered.period;
              value = data.child[i].recovered.value;
            } else if (
              data.child[i].condition === APP_CONST.INDICATION_DIAGNOSED
            ) {
              columnName = APP_CONST.DIAGNOSIS_DATE_COL;
              period = data.child[i].diagnosed.period;
              value = data.child[i].diagnosed.value;
            }
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            replacements = {
              ...replacements,
              [`PatientCondition_date_${randomNum}_${index}_${i}`]:
                calculateDate(value, period),
            };

            query = formatWithCondition(
              data.child[i].operation,
              query,
              data.child[i].condition,
            );

            query = `${query} "${columnName}" < :PatientCondition_date_${randomNum}_${index}_${i})`;

            // if (period === APP_CONST.MONTH_PERIOD) {
            //   query = `${query} EXTRACT(YEAR FROM AGE(CAST("${columnName}" as date))) * 12 + EXTRACT(MONTH FROM AGE(CAST("${columnName}" as date))) > :PatientCondition_date_${randomNum}_${index}_${i})`;
            // }
            // if (period === APP_CONST.YEAR_PERIOD) {
            //   query = `${query} EXTRACT(YEAR FROM AGE(CAST("${columnName}" as date))) > :PatientCondition_date_${randomNum}_${index}_${i})`;
            // }
            // if (period === APP_CONST.DAY_PERIOD) {
            //   query = `${query} current_date - "${columnName}"::date > :PatientCondition_date_${randomNum}_${index}_${i})`;
            // }
            if (data.child[i].operation === APP_CONST.BUT_NOT_CONDITION) {
              query = `${query} )`;
            }

            if (!data?.child[i]?.count) {
              data.child[i]['count'] = await queryExecuter(query, replacements);
            }

            if (data.child[i].child.length > 0) {
              const indObj = await getIndication(
                data.child[i],
                i,
                query.substring(0, query.length - 1),
                replacements,
              );
              query = indObj.query;
              replacements = { ...replacements, ...indObj.replacements };
            }
          } else if (data.child[i].condition === APP_CONST.SEVERITY) {
            if (i > 0) {
              query = query.slice(0, -1);
            }
            query = formatWithCondition(
              data.child[i].operation,
              query,
              data.child[i].condition,
            );
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            replacements = {
              ...replacements,
              [`PatientCondition_Severity_${randomNum}_${index}_${i}`]:
                data.child[i].severity.stage,
            };
            if (data.child[i].operation === APP_CONST.BUT_NOT_CONDITION) {
              query = `${query} "${APP_CONST.SEVERITY_COL}" <> :PatientCondition_Severity_${randomNum}_${index}_${i})`;
            } else {
              query = `${query} "${APP_CONST.SEVERITY_COL}" = :PatientCondition_Severity_${randomNum}_${index}_${i})`;
            }
            console.log(query);
            if (!data?.child[i]?.count) {
              data.child[i]['count'] = await queryExecuter(query, replacements);
            }
          } else {
            console.log(`${data.child[i].condition} is not valid for now`);
          }
        }
      }
      resolve({ data, query, replacements });
    } catch (error) {
      console.error('-------Error at getIndication-----');
      console.error(error);
      reject(error);
    }
  });

const getDemographics = async (data, index, query, replacements) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data?.child?.length > 0) {
        const demographics = data.child;
        const gender = demographics.find((a) => {
          return a.condition === APP_CONST.GENDER;
        })?.gender;

        const ageRange = demographics.find((a) => {
          return a.condition === APP_CONST.AGE_RANGE;
        })?.ageRange;

        if (gender !== '' || ageRange?.min !== 0 || ageRange?.max !== 0) {
          const dGraphic = data;
          if (dGraphic.condition === APP_CONST.INCLUSION) {
            query = `${query} AND "Id" IN (`;
          } else {
            query = `${query} AND "Id" NOT IN (`;
          }
          query = `${query} SELECT  "Id" FROM "${APP_CONST.USERS_TABLE}" WHERE`;
          for (let i = 0; i < demographics.length; i++) {
            if (
              demographics[i].condition === APP_CONST.GENDER &&
              gender !== ''
            ) {
              replacements = {
                ...replacements,
                [`demographics_users_gender_${index}_${i}`]: gender.split(','),
              };
              query = demographicQueryModifier(i, demographics, query);
              query = `${query} "Gender" in (:demographics_users_gender_${index}_${i}) )`;
              if (!demographics[i]?.count) {
                demographics[i]['count'] = await queryExecuter(
                  query,
                  replacements,
                );
              }
            } else if (
              demographics[i].condition === APP_CONST.AGE_RANGE &&
              (ageRange?.min !== 0 || ageRange?.max !== 0)
            ) {
              replacements = {
                ...replacements,
                [`demographics_Users_Age_min_${index}_${i}`]: ageRange?.min,
                [`demographics_Users_Age_max_${index}_${i}`]: ageRange?.max,
              };

              query = demographicQueryModifier(i, demographics, query);

              query = `${query} EXTRACT(YEAR FROM AGE(CAST("Dob" as date)))  > :demographics_Users_Age_min_${index}_${i}
              and  EXTRACT(YEAR FROM AGE(CAST("Dob" as date))) < :demographics_Users_Age_max_${index}_${i} )`;
              if (!demographics[i]?.count) {
                demographics[i]['count'] = await queryExecuter(
                  query,
                  replacements,
                );
              }
            }
          }
        }
      }

      resolve({ data, query, replacements });
    } catch (error) {
      console.error('-------Error at getDemographics-----');
      console.error(error);
      reject(error);
    }
  });

const getMedication = async (data, index, query, replacements) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.condition === APP_CONST.INCLUSION) {
        query = `${query} "${APP_CONST.ID_COL}" IN`;
      } else {
        query = `${query} "${APP_CONST.ID_COL}" NOT IN`;
      }
      query = `${query} (SELECT DISTINCT "${APP_CONST.PATIENT_ID_COL}" from "${APP_CONST.MEDICATION_TABLE}" where "${APP_CONST.NAME_COL}" = :Medication_Name_${index}`;
      replacements = {
        ...replacements,
        [`Medication_Name_${index}`]: data.caseName,
      };
      for (let i = 0; i < data.child.length; i++) {
        if (data.child[i].condition === APP_CONST.DOSAGE) {
          if (data.child[i].operation === APP_CONST.AND_CONDITION) {
            query = `${query} AND `;
          } else if (data.child[i].operation === APP_CONST.OR_CONDITION) {
            query = `${query} OR `;
          } else if (data.child[i].operation === APP_CONST.BUT_NOT_CONDITION) {
            query = `${query} AND "${APP_CONST.PATIENT_ID_COL}" NOT IN (SELECT DISTINCT "${APP_CONST.PATIENT_ID_COL}" FROM "${APP_CONST.MEDICATION_TABLE}" WHERE`;
          }
          if (data.child[i].dosage.level === 'Higher than') {
            query = `${query} "Dosage" > :Dosage_${index}_${i} and "DosageUnit" = :DosageUnit_${index}_${i}) `;
          } else if (data.child[i].dosage.level === 'Lower than') {
            query = `${query} "Dosage" < :Dosage_${index}_${i} and "DosageUnit" = :DosageUnit_${index}_${i}) `;
          } else {
            query = `${query} "Dosage" = :Dosage_${index}_${i} and "DosageUnit" = :DosageUnit_${index}_${i}) `;
          }
          replacements = {
            ...replacements,
            [`Dosage_${index}_${i}`]: data.child[i].dosage.dosage,
            [`DosageUnit_${index}_${i}`]: data.child[i].dosage.unit,
          };
          if (!data?.child[i]?.count) {
            data.child[i]['count'] = await queryExecuter(query, replacements);
          }
        } else if (data.child[i].condition === APP_CONST.STARTED) {
          const { value, period } = data.child[i].started;
          replacements = {
            ...replacements,
            [`Start_${index}_${i}`]: calculateDate(value, period),
          };

          if (data.child[i].operation === APP_CONST.AND_CONDITION) {
            query = `${query} AND  "${APP_CONST.START_DATE_COL}" < :Start_${index}_${i})  `;
          } else if (data.child[i].operation === APP_CONST.OR_CONDITION) {
            query = `${query} OR  "${APP_CONST.START_DATE_COL}" < :Start_${index}_${i})  `;
          } else if (data.child[i].operation === APP_CONST.BUT_NOT_CONDITION) {
            query = `${query} AND  "${APP_CONST.START_DATE_COL}" > :Start_${index}_${i}) `;
          }

          if (!data?.child[i]?.count) {
            data.child[i]['count'] = await queryExecuter(query, replacements);
          }
        }
      }
      resolve({ data, query, replacements });
    } catch (error) {
      console.error('-------Error at getMedication-----');
      console.error(error);
      reject(error);
    }
  });

const getBmi = async (data, i, query, replacements) =>
  new Promise(async (resolve, reject) => {
    const { bmiRange, count } = data.child[0];
    if (data.condition === APP_CONST.INCLUSION) {
      query = `${query} AND "Id" IN (`;
    } else {
      query = `${query} AND "Id" NOT IN (`;
    }

    if (bmiRange) {
      query = `${query} SELECT DISTINCT "${APP_CONST.ID_COL}" FROM "${APP_CONST.PATIENTS_TABLE}" WHERE "${APP_CONST.BMI_COL}"`;
      if (bmiRange === APP_CONST.UNDER_WEIGHT) {
        query = `${query} ${APP_CONST.LESS_THAN} :PatientCondition_Bmi_Range_${i})`;
        replacements = {
          ...replacements,
          [`PatientCondition_Bmi_Range_${i}`]: APP_CONST.UNDER_WEIGHT_VALUE,
        };
      }

      if (
        bmiRange === APP_CONST.NORMAL_WEIGHT ||
        bmiRange === APP_CONST.OVER_WEIGHT
      ) {
        query = `${query} ${APP_CONST.BETWEEN_CONDITION} :PatientCondition_Bmi_Range_From_${i} ${APP_CONST.AND_CONDITION} :PatientCondition_Bmi_Range_To_${i})`;
        const from =
          bmiRange === APP_CONST.NORMAL_WEIGHT
            ? APP_CONST.UNDER_WEIGHT_VALUE
            : APP_CONST.OVER_WEIGHT_FROM_VALUE;
        const to =
          bmiRange === APP_CONST.NORMAL_WEIGHT
            ? APP_CONST.NORMAL_WEIGHT_TO_VALUE
            : APP_CONST.OVER_WEIGHT_TO_VALUE;
        replacements = {
          ...replacements,
          [`PatientCondition_Bmi_Range_From_${i}`]: from,
          [`PatientCondition_Bmi_Range_To_${i}`]: to,
        };
      }

      if (bmiRange === APP_CONST.OBESITY) {
        query = `${query} ${APP_CONST.GREATER_THAN_EQUAL_TO} :PatientCondition_Bmi_Range_${i})`;
        replacements = {
          ...replacements,
          [`PatientCondition_Bmi_Range_${i}`]: APP_CONST.OBESITY_VALUE,
        };
      }
    }

    if (!count) {
      data.child[0]['count'] = await queryExecuter(query, replacements);
    }
    resolve({ data, query, replacements });
  });
const getWeight = async (data, i, query, replacements) =>
  new Promise(async (resolve, reject) => {
    const { max, min, range, count } = data.child[0].weightRange;
    if (data.condition === APP_CONST.INCLUSION) {
      query = `${query} AND "Id" IN (`;
    } else {
      query = `${query} AND "Id" NOT IN (`;
    }

    if (max && min) {
      query = `${query} SELECT DISTINCT "${APP_CONST.ID_COL}" FROM "${APP_CONST.PATIENTS_TABLE}" WHERE "${APP_CONST.WEIGTH_COL}" ${APP_CONST.BETWEEN_CONDITION} :PatientCondition_Weight_Min_${i} ${APP_CONST.AND_CONDITION} :PatientCondition_Weight_Max_${i})`;
      replacements = {
        ...replacements,
        [`PatientCondition_Weight_Max_${i}`]: max,
        [`PatientCondition_Weight_Min_${i}`]: min,
      };
    }

    if (max && !min) {
      query = `${query} SELECT DISTINCT "${APP_CONST.ID_COL}" FROM "${APP_CONST.PATIENTS_TABLE}" WHERE "${APP_CONST.WEIGTH_COL}" ${APP_CONST.GREATER_THAN_EQUAL_TO} :PatientCondition_Weight_Max_${i})`;
      replacements = {
        ...replacements,
        [`PatientCondition_Weight_Max_${i}`]: max,
      };
    }

    if (!max && min) {
      if (max && !min) {
        query = `${query} SELECT DISTINCT "${APP_CONST.ID_COL}" FROM "${APP_CONST.PATIENTS_TABLE}" WHERE "${APP_CONST.WEIGTH_COL}" ${APP_CONST.LESS_THAN_EQUAL_TO} :PatientCondition_Weight_Min_${i})`;
        replacements = {
          ...replacements,
          [`PatientCondition_Weight_Min_${i}`]: min,
        };
      }
    }

    if (!count) {
      data.child[0]['count'] = await queryExecuter(query, replacements);
    }
    resolve({ data, query, replacements });
  });
/*
Created common function to execute query by group and return data
*/

const queryExecuter = async (queryStr, replacements, countryGroup = false) => {
  try {
    const result = await getSequlize().query(
      `${queryStr} GROUP BY "${APP_CONST.COUNTRY_COL}"`,
      {
        replacements,
        type: QueryTypes.SELECT,
      },
    );
    return countryGroup
      ? result
      : result.reduce((prev, next) => prev + parseInt(next.count), 0);
  } catch (error) {
    console.log(`Query exe err->`);
    console.log(error.message);
    console.log(error.sql);
  }
};

const getFeasibilityStudyPatientCount = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const count = await getModelByName(`${APP_CONST.PATIENTS_TABLE}`).count({
        where: data,
      });
      resolve({ count });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

module.exports = { getFeasibilityDetails, getFeasibilityStudyPatientCount };

/*
demographicQueryModifier function to remove 
last char and add AND condition
to generate the demographic query
*/

function demographicQueryModifier(i, demographics, query) {
  if (
    i === 1 &&
    ((demographics[1].condition === APP_CONST.AGE_RANGE &&
      demographics[0].gender !== '') ||
      (demographics[1].condition === APP_CONST.GENDER &&
        (demographics[0].ageRange?.min !== 0 ||
          demographics[0].ageRange?.max !== 0)))
  ) {
    query = `${query.substring(0, query.length - 1)} AND`;
  }
  return query;
}

function formatWithCondition(operation, query, condition) {
  if (
    operation === APP_CONST.AND_CONDITION ||
    (operation === APP_CONST.BUT_NOT_CONDITION &&
      condition === APP_CONST.SEVERITY)
  ) {
    return `${query} AND `;
  }
  if (operation === APP_CONST.OR_CONDITION) {
    return `${query} OR `;
  }
  if (
    operation === APP_CONST.BUT_NOT_CONDITION &&
    (condition === APP_CONST.INDICATION_DIAGNOSED ||
      condition === APP_CONST.INDICATION_RECOVERED)
  ) {
    return `${query} AND "${APP_CONST.PATIENT_ID_COL}" NOT IN (SELECT DISTINCT "${APP_CONST.PATIENT_ID_COL}" FROM "${APP_CONST.PATIENT_CONSITION_TABLE}" WHERE`;
  }
}

const calculateDate = (range, type) => {
  var date = new Date();
  if (type === APP_CONST.MONTH_PERIOD) {
    return new Date(date.setMonth(date.getMonth() - range));
  } else if (type === APP_CONST.YEAR_PERIOD) {
    return new Date(date.setFullYear(date.getFullYear() - range));
  } else {
    return new Date(date.setDate(date.getDate() - range));
  }
};
