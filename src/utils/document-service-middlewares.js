const { Result } = require("pg");
const orden = require("../api/orden/controllers/orden.js");
const formatearPesosCLP = require("./formatCurrency.js");
const colors = require("colors");
const pageTypes = ["api::orden.orden"];
const pageActions = ["update"];
const sendEmailActions = ["publish"];

const enviarEmailConfirmacionDePago = () => {
  return async (context, next) => {
    const { uid, action, params } = context;
    
    try {
      // Solo si es un update de orden y viene el campo estado
      if (pageTypes.includes(uid) && pageActions.includes(action) && params.data.estado) {
        
       
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
          
          console.log(previous)
          await strapi.plugin('email').service('email').send({
            to: previous.email,
            bcc: 'erick.olivares.gonzalez@gmail.com',
            subject: `Confirmacion de tu compra en Michisytarot`,
            text: `
              Michisytarot

              Muchas gracias por tu compra ${previous.nombre.toUpperCase()} 😺

              Fecha de pago: ${previous.fecha_de_pago}
              Orden ID: ${previous.documentId}

              Información de envío:
              ${previous.nombre} ${previous.apellidos}
              ${previous.direccion}
              Telefono: ${previous.telefono}

              Método de pago: ${previous.metodos_de_pago.nombre}
              Método de envío: ${previous.metodos_de_envio.nombre}

              Productos:
              ${previous.orden_detalles.map(item => `${item.snapshot_info_producto} * ${item.cantidad}`).join('\n')}

              Total de la compra CLP ${previous.total}
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
                                  <h2 style="color: white; margin: 0; box-sizing: border-box;">Muchas gracias por tu compra ${previous.nombre.toUpperCase()} 😺</h2>
                                </td>
                              </tr>
                            

                              <tr>
                                <td style="padding: 5px; box-sizing: border-box;">
                                  <span style="display:block; box-sizing: border-box;">Fecha de pago ${previous.fecha_de_pago}</span>
                                  <h3 style="margin: 0; box-sizing: border-box;">Orden ID : ${previous.documentId}</h3>
                                </td>
                              </tr>

                              <tr>
                                <td style="padding: 5px; box-sizing: border-box;">
                                  <h3 style="margin: 0; box-sizing: border-box;">Información de envío</h3>
                                  <p style="margin: 0;">
                                      ${previous.nombre} ${previous.apellidos} <br>
                                      ${previous.direccion} <br>
                                      Telefono ${previous.telefono}

                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td style="padding: 5px; box-sizing: border-box;">
                                  <h3 style="margin: 0; box-sizing: border-box;">Método de pago</h3>
                                  <p style="margin: 0;">${previous.metodos_de_pago.nombre}</p>
                                </td>
                              </tr>

                              <tr>
                                <td style="padding: 5px; box-sizing: border-box;">
                                  <h3 style="margin: 0; box-sizing: border-box;">Método de envío</h3>
                                  <p style="margin: 0;">${previous.metodos_de_envio.nombre}</p>
                                </td>
                              </tr>

                              <tr>
                                <td style="padding: 5px; background: black; box-sizing: border-box;">
                                  <h3 style="color: white; margin: 0; box-sizing: border-box;">Total de la compra CLP ${formatearPesosCLP(previous.total)}</h3>
                                </td>
                              </tr>

                              <td style="padding: 5px;  box-sizing: border-box;">
                                ${
                                  previous.orden_detalles
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
        
        }

        return result;
      }

      // Si no es update de estado, solo ejecuta next()
      return await next();

    } catch (error) {
      console.error('Error al enviar correo de confirmacion de compra:', error);
      // No relanzamos el error para no afectar el flujo de Strapi
      return await next();
    }
  };
}

module.exports = { enviarEmailConfirmacionDePago }