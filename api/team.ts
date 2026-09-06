import { jsonHandler } from "./_lib/handler.js";
import { getTeam } from "./_lib/queries.js";

export default jsonHandler(getTeam);
