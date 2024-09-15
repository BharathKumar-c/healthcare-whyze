module.exports = {
  paths: {
    '/hcp/appointment/create-appointment': {
      post: {
        tags: ['Hcp Appointment'],
        summary: 'To create an appointment for patients by doctor',
        description: 'To create an appointment for patients by doctor',

        requestBody: {
          description: 'To pass the appointment object referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  appointmentData: {
                    type: 'object',
                    properties: {
                      patient: {
                        type: 'string',
                        example: '640f1234567a3dbab0f652a3',
                      },
                      patient_name: {
                        type: 'string',
                        example: 'James',
                      },
                      appointment_type: {
                        type: 'string',
                        example: 'NewReferral',
                      },
                      hcp: {
                        type: 'string',
                        example: '640f1234567a3dbab0f652a3',
                      },
                      hcp_name: {
                        type: 'string',
                        example: 'Peter Banner',
                      },
                      start_date: {
                        type: 'string',
                        example: '2022-03-07T13:00',
                      },
                      end_date: {
                        type: 'string',
                        example: '2022-03-07T14:00',
                      },
                      condition: {
                        type: 'string',
                        example: 'NewReferral',
                      },
                      location: {
                        type: 'string',
                        example: 'Remote',
                      },
                      case_id: {
                        type: 'string',
                        example: 'e5c2920b-c2a5-4336-8846-0bb541bc43f1',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Success',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Appointment created',
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
  },
};
