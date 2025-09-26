import type { Schema, Struct } from '@strapi/strapi';

export interface InfoConfiguracionEmail extends Struct.ComponentSchema {
  collectionName: 'components_info_configuracion_emails';
  info: {
    displayName: 'configuracion_email';
  };
  attributes: {
    bcc: Schema.Attribute.Component<'info.email', true>;
    cc: Schema.Attribute.Component<'info.email', true>;
    from: Schema.Attribute.Email & Schema.Attribute.Required;
    reply_to: Schema.Attribute.Email & Schema.Attribute.Required;
  };
}

export interface InfoEmail extends Struct.ComponentSchema {
  collectionName: 'components_info_emails';
  info: {
    displayName: 'email';
  };
  attributes: {
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface InfoLinkTexto extends Struct.ComponentSchema {
  collectionName: 'components_info_link_textos';
  info: {
    displayName: 'link_texto';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
    texto: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InfoRedSocial extends Struct.ComponentSchema {
  collectionName: 'components_info_red_socials';
  info: {
    displayName: 'link_imagen';
  };
  attributes: {
    imagen: Schema.Attribute.Media<'files' | 'images'> &
      Schema.Attribute.Required;
    link: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface InfoTituloInformacion extends Struct.ComponentSchema {
  collectionName: 'components_info_titulo_informacions';
  info: {
    displayName: 'titulo_informacion';
  };
  attributes: {
    informacion: Schema.Attribute.Text & Schema.Attribute.Required;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'info.configuracion-email': InfoConfiguracionEmail;
      'info.email': InfoEmail;
      'info.link-texto': InfoLinkTexto;
      'info.red-social': InfoRedSocial;
      'info.titulo-informacion': InfoTituloInformacion;
    }
  }
}
