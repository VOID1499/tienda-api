const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;
const chalk = require("chalk");
module.exports = {


  myJob: {
    task: async ({ strapi }) => {
      try {
          console.log(chalk.default.bgBlue('[CRON] Buscando ordenes pendientes ...'))
        await strapi.service("api::orden.orden").eliminarOrdenesPendientes();
      } catch (error) {
        if(error instanceof ApplicationError){
          console.log(error.details)
        }
      }
    },
    options: {
      //rule: "*/5 * * * * *",
      rule: "0 3 * * *"
    },
  },
};