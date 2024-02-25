const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapAlbumToModel, mapSongToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
const ClientError = require("../../exceptions/ClientError");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const randomString = nanoid(16);
    const id = `album-${randomString}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id",
      values: [id, name, year, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = mapAlbumToModel(result.rows[0]);

    const querySongs = {
      text: 'SELECT id, title, year performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    if (resultSongs.rows.length > 0) {
      const songs = resultSongs.rows.map(mapSongToModel);
      album.songs = songs;
    } else {
      album.songs = [];
    }

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async addAlbumCoverById(id, albumCover) {
    const query = {
      text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
      values: [albumCover, id],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan.");
    }
  }

  async checkValidAlbum(albumId) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }

  async checkLikes(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE "albumId" = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new ClientError("Sudah memberi like pada album ini");
    }
  }

  async addAlbumLikeById(albumId, userId) {
    const like = 'like';
    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO album_likes VALUES ($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`likes:${albumId}`);
    return like;
  }

  async getAlbumLikesById(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: parseInt(JSON.parse(result), 10),
        cache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM album_likes WHERE "albumId" = $1',
        values: [albumId],
      };
      const { rows, rowCount } = await this._pool.query(query);
      if (!rowCount) {
        throw new NotFoundError("Album tidak ditemukan");
      }

      const { count } = rows[0];
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(count));

      return {
        likes: parseInt(count, 10),
        cache: false,
      };
    }
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE "albumId" = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal membatalkan like pada album ini");
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }
}

module.exports = AlbumsService;
