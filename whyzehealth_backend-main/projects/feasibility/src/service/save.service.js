var { getModels, getModelByName } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const saveFeasibilityStudy = (userId, projectData, feasibilityStudyData) =>
  new Promise((resolve, reject) => {
    const { Projects, FeasibilityStudy } = getModels();

    Projects.create({
      Id: uuidv4(),
      UserId: userId,
      ProjectName: projectData.projectName,
      ClientName: projectData.clientName,
      Description: projectData.description,
      IsFavourite: false,
      PatientSegmentReqiured: projectData.patientSegmentReqiured,
      CreatedBy: userId,
      UpdatedBy: userId,
    })
      .then(async(result) => {
        if (result.Id) {
          const ProjectId = result.Id;
          var feasibilityStudyDataArray = await feasibilityStudyData.map((obj)=>({
            Id:uuidv4(),
            ProjectId: ProjectId,
            Name: obj.name,
            IsDone: obj.isDone,
            FeasibilityStudy: obj.feasibilityStudy,
            // Location:obj.location,
            // SitesContacted: obj.sitesContacted,
            // SitesInitiated:obj.sitesInitiated,
            // PreferredSites: obj.preferredSites,
            // Sites: obj.sites,
            FinalCount: obj.finalCount,
            CreatedBy: userId,
            UpdatedBy: userId,
          }))
          return FeasibilityStudy.bulkCreate(feasibilityStudyDataArray)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err.message);
            });
        }
      })
      .catch((err) => {
        reject(err.message);
      });
  });

const formatFeasibiliStudy = (data) => {
  const newFeasibilityStudy = [];
  data.forEach((ele) => {
    newFeasibilityStudy.push({
      id: ele.Id,
      projectId: ele.ProjectId,
      isDone: ele.IsDone,
      feasibilityStudy: ele.FeasibilityStudy,
      location: ele.Location,
      sitesContacted: ele.SitesContacted,
      sitesInitiated: ele.SitesInitiated,
      preferredSites: ele.PreferredSites,
      sites: ele.Sites,
      finalCount: ele.FinalCount,
    });
  });

  return newFeasibilityStudy;
};

const getFeasibilityStudy = (UserId) =>
  new Promise((resolve, reject) => {
    const ProjectModel = getModelByName('Projects');
    const FeasibilityStudyModel = getModelByName('FeasibilityStudy');
    ProjectModel.findAll({
      where: { UserId },
      include: [FeasibilityStudyModel],
    })
      .then((result) => {
        const projects = [];
        result.forEach((ele) => {
          projects.push({
            id: ele.Id,
            userId: ele.UserId,
            projectName: ele.ProjectName,
            clientName: ele.ClientName,
            description: ele.Description,
            isFavourite: ele.IsFavourite,
            patientSegmentReqiured: ele.PatientSegmentReqiured,
            feasibilityStudy: formatFeasibiliStudy(ele.FeasibilityStudies),
            created: ele.created,
            updated: ele.updated,
          });
        });
        resolve(projects);
      })
      .catch((err) => reject(err.message));
  });

const getFeasibilityStudyById = (Id) =>
  new Promise((resolve, reject) => {
    const ProjectModel = getModelByName('Projects');
    const FeasibilityStudyModel = getModelByName('FeasibilityStudy');
    ProjectModel.findOne({
      where: { Id },
      include: [FeasibilityStudyModel],
    })
      .then((result) => {
        const project = {
          id: result.Id,
          userId: result.UserId,
          projectName: result.ProjectName,
          clientName: result.ClientName,
          description: result.Description,
          isFavourite: result.IsFavourite,
          patientSegmentReqiured: result.PatientSegmentReqiured,
          feasibilityStudy: formatFeasibiliStudy(result.FeasibilityStudies),
          created: result.created,
          updated: result.updated,
        };
        resolve(project);
      })
      .catch((err) => reject(err.message));
  });

module.exports = {
  saveFeasibilityStudy,
  getFeasibilityStudy,
  getFeasibilityStudyById,
};
