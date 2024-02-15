const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapSongToModel } = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const randomString = nanoid(16);
    const id = `song-${randomString}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    // pengecekan apakah terdapat id, jika tidak maka throw invarianterror
    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      "SELECT id, title, performer FROM songs",
    );
    return result.rows.map(mapSongToModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapSongToModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
  }

  async getSongByTitle(title) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1",
      values: [`%${title}%`],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Nama lagu tidak ditemukan!");
    }

    return result.rows.map(mapSongToModel);
  }

  async getSongByPerformer(performer) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE performer ILIKE $1",
      values: [`%${performer}%`],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Artis tidak ditemukan!");
    }

    return result.rows.map(mapSongToModel);
  }

  async getSongByTitleAndPerformer(title, performer) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2",
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Nama lagu atau artis tidak ditemukan!");
    }

    return result.rows.map(mapSongToModel);
  }
}

module.exports = SongsService;
