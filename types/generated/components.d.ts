import type { Schema, Struct } from '@strapi/strapi';

export interface InformacionDelSitioPreguntasRespuestas
  extends Struct.ComponentSchema {
  collectionName: 'components_informacion_del_sitio_preguntas_respuestas';
  info: {
    displayName: 'pregunta_respuesta';
  };
  attributes: {
    pregunta: Schema.Attribute.Text & Schema.Attribute.Required;
    respuesta: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface InformacionDelSitioRedSocial extends Struct.ComponentSchema {
  collectionName: 'components_informacion_del_sitio_red_socials';
  info: {
    displayName: 'red_social';
  };
  attributes: {
    imagen: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    link: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'informacion-del-sitio.preguntas-respuestas': InformacionDelSitioPreguntasRespuestas;
      'informacion-del-sitio.red-social': InformacionDelSitioRedSocial;
    }
  }
}
