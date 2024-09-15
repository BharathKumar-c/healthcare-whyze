module.exports = {
  paths: {
    '/patient/v2/hi': {
      get: {
        tags: ['Patient App HealthInsurance'],
        summary: 'To get the list of health insurance provider',
        description: 'To get the list of health insurance provider',
        reference: 'GetHealthInsurance',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/GetHealthInsurance',
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
        tags: ['Patient App HealthInsurance'],
        summary:
          'To create the health insurance detail in the provider list and not in the provider list',
        description:
          'To create the health insurance detail in the provider list and not in the provider list.If it is not in the list you need to pass the <b>health_insurance_provider</b> && <b>health_insurance_plan</b> instead of <b>health_insurance_id</b> && <b>health_insurance_plan_id</b> respectively',
        reference: 'CreateHealthInsurance',

        requestBody: {
          description:
            'health insurance details object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/CreateHealthInsurance',
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
    '/patient/v2/hi/{patient_health_insurance_id}': {
      put: {
        tags: ['Patient App HealthInsurance'],
        summary:
          'To update the health  details provider in the list and not the list',
        description:
          'To update the health  details provider in the list and not the list. If it is not in the list you need to pass the <b>health_insurance_provider</b> && <b>health_insurance_plan</b> instead of <b>health_insurance_id</b> && <b>health_insurance_plan_id</b> respectively',
        reference: 'UpdateHealthInsurance',
        parameters: [
          {
            in: 'path',
            name: 'patient_health_insurance_id',
            description: 'Example object',
            required: true,
            schema: {
              type: 'string',
              example: '642481b35f0b2586c21bba7a',
            },
          },
        ],
        requestBody: {
          description:
            'health details object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UpdateHealthInsurance',
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
    '/patient/v2/hi/{health_insurance_master_id}/plans': {
      get: {
        tags: ['Patient App HealthInsurance'],
        summary: 'To get the list of  health insurance plan',
        description: 'To get the list of  health insurance plan',
        reference: 'GetHealthInsurancePlan',
        parameters: [
          {
            name: 'health_insurance_master_id',
            in: 'path',
            description:
              'ID of the health insurance master to retrieve plan data for',
            required: true,
            schema: {
              type: 'string',
              example: '64194593fde1b3bf0414ccd7',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/GetHealthInsurancePlan',
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
    '/patient/v2/hi/patient_hi': {
      get: {
        tags: ['Patient App HealthInsurance'],
        summary: 'To get the patient health insurance details',
        description: 'To get the patient health insurance details',
        reference: 'GetPatientHealthInsurance',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/GetPatientHealthInsurance',
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
    GetHealthInsurance: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          health_insurance_master_id: {
            type: 'string',
            example: '64214cde9de72af903aaa4fc',
          },
          name: {
            type: 'string',
            example: 'VHI Healthcare',
          },
          country: {
            type: 'string',
            example: 'Ireland',
          },
        },
      },
    },
    GetHealthInsurancePlan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          health_insurance_plan_master_id: {
            type: 'string',
            example: '64214cde9de72af903aaa4fc',
          },
          name: {
            type: 'string',
            example: 'VHI Healthcare',
          },
        },
      },
    },
    GetPatientHealthInsurance: {
      type: 'object',
      properties: {
        patient_health_insurance_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        has_medical_card: {
          type: 'boolean',
          example: 'false',
        },
        policy_number: {
          type: 'string',
          example: '01234567891234',
        },
        pps_number: {
          type: 'string',
          example: '8765432AB',
        },
        is_custom_added: {
          type: 'boolean',
          example: false,
        },
        health_insurance_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        health_insurance_name: {
          type: 'string',
          example: 'Irish Life Health',
        },
        health_insurance_plan_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        health_insurance_plan_name: {
          type: 'string',
          example: 'HealthPlus Extra',
        },
      },
    },
    HealthInsurance: {
      type: 'object',
      properties: {
        pps_number: {
          type: 'string',
        },
        has_medical_card: {
          type: 'boolean',
        },
        gms_number: {
          type: 'string',
        },
        has_insurance: {
          type: 'boolean',
        },
        health_insurance_id: {
          type: 'string',
        },
        health_insurance_plan_id: {
          type: 'string',
        },
        policy_number: {
          type: 'string',
        },
      },
    },
    HealthInsuranceNotInList: {
      type: 'object',
      properties: {
        pps_number: {
          type: 'string',
        },
        has_medical_card: {
          type: 'string',
        },
        gms_number: {
          type: 'string',
        },
        has_insurance: {
          type: 'boolean',
        },
        health_insurance_provider: {
          type: 'string',
          example: 'Star Insurance',
        },
        health_insurance_plan: {
          type: 'string',
          example: 'Life insurance',
        },
      },
    },
    CreateHealthInsurance: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/HealthInsurance' },
        { $ref: '#/definitions/HealthInsuranceNotInList' },
      ],
    },
    UpdateHealthInsurance: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/HealthInsurance' },
        { $ref: '#/definitions/HealthInsuranceNotInList' },
      ],
    },
  },
};
