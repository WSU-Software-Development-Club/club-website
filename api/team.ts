import { vercelResource } from "./_lib/handler.js";
import { createTeamMember, deleteTeamMember, getTeam, updateTeamMember } from "./_lib/queries.js";
import { parseTeamInput } from "./_lib/validate.js";

export default vercelResource({
  list: getTeam,
  parse: parseTeamInput,
  create: createTeamMember,
  update: updateTeamMember,
  remove: deleteTeamMember,
});
