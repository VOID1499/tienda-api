'use strict';
const  { enviarEmailConfirmacionDePago } = require("./utils/document-service-middlewares.js");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
    register({ strapi }) {
    const middlewares = [enviarEmailConfirmacionDePago];

    middlewares.forEach((middleware) => {
      strapi.documents.use(middleware());
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
