const routes = (handler) => [
  // menambah playlist
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
  // menampilkan semua playlist
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
  // menghapus playlist berdasarkan id
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
];

module.exports = routes;
