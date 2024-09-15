module.exports = {
  paths: {
    '/hcp/doctor/relation': {
      post: {
        tags: ['HCP App Relation'],
        summary: 'To post the list of familyRelation by name',
        description: 'To Upload the new familyRelation details ',
        reference: 'UploadRealitionMaster',

        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UploadRealitionMaster',
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
      get: {
        tags: ['HCP App Relation'],
        summary: 'To get the list of all familyRelation details',
        description: 'To get the list of all familyrelation details',
        reference: 'GetRealitionMaster',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetRealitionMaster',
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
    UploadRealitionMaster: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        is_active: {
          type: 'boolean',
        },
        comment: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
    GetRealitionMaster: {
      type: 'object',
      properties: {
        family_realtionship_master_id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        is_active: {
          type: 'boolean',
        },
        comment: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
  },
};
