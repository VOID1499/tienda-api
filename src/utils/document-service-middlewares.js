
const pageTypes = ["api::article.article"];
const pageActions = ["create", "update"];
const sendEmailActions = ["publish"];


const testMiddleware = () => {
  return async (context, next) => {

    if (context.action === 'update' && context.uid == 'api::orden.orden' ) {
      //console.log("Antes de crear:", context.params.data);
    }

    const result = await next(); // Aquí Strapi hace el "insert" en DB

    if (context.action == 'update' && context.uid == 'api::orden.orden') {
      //enviar correo para orden pagada
    }


    return result;
  };
};



module.exports = { testMiddleware }