const autoBind = require("auto-bind");

class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistSongActivitiesService.getSongActivitiesById(
      playlistId,
    );

    return {
      status: "success",
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
