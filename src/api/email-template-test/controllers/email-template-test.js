

const formatearPesosCLP = require("../../../utils/formatCurrency.js");
const moment = require("moment-timezone");
require("moment/locale/es");
moment.locale("es");

const { createCoreController } = require('@strapi/strapi').factories;





module.exports = createCoreController('api::orden.orden',({ strapi }) =>  ({


   async confirmacionDeCompra(ctx) {

   
   const { data } = ctx.request.body;

   
    try {
       const emailData = await strapi.documents("api::informacion-del-sitio.informacion-del-sitio").findFirst({
          fields:[],
          populate:{
            bcc:true,
            cc:true
          }
        });
        
      // Extraer emails como arrays de strings
         const ccEmails = emailData.cc?.map(item => item.email) || [];
         const bccEmails = emailData.bcc?.map(item => item.email) || [];

        const previous = await strapi.documents("api::orden.orden").findOne({
          documentId:data.documentId,
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
      
      
      if(previous){
         
         previous.orden_detalles.forEach(element => {
            element.precio =  formatearPesosCLP(element.precio)
         });

         previous.createdAt = moment(previous.createdAt).tz("America/Santiago").format('MMMM YYYY h:mm:ss a');

         console.log(previous)

         await strapi
         .plugin("email-designer-5")
         .service("email")
         .sendTemplatedEmail(
            {
            to:"erick.olivares.gonzalez@gmail.com",
            cc:ccEmails,
            bcc:bccEmails,
            },
            {
               templateReferenceId:1,
            },
            {
               orden:{...previous}
            }
         )
      }  



      ctx.send();

    } catch (error) {
      console.log(error)
    }



   }





}));