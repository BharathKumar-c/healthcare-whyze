module.exports = {
  paths: {
    '/patient/v2/vaccine/master': {
      get: {
        tags: ['Patient App Vaccines'],
        summary: 'To get the list of all vaccines from master table',
        description:
          'To get the list of all vaccines from master table and if you wants to get the list of all vaccines from master table by condition, you need to pass conditions in parameters.',
        reference: 'ListOfVaccines',
        parameters: [
          {
            in: 'query',
            name: 'condition',
            required: true,
            description:
              'Query for vaccines by condition (Ex: condition=covid)',
            schema: {
              type: 'string',
              example: 'covid',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ListOfVaccines',
            },
          },
          400: {
            description: 'Invalid status value',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        tags: ['Patient App Vaccines'],
        summary: 'To create vaccines',
        description: 'Create vaccines',
        reference: 'PostVaccines',

        requestBody: {
          description: 'Vaccines that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PostVaccines',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'success',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'covisheild is already exists',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    // '/patient/v2/vaccine/master/{conditionId}': {
    //   get: {
    //     tags: ['Patient App Vaccines'],
    //     summary:
    //       'To get the list of all vaccines from master table based on the selected condition',
    //     description:
    //       'To get the list of all vaccines from master table based on the  selected condition',
    //     reference: 'ListOfVaccines',
    // parameters: [
    //   {
    //     in: 'path',
    //     name: 'conditionId',
    //     description:
    //       'Query for vaccine by condition id (Ex: 63fc70978963608055a502a8)',
    //     required: true,
    //     schema: {
    //       type: 'string',
    //       example: '64194593fde1b3bf0414ccd7',
    //     },
    //   },
    // ],
    //     responses: {
    //       200: {
    //         description: 'success',
    //         schema: {
    //           $ref: '#/definitions/ListOfVaccines',
    //         },
    //       },
    //       400: {
    //         description: 'Invalid status value',
    //       },
    //       500: {
    //         description: 'Internal Server Error',
    //       },
    //     },
    //     security: [
    //       {
    //         patientstore_auth: ['write:patient', 'read:patient'],
    //       },
    //     ],
    //   },
    // },
    '/patient/v2/vaccine': {
      get: {
        tags: ['Patient App Vaccines'],
        summary: 'To get the list of patient added all vaccines',
        description:
          'To get the list of patient added all vaccines and if you wants to get the list of all patient added all vaccines by condition, you need to pass conditions in parameters.',
        reference: 'ListOfPatientVaccines',
        parameters: [
          {
            in: 'query',
            name: 'condition',
            description:
              'Query for vaccines by condition (Ex: condition=covid)',
            schema: {
              type: 'string',
              example: 'covid',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ListOfPatientVaccines',
            },
          },
          400: {
            description: 'Invalid status value',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        tags: ['Patient App Vaccines'],
        summary: 'To create or update patient added vaccines',
        description: 'Create or update patient added vaccines',
        reference: 'PostPatientVaccines',
        requestBody: {
          description: 'Vaccines that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PostPatientVaccines',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'success',
                },
              },
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'covid condition already exists',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    // '/patient/v2/vaccine/{conditionId}': {
    //   get: {
    //     tags: ['Patient App Vaccines'],
    //     summary:
    //       'To get the list of all vaccines from patient
    // added vaccines list based on the selected condition',
    //     description:
    //       'To get the list of all vaccines from patient
    // added vaccines list based on the  selected condition',
    //     reference: 'ListOfPatientVaccines',
    // parameters: [
    //   {
    //     in: 'path',
    //     name: 'conditionId',
    //     description:
    //       'Query for vaccine by condition id (Ex: 63fc70978963608055a502a8)',
    //     required: true,
    //     schema: {
    //       type: 'string',
    //       example: '64194593fde1b3bf0414ccd7',
    //     },
    //   },
    // ],
    //     responses: {
    //       200: {
    //         description: 'success',
    //         schema: {
    //           $ref: '#/definitions/ListOfPatientVaccines',
    //         },
    //       },
    //       400: {
    //         description: 'Invalid status value',
    //       },
    //       500: {
    //         description: 'Internal Server Error',
    //       },
    //     },
    //     security: [
    //       {
    //         patientstore_auth: ['write:patient', 'read:patient'],
    //       },
    //     ],
    //   },
    // },
    '/patient/v2/vaccine/{patient_vaccine_mapper_Id}': {
      put: {
        tags: ['Patient App Vaccines'],
        summary: 'Update the patient vaccines along with condtion',
        reference: 'PostPatientVaccines',
        description: 'Update the patient vaccines along with condtion',
        parameters: [
          {
            in: 'path',
            name: 'patient_vaccine_mapper_Id',
            description: 'ID of the patient_vaccine_mapper_Id need to be edit',
            schema: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
          },
        ],
        requestBody: {
          description: 'Vaccines that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PostPatientVaccines',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'success',
                },
              },
            },
          },
          400: {
            description: 'Invalid status value',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/vaccine/condition': {
      get: {
        tags: ['Patient App Vaccines'],
        summary: 'To get the list of vaccine condition',
        description: 'To get the list of vaccine condition.',
        reference: 'ListOfVaccinesConditions',
        parameters: [
          {
            in: 'query',
            name: 'condition',
            description: 'Query for condition (Ex: condition=covid)',
            schema: {
              type: 'string',
              example: 'covid',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ListOfVaccinesConditions',
            },
          },
          400: {
            description: 'Invalid status value',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
  definitions: {
    vaccinesData: {
      type: 'object',
      properties: {
        vaccine_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
          example: 'Moderna vaccine',
        },
        condition: {
          type: 'string',
          example: 'covid',
        },
      },
    },
    PostVaccines: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Moderna vaccine',
        },
        condition: {
          type: 'string',
          example: 'covid',
        },
      },
    },
    PostPatientVaccines: {
      type: 'object',
      properties: {
        condition: {
          type: 'string',
          example: 'covid',
        },
        vaccines: {
          type: 'array',
          items: {
            minItems: 1,
            properties: {
              _id: {
                type: 'string',
                example: '64214cde9de72af903aaa4fc',
              },
              name: {
                type: 'string',
                example: 'covid',
              },
              date: {
                type: 'string',
                example: '01/05/2019',
              },
            },
          },
        },
      },
    },
    ListOfVaccines: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: '#/definitions/vaccinesData',
          },
        },
      },
    },
    ListOfPatientVaccines: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            minItems: 1,
            type: 'object',
            properties: {
              patient_vaccine_mapper_id: {
                type: 'string',
                example: '64214cde9de72af903aaa4fc',
              },
              patient: {
                type: 'string',
                example: '64214cde9de72af903aaa4fc',
              },
              condition: {
                type: 'string',
                example: 'covid',
              },
              vaccines: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    example: '64214cde9de72af903aaa4fc',
                  },
                  name: {
                    type: 'string',
                    example: 'Moderna vaccine',
                  },
                  date: {
                    type: 'date',
                    example: '01/05/2019',
                  },
                },
              },
            },
          },
        },
      },
    },
    ListOfVaccinesConditions: {
      type: 'object',
      properties: {
        year: {
          type: 'array',
          example: ['covid'],
        },
      },
    },
    vaccineMaster: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Moderna vaccine',
        },
        condition: {
          type: 'string',
          example: 'covid',
        },
      },
      xml: {
        name: 'VaccineMaster',
      },
    },
    patientVaccineMapper: {
      type: 'object',
      properties: {
        patient: {
          type: 'string',
          example: 'uuid',
        },
        vaccine: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        condition: {
          type: 'string',
          format: 'covid',
        },
        date: {
          type: 'date',
          example: '01/05/2019',
        },
      },
      xml: {
        name: 'patientVaccineMapper',
      },
    },
  },
};
