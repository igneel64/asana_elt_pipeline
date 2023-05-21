import format from 'pg-format';
import {ASANA_PROJECTS_TABLE} from './constants';
import {query} from '.';

export async function getProjectIds() {
  const projectIdsStm = format(
    `select distinct id from ${ASANA_PROJECTS_TABLE}`
  );
  const res = await query(projectIdsStm);
  const projectIds = res.rows.map(({id}) => id);
  return projectIds;
}
