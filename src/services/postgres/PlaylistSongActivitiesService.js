const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongActivitiesById(id) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities AS psa
        LEFT JOIN playlists AS p ON psa.playlist_id = p.id
        LEFT JOIN songs AS s ON psa.song_id = s.id
        LEFT JOIN users AS u ON psa.user_id = u.id
        WHERE p.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
