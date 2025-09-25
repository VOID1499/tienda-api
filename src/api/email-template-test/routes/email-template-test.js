'use strict';

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/email-template-test/confirmacion-de-compra",
      handler: "email-template-test.confirmacionDeCompra",
      config:{auth:false}
    },
  ],
};
