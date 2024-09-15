const Tenant = require('./tenant');
const User = require('./user');
const Invite = require('./invite');
const Patient = require('./patient');
const DietaryMaster = require('./dietaryMaster');
const Appointments = require('./appointment');
const Preference = require('./preference');
const FcmToken = require('./fcmToken');
const PatientMedication = require('./patientMedication');
const HealthInsuranceMaster = require('./healthInsuranceMaster');
const HealthInsurancePlanMaster = require('./healthInsurancePlanMaster');
const MedicalCondition = require('./medicalCondition');
const CaseShema = require('./case');
const PatientDoctorMapper = require('./patientDoctorMapper');
const AllergiesMaster = require('./allergiesMaster');
const PatientAllergies = require('./patientAllergies');
const ReactionMaster = require('./reactionMaster');
const FamilyRealtionshipMaster = require('./familyRelationshipMaster');
const AddPatientFamilyHistory = require('./addPatientFamilyHistory');
const PatientHealthInsurance = require('./patientHealthInsurance');
const Faq = require('./faq');
const VaccineMaster = require('./vaccineMaster');
const PatientVaccineMapper = require('./patientVaccineMapper');
const PreferenceTenantMapper = require('./preferenceTenantMapper');

module.exports = {
  Tenant,
  User,
  Invite,
  Patient,
  DietaryMaster,
  PatientAllergies,
  AddPatientFamilyHistory,
  ReactionMaster,
  CaseShema,
  Faq,
  AllergiesMaster,
  FamilyRealtionshipMaster,
  Appointments,
  Preference,
  FcmToken,
  PatientMedication,
  HealthInsuranceMaster,
  HealthInsurancePlanMaster,
  MedicalCondition,
  PatientDoctorMapper,
  PatientHealthInsurance,
  VaccineMaster,
  PatientVaccineMapper,
  PreferenceTenantMapper,
};
