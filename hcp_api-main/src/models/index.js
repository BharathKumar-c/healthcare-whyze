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
const FamilyRealtionshipMaster = require('./familyRelationshipMaster');
const AddPatientFamilyHistory = require('./addPatientFamilyHistory');
const PatientHealthInsurance = require('./patientHealthInsurance');
const Faq = require('./faq');
const VaccineMaster = require('./vaccineMaster');
const PatientVaccineMapper = require('./patientVaccineMapper');
const PreferenceTenantMapper = require('./preferenceTenantMapper');
const CountryListMaster = require('./countryList');
const TherapeuticAreas = require('./therapeuticAreas');
const InviteResearchSites = require('./inviteResearchSites');
const LinkedAccounts = require('./linkedAccounts');
const AccessSettings = require('./accessSettings');
const TenantGroupMapper = require('./tenantGroupMapper');
const ClinicalTrialAppointment = require('./clinicalTrialAppointment');
const DoctorNotification = require('./doctorNotification');

module.exports = {
  Tenant,
  User,
  Invite,
  Patient,
  DietaryMaster,
  PatientAllergies,
  AddPatientFamilyHistory,
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
  CountryListMaster,
  TherapeuticAreas,
  InviteResearchSites,
  LinkedAccounts,
  AccessSettings,
  TenantGroupMapper,
  ClinicalTrialAppointment,
  DoctorNotification,
};
