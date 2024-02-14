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
];

module.exports = routes;
