import { vercelResource } from "../_lib/handler.js";
import { listGames } from "../_lib/queries.js";

const notAllowed = () => {
  throw new Error("Method not allowed");
};

export default vercelResource({
  list: listGames,
  parse: notAllowed,
  create: notAllowed,
  update: notAllowed,
  remove: notAllowed,
});
