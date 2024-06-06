module.exports = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  // "strapi::body",
  {
    name: "strapi::body",
    config: {
      patchKoa: true,
      multipart: true,
      includeUnparsed: true,
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  // ...
  // {
  //   name: "strapi::body",
  //   config: {
  //     formLimit: "25mb", // modify form body
  //     jsonLimit: "25mb", // modify JSON body
  //     textLimit: "25mb", // modify text body
  //     formidable: {
  //       maxFileSize: 25 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
  //     },
  //   },
  // },
  // ...
];
