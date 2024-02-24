const autoBind = require("auto-bind");

class UploadsHandler {
  constructor(uploadsService, albumsService, uploadsValidator) {
    this._service = uploadsService;
    this._validator = uploadsValidator;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumCoversHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateAlbumCovers(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi, id);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;
    await this._albumsService.addAlbumCoverById(id, coverUrl);
    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
