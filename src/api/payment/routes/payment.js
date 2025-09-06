'use strict';

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/payment/init",
      handler: "payment.crearCobro",
      config: { auth: false },
    },
  ],
};