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
    learner_info: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::learner-info.learner-info'
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

export interface ApiArabicTxTypeArabicTxType extends Schema.CollectionType {
  collectionName: 'arabic_tx_types';
  info: {
    singularName: 'arabic-tx-type';
    pluralName: 'arabic-tx-types';
    displayName: 'Arabic_TX_Type';
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::arabic-tx-type.arabic-tx-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::arabic-tx-type.arabic-tx-type',
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
    content_details: Attribute.Relation<
      'api::content.content',
      'oneToMany',
      'api::content-detail.content-detail'
    >;
    content_category: Attribute.Relation<
      'api::content.content',
      'oneToOne',
      'api::content-category.content-category'
    >;
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    audio: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    image: Attribute.Media<'images'>;
    content_category_types: Attribute.Relation<
      'api::content.content',
      'oneToMany',
      'api::content-category-type.content-category-type'
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

export interface ApiContentCategoryContentCategory
  extends Schema.CollectionType {
  collectionName: 'content_categories';
  info: {
    singularName: 'content-category';
    pluralName: 'content-categories';
    displayName: 'Content_Category';
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-category.content-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-category.content-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentCategoryTypeContentCategoryType
  extends Schema.CollectionType {
  collectionName: 'content_category_types';
  info: {
    singularName: 'content-category-type';
    pluralName: 'content-category-types';
    displayName: 'Content_Category_Type';
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
      'api::content-category-type.content-category-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-category-type.content-category-type',
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
    language: Attribute.Relation<
      'api::content-detail.content-detail',
      'oneToOne',
      'api::language.language'
    >;
    content: Attribute.Relation<
      'api::content-detail.content-detail',
      'manyToOne',
      'api::content.content'
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

export interface ApiExamExam extends Schema.CollectionType {
  collectionName: 'exams';
  info: {
    singularName: 'exam';
    pluralName: 'exams';
    displayName: 'Exam';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    examDetails: Attribute.String;
    learning_journey_level: Attribute.Relation<
      'api::exam.exam',
      'oneToOne',
      'api::learning-journey-level.learning-journey-level'
    >;
    numberOfQuestions: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 999;
        },
        number
      >;
    correctAnswer: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 999;
        },
        number
      >;
    users_permissions_user: Attribute.Relation<
      'api::exam.exam',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Private;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::exam.exam', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::exam.exam', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiGamificationTxGamificationTx extends Schema.CollectionType {
  collectionName: 'gamification_txes';
  info: {
    singularName: 'gamification-tx';
    pluralName: 'gamification-txes';
    displayName: 'Gamification_TX';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    gamification_tx_type: Attribute.Relation<
      'api::gamification-tx.gamification-tx',
      'oneToOne',
      'api::gamification-tx-type.gamification-tx-type'
    >;
    gamification_type: Attribute.Relation<
      'api::gamification-tx.gamification-tx',
      'oneToOne',
      'api::gamification-type.gamification-type'
    >;
    transactionName: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    transactionDetails: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 5000;
      }>;
    gamification_tx_amount: Attribute.Relation<
      'api::gamification-tx.gamification-tx',
      'oneToOne',
      'api::gamification-tx-amount.gamification-tx-amount'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gamification-tx.gamification-tx',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gamification-tx.gamification-tx',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGamificationTxAmountGamificationTxAmount
  extends Schema.CollectionType {
  collectionName: 'gamification_tx_amounts';
  info: {
    singularName: 'gamification-tx-amount';
    pluralName: 'gamification-tx-amounts';
    displayName: 'Gamification_TX_Amount';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    gamification_tx: Attribute.Relation<
      'api::gamification-tx-amount.gamification-tx-amount',
      'oneToOne',
      'api::gamification-tx.gamification-tx'
    >;
    amount: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 99999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    price: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gamification-tx-amount.gamification-tx-amount',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gamification-tx-amount.gamification-tx-amount',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGamificationTxTypeGamificationTxType
  extends Schema.CollectionType {
  collectionName: 'gamification_tx_types';
  info: {
    singularName: 'gamification-tx-type';
    pluralName: 'gamification-tx-types';
    displayName: 'Gamification_TX_Type';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    typeName: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gamification-tx-type.gamification-tx-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gamification-tx-type.gamification-tx-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGamificationTypeGamificationType
  extends Schema.CollectionType {
  collectionName: 'gamification_types';
  info: {
    singularName: 'gamification-type';
    pluralName: 'gamification-types';
    displayName: 'Gamification_Type';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    typeName: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gamification-type.gamification-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gamification-type.gamification-type',
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
    sequence: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 999999;
        },
        number
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

export interface ApiLearnerGamificationLearnerGamification
  extends Schema.CollectionType {
  collectionName: 'learner_gamifications';
  info: {
    singularName: 'learner-gamification';
    pluralName: 'learner-gamifications';
    displayName: 'Learner_Gamification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::learner-gamification.learner-gamification',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    validDate: Attribute.DateTime;
    gamification_tx: Attribute.Relation<
      'api::learner-gamification.learner-gamification',
      'oneToOne',
      'api::gamification-tx.gamification-tx'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-gamification.learner-gamification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-gamification.learner-gamification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLearnerGamificationStockLearnerGamificationStock
  extends Schema.CollectionType {
  collectionName: 'learner_gamification_stocks';
  info: {
    singularName: 'learner-gamification-stock';
    pluralName: 'learner-gamification-stocks';
    displayName: 'Learner_Gamification_Stock';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::learner-gamification-stock.learner-gamification-stock',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Private;
    gamification_type: Attribute.Relation<
      'api::learner-gamification-stock.learner-gamification-stock',
      'oneToOne',
      'api::gamification-type.gamification-type'
    >;
    stock: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 9999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-gamification-stock.learner-gamification-stock',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-gamification-stock.learner-gamification-stock',
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
    learning_purpose: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::learning-purpose.learning-purpose'
    >;
    social_traffic: Attribute.Relation<
      'api::learner-info.learner-info',
      'oneToOne',
      'api::social-traffic.social-traffic'
    >;
    termsAndConditions: Attribute.Boolean & Attribute.DefaultTo<false>;
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
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::learner-journey.learner-journey',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Private;
    learning_journey_lesson: Attribute.Relation<
      'api::learner-journey.learner-journey',
      'oneToOne',
      'api::learning-journey-lesson.learning-journey-lesson'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
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

export interface ApiLearnerProgressLearnerProgress
  extends Schema.CollectionType {
  collectionName: 'learner_progresses';
  info: {
    singularName: 'learner-progress';
    pluralName: 'learner-progresses';
    displayName: 'Learner_Progress';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    progressId: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 9999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    users_permissions_user: Attribute.Relation<
      'api::learner-progress.learner-progress',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Private;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-progress.learner-progress',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-progress.learner-progress',
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
    icon: Attribute.Media<'images'> & Attribute.Required;
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

export interface ApiLearnerStreakLearnerStreak extends Schema.CollectionType {
  collectionName: 'learner_streaks';
  info: {
    singularName: 'learner-streak';
    pluralName: 'learner-streaks';
    displayName: 'Learner_Streak';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    present: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    users_permissions_user: Attribute.Relation<
      'api::learner-streak.learner-streak',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    checked: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::learner-streak.learner-streak',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::learner-streak.learner-streak',
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
    icon: Attribute.Media<'images'> & Attribute.Required;
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
    icon: Attribute.Media<'images'>;
    sequence: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 999;
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
    lessonSequence: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 9999;
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
    taskSequence: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 999;
        },
        number
      >;
    dates: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    injaz: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    numberOfQuestions: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 5;
          max: 20;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    passMark: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 40;
          max: 100;
        },
        number
      > &
      Attribute.DefaultTo<40>;
    mysteryBox: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
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
    unitSequence: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 999;
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
    icon: Attribute.Media<'images'> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
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

export interface ApiLessonPracticeLessonPractice extends Schema.CollectionType {
  collectionName: 'lesson_practices';
  info: {
    singularName: 'lesson-practice';
    pluralName: 'lesson-practices';
    displayName: 'Lesson_Practice';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::lesson-practice.lesson-practice',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    learning_journey_lesson: Attribute.Relation<
      'api::lesson-practice.lesson-practice',
      'oneToOne',
      'api::learning-journey-lesson.learning-journey-lesson'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::lesson-practice.lesson-practice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::lesson-practice.lesson-practice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPaymentPayment extends Schema.CollectionType {
  collectionName: 'payments';
  info: {
    singularName: 'payment';
    pluralName: 'payments';
    displayName: 'Payment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    paymentStatus: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    subscription: Attribute.Relation<
      'api::payment.payment',
      'oneToOne',
      'api::subscription.subscription'
    >;
    address: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 50000;
      }>;
    phone: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    gamification_tx: Attribute.Relation<
      'api::payment.payment',
      'oneToOne',
      'api::gamification-tx.gamification-tx'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::payment.payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::payment.payment',
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
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    details: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 999999999;
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
    displayName: 'Question';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    audio: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    question: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    image: Attribute.Media<'images'>;
    question_detail: Attribute.Relation<
      'api::question.question',
      'oneToOne',
      'api::question-detail.question-detail'
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
    question_type: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'api::question-type.question-type'
    >;
    question_content_option: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'api::question-content-option.question-content-option'
    >;
    contents: Attribute.Relation<
      'api::question-content.question-content',
      'oneToMany',
      'api::content.content'
    >;
    questions: Attribute.Relation<
      'api::question-content.question-content',
      'oneToMany',
      'api::question.question'
    >;
    questionText: Attribute.Boolean & Attribute.DefaultTo<false>;
    questionImage: Attribute.Boolean & Attribute.DefaultTo<false>;
    questionAudio: Attribute.Boolean & Attribute.DefaultTo<false>;
    arabic_tx_type: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'api::arabic-tx-type.arabic-tx-type'
    >;
    language: Attribute.Relation<
      'api::question-content.question-content',
      'oneToOne',
      'api::language.language'
    >;
    contentText: Attribute.Boolean & Attribute.DefaultTo<false>;
    contentAudio: Attribute.Boolean & Attribute.DefaultTo<false>;
    contentImage: Attribute.Boolean & Attribute.DefaultTo<false>;
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

export interface ApiQuestionDetailQuestionDetail extends Schema.CollectionType {
  collectionName: 'question_details';
  info: {
    singularName: 'question-detail';
    pluralName: 'question-details';
    displayName: 'Question_Detail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    language: Attribute.Relation<
      'api::question-detail.question-detail',
      'oneToOne',
      'api::language.language'
    >;
    audio: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    question: Attribute.Relation<
      'api::question-detail.question-detail',
      'oneToOne',
      'api::question.question'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::question-detail.question-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::question-detail.question-detail',
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
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    condition: Attribute.Text &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 5000;
      }>;
    refundDetails: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 50000;
      }>;
    images: Attribute.Media<'images', true>;
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
    subscription: Attribute.Relation<
      'api::registered.registered',
      'oneToOne',
      'api::subscription.subscription'
    >;
    users_permissions_user: Attribute.Relation<
      'api::registered.registered',
      'oneToOne',
      'plugin::users-permissions.user'
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

export interface ApiSocialTrafficSocialTraffic extends Schema.CollectionType {
  collectionName: 'social_traffics';
  info: {
    singularName: 'social-traffic';
    pluralName: 'social-traffics';
    displayName: 'Social_Traffic';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    trafficName: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 100;
      }>;
    icon: Attribute.Media<'images'> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::social-traffic.social-traffic',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::social-traffic.social-traffic',
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
    users_permissions_user: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    subscription_plan: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'api::subscription-plan.subscription-plan'
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

export interface ApiSubscriptionPlanSubscriptionPlan
  extends Schema.CollectionType {
  collectionName: 'subscription_plans';
  info: {
    singularName: 'subscription-plan';
    pluralName: 'subscription-plans';
    displayName: 'Subscription_Plan';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    planName: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    durationDescription: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    monthDuration: Attribute.Integer &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          max: 100;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    price: Attribute.Integer &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          max: 999999;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    subscription_plan_features: Attribute.Relation<
      'api::subscription-plan.subscription-plan',
      'oneToMany',
      'api::subscription-plan-feature.subscription-plan-feature'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription-plan.subscription-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription-plan.subscription-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionPlanFeatureSubscriptionPlanFeature
  extends Schema.CollectionType {
  collectionName: 'subscription_plan_features';
  info: {
    singularName: 'subscription-plan-feature';
    pluralName: 'subscription-plan-features';
    displayName: 'Subscription_Plan_Feature';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    featureName: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    featureDetails: Attribute.Text &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription-plan-feature.subscription-plan-feature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription-plan-feature.subscription-plan-feature',
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
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    details: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 999999999;
      }>;
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
      'api::arabic-tx-type.arabic-tx-type': ApiArabicTxTypeArabicTxType;
      'api::content.content': ApiContentContent;
      'api::content-by-clause.content-by-clause': ApiContentByClauseContentByClause;
      'api::content-by-syllable.content-by-syllable': ApiContentBySyllableContentBySyllable;
      'api::content-category.content-category': ApiContentCategoryContentCategory;
      'api::content-category-type.content-category-type': ApiContentCategoryTypeContentCategoryType;
      'api::content-detail.content-detail': ApiContentDetailContentDetail;
      'api::discount-policy.discount-policy': ApiDiscountPolicyDiscountPolicy;
      'api::exam.exam': ApiExamExam;
      'api::gamification-tx.gamification-tx': ApiGamificationTxGamificationTx;
      'api::gamification-tx-amount.gamification-tx-amount': ApiGamificationTxAmountGamificationTxAmount;
      'api::gamification-tx-type.gamification-tx-type': ApiGamificationTxTypeGamificationTxType;
      'api::gamification-type.gamification-type': ApiGamificationTypeGamificationType;
      'api::journey-map-question-content.journey-map-question-content': ApiJourneyMapQuestionContentJourneyMapQuestionContent;
      'api::language.language': ApiLanguageLanguage;
      'api::learner-gamification.learner-gamification': ApiLearnerGamificationLearnerGamification;
      'api::learner-gamification-stock.learner-gamification-stock': ApiLearnerGamificationStockLearnerGamificationStock;
      'api::learner-info.learner-info': ApiLearnerInfoLearnerInfo;
      'api::learner-journey.learner-journey': ApiLearnerJourneyLearnerJourney;
      'api::learner-progress.learner-progress': ApiLearnerProgressLearnerProgress;
      'api::learner-starting-point.learner-starting-point': ApiLearnerStartingPointLearnerStartingPoint;
      'api::learner-streak.learner-streak': ApiLearnerStreakLearnerStreak;
      'api::learning-goal.learning-goal': ApiLearningGoalLearningGoal;
      'api::learning-guide.learning-guide': ApiLearningGuideLearningGuide;
      'api::learning-journey.learning-journey': ApiLearningJourneyLearningJourney;
      'api::learning-journey-lesson.learning-journey-lesson': ApiLearningJourneyLessonLearningJourneyLesson;
      'api::learning-journey-level.learning-journey-level': ApiLearningJourneyLevelLearningJourneyLevel;
      'api::learning-journey-unit.learning-journey-unit': ApiLearningJourneyUnitLearningJourneyUnit;
      'api::learning-purpose.learning-purpose': ApiLearningPurposeLearningPurpose;
      'api::learning-tip.learning-tip': ApiLearningTipLearningTip;
      'api::lesson-practice.lesson-practice': ApiLessonPracticeLessonPractice;
      'api::payment.payment': ApiPaymentPayment;
      'api::privacy-policy.privacy-policy': ApiPrivacyPolicyPrivacyPolicy;
      'api::question.question': ApiQuestionQuestion;
      'api::question-content.question-content': ApiQuestionContentQuestionContent;
      'api::question-content-option.question-content-option': ApiQuestionContentOptionQuestionContentOption;
      'api::question-detail.question-detail': ApiQuestionDetailQuestionDetail;
      'api::question-type.question-type': ApiQuestionTypeQuestionType;
      'api::refund-policy.refund-policy': ApiRefundPolicyRefundPolicy;
      'api::registered.registered': ApiRegisteredRegistered;
      'api::social-traffic.social-traffic': ApiSocialTrafficSocialTraffic;
      'api::subscription.subscription': ApiSubscriptionSubscription;
      'api::subscription-plan.subscription-plan': ApiSubscriptionPlanSubscriptionPlan;
      'api::subscription-plan-feature.subscription-plan-feature': ApiSubscriptionPlanFeatureSubscriptionPlanFeature;
      'api::term-and-condition.term-and-condition': ApiTermAndConditionTermAndCondition;
    }
  }
}
