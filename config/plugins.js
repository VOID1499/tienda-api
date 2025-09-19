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
  // ...
});