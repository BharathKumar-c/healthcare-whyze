module.exports = {
  paths: {
    '/hcp/doctor/{tenant_id}': {
      get: {
        tags: ['Hcp App Doctor'],
        summary: 'To get the list of doctors by name',
        description:
          'To get the list of doctors by name, If You need to get the data by name, you must pass the data in name query, Like this <b>64140812a01166ab825555d4</b>',
        reference: 'ArrayOfDoctors',
        parameters: [
          {
            name: 'tenant_id',
            in: 'path',
            description: 'ID of the tenant',
            required: true,
            schema: {
              type: 'string',
              example: '64140812a01166ab825555d4',
            },
          },
        ],

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ArrayOfDoctors',
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
    ArrayOfDoctors: {
      type: 'array',
      items: {
        minItems: 1,
        type: 'object',
        required: ['name'],
        properties: {
          _id: {
            type: 'string',
            example: '64214cde9de72af903aaa4fc',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
    CaseUpload: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        comment: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
    AllergiesUpload: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },

        comment: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
    GetAllergies: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        comment: {
          type: 'string',
        },
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
    GetMedication: {
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
    ReactionUpload: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        comment: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
    GetReaction: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        comment: {
          type: 'string',
        },
      },
    },
    Case: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },

          comment: {
            type: 'string',
          },
        },
      },
    },
    Faq: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          faq_id: {
            type: 'string',
          },
          question_title: {
            type: 'string',
          },
          answer_text: {
            type: 'string',
          },
        },
      },
    },
    FaqUpload: {
      type: 'object',
      properties: {
        question_title: {
          type: 'string',
        },
        answer_text: {
          type: 'string',
        },
      },
    },
  },
};
