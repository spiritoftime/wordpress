import { firstPageZod } from "./firstPageFormZod";
import { thirdPageZod } from "./thirdPageFormZod";
// formschemas needs to be in an array so that the useResolver can work for multiple pages.
export const formSchemas = [
  firstPageZod,
  {}, // nothing to validate at the second page
  thirdPageZod, // last page validation object needs to have everything combined so that the data can be logged out at handleSubmit
];
