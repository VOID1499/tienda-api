const formatearPesosCLP = require("./formatCurrency.js");
const colors = require("colors");
const pageTypes = ["api::article.article"];
const pageActions = ["create", "update"];
const sendEmailActions = ["publish"];


const enviarEmailConfirmacionDePago = () => {
  return async (context, next) => {
    
    const result = await next(); //

    if (context.action == 'update' && context.uid == 'api::orden.orden') {
      if(result.estado == 'pagada'){

        

        try {
           const orden = await strapi.documents("api::orden.orden").findOne({
            documentId:result.documentId,
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
          })
      
          console.log(colors.bgBlue(`Enviando correo de confirmacion de compra a ${result.email}`));
          await strapi.plugin('email').service('email').send({
            to: 'erick.olivares.gonzalez@gmail.com',
            bcc: 'erick.olivares.gonzalez@gmail.com',
            subject: `Confirmacion de tu compra en Michisytarot`,
            text: `
              Michisytarot

              Muchas gracias por tu compra ${orden.nombre.toUpperCase()} 😺

              Fecha de pago: ${orden.fecha_de_pago}
              Orden ID: ${orden.documentId}

              Información de envío:
              ${orden.nombre} ${orden.apellidos}
              ${orden.direccion}
              Telefono: ${orden.Telefono}

              Método de pago: ${orden.metodos_de_pago.nombre}
              Método de envío: ${orden.metodos_de_envio.nombre}

              Productos:
              ${orden.orden_detalles.map(item => `${item.snapshot_info_producto} * ${item.cantidad}`).join('\n')}

              Total de la compra CLP ${orden.total}
            `
,
            html: `
             

		 <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; padding: 20px; font-family: sans-serif;">
              <tr>
                <td align="center">
                  <table width="50%" cellpadding="0" cellspacing="5" style=" box-sizing: border-box;">

                    <tr>
                      <td style="padding: 0 20px; text-align: right; box-sizing: border-box;">
                        <h1 style="margin: 0; box-sizing: border-box;">Michisytarot</h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 5px; background: black; box-sizing: border-box;">
                        <h2 style="color: white; margin: 0; box-sizing: border-box;">Muchas gracias por tu compra ${orden.nombre.toUpperCase()} 😺</h2>
                      </td>
                    </tr>
                   

                    <tr>
                      <td style="padding: 5px; box-sizing: border-box;">
                        <span style="display:block; box-sizing: border-box;">Fecha de pago ${orden.fecha_de_pago}</span>
                        <h3 style="margin: 0; box-sizing: border-box;">Orden ID : ${orden.documentId}</h3>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 5px; box-sizing: border-box;">
                        <h3 style="margin: 0; box-sizing: border-box;">Información de envío</h3>
                        <p style="margin: 0;">
                            ${orden.nombre} ${orden.apellidos} <br>
                            ${orden.direccion} <br>
                            Telefono ${orden.Telefono}

                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 5px; box-sizing: border-box;">
                        <h3 style="margin: 0; box-sizing: border-box;">Método de pago</h3>
                        <p style="margin: 0;">${orden.metodos_de_pago.nombre}</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 5px; box-sizing: border-box;">
                        <h3 style="margin: 0; box-sizing: border-box;">Método de envío</h3>
                        <p style="margin: 0;">${orden.metodos_de_envio.nombre}</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 5px; background: black; box-sizing: border-box;">
                        <h3 style="color: white; margin: 0; box-sizing: border-box;">Total de la compra CLP ${formatearPesosCLP(orden.total)}</h3>
                      </td>
                    </tr>

                    <td style="padding: 5px;  box-sizing: border-box;">
                      ${
                        orden.orden_detalles
                          .map(item => `
                            <h4 style="margin: 0; box-sizing: border-box; border-bottom: 1px solid black;">
                              ${item.snapshot_info_producto} * ${item.cantidad}
                              <span style="float: right;">
                                c/u ${formatearPesosCLP(item.precio)} 
                              </span>
                            </h4>
                          `)
                          .join('')
                      }
                    </td>

                  </table>
                </td>
              </tr>
            </table>

            `,
          });
        } catch (err) {
          console.log(colors.bgRed(`Error al enviar correo de confirmacion de compra ${result.email} ${err}`));
        }

         

      }
    }


    return result;
  };
};



module.exports = { enviarEmailConfirmacionDePago }