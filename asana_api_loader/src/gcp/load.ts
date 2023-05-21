import type {TableField} from '@google-cloud/bigquery';
import {bigQuery, storage} from './services';
import {convertArrayJSONtoNDJson, getExternalTableExpiration} from './utils';
import {ASANA_SOURCE_DATASET_ID, GCP_STORAGE_LOCATION} from './constants';

type ExternalTableOptions = {
  prefix: string;
  schema: TableField[];
  data: Record<string, unknown>[];
  loadId: string;
};

const GCS_UPLOAD_FILENAME = 'upload.json';

export async function createExternalTableFromGCSBucket({
  prefix,
  schema,
  data,
  loadId,
}: ExternalTableOptions): Promise<string> {
  const bucketName = `${prefix}_${loadId}`;
  console.log(bucketName);
  const [bucket] = await storage.createBucket(bucketName, {
    location: GCP_STORAGE_LOCATION,
    standard: true,
  });

  await bucket.file(GCS_UPLOAD_FILENAME).save(convertArrayJSONtoNDJson(data));

  const fileUrl = bucket.cloudStorageURI.href + '/' + GCS_UPLOAD_FILENAME;
  console.log(fileUrl);

  const externalTableId = `${prefix}_external_${loadId}`;
  console.log(externalTableId);

  await bigQuery.dataset(ASANA_SOURCE_DATASET_ID).createTable(externalTableId, {
    schema,
    externalDataConfiguration: {
      sourceUris: [fileUrl],
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      autodetect: false,
      schema: {fields: schema},
    },
    expirationTime: getExternalTableExpiration(),
  });

  return externalTableId;
}
