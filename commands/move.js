exports.names = ['.move', '.mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (data.from.role > 1) {
        djs = room.getDJs();
        bot.moderateDeleteChat(data.id);
        var input = data.message.split(' ');
        if (input.length >= 3) {
            var username = _.rest(input, 1);
            username = _.initial(username, 1).join(' ').trim();
            var position = parseInt(_.last(input, 1));            
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
                if (position <= djs.length && _.findWhere(djs, {id: row.userid})) {
                    bot.moderateMoveDJ(row.userid, position);
                }
                else {
                    bot.moderateAddDJ(row.userid, function () {
                        if (position <= djs.length) {
                            bot.moderateMoveDJ(row.userid, position);
                        }
                    });
                }
                logger.info('Moving ' + username + ' to position: ' + position);
            });
        }
    }
};
