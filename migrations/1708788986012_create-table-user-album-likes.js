exports.up = (pgm) => {
  pgm.createTable("album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
    },
    albumId: {
      type: "VARCHAR(50)",
    },
  });

  pgm.addConstraint(
    "album_likes",
    "fk_album_likes.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE",
  );

  pgm.addConstraint(
    "album_likes",
    "fk_album_likes.albumId_albums.id",
    'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable("album_likes");
};
