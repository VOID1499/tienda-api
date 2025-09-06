'use strict';

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/ordens/cancel/:documentId",
      handler: "orden.cancelar",
      config:{auth:false}
    },
  ],
};
