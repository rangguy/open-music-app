const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlist-songs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES ($1, $2, $3)",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan ke dalam playlist");
    }
  }

  async getPlaylistSongs(playlistId) {
    const queryplaylist = {
      text: "SELECT p.id AS id, p.name AS name, u.username AS owner FROM playlists AS p LEFT JOIN users AS u ON p.owner = u.id WHERE p.owner = $1",
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryplaylist);

    if (!resultPlaylist.rowCount) {
      throw new InvariantError("Playlist kosong");
    }

    const querySongs = {
      text: "SELECT s.id, s.title, s.year, s.performer FROM songs AS s INNER JOIN playlist_songs AS ps ON s.id = ps.song_id WHERE ps.playlist_id = $1",
      values: [playlistId],
    };

    const resultSongs = await this._pool.query(querySongs);

    const playlistData = resultPlaylist.rows[0];
    const songsData = resultSongs.rows;

    return {
      playlist: {
        id: playlistData.playlist_id,
        name: playlistData.playlist_name,
        owner: playlistData.owner,
      },
      songs: songsData,
    };
  }

  async deletePlaylistSong(songId, playlistId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2",
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        // eslint-disable-next-line comma-dangle
        "Lagu gagal dihapus dari playlist. Id tidak ditemukan"
      );
    }
  }

  async verifySongId(songId) {
    const checkSongQuery = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };

    const checkSongResult = await this._pool.query(checkSongQuery);

    if (!checkSongResult.rows.length) {
      throw new NotFoundError("Invalid song id");
    }
  }
}

module.exports = PlaylistSongsService;
