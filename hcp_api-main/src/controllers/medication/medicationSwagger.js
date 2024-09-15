module.exports = {
  paths: {
    '/patient/v2/medication': {
      get: {
        tags: ['Patient App Medication'],
        summary: 'Get all my active medication data',
        description: 'Get all my active medication data',

        responses: {
          200: {
            description: 'success',
            schema: {
              $ref: '#/definitions/MedicationList',
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
        tags: ['Patient App Medication'],
        summary: 'To create the my medication data',
        description: 'Create medication',
        reference: 'Medication',

        requestBody: {
          description: 'Medication object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/Medication',
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
    '/patient/v2/medication/{id}': {
      get: {
        tags: ['Patient App Medication'],
        summary: 'Get my active medication data',
        description: 'Get one active medication data by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the patient medication to get',
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
              $ref: '#/definitions/Medication',
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
      put: {
        tags: ['Patient App Medication'],
        summary: 'Update medication',
        description: 'To update single or few fields in db',
        reference: 'Medication',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the patient medication to get',
            required: true,
            schema: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
          },
        ],
        requestBody: {
          description: 'Medication object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/Medication',
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
      patch: {
        tags: ['Patient App Medication'],
        summary: 'Update medication',
        description: 'To update single or few fields in db',
        reference: 'Medication',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the patient medication to get',
            required: true,
            schema: {
              type: 'string',
              example: '64214cde9de72af903aaa4fc',
            },
          },
        ],
        requestBody: {
          description: 'Medication object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/Medication',
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
      delete: {
        tags: ['Patient App Medication'],
        summary: 'Delete medication',
        description: 'To delete in db',
        reference: 'Medication',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the medication to delete',
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
    Medication: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Dolo 650',
        },
        dosage: {
          type: 'number',
          example: 12,
        },
        dosage_unit: {
          type: 'string',
          example: 'tablet',
          enum: ['tablet', 'mg', 'ml'],
        },
        frequency: {
          type: 'number',
          example: 12,
        },
        frequency_unit: {
          type: 'string',
          example: 'A day',
        },
        reason_for_taking: {
          type: 'string',
          example: 'Test',
        },
        conditions: {
          type: 'array',
          example: ['Head ache', 'Diarrhea'],
        },
        is_active: {
          type: 'boolean',
          example: true,
          default: true,
        },
        image_file: {
          type: 'string',
          format: 'base64',
          example:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ',
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    GetMedication: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Dolo 650',
        },
        dosage: {
          type: 'number',
          example: 12,
        },
        dosage_unit: {
          type: 'string',
          example: 'tablet',
          enum: ['tablet', 'mg', 'ml', 'drops', 'capsule'],
        },
        frequency: {
          type: 'number',
          example: 12,
        },
        frequency_unit: {
          type: 'string',
          example: 'A day',
        },
        reason_for_taking: {
          type: 'string',
          example: 'Test',
        },
        conditions: {
          type: 'array',
          example: ['Head ache', 'Diarrhea'],
        },
        is_active: {
          type: 'boolean',
          example: true,
          default: true,
        },
        image_file: {
          type: 'string',
          example:
            'https://whyze-file-storage.s3.eu-west-1.amazonaws.com/medication/64214cde9de72af903aaa4fc?AWSAccessKeyId=AKIA3OCHEWSVZ2QK6EP7&Expires=1679918952&Signature=6wtSnDcVOn54P3MUSFk8S6rgLFw%3D',
        },
      },
      xml: {
        name: 'Medication',
      },
    },
    MedicationList: {
      type: 'array',
      items: {
        $ref: '#/definitions/GetMedication',
      },
    },
  },
};
