import type {
  Context,
  EventFunction,
} from '@google-cloud/functions-framework/build/src/functions';
import type {PubsubMessage} from '@google-cloud/pubsub/build/src/publisher';
import {loadUsers} from '../../jobs';
import {getLoadId, jsonFormat} from '../../jobs/utils';
import {
  createExternalTableFromGCSBucket,
  bigQuery,
  ASANA_SOURCE_DATASET_ID,
  ASANA_USERS_SOURCE_TABLE_ID,
  USERS_SOURCE_SCHEMA,
} from '../../gcp';

export const loadUsersFunction: EventFunction = async (
  _: PubsubMessage,
  context: Context
) => {
  const users = await loadUsers();
  const loadId = getLoadId(context.eventId as string);
  const formattedUsers = jsonFormat(users, loadId);

  const externalTableId = await createExternalTableFromGCSBucket({
    prefix: 'asana_users',
    schema: USERS_SOURCE_SCHEMA,
    data: formattedUsers,
    loadId,
  });

  const usersMergeQuery = `MERGE INTO \`${ASANA_SOURCE_DATASET_ID}.${ASANA_USERS_SOURCE_TABLE_ID}\` T
USING \`${ASANA_SOURCE_DATASET_ID}.${externalTableId}\` S
ON T.id = S.id
WHEN MATCHED THEN
  UPDATE SET info = S.info, mt_loaded_at = S.mt_loaded_at, mt_load_process = S.mt_load_process
WHEN NOT MATCHED THEN
  INSERT (id, info, mt_loaded_at, mt_load_process) VALUES(id, info, mt_loaded_at, mt_load_process)`;

  console.log(usersMergeQuery);

  const [job] = await bigQuery.createQueryJob(usersMergeQuery);
  console.log(`Job ${job.id} started.`);

  const [metadata] = await job.getMetadata();
  console.log(metadata);
};
