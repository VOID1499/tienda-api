const orden = require("../../orden/controllers/orden");
const { cancelarCobro } = require("./khipu");

module.exports = ({ strapi }) => {
  // Defino providers una vez cuando se crea el servicio
  const providers = {
    khipu: strapi.service("api::pasarelas.khipu"),
    // otros proveedores
  };

  return {

    async verificarEstadoDeCobro(documentId) {

       const ordenEncontrada = await strapi.documents("api::orden.orden").findOne({
        documentId:documentId,
        populate:{
          metodos_de_pago:true
        }
      })
   
      if(!ordenEncontrada){
        throw new Error(`No se encontro la orden`)
      }
      const metodo = ordenEncontrada.metodos_de_pago.nombre.trim();
      console.log(`Buscando proveedor para método: "${metodo}"`);

      const provider = providers[metodo];
      if (!provider) {
        throw new Error(`Proveedor de pago desconocido: ${metodo}`);
      }

      return await provider.verificarEstadoDeCobro(ordenEncontrada);
    },

    async cancelarCobro(documentId){
      
      const ordenEncontrada = await strapi.documents("api::orden.orden").findOne({
        documentId:documentId,
        populate:{
          metodos_de_pago:true
        }
      })
   
      if(!ordenEncontrada){
        throw new Error(`No se encontro la orden`)
      }

      const metodo = ordenEncontrada.metodos_de_pago.nombre.trim();
      console.log(`Buscando proveedor para método: "${metodo}"`);

      const provider = providers[metodo];
      if (!provider) {
        throw new Error(`Proveedor de pago desconocido: ${metodo}`);
      }
      return await provider.cancelarCobro(ordenEncontrada);
      
    },


    async crearCobro(ordenCreada,productosParaDetalleDeOrden,metodoDePago){
    
      const metodo = metodoDePago.nombre.trim();
      console.log(`Buscando proveedor para método: "${metodo}"`);

      const provider = providers[metodo];
      if (!provider) {
        throw new Error(`Proveedor de pago desconocido: ${metodo}`);
      }

      return await provider.crearCobro(ordenCreada,productosParaDetalleDeOrden,metodoDePago);

    }


  };

};