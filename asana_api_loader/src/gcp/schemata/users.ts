import {TableField} from '@google-cloud/bigquery';

export const USERS_SOURCE_SCHEMA: TableField[] = [
  {name: 'id', type: 'BIGNUMERIC', mode: 'REQUIRED'},
  {name: 'mt_loaded_at', type: 'TIMESTAMP', mode: 'REQUIRED'},
  {name: 'mt_load_process', type: 'STRING'},
  {
    name: 'info',
    type: 'RECORD',
    fields: [
      {name: 'name', type: 'STRING'},
      {name: 'email', type: 'STRING'},
      {name: 'gid', type: 'STRING'},
    ],
    mode: 'REQUIRED',
  },
];
