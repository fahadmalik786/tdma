'use strict';

const Migrator = require('./migration/migrator');
const { Utils } = require('./migration/support');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const auth = require('./middleware/auth');
const logger = require('./middleware/logger');

const migrator = new Migrator();

app.use(logger);
app.use(bodyParser.json());
app.use(cors());
app.use(auth);

app.post('/tdma/v1/source/testconnection', (req, res, next) => {
  setTimeout(() => {
    if (req.body.loginId === 'usr_rdshftadmin') {
      res.send('true');
      next();
      return;
    }

    res.status(500).send(TOMCAT_ERROR);
    next();
  }, 2000);
});

app.post('/tdma/v1/target/testconnection', (req, res, next) => {
  setTimeout(() => {
    if (req.body.loginId === 'tma') {
      res.send('true');
      next();
      return;
    }

    res.status(500).send(TOMCAT_ERROR);
    next();
  }, 2000);
});

app.post('/tdma/v1/schemas', (req, res, next) => {
  setTimeout(() => {
    if (req.body.loginId === 'usr_rdshftadmin') {
      res.send([
        "pg_toast",
        "pg_internal",
        "pg_temp_1",
        "pg_catalog",
        "public",
        "information_schema",
        "pg_temp_7",
      ]);
      next();
      return;
    }

    res.status(500).send(TOMCAT_ERROR);
    next();
  }, 2000);
});

app.get('/tdma/v1/progress', (req, res, next) => {
  const { invMigrator, dataMigrator } = migrator;
  const ts = new Date();

  if (!migrator.isRunning()) {
    res.json({});
    next();
    return;
  }

  let throughput = undefined;
  if (dataMigrator.startedAt) {
    const finishedTs = dataMigrator.finishedAt || ts;
    let elapsedTime = (finishedTs.getTime() - dataMigrator.startedAt.getTime()) / 1000;
    throughput = dataMigrator.processedSize / elapsedTime;
  }

  const started = dataMigrator.startedAt;
  const running = dataMigrator.startedAt && !dataMigrator.finishedAt;
  const latency = started ? Utils.getRandom(100) : undefined;
  const tptThreshold = running ? 2 : undefined;
  const tptSessions = running ? Utils.getRandomElementWithProbability([
    { value: 1, probability: 30 },
    { value: 2, probability: 30 },
    { value: 3, probability: 2 },
    { value: 4, probability: 1 }
  ]).value : undefined;

  const progress = {
    timestamp: Utils.fmtDate(ts),
    inventory_started: Utils.fmtDate(invMigrator.startedAt),
    inventory_finished: Utils.fmtDate(invMigrator.finishedAt),
    inventory_total: invMigrator.total,
    inventory_processed: invMigrator.current,
    migration_started: Utils.fmtDate(dataMigrator.startedAt),
    migration_finished: Utils.fmtDate(dataMigrator.finishedAt),
    migration_total: dataMigrator.total,
    migration_processed: dataMigrator.current,
    migration_total_size: dataMigrator.totalSize,
    migration_processed_size: dataMigrator.processedSize,
    total_errors: migrator.inventory.migErrors,
    throughput: throughput,
    tpt_threshold: tptThreshold,
    tpt_sessions: tptSessions,
    latency: latency,
  };

  res.json(progress);
  next();
});

app.get('/tdma/v1/activities', (req, res, next) => {
  if (!migrator.isRunning()) {
    res.json({});
    next();
    return;
  }

  const timestamp = Utils.fmtDate(new Date());
  const inventory_activities = migrator.getInventoryActivities().slice(-30).reverse();
  const data_migration_activities = migrator.getDataMigrationActivities().slice(-30).reverse();
  const errors = migrator.getErrors().slice(-30).reverse();
  res.json({ timestamp, inventory_activities, data_migration_activities, errors });
  next();
});

app.get('/tdma/v1/start', (req, res, next) => {
  const size = parseInt(req.query.size, 10);
  const migSpeed = parseInt(req.query.migSpeed, 10);
  migrator.start(size, migSpeed);

  res.json({});
  next();
});

const TOMCAT_ERROR = `<!DOCTYPE html><html><head><title>Apache Tomcat/8.5.4 - Error report</title><style type="text/css">H1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} H2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} H3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} BODY {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} B {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} P {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;}A {color : black;}A.name {color : black;}.line {height: 1px; background-color: #525D76; border: none;}</style> </head><body><h1>HTTP Status 500 - Request processing failed; nested exception is java.sql.SQLException: [Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;;</h1><div class="line"></div><p><b>type</b> Exception report</p><p><b>message</b> <u>Request processing failed; nested exception is java.sql.SQLException: [Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;;</u></p><p><b>description</b> <u>The server encountered an internal error that prevented it from fulfilling this request.</u></p><p><b>exception</b></p><pre>org.springframework.web.util.NestedServletException: Request processing failed; nested exception is java.sql.SQLException: [Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;;
	org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:982)
	org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:872)
	javax.servlet.http.HttpServlet.service(HttpServlet.java:648)
	org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:846)
	javax.servlet.http.HttpServlet.service(HttpServlet.java:729)
	org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
</pre><p><b>root cause</b></p><pre>java.sql.SQLException: [Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;;
	com.amazon.redshift.client.messages.inbound.ErrorResponse.toErrorException(ErrorResponse.java:1830)
	com.amazon.redshift.client.InboundDataHandler.read(InboundDataHandler.java:454)
	com.amazon.channels.AbstractSocketChannel.readCallback(AbstractSocketChannel.java:172)
	com.amazon.channels.PlainSocketChannel.read(PlainSocketChannel.java:192)
</pre><p><b>root cause</b></p><pre>com.amazon.support.exceptions.ErrorException: [Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;;
	com.amazon.redshift.client.messages.inbound.ErrorResponse.toErrorException(ErrorResponse.java:1830)
	com.amazon.redshift.client.InboundDataHandler.read(InboundDataHandler.java:454)
	com.amazon.channels.AbstractSocketChannel.readCallback(AbstractSocketChannel.java:172)
	com.amazon.channels.PlainSocketChannel.read(PlainSocketChannel.java:192)
</pre><p><b>note</b> <u>The full stack trace of the root cause is available in the Apache Tomcat/8.5.4 logs.</u></p><hr class="line"><h3>Apache Tomcat/8.5.4</h3></body></html>`;

const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log(`Mock API listening on port ${port}!`)
});
