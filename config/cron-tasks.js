const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;
const colors = require("colors");
module.exports = {


  myJob: {
    task: async ({ strapi }) => {
      try {
          console.log(`${colors.bgBlue('[CRON] Buscando ordenes pendientes ...')}`)
        await strapi.service("api::orden.orden").eliminarOrdenesPendientes();
      } catch (error) {
        if(error instanceof ApplicationError){
          console.log(`${colors.yellow(error.details)}`)
        }
      }
    },
    options: {
      //rule: "*/5 * * * * *",
      rule: "0 3 * * *"
    },
  },
};