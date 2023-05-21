import {client} from './client';
import {paginate} from './utils';
import asana from 'asana';

const projectFields =
  'archived,completed,created_at,completed_at,modified_at,name,owner,members';

async function fetchProjects(offset?: string) {
  return await client.projects.findAll({
    workspace: Number(process.env.ASANA_WORKSPACE_ID),
    offset,
    opt_fields: projectFields,
  });
}

export async function getProjects() {
  return await paginate<asana.resources.Projects.Type[]>(fetchProjects);
}
