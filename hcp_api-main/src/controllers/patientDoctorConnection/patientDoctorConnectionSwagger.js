module.exports = {
  paths: {
    '/patient/v2/hcp-connect': {
      get: {
        tags: ['Patient App Doctor'],
        summary: 'To get the connected and not connected doctors details',
        description: 'To get the connected and not connected doctors details',
        reference: 'PatientDoctoConnectionDetailList',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/PatientDoctoConnectionDetailList',
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
    '/patient/v2/hcp-connect/hcp': {
      post: {
        tags: ['Patient App Doctor'],
        summary: 'To store the doctor details associated with the patient',
        description: 'To store the doctor details associated with the patient.',

        requestBody: {
          description:
            'Doctor details  object that needs to be added to the store.If the doctor is not on the provided list, use this body <code>{"hcp_id":"63fc70978963608055a502a5", "is_connected": true}</code>',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/doctorAndTenantDetails',
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
    '/patient/v2/hcp-connect/{doctorMapperId}': {
      get: {
        tags: ['Patient App Doctor'],
        summary: 'To get the connected and not connected doctors details',
        description: 'To get the connected and not connected doctors details',
        reference: 'GetPatientDoctorData',
        parameters: [
          {
            in: 'path',
            name: 'doctorMapperId',
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
            schema: {
              $ref: '#/definitions/GetPatientDoctorData',
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
    '/patient/v2/hcp-connect/hcp/{doctorMapperId}': {
      put: {
        tags: ['Patient App Doctor'],
        summary: 'To update the doctor details associated with the patient',
        description:
          'To update the doctor details associated with the patient.',
        reference: 'editDoctorAndTenantDetails',
        parameters: [
          {
            in: 'path',
            name: 'doctorMapperId',
            description: 'Example object',
            required: true,
            schema: {
              type: 'string',
              example: '64244111eed5835d465665a2',
            },
          },
        ],
        requestBody: {
          description:
            'Doctor details  object that needs to be added to the store. If the doctor is not on the provided list, use this body <code>{"hcp_id":"63fc70978963608055a502a5", "is_connected": true}</code>',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/editDoctorAndTenantDetails',
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
    PatientDoctorMapper: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        patient: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        hcp: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        is_connected: {
          type: 'boolean',
          example: true,
        },
        created_by: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        updated_by: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
      },
    },
    GetPatientDoctorData: {
      type: 'object',
      properties: {
        patient_doctor_mapper_id: {
          type: 'string',
          example: '64244111eed5835d465665a2',
        },
        hcp_id: {
          type: 'string',
          example: '63fc70978963608055a502a5',
        },
        hcp_name: {
          type: 'string',
          example: 'Peter parkour',
        },
        tenant: [
          {
            _id: {
              type: 'string',
              example: '6419a8afde3358b06e6682ea',
            },
            name: {
              type: 'string',
              example: 'Galway Clinic',
            },
            unique_name: {
              type: 'string',
              example: 'Galway Clinic',
            },
            image: {
              type: 'string',
            },
            description: {
              type: 'string',
              example:
                'Kingsbridge Private Hospital is a private hospital on the Lisburn Road, Belfast, Northern Ireland. It is owned by Kingsbridge Healthcare Group, the largest provider of private healthcare in Northern Ireland.',
            },
            address_line1: {
              type: 'string',
              example: '22 Carrickbrack Road',
            },
            address_line2: {
              type: 'string',
              example: 'Dublin 6',
            },
            address_line3: {
              type: 'string',
              example: 'Dublin',
            },
            city: {
              type: 'string',
              example: 'Ireland',
            },
            post_code: {
              type: 'string',
              example: '456799',
            },
            country: {
              type: 'string',
              example: 'Ireland',
            },
          },
        ],
        is_connected: {
          type: 'boolean',
          example: false,
        },
        is_custom_added: {
          type: 'boolean',
          example: false,
        },
      },
    },
    PatientDoctoConnectionDetailList: {
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
    doctorConnectionData: {
      type: 'object',
      properties: {
        hcp_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        is_connected: {
          type: 'boolean',
          example: false,
        },
      },
    },
    existingTenantDetails: {
      type: 'object',
      properties: {
        hcp_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        is_connected: {
          type: 'boolean',
          example: false,
        },
      },
    },
    newTenantDetails: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: 'Mick Nickolic',
        },
        last_name: {
          type: 'string',
          example: '',
        },
        clinic_name: {
          type: 'string',
          example: 'clinic_name',
        },
        address_line1: {
          type: 'string',
          example: '22 Carrickbrack Road',
        },
        address_line2: {
          type: 'string',
          example: 'Dublin 6',
        },
        address_line3: {
          type: 'string',
          example: 'Dublin',
        },
        city: {
          type: 'string',
          example: 'Ireland',
        },
        post_code: {
          type: 'string',
          example: '456798',
        },
        country: {
          type: 'string',
          example: 'Ireland',
        },
        is_connected: {
          type: 'boolean',
          example: false,
        },
      },
    },
    editNewtenantDetails: {
      type: 'object',
      properties: {
        tenant_id: {
          type: 'string',
          example: '6419a8afde3358b06e6682ea',
        },
        doctor_id: {
          type: 'string',
          example: '63fc70978963608055a502a5',
        },
      },
      allOf: [
        {
          $ref: '#/definitions/newTenantDetails',
        },
      ],
    },
    doctorAndTenantDetails: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/newTenantDetails' },
        { $ref: '#/definitions/existingTenantDetails' },
      ],
    },
    editDoctorAndTenantDetails: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/editNewtenantDetails' },
        { $ref: '#/definitions/existingTenantDetails' },
      ],
    },
  },
};
