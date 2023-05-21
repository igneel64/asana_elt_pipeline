import {TableField} from '@google-cloud/bigquery';

export const TASKS_SOURCE_SCHEMA: TableField[] = [
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
        name: 'assignee',
        type: 'RECORD',
        fields: [
          {name: 'gid', type: 'STRING'},
          {name: 'resource_type', type: 'STRING'},
        ],
      },
      {
        name: 'tags',
        type: 'RECORD',
        mode: 'REPEATED',
        fields: [
          {name: 'gid', type: 'STRING'},
          {name: 'resource_type', type: 'STRING'},
        ],
      },
      {
        name: 'projects',
        type: 'RECORD',
        mode: 'REPEATED',
        fields: [
          {name: 'gid', type: 'STRING'},
          {name: 'resource_type', type: 'STRING'},
        ],
      },
      {name: 'due_at', type: 'TIMESTAMP'},
      {name: 'due_on', type: 'DATE'},
      {name: 'completed', type: 'BOOLEAN'},
      {name: 'created_at', type: 'TIMESTAMP'},
      {name: 'modified_at', type: 'TIMESTAMP'},
      {name: 'completed_at', type: 'TIMESTAMP'},
      {name: 'assignee_status', type: 'STRING'},
      {name: 'actual_time_minutes', type: 'INTEGER'},
      {
        name: 'memberships',
        type: 'RECORD',
        mode: 'REPEATED',
        fields: [
          {name: 'gid', type: 'STRING'},
          {name: 'resource_type', type: 'STRING'},
        ],
      },
    ],
    mode: 'REQUIRED',
  },
];
