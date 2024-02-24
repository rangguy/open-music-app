/* eslint-disable camelcase */
const mapAlbumToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
  cover,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  coverUrl: cover,
});

const mapSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapPlaylistToModel = ({ id, name, owner }) => ({
  id,
  name,
  username: owner,
});

module.exports = { mapAlbumToModel, mapSongToModel, mapPlaylistToModel };
