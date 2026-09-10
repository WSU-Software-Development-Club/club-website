import { vercelResource } from "./_lib/handler.js";
import { createEvent, deleteEvent, getEvents, updateEvent } from "./_lib/queries.js";
import { parseEventInput } from "./_lib/validate.js";

export default vercelResource({
  list: getEvents,
  parse: parseEventInput,
  create: createEvent,
  update: updateEvent,
  remove: deleteEvent,
});
