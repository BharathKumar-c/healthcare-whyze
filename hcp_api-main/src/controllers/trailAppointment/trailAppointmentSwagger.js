module.exports = {
  paths: {
    '/patient/v2/book-appointment/trail-appointment-dates/{id}': {
      get: {
        tags: ['Patient App Trail Appintment'],
        summary: 'To get avalible appoiment date and discription',
        description: 'Trail appointment dates and discription',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'Example object',
            required: true,
            schema: {
              type: 'string',
              example: '64244111eed5835d465665a2',
            },
          },
        ],
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
      put: {
        tags: ['Patient App Trail Appintment'],
        summary: 'To update avalible appoitment date',
        description: 'Trail update appointment date',
        reference: 'UpdateTrail',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'Example object',
            required: true,
            schema: {
              type: 'string',
              example: '64244111eed5835d465665a2',
            },
          },
        ],
        requestBody: {
          description: 'preference needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UpdateTrail',
              },
            },
          },
        },
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
    UpdateTrail: {
      type: 'object',
      properties: {
        clinicalTrialAppointmentId: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
      },
    },
  },
};
