import {getUsers} from '../asana/users';

export async function loadUsers() {
  return await getUsers();
}
