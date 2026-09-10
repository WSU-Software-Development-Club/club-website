import { vercelResource } from "./_lib/handler.js";
import { createProject, deleteProject, getProjects, updateProject } from "./_lib/queries.js";
import { parseProjectInput } from "./_lib/validate.js";

export default vercelResource({
  list: getProjects,
  parse: parseProjectInput,
  create: createProject,
  update: updateProject,
  remove: deleteProject,
});
