module.exports = {
  paths: {
    '/patient/v2/verification/send-email-Verification': {
      post: {
        tags: ['Patient App Verification'],
        summary:
          'To send patient email verification when editing the contact details',
        description:
          'To send patient email verification when editing the contact details',
        reference: 'EmailVerification',

        requestBody: {
          description: 'To pass the email field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/EmailVerification',
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
    '/patient/v2/verification/verify-email/{token}': {
      get: {
        tags: ['Patient App Verification'],
        summary:
          'To verify the email of the patient when editing the contact details',
        description:
          'To verify the email of the patient when editing the contact details',
        parameters: [
          {
            name: 'token',
            in: 'path',
            description: 'Token to verify the email of the patient',
            required: true,
            schema: {
              type: 'string',
              example:
                'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3aHl6ZSIsImVtYWlsIjoia2FydGhp....',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Email verified',
                },
              },
            },
          },
          400: {
            description: 'Invalid status value',
          },
          500: {
            description: 'Internal Server Error',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'The link has expired',
                },
              },
            },
          },
        },
      },
    },
    '/patient/v2/verification/send-phone-verification': {
      post: {
        tags: ['Patient App Verification'],
        summary:
          'To send patient phone verification when editing the contact details',
        description:
          'To send patient phone verification when editing the contact details',
        reference: 'PhoneVerification',

        requestBody: {
          description: 'o pass the email field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/PhoneVerification',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'PhoneVerificationSuccess',
            schema: {
              $ref: '#/definitions/PhoneVerificationSuccess',
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
    '/patient/v2/verification/verify-phone': {
      post: {
        tags: ['Patient App Verification'],
        summary:
          'To verify patient phone number when editing the contact details',
        description:
          'To verify patient phone number when editing the contact details',

        requestBody: {
          description: 'o pass the email field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/VerifyPhoneWithCode',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'VerifyPhoneWithCodeSuccess',
            schema: {
              $ref: '#/definitions/VerifyPhoneWithCodeSuccess',
            },
          },
          400: {
            description: 'Invalid status value',
          },
          500: {
            description: 'Internal Server Error',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'The security code is invalid or expired',
                },
              },
            },
          },
        },
      },
    },
    '/patient/v2/link-existing-account/patient': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To check existing patient profile',
        description: 'To check existing patient profile',

        requestBody: {
          description: 'To pass the field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/ExistingAccount',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'ExistingAccountSuccess',
            schema: {
              $ref: '#/definitions/ExistingAccountSuccess',
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
    '/patient/v2/link-existing-account/confirm-tenant': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To check the tenant of the patient',
        description:
          'To check the tenant of the patient,asking a question to validate their previous profile',

        requestBody: {
          description: 'To pass the field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/ConfirmTenantBody',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'ConfirmTenantSuccess',
            schema: {
              $ref: '#/definitions/ConfirmTenantSuccess',
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Selected Tenant is wrong',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/link-existing-account/confirm-tenant-get-hcp': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To check the tenant of the patient and return hcp',
        description:
          'To check the tenant of the patient and get the appoinment hcp data, asking a question to validate their previous profile',

        requestBody: {
          description: 'To pass the field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/ConfirmTenantBody',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'Hcpobj',
            schema: {
              $ref: '#/definitions/Hcpobj',
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Selected Tenant is wrong',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/link-existing-account/confirm-hcp-get-year': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To check the hcp return hcp year',
        description:
          'To check the hcp, patient with the recent appointment and get the hcp year, asking a question to validate their previous profile',

        requestBody: {
          description: 'To pass the field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/ConfirmHcpBody',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'YearObj',
            schema: {
              $ref: '#/definitions/YearObj',
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Selected Hcp is wrong',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/link-existing-account/confirm-year-get-health-condition': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To check the year return health condition',
        description:
          'To check the year that patient in the appointment year,return with the recent health condition, asking a question to validate their previous profile',

        requestBody: {
          description: 'o pass the email field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/ConfirmYearBody',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'success',
            reference: 'ConditionObj',
            schema: {
              $ref: '#/definitions/ConditionObj',
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Selected year is wrong',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/link-existing-account/confirm-condition': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To check the health condition',
        description: 'To check the health condition',

        requestBody: {
          description: 'To pass the field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/ConditionBody',
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
                condition: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Selected condition is wrong',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/link-existing-account/update-existing-user': {
      post: {
        tags: ['Patient App Existing Account Details'],
        summary: 'To update for existing user',
        description: 'To update for existing user',

        requestBody: {
          description: 'To pass the field referred in schema',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UpdateExistingUser',
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
    '/patient/v2/account/forgot_password?email=email': {
      get: {
        tags: ['Patient App Forgot password'],
        summary: 'Request to send email to reset the password',
        description: 'Forgot password ',
        reference: 'ForgotPassword',
        parameters: [
          {
            in: 'query',
            name: 'email',
            description: 'patient email id to send the reset password email',
            required: true,
            schema: {
              type: 'string',
              example: 'test@gmail.com',
            },
          },
        ],
        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#definitions/ForgotPassword',
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
    EmailVerification: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'john.wick@gmail.com',
        },
      },
    },
    PhoneVerification: {
      type: 'object',
      properties: {
        phone_number: {
          type: 'string',
          example: '+919999999999',
        },
      },
    },
    PhoneVerificationSuccess: {
      type: 'object',
      properties: {
        phone_number: {
          type: 'string',
          example: '+919999999999',
        },
        verification_id: {
          type: 'string',
          example: 'qad76fdh59tn12321e123qwve5et5',
        },
      },
    },
    VerifyPhoneWithCode: {
      type: 'object',
      properties: {
        phone_number: {
          type: 'string',
          example: '+919999999999',
        },
        verification_code: {
          type: 'string',
          example: '1234',
        },
        verification_id: {
          type: 'string',
          example: 'qad76fdh59tn12321e123qwve5et5',
        },
      },
    },
    VerifyPhoneWithCodeSuccess: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Phone number verified',
        },
      },
    },
    ExistingAccount: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'James',
        },
        lastName: {
          type: 'string',
          example: 'Bond',
        },
        dob: {
          type: 'string',
          example: '15/12/1980',
        },
        addressLine1: {
          type: 'string',
          example: '22 Carrickbrack Road',
        },
        addressLine2: {
          type: 'string',
          example: 'Dublin 5',
        },
        addressLine3: {
          type: 'string',
          example: 'Dublin',
        },
      },
    },
    ExistingAccountSuccessUser: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              example: '63fc70971234567055a51234',
            },
            first_name: {
              type: 'string',
              example: 'Micky',
            },
            last_name: {
              type: 'string',
              example: 'Nikolich',
            },
          },
        },
        tenantList: {
          type: 'array',
          items: {
            $ref: '#/definitions/Tenant',
          },
        },
      },
    },
    ExistingAccountSuccessUserNull: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
          example: '',
        },
      },
    },
    Tenant: {
      type: 'object',
      properties: {
        tenant_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        name: {
          type: 'string',
          example: 'Peter sons university hospital',
        },
      },
    },
    ExistingAccountSuccess: {
      type: 'object',
      properties: {
        user: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/ExistingAccountSuccessUser' },
              { $ref: '#/definitions/ExistingAccountSuccessUserNull' },
            ],
          },
        },
        tenantList: {
          type: 'array',
          items: {
            $ref: '#/definitions/Tenant',
          },
        },
      },
    },
    ConfirmTenantBody: {
      type: 'object',
      properties: {
        tenant_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        user_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
      },
    },
    ConfirmTenantSuccess: {
      type: 'object',
      properties: {
        tenantList: {
          type: 'array',
          items: {
            $ref: '#/definitions/Tenant',
          },
        },
      },
    },
    Hcpobj: {
      type: 'object',
      properties: {
        hcpList: {
          type: 'array',
          items: {
            $ref: '#/definitions/HcpList',
          },
        },
      },
    },
    HcpList: {
      type: 'object',
      properties: {
        hcp_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        hcp_name: {
          type: 'string',
          example: 'James',
        },
      },
    },
    ConfirmHcpBody: {
      type: 'object',
      properties: {
        hcp_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        user_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
      },
    },
    YearObj: {
      type: 'object',
      properties: {
        year: {
          type: 'array',
          example: ['2000,2001,2002,2003'],
        },
      },
    },
    ConfirmYearBody: {
      type: 'object',
      properties: {
        hcp_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        year: {
          type: 'number',
          example: 2023,
        },
        user_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
      },
    },
    ConditionObj: {
      type: 'object',
      properties: {
        hcpList: {
          type: 'array',
          items: {
            $ref: '#/definitions/ConditionList',
          },
        },
      },
    },
    ConditionList: {
      type: 'object',
      properties: {
        condition_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        condition_name: {
          type: 'string',
          example: 'Covid',
        },
      },
    },
    ConditionBody: {
      type: 'object',
      properties: {
        condition_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
        user_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
      },
    },
    UpdateExistingUser: {
      type: 'object',
      properties: {
        existing_user_id: {
          type: 'string',
          example: '63fc70971234567055a51234',
        },
      },
    },
    ForgotPassword: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Check your email and open the link we sent to continue',
        },
      },
    },
  },
};
