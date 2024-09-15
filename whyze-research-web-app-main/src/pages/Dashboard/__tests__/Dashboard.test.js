import React from 'react';
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from '@testing-library/react';
import Dashboard from '..';
const mockedUsedNavigate = jest.fn();
import Store from '../../../redux/store';
import { Provider } from 'react-redux';
import {
  activeTrials,
  avgTimeLable,
  avgTimeToRecruit,
  countriesLable,
  createFirstStudy,
  createFirstStudyContent,
  patientstitleLable,
  screenFailRate,
  sitesLable,
  sitesRecruitedLable,
  threeMonths,
  totalPatientsLable,
  totalTrials,
  trialsLable,
  welComeComponentContent,
} from '../../../constant/ConstantTexts';
import { BrowserRouter } from 'react-router-dom';
import { setProjects } from '../../../redux/reducer/projectsReducer';
import ApiUtil from '../../../utils/ApiUtils';
import { dashboardApiUrls } from '../../../constant/ApiEndPoints';
import ProjectLayout from '../ProjectLayout';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('axios');
jest.mock('../../../utils/ApiUtils');

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={Store}>{element}</Provider>,
  );
  return { container, Store, getByText };
}

describe('Test case for Dashbaord', () => {
  test('Dashboard render check', () => {
    const { container } = renderWithContext(<Dashboard />);
    expect(container).toMatchSnapshot();
  });
  test('Dashboard check UI components', () => {
    const { container } = renderWithContext(<Dashboard />);
    const patientsLogo = container.getElementsByClassName(
      'dashboard-patient-icon',
    );
    const dashboardTitle = container.getElementsByClassName('dashboard-title');
    const dashboardContentText = container.getElementsByClassName(
      'dashboard-content-text',
    );
    const patientTitle = container.getElementsByClassName(
      'dashboard-patient-text',
    );
    const totalPatients = container.getElementsByClassName(
      'dashboard-patient-total',
    );
    const totalPatientsText = container.getElementsByClassName(
      'dashboard-patient-total-text',
    );
    const countriesText = container.getElementsByClassName(
      'dashboard-patient-total-text',
    );
    const sitesLogo = container.getElementsByClassName('dashboard-sites-icon"');
    const sitesTitle = container.getElementsByClassName(
      'dashboard-patient-text',
    );
    const sitesRecruitedLableText = container.getElementsByClassName(
      'dashboard-patient-total-text',
    );
    const trialsTitle = container.getElementsByClassName(
      'dashboard-patient-text',
    );
    const trialsTimeTitle = container.getElementsByClassName(
      'dashboard-patient-total',
    );
    const trialsLableAndText = container.getElementsByClassName(
      'dashboard-patient-total-text',
    );
    const firstStudyTitle = container.getElementsByClassName('dashboard-title');
    const firstStudyTitleContent = container.getElementsByClassName(
      'dashboard-patient-study-content',
    );
    const letsgoButton = screen.getByRole('button');

    expect(patientsLogo).toBeDefined();
    expect(dashboardTitle.length).toBe(2);
    expect(dashboardContentText[0].textContent).toBe(welComeComponentContent);
    expect(patientTitle[0].textContent).toBe(patientstitleLable);
    expect(totalPatients[0].textContent).not.toBe('');
    expect(totalPatientsText[0].textContent).toBe(totalPatientsLable);
    expect(countriesText[1].textContent).toBe(countriesLable);
    expect(sitesLogo).toBeDefined();
    expect(sitesTitle[1].textContent).toBe(sitesLable);
    expect(sitesRecruitedLableText[2].textContent).toBe(sitesRecruitedLable);
    expect(sitesRecruitedLableText[3].textContent).toBe(avgTimeLable);
    expect(trialsTitle[2].textContent).toBe(trialsLable);
    expect(trialsLableAndText[4].textContent).toBe(activeTrials);
    expect(trialsLableAndText[5].textContent).toBe(totalTrials);
    expect(trialsLableAndText[6].textContent).toBe(screenFailRate);
    expect(trialsTimeTitle[7].textContent).toBe(threeMonths);
    expect(trialsLableAndText[7].textContent).toBe(avgTimeToRecruit);
    expect(firstStudyTitle[1].textContent).toBe(createFirstStudy);
    expect(firstStudyTitleContent[0].textContent).toBe(createFirstStudyContent);
    expect(letsgoButton).toBeInTheDocument();
  });
  test('Feasibility navigation', () => {
    renderWithContext(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/new-feasibility-study');
  });

  test('Update store to test rendering projects component', () => {
    const { Store } = renderWithContext(<Dashboard />);
    const projectData = [];

    act(() => {
      projectData.push({
        clientName: 'test',
        description: 'test test',
        feasibilityStudy: [
          {
            id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
            projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
            isDone: false,
            feasibilityStudy: [
              {
                name: 'Indication',
                case: 'Indication',
                condition: 'Inclusion',
                caseName: 'Covid-19',
                child: [],
              },
              {
                name: 'Demographics',
                case: 'Demographics',
                condition: 'Inclusion',
                caseName: '',
                child: [
                  {
                    condition: 'Gender',
                    field: 'gender',
                    gender: '',
                  },
                  {
                    condition: 'Age range',
                    field: 'age',
                    ageRange: {
                      min: 0,
                      max: 0,
                    },
                  },
                ],
              },
            ],
            location: null,
            sitesContacted: null,
            sitesInitiated: null,
            preferredSites: null,
            sites: null,
            finalCount: 123,
          },
        ],
        id: 'e3653f73-e486-456b-9ba2-1e5421026175',
        isFavourite: false,
        patientSegmentReqiured: 123,
        projectName: 'test',
        userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
      });
      Store.dispatch(setProjects(projectData));
    });
  });
  test('Projects component', async () => {
    const { container, Store } = renderWithContext(<Dashboard />);

    const { projects } = JSON.parse(
      JSON.stringify(Store.getState().projectReducer),
    );
    expect(projects.length).toBe(1);

    const dashboardProjectComponent = container.getElementsByClassName(
      'dashboard-projects-list',
    );
    expect(dashboardProjectComponent).toHaveLength(1);
  });
});

describe('Test case for Use Dashbaord', () => {
  test('get Projects', async () => {
    renderWithContext(<Dashboard />);
    ApiUtil.postData.mockResolvedValue({
      data: [
        {
          clientName: 'test',
          description: 'test test',
          feasibilityStudy: [
            {
              id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
              projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
              isDone: false,
              feasibilityStudy: [
                {
                  name: 'Indication',
                  case: 'Indication',
                  condition: 'Inclusion',
                  caseName: 'Covid-19',
                  child: [],
                },
                {
                  name: 'Demographics',
                  case: 'Demographics',
                  condition: 'Inclusion',
                  caseName: '',
                  child: [
                    {
                      condition: 'Gender',
                      field: 'gender',
                      gender: '',
                    },
                    {
                      condition: 'Age range',
                      field: 'age',
                      ageRange: {
                        min: 0,
                        max: 0,
                      },
                    },
                  ],
                },
              ],
              location: null,
              sitesContacted: null,
              sitesInitiated: null,
              preferredSites: null,
              sites: null,
              finalCount: 123,
            },
          ],
          id: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isFavourite: false,
          patientSegmentReqiured: 123,
          projectName: 'test',
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
        {
          clientName: 'test',
          description: 'test test',
          feasibilityStudy: [
            {
              id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
              projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
              isDone: false,
              feasibilityStudy: [
                {
                  name: 'Indication',
                  case: 'Indication',
                  condition: 'Inclusion',
                  caseName: 'Covid-19',
                  child: [],
                },
                {
                  name: 'Demographics',
                  case: 'Demographics',
                  condition: 'Inclusion',
                  caseName: '',
                  child: [
                    {
                      condition: 'Gender',
                      field: 'gender',
                      gender: '',
                    },
                    {
                      condition: 'Age range',
                      field: 'age',
                      ageRange: {
                        min: 0,
                        max: 0,
                      },
                    },
                  ],
                },
              ],
              location: null,
              sitesContacted: null,
              sitesInitiated: null,
              preferredSites: null,
              sites: null,
              finalCount: 123,
            },
          ],
          id: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isFavourite: false,
          patientSegmentReqiured: 123,
          projectName: 'test',
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
        {
          clientName: 'test',
          description: 'test test',
          feasibilityStudy: [
            {
              id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
              projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
              isDone: false,
              feasibilityStudy: [
                {
                  name: 'Indication',
                  case: 'Indication',
                  condition: 'Inclusion',
                  caseName: 'Covid-19',
                  child: [],
                },
                {
                  name: 'Demographics',
                  case: 'Demographics',
                  condition: 'Inclusion',
                  caseName: '',
                  child: [
                    {
                      condition: 'Gender',
                      field: 'gender',
                      gender: '',
                    },
                    {
                      condition: 'Age range',
                      field: 'age',
                      ageRange: {
                        min: 0,
                        max: 0,
                      },
                    },
                  ],
                },
              ],
              location: null,
              sitesContacted: null,
              sitesInitiated: null,
              preferredSites: null,
              sites: null,
              finalCount: 123,
            },
          ],
          id: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isFavourite: false,
          patientSegmentReqiured: 123,
          projectName: 'test',
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
        {
          clientName: 'test',
          description: 'test test',
          feasibilityStudy: [
            {
              id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
              projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
              isDone: false,
              feasibilityStudy: [
                {
                  name: 'Indication',
                  case: 'Indication',
                  condition: 'Inclusion',
                  caseName: 'Covid-19',
                  child: [],
                },
                {
                  name: 'Demographics',
                  case: 'Demographics',
                  condition: 'Inclusion',
                  caseName: '',
                  child: [
                    {
                      condition: 'Gender',
                      field: 'gender',
                      gender: '',
                    },
                    {
                      condition: 'Age range',
                      field: 'age',
                      ageRange: {
                        min: 0,
                        max: 0,
                      },
                    },
                  ],
                },
              ],
              location: null,
              sitesContacted: null,
              sitesInitiated: null,
              preferredSites: null,
              sites: null,
              finalCount: 123,
            },
          ],
          id: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isFavourite: false,
          patientSegmentReqiured: 123,
          projectName: 'test',
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
        {
          clientName: 'test',
          description: 'test test',
          feasibilityStudy: [
            {
              id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
              projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
              isDone: false,
              feasibilityStudy: [
                {
                  name: 'Indication',
                  case: 'Indication',
                  condition: 'Inclusion',
                  caseName: 'Covid-19',
                  child: [],
                },
                {
                  name: 'Demographics',
                  case: 'Demographics',
                  condition: 'Inclusion',
                  caseName: '',
                  child: [
                    {
                      condition: 'Gender',
                      field: 'gender',
                      gender: '',
                    },
                    {
                      condition: 'Age range',
                      field: 'age',
                      ageRange: {
                        min: 0,
                        max: 0,
                      },
                    },
                  ],
                },
              ],
              location: null,
              sitesContacted: null,
              sitesInitiated: null,
              preferredSites: null,
              sites: null,
              finalCount: 123,
            },
          ],
          id: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isFavourite: false,
          patientSegmentReqiured: 123,
          projectName: 'test',
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
        {
          clientName: 'test',
          description: 'test test',
          feasibilityStudy: [
            {
              id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
              projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
              isDone: false,
              feasibilityStudy: [
                {
                  name: 'Indication',
                  case: 'Indication',
                  condition: 'Inclusion',
                  caseName: 'Covid-19',
                  child: [],
                },
                {
                  name: 'Demographics',
                  case: 'Demographics',
                  condition: 'Inclusion',
                  caseName: '',
                  child: [
                    {
                      condition: 'Gender',
                      field: 'gender',
                      gender: '',
                    },
                    {
                      condition: 'Age range',
                      field: 'age',
                      ageRange: {
                        min: 0,
                        max: 0,
                      },
                    },
                  ],
                },
              ],
              location: null,
              sitesContacted: null,
              sitesInitiated: null,
              preferredSites: null,
              sites: null,
              finalCount: 123,
            },
          ],
          id: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isFavourite: false,
          patientSegmentReqiured: 123,
          projectName: 'test',
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
      ],
    });
    await waitFor(() => {
      expect(ApiUtil.postData).toHaveBeenCalledWith(
        `${dashboardApiUrls.projectUrl}`,
        {
          userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
        },
      );
      expect(ApiUtil.postData).toHaveBeenCalledTimes(1);
      const { segments } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      expect(segments.length).toBeGreaterThan(0);
    });
  });

  test('get Projects by id', async () => {
    const data = {
      clientName: 'test',
      description: 'test test',
      feasibilityStudy: [
        {
          id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
          projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isDone: false,
          feasibilityStudy: [
            {
              name: 'Indication',
              case: 'Indication',
              condition: 'Inclusion',
              caseName: 'Covid-19',
              child: [],
            },
            {
              name: 'Demographics',
              case: 'Demographics',
              condition: 'Inclusion',
              caseName: '',
              child: [
                {
                  condition: 'Gender',
                  field: 'gender',
                  gender: '',
                },
                {
                  condition: 'Age range',
                  field: 'age',
                  ageRange: {
                    min: 0,
                    max: 0,
                  },
                },
              ],
            },
          ],
          location: null,
          sitesContacted: null,
          sitesInitiated: null,
          preferredSites: null,
          sites: null,
          finalCount: 123,
        },
      ],
      id: 'e3653f73-e486-456b-9ba2-1e5421026175',
      isFavourite: false,
      patientSegmentReqiured: 123,
      projectName: 'test',
      userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
    };
    const { container } = renderWithContext(
      <ProjectLayout project={data} currentIndex={0} />,
    );
    const projectTitle = container.getElementsByClassName(
      'project-layout-indication-title',
    );
    expect(projectTitle[0].textContent).toBe('Covid-19');
    fireEvent.click(projectTitle[0]);
    ApiUtil.getData.mockResolvedValue({
      data: {
        clientName: 'test',
        description: 'test test',
        feasibilityStudy: [
          {
            id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
            projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
            isDone: false,
            feasibilityStudy: [
              {
                name: 'Indication',
                case: 'Indication',
                condition: 'Inclusion',
                caseName: 'Covid-19',
                child: [],
              },
              {
                name: 'Demographics',
                case: 'Demographics',
                condition: 'Inclusion',
                caseName: '',
                child: [
                  {
                    condition: 'Gender',
                    field: 'gender',
                    gender: '',
                  },
                  {
                    condition: 'Age range',
                    field: 'age',
                    ageRange: {
                      min: 0,
                      max: 0,
                    },
                  },
                ],
              },
            ],
            location: null,
            sitesContacted: null,
            sitesInitiated: null,
            preferredSites: null,
            sites: null,
            finalCount: 123,
          },
        ],
        id: 'e3653f73-e486-456b-9ba2-1e5421026175',
        isFavourite: false,
        patientSegmentReqiured: 123,
        projectName: 'test',
        userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
      },
    });
    await waitFor(() => {
      expect(ApiUtil.getData).toHaveBeenCalledWith(
        `${dashboardApiUrls.projectUrl}/e3653f73-e486-456b-9ba2-1e5421026175`,
      );
      expect(ApiUtil.getData).toHaveBeenCalledTimes(1);
      const { segments } = JSON.parse(
        JSON.stringify(Store.getState().feasibilityStudyReducer),
      );
      expect(segments.length).toBeGreaterThan(0);
    });
  });

  test('Render check', async () => {
    const data = {
      clientName: 'test',
      description: 'test test',
      feasibilityStudy: [
        {
          id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
          projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isDone: false,
          feasibilityStudy: [
            {
              name: 'Indication',
              case: 'Indication',
              condition: 'Inclusion',
              caseName: 'Covid-19',
              child: [],
            },
            {
              name: 'Demographics',
              case: 'Demographics',
              condition: 'Inclusion',
              caseName: '',
              child: [
                {
                  condition: 'Gender',
                  field: 'gender',
                  gender: '',
                },
                {
                  condition: 'Age range',
                  field: 'age',
                  ageRange: {
                    min: 0,
                    max: 0,
                  },
                },
              ],
            },
          ],
          location: null,
          sitesContacted: null,
          sitesInitiated: null,
          preferredSites: null,
          sites: null,
          finalCount: 123,
        },
      ],
      id: 'e3653f73-e486-456b-9ba2-1e5421026175',
      isFavourite: false,
      patientSegmentReqiured: 123,
      projectName: 'test',
      userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
    };
    const { container } = renderWithContext(
      <ProjectLayout project={data} currentIndex={0} />,
    );
    const projectTitle = container.getElementsByClassName(
      'project-layout-indication-title',
    );
    const starElement = container.getElementsByClassName(
      'project-layout-favourite',
    );
    expect(projectTitle[0].textContent).toBe('Covid-19');
    userEvent.click(starElement[0]);
    const { projects } = JSON.parse(
      JSON.stringify(Store.getState().projectReducer),
    );
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].isFavourite).toBe(true);
  });
  test(' icon', () => {
    const data = {
      clientName: 'test',
      description: 'test test',
      feasibilityStudy: [
        {
          id: 'bfb1e873-755b-4ab7-9aa5-3ad4ec9a0dbb',
          projectId: 'e3653f73-e486-456b-9ba2-1e5421026175',
          isDone: false,
          feasibilityStudy: [
            {
              name: 'Indication',
              case: 'Indication',
              condition: 'Inclusion',
              caseName: 'Covid-19',
              child: [],
            },
            {
              name: 'Demographics',
              case: 'Demographics',
              condition: 'Inclusion',
              caseName: '',
              child: [
                {
                  condition: 'Gender',
                  field: 'gender',
                  gender: '',
                },
                {
                  condition: 'Age range',
                  field: 'age',
                  ageRange: {
                    min: 0,
                    max: 0,
                  },
                },
              ],
            },
          ],
          location: null,
          sitesContacted: null,
          sitesInitiated: null,
          preferredSites: null,
          sites: null,
          finalCount: 123,
        },
      ],
      id: 'e3653f73-e486-456b-9ba2-1e5421026175',
      isFavourite: true,
      patientSegmentReqiured: 123,
      projectName: 'test',
      userId: '0005a35c-b4b1-4fd4-bbd5-ab3e809e8b4e',
    };
    const { container } = renderWithContext(
      <ProjectLayout project={data} currentIndex={0} />,
    );
    const starElement = container.getElementsByClassName(
      'project-layout-favourite',
    );
    userEvent.click(starElement[0]);
    const { projects } = JSON.parse(
      JSON.stringify(Store.getState().projectReducer),
    );
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].isFavourite).toBe(false);
  });
});
