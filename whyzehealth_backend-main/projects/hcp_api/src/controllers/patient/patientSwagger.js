module.exports = {
  paths: {
    '/patient/v2': {
      get: {
        tags: ['Patient App Personal Details'],
        summary: 'To get the self details of patient',
        description: 'To get the details for the user',
        reference: 'User',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/User',
            },
          },
          400: {
            description: 'Invalid status value',
          },
        },
      },
      post: {
        tags: ['Patient App Personal Details'],
        summary: 'To Create PatientAllergies For Paticular Patient',
        description: 'Create or update the patient details.',
        reference: 'PatientDetails',
        requestBody: {
          description:
            'Patient  details object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PatientDetails',
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
    '/patient/v2/allergies/{patient_allergies_id}': {
      patch: {
        tags: ['Patient App Allergies'],
        summary: 'To update the list of all allergies by name',
        description:
          'in remove/add id from array to update allergies of reaction',
        reference: 'AllergiesUpdate',
        parameters: [
          {
            in: 'path',
            name: 'patient_allergies_id',
            description:
              'Query for allergy name. (Ex: 63fc70978963608055a502a8)',
            required: true,
            schema: {
              type: 'string',
              example: '64194593fde1b3bf0414ccd7',
            },
          },
        ],
        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/AllergiesUpdate',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/AllergiesUpdate',
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
      delete: {
        tags: ['Patient App Allergies'],
        summary:
          'To Delete the Patient Allergies of patient to change active Family History',
        description:
          'To Delete the  Patient Allergies of patient to change active tenant ',
        reference: 'AllergiesUpdate',
        parameters: [
          {
            name: 'patient_allergies_id',
            in: 'path',
            description:
              'Query for patient_allergies_id. (Ex: 63fc70978963608055a502a8)',
            required: true,
            schema: {
              type: 'string',
              example: '63fc70978963608055a502a8',
            },
          },
        ],
        responses: {
          200: {
            description: 'PatientAllergy Removed successfully !',
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
    '/patient/v2/allergies': {
      post: {
        tags: ['Patient App Allergies'],
        summary:
          'To post the list of Allergies by name for particular Patient patinet',
        description:
          'To Upload the new Allergies details for particular Patient ',
        reference: 'AllergiesUpdate',

        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/AllergiesUpdate',
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
        tags: ['Patient App Allergies'],
        summary: 'To get the list of all allergies of patient',
        description: 'To get the list of all allergies for particular Patient',
        reference: 'GetAllergies',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetAllergies',
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
    '/patient/v2/allergies/masterdata': {
      get: {
        tags: ['Patient App Allergies'],
        summary: 'To get the list of all master data allergies',
        description: 'To get the list of all allergies upload by hcp ',
        reference: 'GetAllergies',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetAllergies',
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
    '/patient/v2/allergies/masterdata?name': {
      get: {
        tags: ['Patient App Allergies'],
        summary: 'To get the list of all allergies by name',
        description:
          'To get the list of allergies upload by hcp using allergy name',

        reference: 'GetAllergies',
        parameters: [
          {
            in: 'query',
            name: 'name',
            description: 'Query for allergy name. (Ex: name=covid)',
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
              $ref: '#definitions/GetAllergies',
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
    '/patient/v2/fh/{patient_family_details_id}': {
      patch: {
        tags: ['Patient App Family History'],
        summary: 'To update the list of all familyHistory by name',
        description:
          'To update the list of all familyHistory upload by patient ',
        reference: 'FamilyDetailsUpload',
        parameters: [
          {
            name: 'patient_family_details_id',
            in: 'path',
            description:
              'Query for familydetails id name. (Ex: 63fc70978963608055a502a8)',
            required: true,
            schema: {
              type: 'string',
              example: '63fc70978963608055a502a8',
            },
          },
        ],
        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/FamilyDetailsUpload',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'string',
              example: 'familydetails updated successfully.!',
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
      delete: {
        tags: ['Patient App Family History'],
        summary:
          'To Delete the family history of patient to change active Family History',
        description:
          'To Delete the family history of patient to change active tenant ',
        reference: 'FamilyDetailsUpload',
        parameters: [
          {
            name: 'patient_family_details_id',
            in: 'path',
            description:
              'Query for patient_family_details_id. (Ex: 63fc70978963608055a502a8)',
            required: true,
            schema: {
              type: 'string',
              example: '63fc70978963608055a502a8',
            },
          },
        ],
        responses: {
          200: {
            description: 'FamilyDetails Removed successfully !',
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
    '/patient/v2/fh': {
      post: {
        tags: ['Patient App Family History'],
        summary:
          'To post the list of familyHistory by name for particular Patient',
        description:
          'To Upload the new familyHistory details for particular Patient ',
        reference: 'FamilyDetailsUpload',
        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/FamilyDetailsUpload',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/FamilyDetailsUpload',
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
      get: {
        tags: ['Patient App Family History'],
        summary: 'To get the list of all familyHistory by name',
        description:
          'To get the list of all familyHistory for particular Patient',
        reference: 'GetFamilyDetails',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetFamilyDetails',
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
    '/patient/v2/fh/masterdata': {
      get: {
        tags: ['Patient App Relation'],
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
    '/patient/v2/tenant/{patient_tenant_id}': {
      patch: {
        tags: ['Patient App Tenant'],
        summary: 'To update the tenant of patient to change active tenant',
        description: 'To update the tenant of patient to change active tenant ',
        reference: 'TenantUpdate',
        parameters: [
          {
            in: 'path',
            name: 'patient_tenant_id',
            description: 'Query for Tenant id. (Ex: 63fc70978963608055a502a8)',
            required: true,
            schema: {
              type: 'string',
              example: '63fc70978963608055a502a8',
            },
          },
        ],
        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/TenantUpdate',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'tenant uploaded successfully !',
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
    '/patient/v2/getProfileCompletionStep': {
      get: {
        tags: ['Patient App Progress/Step Completion'],
        summary: 'To get the progress of patient in the to-do status',
        description: 'To get the progress of patient in the to-do status',
        reference: 'GetProgressStatus',
        responses: {
          200: {
            description: 'Success',
            schema: {
              $ref: '#definitions/GetProgressStatus',
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
    '/patient/v2/updateProfileCompletionStep': {
      put: {
        tags: ['Patient App Progress/Step Completion'],
        summary: 'To update the progress of patient in the to-do status',
        description: 'To update the progress of patient in the to-do status',
        reference: 'UpdateProgressStatusValue',
        requestBody: {
          description: 'Patient object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UpdateProgressStatusValue',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Created',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Profile completion status updated',
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
    '/patient/v2/case/masterdata': {
      get: {
        tags: ['Patient App Case'],
        summary: 'To get the list of case by name',
        description:
          'To get the list of case by name, If You need to get the data by name, you must pass the data ',
        reference: 'CaseDetails',
        parameters: [
          {
            in: 'query',
            name: 'index',
            schema: {
              type: 'integer',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'offset',
            schema: {
              type: 'string',
              default: '0',
            },
          },
          {
            in: 'query',
            name: 'orderBy',
            schema: {
              type: 'array',
            },
          },
          {
            in: 'query',
            name: 'descending',
            schema: {
              type: 'string',
              enum: ['true', 'false'],
              default: 'false',
            },
          },
        ],

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/Case',
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
    '/patient/v2/medication/masterdata?name': {
      get: {
        tags: ['Patient App Medication'],
        summary: 'To get the list of all medication by name',
        description:
          'To get the list of medication upload by hcp using allergy name',

        reference: 'GetMedication',
        parameters: [
          {
            in: 'query',
            name: 'name',
            description: 'Query for medication name. (Ex: dolo650)',
            required: true,
            schema: {
              type: 'string',
              example: 'dolo650',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetMedication',
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

    '/patient/v2/reaction/masterdata': {
      get: {
        tags: ['Patient App Reaction'],
        summary: 'To get the list of all reactions by name',
        description: 'To get the list of all reactions upload by hcp ',
        reference: 'GetAllergies',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetAllergies',
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

    '/patient/v2/reaction/masterdata?name': {
      get: {
        tags: ['Patient App Reaction'],
        summary: 'To get the list of all reactions by name',
        description:
          'To get the list of reactions upload by hcp using reaction name',

        reference: 'GetReaction',
        parameters: [
          {
            in: 'query',
            name: 'name',
            description: 'Query for reaction name. (Ex: name=pimples)',
            required: true,
            schema: {
              type: 'string',
              example: 'rash',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/GetReaction',
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
    '/patient/v2/faq': {
      get: {
        tags: ['Patient App FAQ'],
        summary: 'To get the list of all faq',
        description: 'To get the list of uploaded faq',

        reference: 'Faq',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/Faq',
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
    '/patient/v2/tenant': {
      get: {
        tags: ['Patient App Tenant'],
        summary: 'To get the list of all tenants',
        description: 'To get the list of all tenants ',
        reference: 'listOfTenants',
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/listOfTenants',
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
    '/patient/v2/tenant?name': {
      get: {
        tags: ['Patient App Tenant'],
        summary: 'To get the list of tenants by name',
        description:
          'To get the list of tenants by name, If You need to get the data by name, you must pass the data in name query, Like this <b>name=in</b>',
        reference: 'ArrayOfTenant',
        parameters: [
          {
            in: 'query',
            name: 'name',
            description: 'Query for tenants name. (Ex: name=in)',
            required: true,
            schema: {
              type: 'string',
              example: 'in',
            },
          },
        ],

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/ArrayOfTenant',
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
    '/patient/v2/tenant/{tenant_id}/doctor': {
      get: {
        tags: ['Patient App Tenant'],
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
          {
            in: 'query',
            name: 'name',
            description: 'Query for doctor name. (Ex: James)',
            required: true,
            schema: {
              type: 'string',
              example: 'James',
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
    User: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        email: {
          type: 'string',
          example: 'john.wick@gmail.com',
        },
        email_verified: {
          type: 'boolean',
          example: 'true',
        },
        phone_number: {
          type: 'string',
          example: '919790064783',
        },
        tenant: {
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
              unique_name: {
                type: 'string',
              },
              is_share: {
                type: 'boolean',
              },
            },
          },
        },

        role: {
          type: 'string',
          example: 'patient',
        },
        patient_detail: {
          type: 'object',
          properties: {
            patient: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
            dietary: {
              type: 'array',
              items: {
                minItems: 1,
                type: 'object',
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
            created_by: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
            updated_by: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
            blood_type: {
              type: 'string',
              example: 'A+',
            },
            bmi: {
              type: 'string',
              example: '30.4',
            },
            ethnicity: {
              type: 'string',
              example: 'Black',
            },
            height: {
              type: 'decimal',
              example: '5.7',
            },
            height_unit: {
              type: 'string',
              example: 'feet',
            },
            weight: {
              type: 'decimal',
              example: '13.39',
            },
            weight_unit: {
              type: 'string',
              example: 'feet',
            },
            is_smoker: {
              type: 'boolean',
              example: false,
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
          },
        },

        Preference: {
          type: 'object',
          properties: {
            patient: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
            surveys: {
              type: 'boolean',
              example: false,
            },
            clinical_trials: {
              type: 'boolean',
              example: false,
            },
            pseudonymised_data: {
              type: 'boolean',
              example: false,
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
        country: {
          type: 'string',
          example: 'Ireland',
        },
        dob: {
          type: 'date',
          example: '17/05/2019',
        },
        first_name: {
          type: 'string',
          example: 'Mick',
        },
        gender: {
          type: 'string',
          example: 'Male',
        },
        last_name: {
          type: 'string',
          example: 'Nikolich',
        },
        updated_by: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        appointments: {
          type: 'array',
          items: {
            minItems: 1,
            type: 'object',
            properties: {
              patient: {
                type: 'string',
                example: '64214cde9de72af903aaa4fc',
              },
              comments: { type: 'string' },
              hcp_id: { type: 'string', format: 'uuid' },
              type: { type: 'string' },
              condition: { type: 'string' },
              patient_name: { type: 'string' },
              hcp_name: { type: 'string' },
              case_id: { type: 'string' },
              comment: { type: 'string' },
              start_date: { type: 'string' },
              end_date: { type: 'string' },
              vital_status: { type: 'string' },
              location: { type: 'string' },
              updated_by: {
                type: 'string',
                example: '64214cde9de72af903aaa4fc',
              },
            },
          },
        },
      },
      xml: {
        name: 'User',
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
    TenantUpdate: {
      type: 'object',
      properties: {
        is_share: {
          type: 'boolean',
          example: 'true',
        },
      },
    },
    Preference: {
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
      },
    },
    listOfTenants: {
      type: 'array',
      items: {
        minItems: 1,
        type: 'object',
        properties: {
          tenant_id: {
            type: 'string',
            example: '64214cde9de72af903aaa4fc',
          },
          name: {
            type: 'string',
          },
          unique_name: {
            type: 'string',
          },
          image: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
        },
      },
    },
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
    Tenant: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        name: {
          type: 'string',
        },
        unique_name: {
          type: 'string',
        },
        image: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        address: {
          type: 'string',
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
      xml: {
        name: 'Tenant',
      },
    },

    TenantDetails: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'Inchicore Practice',
        },
        unique_name: {
          type: 'string',
          format: 'Inchicore Practice',
        },
        image: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
      },
    },
    ArrayOfTenant: {
      type: 'array',
      items: {
        minItems: 1,
        type: 'object',
        required: ['name'],
        properties: {
          tenant_id: {
            type: 'string',
            example: '64214cde9de72af903aaa4fc',
          },
          name: {
            type: 'string',
          },
          unique_name: {
            type: 'string',
          },
          image: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
        },
      },
    },
    Patient: {
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
        height: {
          type: 'decimal',
          example: '5.7',
        },
        height_unit: {
          type: 'string',
          example: 'feet',
        },
        weight: {
          type: 'decimal',
          example: '13.39',
        },
        weight_unit: {
          type: 'string',
          example: 'feet',
        },
        bmi: {
          type: 'string',
          example: '30.4',
        },
        blood_type: {
          type: 'string',
          example: 'A+',
        },
        is_smoker: {
          type: 'boolean',
          example: false,
        },
        smoke_frequency: {
          type: 'string',
          example: 'Several times a day',
        },
        smoke_start_year: {
          type: 'string',
          example: '2011',
        },
        smoke_quite_year: {
          type: 'string',
          example: '2022',
        },
        alcohol_weekly_frequency: {
          type: 'string',
          example: '1-5 units',
        },
        dietary: [],
        Preference: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        ethnicity: {
          type: 'string',
          example: 'Black',
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
    PatientDetails: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: 'Mick',
        },
        last_name: {
          type: 'string',
          example: 'Nikolich',
        },
        dob: {
          type: 'date',
          example: '17/05/2019',
        },
        gender: {
          type: 'string',
          example: 'male',
        },
        country: {
          type: 'string',
          example: 'Ireland',
        },
        address_line1: {
          type: 'string',
          example: '22 Carrickbrack Road',
        },
        address_line2: {
          type: 'string',
          example: 'Dublin 5',
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
        ethnicity: {
          type: 'string',
          example: 'Black',
        },
        height: {
          type: 'decimal',
          example: '5.7',
        },
        height_unit: {
          type: 'string',
          example: 'feet',
        },
        weight: {
          type: 'decimal',
          example: '13.39',
        },
        weight_unit: {
          type: 'string',
          example: 'stone',
        },
        bmi: {
          type: 'string',
          example: '30.4',
        },
        blood_type: {
          type: 'string',
          example: 'A+',
        },
      },
    },
    GetFamilyDetails: {
      type: 'object',
      properties: {
        patient_family_details_id: {
          type: 'string',
          example: '64214cde9de72af903aaa4fc',
        },
        patient: {
          type: 'string',
        },
        relation: {
          type: 'string',
        },
        patient_medical_condition: {
          type: 'string',
        },
        further_comments: {
          type: 'string',
        },
        is_active: {
          type: 'boolean',
        },
      },
    },
    FamilyDetailsUpload: {
      type: 'object',
      properties: {
        relation_master_id: {
          type: 'uuid',
          example: '64142ad721835a2e96cdddce',
        },
        name: {
          type: 'string',
        },
        icd10_code: {
          type: 'string',
        },
        patient_medical_condition: {
          type: 'string',
        },
        further_comments: {
          type: 'string',
          example: 'yes added..',
        },
      },
    },
    UserDetails: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: 'Mick',
        },
        last_name: {
          type: 'string',
          example: 'Nikolich',
        },
        dob: {
          type: 'date',
          example: '17/05/2019',
        },
        gender: {
          type: 'string',
          example: 'male',
        },
        country: {
          type: 'string',
          example: 'Ireland',
        },
        address_line1: {
          type: 'string',
          example: '22 Carrickbrack Road',
        },
        address_line2: {
          type: 'string',
          example: 'Dublin 5',
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
      },
    },
    AllergiesUpdate: {
      type: 'object',
      properties: {
        allergy: {
          type: 'string',
          example: '64140812a01166ab825555d4',
        },
        reactions: {
          type: 'array',
          example: [
            '64140812a01166ab825555d4',
            '6414081ca01166ab825555d6',
            '64140826a01166ab825555d8',
          ],
        },
      },
    },
    GetAllergies: {
      type: 'object',
      properties: {
        patient_allergies_id: {
          type: 'uuid',
        },
        allergy: {
          type: 'string',
        },
        reactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'uuid',
              },
              is_active: {
                type: 'boolean',
              },
              name: {
                type: 'string',
              },
            },
          },
        },
        is_active: {
          type: 'boolean',
        },
      },
    },
    GetProgressStatus: {
      type: 'object',
      properties: {
        progress: {
          type: 'array',
          example: [1, 2, 3],
        },
        clinical_trials: {
          type: 'boolean',
          example: true,
        },
      },
    },
    UpdateProgressStatusValue: {
      type: 'object',
      properties: {
        progress: {
          type: 'array',
          example: [1, 2, 3],
        },
      },
    },
  },
};
