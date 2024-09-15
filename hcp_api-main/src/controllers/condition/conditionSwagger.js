module.exports = {
  paths: {
    '/patient/v2/condition': {
      get: {
        tags: ['Patient App Medical Condition'],
        summary: 'Get all my medication condition',
        description: 'Get all my medication condition',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ConditionList',
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
        tags: ['Patient App Medical Condition'],
        summary: 'To create my medical condition',
        description: 'Create medical condition',
        reference: 'PostCondition',

        requestBody: {
          description: 'Medication object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PostCondition',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
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
    '/patient/v2/condition/masterdata?name': {
      get: {
        tags: ['Patient App Medical Condition'],
        summary: 'To get the list of all condition by name',
        description: 'To get the list of all condition upload by hcp ',
        reference: 'GetCondition',

        parameters: [
          {
            in: 'query',
            name: 'name',
            description: 'Query for condition name. (Ex: name=covid)',
            required: true,
            schema: {
              type: 'string',
              example: 'typhoid',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetCondition',
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
    '/patient/v2/condition/{id}': {
      get: {
        tags: ['Patient App Medical Condition'],
        summary: 'Get  my medication condition by id',
        description: 'Get my medication condition by id',
        reference: 'NotInTreatmentCondition',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description:
              'Query for my medication condition by id. (Ex: 64214cde9de72af903aaa4fc)',
            required: true,
            schema: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/NotInTreatmentCondition',
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
      put: {
        tags: ['Patient App Medical Condition'],
        summary: 'Update the condition along with related issues',
        reference: 'PutCondition',
        description:
          "This route contain lots of functionality. Patient can edit his/her medical condition along with related issue.Also, we can add/delete/edit related issue.For new related issue doesn't have '_id'. To delete related issue, remove that object from the request. To edit, send the object also with '_id'",
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the medical condition need to be edit',
            required: true,
            schema: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
          },
        ],
        requestBody: {
          description:
            "Patient can edit his/her medical condition along with related issue.Also, we can add/delete/edit related issue.For new related issue doesn't have '_id'. To delete related issue, remove that object from the request. To edit, send the object also with '_id'",
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PutCondition',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
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
    InTreatmentCondition: {
      type: 'object',
      properties: {
        patient: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
          example: 'Covid',
        },
        icd10_code: {
          type: 'string',
          example: '11W1',
        },
        status: {
          type: 'string',
        },
        is_in_treatment: {
          type: 'boolean',
          example: true,
        },
        diagnosis_date: {
          type: 'string',
        },
        recovery_date: {
          type: 'string',
        },
        is_active: {
          type: 'boolean',
          example: true,
          default: true,
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    GetCondition: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          medical_name: {
            type: 'string',
          },
          icd10_code: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
    NotInTreatmentCondition: {
      type: 'object',
      properties: {
        patient: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
          example: 'Covid',
        },
        icd10_code: {
          type: 'string',
          example: '11W1',
        },
        status: {
          type: 'string',
        },
        is_in_treatment: {
          type: 'boolean',
          example: false,
        },
        diagnosis_date: {
          type: 'string',
        },
        recovery_date: {
          type: 'string',
        },
        is_active: {
          type: 'boolean',
          example: true,
          default: true,
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    InTreatmentConditionWithId: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
          example: 'Covid',
        },
        icd10_code: {
          type: 'string',
          example: '11W1',
        },
        status: {
          type: 'string',
        },
        is_in_treatment: {
          type: 'boolean',
          example: true,
        },
        diagnosis_date: {
          type: 'string',
        },
        is_active: {
          type: 'boolean',
          example: true,
          default: true,
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    NotInTreatmentConditionWithId: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
          example: 'Covid',
        },
        icd10_code: {
          type: 'string',
          example: '11W1',
        },
        status: {
          type: 'string',
        },
        is_in_treatment: {
          type: 'boolean',
          example: false,
        },
        diagnose_month: {
          type: 'string',
        },
        diagnose_year: {
          type: 'string',
        },
        recovery_month: {
          type: 'string',
        },
        recovery_year: {
          type: 'string',
        },
        is_recovered: {
          type: 'boolean',
          example: false,
        },
        is_active: {
          type: 'boolean',
          example: true,
          default: true,
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    ConditionList: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: '#/definitions/InTreatmentCondition' },
          { $ref: '#/definitions/NotInTreatmentCondition' },
        ],
      },
    },
    PostCondition: {
      type: 'object',
      properties: {
        patient_condition_id: {
          type: 'string',
          example: '63fc70978963608055a502a8',
        },
        patient_id: {
          type: 'string',
          example: '63fc703248963608055a502a8',
        },
        name: {
          type: 'string',
          example: 'Covid',
        },
        icd10_code: {
          type: 'string',
          example: '11W1',
        },
        status: {
          type: 'string',
        },
        is_in_treatment: {
          type: 'boolean',
          example: false,
        },
        diagnose_month: {
          type: 'string',
        },
        diagnose_year: {
          type: 'string',
        },
        recovery_month: {
          type: 'string',
        },
        recovery_year: {
          type: 'string',
        },
        is_recovered: {
          type: 'boolean',
          example: false,
        },
        related_issues: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/InTreatmentCondition' },
              { $ref: '#/definitions/NotInTreatmentCondition' },
            ],
          },
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    PutCondition: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Covid',
        },
        icd10_code: {
          type: 'string',
          example: '11W1',
        },
        status: {
          type: 'string',
        },
        is_in_treatment: {
          type: 'boolean',
          example: false,
        },
        diagnose_month: {
          type: 'string',
        },
        diagnose_year: {
          type: 'string',
        },
        recovery_month: {
          type: 'string',
        },
        recovery_year: {
          type: 'string',
        },
        is_recovered: {
          type: 'boolean',
          example: false,
        },
        related_issues: {
          type: 'array',
          items: {
            type: 'string',
            oneOf: [
              { $ref: '#/definitions/NotInTreatmentConditionWithId' },
              { $ref: '#/definitions/InTreatmentConditionWithId' },
              { $ref: '#/definitions/InTreatmentCondition' },
              { $ref: '#/definitions/NotInTreatmentCondition' },
            ],
          },
        },
      },
      xml: {
        name: 'Medication',
      },
    },
  },
};
