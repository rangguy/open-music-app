const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postAlbumCoversHandler,
    options: {
      payload: {
        maxBytes: 512000,
        parse: true,
        multipart: true,
        allow: "multipart/form-data",
        output: "stream",
      },
    },
  },
];

module.exports = routes;
