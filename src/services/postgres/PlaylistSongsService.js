/* eslint-disable max-len */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapPlaylistToModel, mapSongToModel } = require("../../utils");

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    await this.checkSongInPlaylist(playlistId, songId);
    const id = `playlist-songs-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES ($1, $2, $3)",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error("Gagal menambahkan lagu ke dalam playlist");
    }
  }

  async getPlaylistSongs(playlistId) {
    const queryplaylist = {
      text: "SELECT p.id AS id, p.name AS name, u.username AS owner FROM playlists AS p LEFT JOIN users AS u ON p.owner = u.id WHERE p.id = $1",
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryplaylist);

    if (!resultPlaylist.rows.length) {
      throw new InvariantError("Playlist kosong");
    }

    const playlistData = mapPlaylistToModel(resultPlaylist.rows[0]);

    const querySongs = {
      text: "SELECT s.id, s.title, s.performer FROM songs AS s INNER JOIN playlist_songs AS ps ON s.id = ps.song_id WHERE ps.playlist_id = $1",
      values: [playlistId],
    };

    const resultSongs = await this._pool.query(querySongs);

    if (resultSongs.rows.length > 0) {
      const songs = resultSongs.rows.map(mapSongToModel);
      playlistData.songs = songs;
    } else {
      playlistData.songs = [];
    }

    return playlistData;
  }

  async deletePlaylistSong(songId, playlistId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(
        `Lagu dengan id ${songId} tidak ditemukan di dalam playlist dengan id ${playlistId}`,
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

  async checkSongInPlaylist(playlistId, songId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Lagu telah ada di dalam playlist");
    }
  }

  async addToPlaylistSongActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal menambahkan aktivitas lagu");
    }
  }
}

module.exports = PlaylistSongsService;
