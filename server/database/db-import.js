/*
* @Author: kuychaco
* @Date:   2015-06-03 10:20:55
* @Last Modified by:   Katrina Uychaco
*/

'use strict';


var dbUrl = process.env.DATABASE_URL;
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));
var pg = Bluebird.promisifyAll(require('pg'));
var config = require('../../build-config');


// Connect to database --> promise with value sqlClient
var pSqlClient = pg.connectAsync(dbUrl).spread(function(sqlClient, done) {
  sqlClient.close = done;
  return sqlClient;
});

// Read schema file --> promise with value schema-file
var schemaPromise = fs.readFileAsync(config.db+'/postgres-schema.sql', 'utf8');

// This is a helper function to close database connection
var closeConnection = function() {
  if (pSqlClient.isFulfilled()) {
    pSqlClient.value().close();
  }
};

// Load database schema
var loadSchema = function(callback) {
  Bluebird.join(pSqlClient, schemaPromise, function(sqlClient, schema) {
    return sqlClient.queryAsync(schema).thenReturn(schema);
  })
  .then(function(/*result*/) {
    callback(null, 'database schema loaded');
  })
  .catch(function(err) {
    callback(err, null);
  });
};

// Add users of repo to database
var postUsers = function(users, callback) {

  pSqlClient
    .then(function(sqlClient) {
      var query = "INSERT INTO users (id, login, avatar_url, url, html_url, organizations_url, repos_url, name, email, created_at, updated_at) VALUES (0, 'unassigned', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'),";
      users.forEach(function(user, i) {
        query += "(" + user.id + ", '" + user.login + "', '" + user.avatar_url + "', '" + user.url + "', '" + user.html_url + "', '" + user.organizations_url + "', '" + user.repos_url + "', '" + user.name + "', '" + user.email + "', '" + user.created_at + "', '" + user.updated_at + "')";
        if (i !== users.length-1) {
          query += ', ';
        } else {
          query += ';';
        }
      });

      return sqlClient.queryAsync(query).thenReturn(query);
    })
    .then(function(/*query*/) {
      callback(null, 'successfully added users');
    })
    .catch(function(err) {
      callback(err, null);
    });
};

// Set up project - add clusters and nodes for root, entry, and exit to database
var createProjectBase = function(clusters, callback) {

  clusters.forEach(function(cluster) {
  var clusterId, entry, exit;

    pSqlClient
      // insert cluster
      .then(function(sqlClient) {
        var queryAddCluster = "INSERT INTO clusters (abbrev, name, description, creator, children_count, children_complete) VALUES ('" + cluster.abbrev + "', '" + cluster.name + "', '" + cluster.description + "', '" + cluster.creator + "', '" + cluster.children_count + "', '" + cluster.children_complete + "') RETURNING id;";

        return sqlClient.queryAsync(queryAddCluster);
      })
      // create nodes for cluster, entry, and exit
      .then(function(results) {
        clusterId = results.rows[0].id;

        var queryAddRootNodes = "INSERT INTO nodes (type, parent_cluster, cluster_id, issue_id) VALUES ('cluster', 1, " + clusterId + ", DEFAULT), ('enter', " + clusterId + ", DEFAULT, DEFAULT), ('exit', " + clusterId + ", DEFAULT, DEFAULT) RETURNING id;";
        // update cluster to have entry and exit node IDs
        return pSqlClient.value().queryAsync(queryAddRootNodes);

      })
      .then(function(results) {
        // update cluster with entry and exit nodes
        entry = results.rows[1].id;
        exit = results.rows[2].id;
        var queryAddEndpoints = "UPDATE clusters SET endpoints = ARRAY[" + entry + ',' + exit + "] WHERE id = " + clusterId;
        return pSqlClient.value().queryAsync(queryAddEndpoints);
      })
      .then(function(/*results*/) {
        var query = "UPDATE nodes SET parent_cluster = 0 WHERE id = 1";
        return pSqlClient.value().queryAsync(query);
      })
      .then(function(/*results*/) {
        callback(null, 'successfully created project root clusters and nodes');
      })
      .catch(function(err) {
        callback(err, null);
      });

  });

};

// Add issues to database
var postIssues = function(issues, callback) {

  pSqlClient
    .then(function(sqlClient) {
      var queryAddIssue = 'INSERT INTO issues (id, url, labels_url, comments_url, events_url, html_url, number_github, title, creator, state, locked, assignee, comments, created_at, updated_at, closed_at, body) VALUES ';
      issues.forEach(function(issue, i) {
        issue.assignee = issue.assignee || {id: 0};

        queryAddIssue += "('" + issue.id + "', '" + issue.url + "', '" + issue.labels_url + "', '" + issue.comments_url + "', '" + issue.events_url + "', '" + issue.html_url + "', '" + issue.number + "', '" + issue.title + "', " + issue.user.id + ", '" + issue.state + "', '" + issue.locked + "', " + issue.assignee.id + ", '" + issue.comments + "', '" + issue.created_at + "', '" + issue.updated_at + "', '" + issue.closed_at + "', '" + issue.body + "')";

        if (i !== issues.length-1) {
          queryAddIssue += ', ';
        } else {
          queryAddIssue += ';';
        }
      });

      return sqlClient.queryAsync(queryAddIssue).thenReturn(queryAddIssue);
    })
    .then(function(/*query*/) {
      callback(null, 'successfully added issues');
    })
    .catch(function(err) {
      callback(err, null);
    });
};

