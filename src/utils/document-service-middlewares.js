
const formatearPesosCLP = require("./formatCurrency.js");
const pageTypes = ["api::orden.orden"];
const pageActions = ["update"];
const chalk = require("chalk");

const sendEmailActions = ["publish"];

const moment = require("moment-timezone");
const infoSite = require("../api/informacion-del-sitio/controllers/informacion-del-sitio.js");
require("moment/locale/es");
moment.locale("es");


const enviarEmailConfirmacionDePago = () => {
  return async (context, next) => {
    const { uid, action, params } = context;
    
    try {

      
      if (pageTypes.includes(uid) && pageActions.includes(action) && params.data.estado) {

        const infoSite = await strapi.documents("api::informacion-del-sitio.informacion-del-sitio").findFirst({
          fields:[],
          populate:{
            bcc:true,
            cc:true
          }
        });

         const ccEmails = infoSite.cc?.map(item => item.email) || [];
         const bccEmails = infoSite.bcc?.map(item => item.email) || [];
       
        // Obtener estado anterior antes de ejecutar el update
        const previous = await strapi.documents("api::orden.orden").findOne({
          documentId:params.documentId,
            populate:{
              metodos_de_envio:{
                fields:["nombre"]
              },
              metodos_de_pago:{
                fields:["nombre"]
              },
              orden_detalles:{
                fields:["cantidad","precio","subtotal","snapshot_info_producto"]
              }
            }
        });

        
        // Ejecuta el update
        const result = await next();

        // Comparar estado y disparar correo solo si cambió a 'pagada'
        if (previous.estado !== result.estado && result.estado === 'pagada') {
          
          previous.orden_detalles.forEach(element => {
              element.precio =  formatearPesosCLP(element.precio)
          });

          previous.createdAt = moment(previous.createdAt).tz("America/Santiago").format('MMMM YYYY h:mm:ss a');

          console.log(chalk.default.bgBlue("Enviando correo confirmacion de compra"))
          
          await strapi
          .plugin("email-designer-5")
          .service("email")
          .sendTemplatedEmail(
              {
              to:previous.email,
              cc:ccEmails,
              bcc:bccEmails,
              },
              {
                templateReferenceId:1,
                subject: `Confirmacion de compra`,
              },
              {
                orden:{...previous}
              }
          )
        
        }

        return result;
      }

      // Si no es update de estado, solo ejecuta next()
      return await next();

    } catch (error) {
      console.error(chalk.default.bgRed(`Error al enviar correo de confirmacion de compra: ${error}`));
      // No relanzamos el error para no afectar el flujo de Strapi
      return await next();
    }
  };
}

module.exports = { enviarEmailConfirmacionDePago }