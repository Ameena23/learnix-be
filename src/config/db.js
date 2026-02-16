
import { Sequelize } from "sequelize";
 
const sequelize = new Sequelize("utils", "root", "muhammed123", {
  host: "localhost",
  dialect: "mysql",
  logging: true,
});
 
export default sequelize;
 