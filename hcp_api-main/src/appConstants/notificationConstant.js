module.exports = {
  remainderNotification: {
    title: 'Whyzehealth Platform',
    body: "Don't forget to sign up for research! Log into Whyze to and update your research preferences now",
    data: { route: '/researchpreference-view' },
  },
  acceptInvition: {
    title: 'Whyze Health Platform',
    body: 'Your request was accepted, and you’ve been granted access to create Whyze account',
    data: { route: '/acceptLinkRequest-view' },
  },
  sendResearchInvite: {
    title: 'Whyze Health Platform',
    body: 'A new clinical trial that Dr {DoctorName} thinks you might be a good fit for has been released.',
    data: { route: '/about-the-trial', hcpId: '' },
  },
  sendEligibleNotification: {
    title: 'Whyze Health Platform',
    body: 'Congratulations! You are eligible for the {ClinicalName} Clinical Trial.',
    data: { route: '/eligiblefor-trial-view' },
  },
  sendEnrollingNotification: {
    title: 'Whyze Health Platform',
    body: 'Thanks for enrolling in the {ClinicalName}  Clinical Trial.',
    data: { route: '/enroll-for-trial-view' },
  },
};
