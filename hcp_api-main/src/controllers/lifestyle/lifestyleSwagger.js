module.exports = {
  paths: {
    '/patient/v2/lifestyle': {
      post: {
        tags: ['Patient App Lifestyle'],
        summary: 'To create the lifestyle or update the lifestyle if exisit',
        description: 'Create or Update lifestyle',
        reference: 'LifestylePatient',
        requestBody: {
          description:
            'Patient  details object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/LifestylePatient',
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
    '/patient/v2/lifestyle/dietary': {
      get: {
        tags: ['Patient App Lifestyle'],
        summary: 'Dietary master',
        description: 'To get the list of dietary',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ArrayOfDietary',
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
    LifestylePatient: {
      type: 'object',
      properties: {
        is_smoker: {
          type: 'boolean',
          example: true,
        },
        smoke_frequency: {
          type: 'string',
          example: 'Several times a day',
        },
        smoke_start_year: {
          type: 'string',
          example: '2012',
        },
        smoke_quite_year: {
          type: 'string',
          example: '2022',
        },
        alcohol_weekly_frequency: {
          type: 'string',
          example: '1-5 units',
        },
        dietary: {
          type: 'array',
          example: ['63efc97befa970286f6f7f0d', '63efc97befa970286f6f7f03'],
        },
      },
      xml: {
        name: 'Lifestyle Patient',
      },
    },
    Dietary: {
      type: 'object',
      properties: {
        dietary_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
        },
      },
    },
    ArrayOfDietary: {
      type: 'array',
      items: {
        minItems: 1,
        type: 'object',
        required: ['name'],
        properties: {
          dietary_id: {
            type: 'string',
            example: '64214cde9de72af903aaa4fc',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
  },
};
