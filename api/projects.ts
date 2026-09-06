import { jsonHandler } from "./_lib/handler.js";
import { getProjects } from "./_lib/queries.js";

export default jsonHandler(getProjects);
