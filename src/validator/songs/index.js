const InvariantError = require("../../exceptions/InvariantError");
const { SongPayloadSchema, SongQuerySchema } = require("./schema");

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongQuery: (query) => {
    const validationResultQuery = SongQuerySchema.validate(query);
    if (validationResultQuery.error) {
      throw new Error(validationResultQuery.error.message);
    }
    return validationResultQuery;
  },
};

module.exports = SongsValidator;
