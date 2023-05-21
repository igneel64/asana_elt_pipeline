import {getProjects} from '../asana/projects';

export async function loadProjects() {
  return await getProjects();
}
