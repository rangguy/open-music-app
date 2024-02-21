const autoBind = require("auto-bind");

class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    await this._service.verifySongId(songId);

    await this._service.addPlaylistSong({ playlistId, songId });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const playlist = this._service.getPlaylistSongs(playlistId);

    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;

    await this._service.deletePlaylistSong(songId, playlistId);

    return {
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    };
  }
}

module.exports = PlaylistSongsHandler;
