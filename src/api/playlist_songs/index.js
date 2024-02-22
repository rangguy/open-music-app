const PlaylistsService = require("../../services/postgres/PlaylistsService");
const PlaylistSongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlist_songs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const playlistsService = new PlaylistsService();
    const playlistSongsHandler = new PlaylistSongsHandler(
      service,
      validator,
      playlistsService,
    );
    server.route(routes(playlistSongsHandler));
  },
};
