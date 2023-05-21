import asana from 'asana';
import {client} from './client';
import {paginate} from './utils';

const userFields = 'email,name';

async function fetchUsers(offset?: string) {
  return await client.users.findAll({
    workspace: Number(process.env.ASANA_WORKSPACE_ID),
    offset,
    opt_fields: userFields,
  });
}

export async function getUsers() {
  return await paginate<asana.resources.Users.Type[]>(fetchUsers);
}
