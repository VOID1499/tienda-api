module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'amazon-ses',
      providerOptions: {
        key: env('AWS_SES_KEY'),
        secret: env('AWS_SES_SECRET'),
        amazon: `https://email.${env('AWS_SES_REGION')}.amazonaws.com`,
      },
      settings: {
        defaultFrom: 'Michisytarot <contacto@shibi.space>',
        defaultReplyTo: 'Michisytarot <michisytarot@gmail.com>',
      },
    },
  },
 

   // Configuración del plugin Email Designer v5
  'email-designer-5': {
    enabled: true,
    config: {
      // Estos mergeTags se añaden como variables disponibles en TODAS tus plantillas
      mergeTags: {
        company: {
          name: 'Company',
          mergeTags: {
            name: {
              name: 'Nombre de la compañia',
              value: 'Michisytarot',
              sample: 'ACME Corp',
            },
            supportEmail: {
              name: 'Support Email',
              value: 'soporte@shibi.space',
              sample: 'soporte@shibi.space',
            },
          },
        },
      },
    },
  },

  
});