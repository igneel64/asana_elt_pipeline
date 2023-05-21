import {TableField} from '@google-cloud/bigquery';

export const PROJECTS_SOURCE_SCHEMA: TableField[] = [
  {name: 'id', type: 'BIGNUMERIC', mode: 'REQUIRED'},
  {name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED'},
  {name: 'mt_loaded_at', type: 'TIMESTAMP', mode: 'REQUIRED'},
  {name: 'mt_load_process', type: 'STRING'},
  {
    name: 'info',
    type: 'RECORD',
    fields: [
      {name: 'gid', type: 'STRING'},
      {name: 'name', type: 'STRING'},
      {
        name: 'owner',
        type: 'RECORD',
        fields: [
          {name: 'gid', type: 'STRING'},
          {name: 'resource_type', type: 'STRING'},
        ],
      },
      {
        name: 'members',
        type: 'RECORD',
        mode: 'REPEATED',
        fields: [
          {name: 'gid', type: 'STRING'},
          {name: 'resource_type', type: 'STRING'},
        ],
      },
      {name: 'archived', type: 'BOOLEAN'},
      {name: 'completed', type: 'BOOLEAN'},
      {name: 'created_at', type: 'TIMESTAMP'},
      {name: 'modified_at', type: 'TIMESTAMP'},
      {name: 'completed_at', type: 'TIMESTAMP'},
    ],
    mode: 'REQUIRED',
  },
];
