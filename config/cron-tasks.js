const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

module.exports = {


  myJob: {
    task: async ({ strapi }) => {
      try {
          console.log("verificando ordenes pendientes")
        await strapi.service("api::orden.orden").eliminarOrdenesPendientes();
      } catch (error) {
        if(error instanceof ApplicationError){
          console.log(error.details)
        }
      }
    },
    options: {
      rule: "*/5 * * * * *",
    },
  },
};