// Retrieve list of issue IDs for creating nodes
var getIssueIds = function(callback) {
  pSqlClient
    .then(function(sqlClient) {
      var query = 'SELECT id, title FROM issues';
      return sqlClient.queryAsync(query);
    })
    .then(function(results) {
      callback(null, results);
    })
    .catch(function(err) {
      callback(err, null);
    });
};

// Create node for each issue
var createIssueNodes = function(issues, callback) {

  pSqlClient
    .then(function(sqlClient) {

      var queryAddNode = 'INSERT INTO nodes (id, type, parent_cluster, issue_id, upstream_nodes, downstream_nodes) VALUES ';
      issues.forEach(function(issue, i) {
        var abbrev = issue.title.split(' - ')[0];
        // var abbrev = 'DB';
        if ([86269811, 86269541, 86269457, 86269344, 86269119, 86269044].indexOf(issue.id) !== -1) {
          abbrev = 'Contr';
        }

        var queryParentCluster = "(SELECT id FROM clusters WHERE abbrev = '" + abbrev + "')";
        var entryId = "(SELECT id FROM nodes WHERE parent_cluster = " + queryParentCluster + " AND type = 'enter')";
        var exitId = "(SELECT id FROM nodes WHERE parent_cluster = " + queryParentCluster + " AND type = 'exit')";
        queryAddNode += "(DEFAULT, 'issue', " + queryParentCluster + ", " + issue.id + ", ARRAY[" + entryId + "], ARRAY[" + exitId + "])";

        if (i !== issues.length-1) {
          queryAddNode += ', ';
        } else {
          queryAddNode += ';';
        }



      });
      return sqlClient.queryAsync(queryAddNode).thenReturn(queryAddNode);

    })
    .then(function(/*query*/) {
      callback(null, 'successfully created nodes for issues');
    })
    .catch(function(err) {
      callback(err, null);
    });

};

var addEndpointDependencies = function(callback) {

  pSqlClient
    .then(function(sqlClient) {
      var query = "SELECT id, upstream_nodes, downstream_nodes FROM nodes WHERE type = 'issue'";
      return sqlClient.queryAsync(query);
    })
    .then(function(results) {
      return Bluebird.map(results.rows, function(row) {
        var addDepsQuery = "UPDATE nodes SET downstream_nodes = array_append(downstream_nodes, "+row.id+") WHERE id="+row.upstream_nodes[0]+"; UPDATE nodes SET upstream_nodes = array_append(upstream_nodes, "+row.id+") WHERE id="+row.downstream_nodes[0]+";"
        return pSqlClient.value().queryAsync(addDepsQuery);
      });
    })
    .then(function(results) {
      callback(null, 'successfully connected enter/exit nodes for issues');
    })
    .catch(function(err) {
      callback(err, null);
    });

};

var buildPartialGraph = function(callback) {
  var query = "UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[4,7,10,13]) WHERE id=2; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[2]) WHERE id=4; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[16]) WHERE id=4; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[2]) WHERE id=7; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[16,19]) WHERE id=7; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[2]) WHERE id=10; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[19]) WHERE id=10; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[2]) WHERE id=13; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[19,22]) WHERE id=13; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[4, 7]) WHERE id=16; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[28]) WHERE id=16; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[7,10,13]) WHERE id=19; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[28]) WHERE id=19; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[13]) WHERE id=22; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[28]) WHERE id=22; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[16,19,22]) WHERE id=28; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[3]) WHERE id=28; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[28]) WHERE id=3; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[52,53]) WHERE id=20; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[20]) WHERE id=52; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[54,55,56]) WHERE id=52; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[20]) WHERE id=53; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[54,55,56]) WHERE id=53; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[53]) WHERE id=54; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[57]) WHERE id=54; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[53]) WHERE id=55; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[57]) WHERE id=55; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[53]) WHERE id=56; \
              UPDATE nodes SET downstream_nodes = array_cat(downstream_nodes, ARRAY[57]) WHERE id=56; \
              UPDATE nodes SET upstream_nodes = array_cat(upstream_nodes, ARRAY[54,55,56]) WHERE id=57;"

  pSqlClient
    .then(function(sqlClient) {
      return sqlClient.queryAsync(query);
    })
    .then(function(results) {
      callback(null, 'successfully built partial graph');
    })
    .catch(function(err) {
      callback(err, null);
    });
};


module.exports.loadSchema = loadSchema;
module.exports.postUsers = postUsers;
module.exports.createProjectBase = createProjectBase;
module.exports.postIssues = postIssues;
module.exports.closeConnection = closeConnection;
module.exports.getIssueIds = getIssueIds;
module.exports.createIssueNodes = createIssueNodes;
module.exports.addEndpointDependencies = addEndpointDependencies;
module.exports.buildPartialGraph = buildPartialGraph;
