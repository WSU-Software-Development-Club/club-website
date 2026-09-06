import { jsonHandler } from "./_lib/handler.js";
import { getEvents } from "./_lib/queries.js";

export default jsonHandler(getEvents);
