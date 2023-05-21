/** Exporting singleton service type classes. */
import {BigQuery} from '@google-cloud/bigquery';
import {Storage} from '@google-cloud/storage';

export const storage = new Storage();
export const bigQuery = new BigQuery();
