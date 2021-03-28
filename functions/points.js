module.exports = function () {
  attemptPurchase = function (user, points, callback) {
    getDbUserFromSiteUser(user, function (row) {
      if (!row || row.custom_points < points) {
        console.log("[POINTS] Purchase failed: " + row.username + " only has " + row.custom_points + " points (" + points + " needed)");
        bot.sendChat("Sorry @" + row.username + ", you need " + points + config.customPointName + " for that.");
        callback(false);
        return;
      }

      // Deduct the points from the sender's balance and add to the recipient
      models.User.update(
        {
          custom_points: Sequelize.literal("(custom_points - " + points + ")"),
        },
        { where: { site_id: row.site_id } }
      );
      console.log("[POINTS] " + row.username + " spent " + points + " points");
      callback(true);
    });
    return;
  };

  transferCustomPoints = function (fromUserId, toUserId, points) {
    toUser = getDbUserFromUserId(toUserId);

    // Create them out of thin air!
    if (fromUserId === null) {
      fromUser = getDbUserFromUserId(bot.user.id);
      models.User.update(
        {
          custom_points: Sequelize.literal("(custom_points + " + points + ")"),
        },
        { where: { site_id: toUserId } }
      );
      console.log("[GIFT] " + fromUser.username + " awarded " + points + " points to " + toUser.username);
      bot.sendChat(":gift: " + fromUser.username + " awarded " + points + " " + config.customPointName + " to @" + toUser.username);

      return;
    } else {
      getDbUserFromUserId(fromUserId, function (row) {
        if (!row || row.custom_points < points) {
          console.log("Gift failed");
          return false;
        }

        // Deduct the points from the sender's balance and add to the recipient
        models.User.update(
          {
            custom_points: Sequelize.literal("(custom_points - " + points + ")"),
          },
          { where: { site_id: fromUserId } }
        );
        models.User.update(
          {
            custom_points: Sequelize.literal("(custom_points + " + points + ")"),
          },
          { where: { site_id: toUserId } }
        );

        console.log("[GIFT] " + fromUser.username + " gave " + points + " points to " + toUser.username);
        bot.sendChat(":gift: @" + fromUser.username + " gave " + points + " " + config.customPointName + " to @" + toUser.username + " :gift:");
      });
    }
  };
};
