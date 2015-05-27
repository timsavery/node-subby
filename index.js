var exec = require('child_process').exec;

function Svn() {
}

Svn.prototype.info = function (callback) {
  exec('svn info', function (err, stdout, stderr) {
    if (err) {
      return callback(err);
    }

    if (stderr) {
      return callback(stderr);
    }

    var info = {};
    var lines = stdout.split('\n');

    lines.forEach(function (line) {
      var firstColonIndex = line.indexOf(':');

      if (firstColonIndex > -1) {
        var key = line.slice(0, firstColonIndex);
        var value = line.slice(firstColonIndex + 2);

        switch (key) {
        case 'Revision':
          info.baseRevision = value;
          break;
        case 'URL':
          info.baseUrl = value;
          break;
        case 'Repository Root':
          if (!info.repository) {
            info.repository = {};
          }
          info.repository.root = value;
          break;
        case 'Repository UUID':
          if (!info.repository) {
            info.repository = {};
          }
          info.repository.uuid = value;
          break;
        default:
          break;
        }
      }
    });

    callback(null, info);
  });
};

Svn.prototype.status = function (callback) {
  exec('svn status', function (err, stdout, stderr) {
    if (err) {
      return callback(err);
    }

    if (stderr) {
      return callback(stderr);
    }

    var status = {};
    var lines = stdout.split('\n');

    lines.forEach(function (line) {
      var firstSpaceIndex = line.indexOf(' ');

      if (firstSpaceIndex > -1) {
        var path = line.slice(firstSpaceIndex).replace(/\s/g, '');
        var type = line.slice(0, firstSpaceIndex + 1).replace(/\s/g, '');

        status[path] = {
          path: path,
          type: type
        };
      }
    });

    callback(null, status);
  });
};

Svn.prototype.add = function (path, callback) {
  exec('svn add ' + path, function (err, stdout, stderr) {
    callback(err || stderr, stdout);
  });
};

Svn.prototype.diff = function (path, callback) {
  exec('svn diff ' + path, callback);
};

module.exports = new Svn();
