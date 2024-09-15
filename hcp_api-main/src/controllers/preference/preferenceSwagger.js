module.exports = {
  paths: {
    '/patient/v2/preference': {
      get: {
        tags: ['Patient App Preference'],
        summary: 'Get Preference details',
        description: 'Get Preference details',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/PreferenceDetails',
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
        tags: ['Patient App Preference'],
        summary: 'To add the tenant for reasearch preference',
        description: 'To add the tenant for reasearch preference',
        reference: 'PostPreference',

        requestBody: {
          description: 'preference needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PostPreference',
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
    '/patient/v2/preference/{preferenceId}': {
      put: {
        tags: ['Patient App Preference'],
        summary: 'To Update Patient Preference',
        description: 'To Update Patient Preference',
        reference: 'PutPreference',
        parameters: [
          {
            in: 'path',
            name: 'preferenceId',
            description: 'ID of the patient_vaccine_mapper_Id need to be edit',
            required: true,
            schema: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
          },
        ],
        requestBody: {
          description: 'preference needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PutPreference',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'string',
              example: 'Preference updated successfully.!',
            },
          },
          400: {
            description: 'Invalid status value',
          },
        },
      },
    },
    '/patient/v2/preference/therapeutic-areas/{id}': {
      patch: {
        tags: ['Patient App Preference'],
        summary: 'To Update Therapeutic Areas ',
        description: 'To Update Therapeutic Areas ',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the Therapeutic Areas need to be edit',
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
              type: 'string',
              example: 'Therapeutic Areas Updated successfully.',
            },
          },
          400: {
            description: 'Invalid status value',
          },
        },
      },
    },
  },
  definitions: {
    PreferenceDetails: {
      type: 'object',
      properties: {
        preference_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        surveys: {
          type: 'boolean',
          example: true,
        },
        clinical_trials: {
          type: 'boolean',
          example: false,
        },
        pseudonymised_data: {
          type: 'boolean',
          example: false,
        },
        tenant_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
          example: 'Galway Clini',
        },
        image: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        is_connected: {
          type: 'boolean',
          example: false,
        },
        hospital_number: {
          type: 'string',
          example: '45851861',
        },
        travel_distance: {
          type: 'string',
          example: 'less then 30km',
        },
      },
    },
    PostPreference: {
      type: 'object',
      properties: {
        tenant: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
        hospital_number: {
          type: 'string',
          example: '45851861',
        },
      },
    },
    PutPreference: {
      type: 'object',
      properties: {
        surveys: {
          type: 'boolean',
          example: 'true',
        },
        clinical_trials: {
          type: 'boolean',
          example: 'false',
        },
        pseudonymised_data: {
          type: 'boolean',
          example: 'false',
        },
        travel_distance: {
          type: 'string',
          example: '< 50km',
        },
      },
    },
  },
};
