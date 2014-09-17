exports.names = ['.move', '.mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.uid}).role > 1) {
        bot.moderateDeleteChat(data.cid);
        var input = data.message.split(' ');
        if (input.length >= 3) {
            var username = _.rest(input, 1);
            username = _.initial(username, 1).join(' ').trim();
            var position = parseInt(_.last(input, 1));            
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
                if (position <= room.djs.length && _.findWhere(room.djs, {id: row.userid})) {
                    bot.moderateMoveDJ(parseInt(row.userid), position);
                }
                else {
                    bot.moderateAddDJ(parseInt(row.userid), function () {
                        if (position <= room.djs.length) {
                            bot.moderateMoveDJ(parseInt(row.userid), position);
                        }
                    });
                }
                logger.info('Moving ' + username + ' to position: ' + position);
            });
        }
    }
};
