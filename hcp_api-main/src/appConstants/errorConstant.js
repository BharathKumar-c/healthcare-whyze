const errorConstants = {
  emailAlreadyExists: 'Email already exists',
  correctEmailRequired: 'Please give correct Email',
  patientIdRequired: 'Patient ID is required',
  adminIdRequired: 'Admin ID is required',
  accountHasNotLinked: 'This account was not linked!',
  adminCanDelete: 'Admin only delete the account!',
  switcherAccountRequired: 'switch account is required',
  accountAlreadyLinked: 'This Account was already linked',
  accountLinkedAnotherOrganization:
    'This user account has already been linked to another organization',
  sameAccount: 'You Tried give access to your account',
  accountLinkedSameOrganization:
    'This user account has already been linked to same organization',
  accountAccessAlreadyRemoved:
    'User Account was not linked or already removed access!',
  emailWasNotFound: 'Email was not found!',
  givenNameNotMatched: 'The first name, last name or email was not matched.',
  patientIdNotFound: 'Patient id is not found!',
  someFieldAreMissing: 'Some fields are missing!',
  checkResearchId: 'Check your reasearch site id or appointment id',
  researchIdRequired: 'Research Id Required',
  invalidUser: 'Invalid user!',
};

module.exports = { errorConstants };
