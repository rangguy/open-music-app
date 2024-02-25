const path = require('path');

const routes = (handler) => [
  // menambah album
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  // menampilkan detail dari album
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  // mengubah album
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  // menghapus album berdasarkan id
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postAlbumLikeByIdHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getAlbumLikesByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteAlbumLikeByIdHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/covers/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "../uploads/file/images"),
      },
    },
  },
];

module.exports = routes;
