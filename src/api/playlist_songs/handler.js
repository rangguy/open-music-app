const autoBind = require("auto-bind");

class PlaylistSongsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._service.verifySongId(songId);

    await this._service.addPlaylistSong(playlistId, songId);

    const action = "add";
    await this._service.addToPlaylistSongActivities(
      playlistId,
      songId,
      credentialId,
      action,
    );

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._service.getPlaylistSongs(id);
    const { name, username, songs } = playlist;

    return {
      status: "success",
      data: {
        playlist: {
          id,
          name,
          username,
          songs,
        },
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._service.deletePlaylistSong(songId, playlistId);

    const action = "delete";
    await this._service.addToPlaylistSongActivities(
      playlistId,
      songId,
      credentialId,
      action,
    );

    return {
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    };
  }
}

module.exports = PlaylistSongsHandler;
