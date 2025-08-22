'use strict';
const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

/**
 * orden controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::orden.orden',({ strapi }) =>  ({

  // Method 1: Creating an entirely custom action
  async cancelar(ctx) {
    try {
      const { documentId } = ctx.params;    

       await strapi.service("api::pasarelas.payment-dispatcher").cancelarCobro(documentId);

       await strapi.service("api::orden.orden").cambiarEstadoOrden(documentId,"cancelada")

       ctx.send();

    } catch (error) {
     
      console.log(error)
      if(error instanceof ApplicationError){
        ctx.status = 422;
        ctx.body = {
          data:{
            error: {
              message: error.message,
              detalles: error.details,
            }
          }
        };
        return;
      }

    }
  },



}));
