import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentContent extends Schema.CollectionType {
  collectionName: 'contents';
  info: {
    singularName: 'content';
    pluralName: 'contents';
    displayName: 'Content';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    content_type_category: Attribute.Relation<
      'api::content.content',
      'oneToOne',
      'api::content-type-category.content-type-category'
    >;
    content_type: Attribute.Relation<
      'api::content.content',
      'oneToOne',
      'api::content-type.content-type'
    >;
    question_contents: Attribute.Relation<
      'api::content.content',
      'oneToMany',
      'api::question-content.question-content'
    >;
    content_detail: Attribute.Relation<
      'api::content.content',
      'oneToOne',
      'api::content-detail.content-detail'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content.content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content.content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentByClauseContentByClause
  extends Schema.CollectionType {
  collectionName: 'content_by_clauses';
  info: {
    singularName: 'content-by-clause';
    pluralName: 'content-by-clauses';
    displayName: 'Content_By_Clause';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99;
        },
        number
      >;
    content: Attribute.Relation<
      'api::content-by-clause.content-by-clause',
      'oneToOne',
      'api::content.content'
    >;
    content_details_by_language: Attribute.Relation<
      'api::content-by-clause.content-by-clause',
      'oneToOne',
      'api::content-details-by-language.content-details-by-language'
    >;
    language: Attribute.Relation<
      'api::content-by-clause.content-by-clause',
      'oneToOne',
      'api::language.language'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-by-clause.content-by-clause',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-by-clause.content-by-clause',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentBySyllableContentBySyllable
  extends Schema.CollectionType {
  collectionName: 'content_by_syllables';
  info: {
    singularName: 'content-by-syllable';
    pluralName: 'content-by-syllables';
    displayName: 'Content_By_Syllable';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99;
        },
        number
      >;
    content: Attribute.Relation<
      'api::content-by-syllable.content-by-syllable',
      'oneToOne',
      'api::content.content'
    >;
    language: Attribute.Relation<
      'api::content-by-syllable.content-by-syllable',
      'oneToOne',
      'api::language.language'
    >;
    content_details_by_language: Attribute.Relation<
      'api::content-by-syllable.content-by-syllable',
      'oneToOne',
      'api::content-details-by-language.content-details-by-language'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-by-syllable.content-by-syllable',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-by-syllable.content-by-syllable',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentDetailContentDetail extends Schema.CollectionType {
  collectionName: 'content_details';
  info: {
    singularName: 'content-detail';
    pluralName: 'content-details';
    displayName: 'Content_Detail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    audio: Attribute.String;
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    image: Attribute.Media;
    content: Attribute.Relation<
      'api::content-detail.content-detail',
      'oneToOne',
      'api::content.content'
    >;
    language: Attribute.Relation<
      'api::content-detail.content-detail',
      'oneToOne',
      'api::language.language'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-detail.content-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-detail.content-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentDetailsByLanguageContentDetailsByLanguage
  extends Schema.CollectionType {
  collectionName: 'content_details_by_languages';
  info: {
    singularName: 'content-details-by-language';
    pluralName: 'content-details-by-languages';
    displayName: 'Content_Details_By_Language';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    content: Attribute.Relation<
      'api::content-details-by-language.content-details-by-language',
      'oneToOne',
      'api::content.content'
    >;
    language: Attribute.Relation<
      'api::content-details-by-language.content-details-by-language',
      'oneToOne',
      'api::language.language'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-details-by-language.content-details-by-language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-details-by-language.content-details-by-language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentTypeContentType extends Schema.CollectionType {
  collectionName: 'content_types';
  info: {
    singularName: 'content-type';
    pluralName: 'content-types';
    displayName: 'Content_Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 50;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-type.content-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-type.content-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentTypeCategoryContentTypeCategory
  extends Schema.CollectionType {
  collectionName: 'content_type_categories';
  info: {
    singularName: 'content-type-category';
    pluralName: 'content-type-categories';
    displayName: 'Content_Type_Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 20;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-type-category.content-type-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-type-category.content-type-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDetailsContentLanguageDetailsContentLanguage
  extends Schema.CollectionType {
  collectionName: 'details_content_languages';
  info: {
    singularName: 'details-content-language';
    pluralName: 'details-content-languages';
    displayName: 'Details_Content_Language';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content_details_by_language: Attribute.Relation<
      'api::details-content-language.details-content-language',
      'oneToOne',
      'api::content-details-by-language.content-details-by-language'
    >;
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    audio: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    image: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::details-content-language.details-content-language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::details-content-language.details-content-language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiscountPolicyDiscountPolicy extends Schema.CollectionType {
  collectionName: 'discount_policies';
  info: {
    singularName: 'discount-policy';
    pluralName: 'discount-policies';
    displayName: 'Discount_Policy';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 1000;
        },
        number
      >;
    discountMotive: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 1000;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::discount-policy.discount-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::discount-policy.discount-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInteractivityInteractivity extends Schema.CollectionType {
  collectionName: 'interactivities';
  info: {
    singularName: 'interactivity';
    pluralName: 'interactivities';
    displayName: 'Interactivity';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    examDate: Attribute.DateTime;
    learner_journey_history: Attribute.Relation<
      'api::interactivity.interactivity',
      'oneToOne',
      'api::learner-journey-history.learner-journey-history'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::interactivity.interactivity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::interactivity.interactivity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiJourneyMapQuestionContentJourneyMapQuestionContent
  extends Schema.CollectionType {
  collectionName: 'journey_map_question_contents';
  info: {
    singularName: 'journey-map-question-content';
    pluralName: 'journey-map-question-contents';
    displayName: 'Journey_Map_Question_Content';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    learning_journey_lesson: Attribute.Relation<
      'api::journey-map-question-content.journey-map-question-content',
      'oneToOne',
      'api::learning-journey-lesson.learning-journey-lesson'
    >;
    question_content: Attribute.Relation<
      'api::journey-map-question-content.journey-map-question-content',
      'oneToOne',
      'api::question-content.question-content'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::journey-map-question-content.journey-map-question-content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::journey-map-question-content.journey-map-question-content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLanguageLanguage extends Schema.CollectionType {
  collectionName: 'languages';
  info: {
    singularName: 'language';
    pluralName: 'languages';
    displayName: 'Language';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    country: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::language.language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::language.language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearnerInfoLearnerInfo extends Schema.CollectionType {
  collectionName: 'learner_infos';
  info: {
    singularName: 'learner-info';
    pluralName: 'learner-infos';
    displayName: 'Learner_Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    learning_purpose: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::learning-purpose.learning-purpose'
    >;
    learning_goal: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::learning-goal.learning-goal'
    >;
    language: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::language.language'
    >;
    privacy_policy: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::privacy-policy.privacy-policy'
    >;
    learning_journey: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::learning-journey.learning-journey'
    >;
    registered: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::registered.registered'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearnerJourneyLearnerJourney extends Schema.CollectionType {
  collectionName: 'learner_journeys';
  info: {
    singularName: 'learner-journey';
    pluralName: 'learner-journeys';
    displayName: 'Learner_Journey';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdDate: Attribute.DateTime;
    learnerAnswer: Attribute.Boolean;
    learner_info: Attribute.Relation<
      'api::learner-journey.learner-journey',
      'oneToOne',
      'api::learner-info.learner-info'
    >;
    journey_map_question_content: Attribute.Relation<
      'api::learner-journey.learner-journey',
      'oneToOne',
      'api::journey-map-question-content.journey-map-question-content'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-journey.learner-journey',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-journey.learner-journey',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearnerJourneyHistoryLearnerJourneyHistory
  extends Schema.CollectionType {
  collectionName: 'learner_journey_histories';
  info: {
    singularName: 'learner-journey-history';
    pluralName: 'learner-journey-histories';
    displayName: 'Learner_Journey_History';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    fromDate: Attribute.DateTime;
    toDate: Attribute.DateTime;
    interactivity: Attribute.Relation<
      'api::learner-journey-history.learner-journey-history',
      'oneToOne',
      'api::interactivity.interactivity'
    >;
    learner_journey: Attribute.Relation<
      'api::learner-journey-history.learner-journey-history',
      'oneToOne',
      'api::learner-journey.learner-journey'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-journey-history.learner-journey-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-journey-history.learner-journey-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearnerStartingPointLearnerStartingPoint
  extends Schema.CollectionType {
  collectionName: 'learner_starting_points';
  info: {
    singularName: 'learner-starting-point';
    pluralName: 'learner-starting-points';
    displayName: 'Learner_starting_point';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    subtitle: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    icon: Attribute.Media & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-starting-point.learner-starting-point',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-starting-point.learner-starting-point',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningGoalLearningGoal extends Schema.CollectionType {
  collectionName: 'learning_goals';
  info: {
    singularName: 'learning-goal';
    pluralName: 'learning-goals';
    displayName: 'Learning_Goal';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    time: Attribute.BigInteger &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          min: '5';
          max: '60';
        },
        string
      >;
    icon: Attribute.Media & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-goal.learning-goal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-goal.learning-goal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningGuideLearningGuide extends Schema.CollectionType {
  collectionName: 'learning_guides';
  info: {
    singularName: 'learning-guide';
    pluralName: 'learning-guides';
    displayName: 'Learning_Guide';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    details: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 5000;
      }>;
    name: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-guide.learning-guide',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-guide.learning-guide',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningJourneyLearningJourney
  extends Schema.CollectionType {
  collectionName: 'learning_journeys';
  info: {
    singularName: 'learning-journey';
    pluralName: 'learning-journeys';
    displayName: 'Learning_Journey';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 20;
      }>;
    icon: Attribute.Media;
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-journey.learning-journey',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-journey.learning-journey',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningJourneyLessonLearningJourneyLesson
  extends Schema.CollectionType {
  collectionName: 'learning_journey_lessons';
  info: {
    singularName: 'learning-journey-lesson';
    pluralName: 'learning-journey-lessons';
    displayName: 'Learning_Journey_Lesson';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    learning_journey_level: Attribute.Relation<
      'api::learning-journey-lesson.learning-journey-lesson',
      'oneToOne',
      'api::learning-journey-level.learning-journey-level'
    >;
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-journey-lesson.learning-journey-lesson',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-journey-lesson.learning-journey-lesson',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningJourneyLevelLearningJourneyLevel
  extends Schema.CollectionType {
  collectionName: 'learning_journey_levels';
  info: {
    singularName: 'learning-journey-level';
    pluralName: 'learning-journey-levels';
    displayName: 'Learning_Journey_Level';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    learning_journey_unit: Attribute.Relation<
      'api::learning-journey-level.learning-journey-level',
      'oneToOne',
      'api::learning-journey-unit.learning-journey-unit'
    >;
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-journey-level.learning-journey-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-journey-level.learning-journey-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningJourneyUnitLearningJourneyUnit
  extends Schema.CollectionType {
  collectionName: 'learning_journey_units';
  info: {
    singularName: 'learning-journey-unit';
    pluralName: 'learning-journey-units';
    displayName: 'Learning_Journey_Unit';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 20;
      }>;
    learning_journey: Attribute.Relation<
      'api::learning-journey-unit.learning-journey-unit',
      'oneToOne',
      'api::learning-journey.learning-journey'
    >;
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-journey-unit.learning-journey-unit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-journey-unit.learning-journey-unit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningPurposeLearningPurpose
  extends Schema.CollectionType {
  collectionName: 'learning_purposes';
  info: {
    singularName: 'learning-purpose';
    pluralName: 'learning-purposes';
    displayName: 'Learning_Purpose';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    purpose: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    icon: Attribute.Media & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-purpose.learning-purpose',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-purpose.learning-purpose',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearningTipLearningTip extends Schema.CollectionType {
  collectionName: 'learning_tips';
  info: {
    singularName: 'learning-tip';
    pluralName: 'learning-tips';
    displayName: 'Learning_Tip';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    details: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 5000;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learning-tip.learning-tip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learning-tip.learning-tip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPrivacyPolicyPrivacyPolicy extends Schema.CollectionType {
  collectionName: 'privacy_policies';
  info: {
    singularName: 'privacy-policy';
    pluralName: 'privacy-policies';
    displayName: 'Privacy_Policy';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    details: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 5000;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::privacy-policy.privacy-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::privacy-policy.privacy-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuestionQuestion extends Schema.CollectionType {
  collectionName: 'questions';
  info: {
    singularName: 'question';
    pluralName: 'questions';
    displayName: 'question';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    question: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    question_contents: Attribute.Relation<
      'api::question.question',
      'oneToMany',
      'api::question-content.question-content'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::question.question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::question.question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuestionContentQuestionContent
  extends Schema.CollectionType {
  collectionName: 'question_contents';
  info: {
    singularName: 'question-content';
    pluralName: 'question-contents';
    displayName: 'Question_Content';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    question: Attribute.Relation<
      'api::question-content.question-content',
      'manyToOne',
      'api::question.question'
    >;
    content: Attribute.Relation<
      'api::question-content.question-content',
      'manyToOne',
      'api::content.content'
    >;
    question_type: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'api::question-type.question-type'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuestionContentOptionQuestionContentOption
  extends Schema.CollectionType {
  collectionName: 'question_content_options';
  info: {
    singularName: 'question-content-option';
    pluralName: 'question-content-options';
    displayName: 'Question_Content_Option';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    question_content: Attribute.Relation<
      'api::question-content-option.question-content-option',
      'oneToOne',
      'api::question-content.question-content'
    >;
    contents: Attribute.Relation<
      'api::question-content-option.question-content-option',
      'oneToMany',
      'api::content.content'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::question-content-option.question-content-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::question-content-option.question-content-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuestionTypeQuestionType extends Schema.CollectionType {
  collectionName: 'question_types';
  info: {
    singularName: 'question-type';
    pluralName: 'question-types';
    displayName: 'Question_Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::question-type.question-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::question-type.question-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRefundPolicyRefundPolicy extends Schema.CollectionType {
  collectionName: 'refund_policies';
  info: {
    singularName: 'refund-policy';
    pluralName: 'refund-policies';
    displayName: 'Refund_Policy';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    condition: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 5000;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::refund-policy.refund-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::refund-policy.refund-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRegisteredRegistered extends Schema.CollectionType {
  collectionName: 'registereds';
  info: {
    singularName: 'registered';
    pluralName: 'registereds';
    displayName: 'Registered';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    lastName: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    address: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    contactNumber: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 20;
      }>;
    age: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 120;
        },
        number
      >;
    gender: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    learner_info: Attribute.Relation<
      'api::registered.registered',
      'oneToOne',
      'api::learner-info.learner-info'
    >;
    subscription: Attribute.Relation<
      'api::registered.registered',
      'oneToOne',
      'api::subscription.subscription'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::registered.registered',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::registered.registered',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriberPlanSubscriberPlan extends Schema.CollectionType {
  collectionName: 'subscriber_plans';
  info: {
    singularName: 'subscriber-plan';
    pluralName: 'subscriber-plans';
    displayName: 'Subscriber_Plan';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    price: Attribute.Integer;
    timeDuration: Attribute.DateTime;
    discount_policy: Attribute.Relation<
      'api::subscriber-plan.subscriber-plan',
      'oneToOne',
      'api::discount-policy.discount-policy'
    >;
    refund_policy: Attribute.Relation<
      'api::subscriber-plan.subscriber-plan',
      'oneToOne',
      'api::refund-policy.refund-policy'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscriber-plan.subscriber-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscriber-plan.subscriber-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionSubscription extends Schema.CollectionType {
  collectionName: 'subscriptions';
  info: {
    singularName: 'subscription';
    pluralName: 'subscriptions';
    displayName: 'Subscription';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    subscriber_plan: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'api::subscriber-plan.subscriber-plan'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTermAndConditionTermAndCondition
  extends Schema.CollectionType {
  collectionName: 'term_and_conditions';
  info: {
    singularName: 'term-and-condition';
    pluralName: 'term-and-conditions';
    displayName: 'Term_And_Condition';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    privacy_policy: Attribute.Relation<
      'api::term-and-condition.term-and-condition',
      'oneToOne',
      'api::privacy-policy.privacy-policy'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::term-and-condition.term-and-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::term-and-condition.term-and-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::content.content': ApiContentContent;
      'api::content-by-clause.content-by-clause': ApiContentByClauseContentByClause;
      'api::content-by-syllable.content-by-syllable': ApiContentBySyllableContentBySyllable;
      'api::content-detail.content-detail': ApiContentDetailContentDetail;
      'api::content-details-by-language.content-details-by-language': ApiContentDetailsByLanguageContentDetailsByLanguage;
      'api::content-type.content-type': ApiContentTypeContentType;
      'api::content-type-category.content-type-category': ApiContentTypeCategoryContentTypeCategory;
      'api::details-content-language.details-content-language': ApiDetailsContentLanguageDetailsContentLanguage;
      'api::discount-policy.discount-policy': ApiDiscountPolicyDiscountPolicy;
      'api::interactivity.interactivity': ApiInteractivityInteractivity;
      'api::journey-map-question-content.journey-map-question-content': ApiJourneyMapQuestionContentJourneyMapQuestionContent;
      'api::language.language': ApiLanguageLanguage;
      'api::learner-info.learner-info': ApiLearnerInfoLearnerInfo;
      'api::learner-journey.learner-journey': ApiLearnerJourneyLearnerJourney;
      'api::learner-journey-history.learner-journey-history': ApiLearnerJourneyHistoryLearnerJourneyHistory;
      'api::learner-starting-point.learner-starting-point': ApiLearnerStartingPointLearnerStartingPoint;
      'api::learning-goal.learning-goal': ApiLearningGoalLearningGoal;
      'api::learning-guide.learning-guide': ApiLearningGuideLearningGuide;
      'api::learning-journey.learning-journey': ApiLearningJourneyLearningJourney;
      'api::learning-journey-lesson.learning-journey-lesson': ApiLearningJourneyLessonLearningJourneyLesson;
      'api::learning-journey-level.learning-journey-level': ApiLearningJourneyLevelLearningJourneyLevel;
      'api::learning-journey-unit.learning-journey-unit': ApiLearningJourneyUnitLearningJourneyUnit;
      'api::learning-purpose.learning-purpose': ApiLearningPurposeLearningPurpose;
      'api::learning-tip.learning-tip': ApiLearningTipLearningTip;
      'api::privacy-policy.privacy-policy': ApiPrivacyPolicyPrivacyPolicy;
      'api::question.question': ApiQuestionQuestion;
      'api::question-content.question-content': ApiQuestionContentQuestionContent;
      'api::question-content-option.question-content-option': ApiQuestionContentOptionQuestionContentOption;
      'api::question-type.question-type': ApiQuestionTypeQuestionType;
      'api::refund-policy.refund-policy': ApiRefundPolicyRefundPolicy;
      'api::registered.registered': ApiRegisteredRegistered;
      'api::subscriber-plan.subscriber-plan': ApiSubscriberPlanSubscriberPlan;
      'api::subscription.subscription': ApiSubscriptionSubscription;
      'api::term-and-condition.term-and-condition': ApiTermAndConditionTermAndCondition;
    }
  }
}
