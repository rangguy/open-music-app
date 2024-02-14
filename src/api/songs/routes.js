const routes = (handler) => [
  // menambah lagu
  {
    method: "POST",
    path: "/songs",
    handler: handler.postSongHandler,
  },
  // menampilkan seluruh lagu
  {
    method: "GET",
    path: "/songs",
    handler: handler.getSongsHandler,
  },
  // menampilkan detail dari lagu
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getSongByIdHandler,
  },
  // mengubah lagu
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putSongByIdHandler,
  },
  // menghapus lagu berdasarkan id
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = routes;
