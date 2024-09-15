module.exports = {
  paths: {
    '/hcp/tenant': {
      get: {
        tags: ['Hcp Tenant'],
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
    '/hcp/tenant?name': {
      get: {
        tags: ['Hcp Tenant'],
        summary: 'To get the list of tenants by name',
        description:
          'To get the list of tenants by name, If You need to get the data by name, you must pass the data in name query, Like this <b>name=in</b>',

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
        reference: 'ArrayOfTenant',
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
  },

  definitions: {
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
          is_distance_enabled: {
            type: 'boolean',
          },
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
          is_distance_enabled: {
            type: 'boolean',
          },
        },
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
  },
};
