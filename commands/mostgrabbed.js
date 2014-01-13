exports.names = ['.mostgrabbed', '.mosthearted', '.mostsnagged', 'mostsnagged', '.mostcurated'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.all('SELECT author, title, sum_hearts FROM (SELECT songid, sum(snags) as sum_hearts FROM PLAYS GROUP BY songid ORDER BY sum(snags) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
        if (rows != null) {
            bot.chat('The most grabbed songs I\'ve heard: ' + rows.map(function (row) {
                return row['title'] + ' by ' + row['author'] + ': ' + row['sum_hearts'] + ' grabs.';
            }).join(' · '));
        } else {
            bot.chat('No one has grabbed anything in this room!');
        }
    });
};

