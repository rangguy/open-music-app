/* eslint-disable object-curly-newline */
const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const { name, year, coverUrl, songs } = album;

    return {
      status: "success",
      data: {
        album: {
          id,
          name,
          year,
          coverUrl,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album berhasil diperbaharui",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.checkValidAlbum(albumId);
    await this._service.checkLikes(albumId, userId);
    await this._service.addAlbumLikeById(albumId, userId);
    return h
      .response({
        status: "success",
        message: "Berhasil menyukai album",
      })
      .code(201);
  }

  async getAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.checkValidAlbum(albumId);
    const { cache, likes } = await this._service.getAlbumLikesById(albumId);
    const response = h.response({
      status: "success",
      data: {
        likes,
      },
    });
    if (cache) {
      response.header("X-Data-Source", "cache");
    }
    return response;
  }

  async deleteAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkValidAlbum(albumId);
    await this._service.deleteAlbumLike(albumId, credentialId);

    return h
      .response({
        status: "success",
        message: "Berhasil membatalkan like",
      })
      .code(200);
  }
}

module.exports = AlbumsHandler;
