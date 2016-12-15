'use strict';

const Migrator = require('./migration/migrator');
const { Utils } = require('./migration/support');

const Td2TdMigrator = require('./migration/td2td/migrator');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const auth = require('./middleware/auth');
const logger = require('./middleware/logger');

const migrator = new Migrator();
const tdMigrator = new Td2TdMigrator();

app.use(logger);
app.use(bodyParser.json());
app.use(cors());
app.use(auth);

app.get('/td2td-utility/v1/start', (req, res, next) => {
  setTimeout(() => {
    res.json(tdMigrator.start(req.query.runningMode, req.query.size));
    next();
  }, 1000);
});

app.post('/td2td-utility/v1/saveSettings', (req, res, next) => {
  setTimeout(() => {
    if (req.body.sourceTdUser === 'usr_tdsource') {
      res.status(201).send({ success: 'true' });
      next();
      return;
    }

    res.status(500).send({ success: 'false' });
    next();
  }, 2000);
});

app.post('/td2td-utility/v1/loadSettings', (req, res, next) => {
  const settings = {
    sourceTdIp: "SPKISL866",
    sourceTdUser: "sourcedbc1",
    sourceTdPassword: "sourcedbc2",
    sourceArcUser: "sourcedbc3",
    sourceArcPassword: "sourcedbc4",
    targetTdIp: "10.0.0.6",
    targetTdUser: "targetdbc1",
    targetTdPassword: "targetdbc2",
    targetArcUser: "targetdbc3",
    targetArcPassword: "targetdbc4",
    workingDirectory: "C:\\TD2TD_Working_Folder",
    s3Bucket: "dummy_bucket",
    accessKey: "dummyAccessKey",
    secretAccessKey: "dummy+secretAccessKey",
    jobMode: "download",
    applicationMode: "aws",
  };

  setTimeout(() => {
    res.json(settings);
    // res.status(404).send({
    //   success: 'false'
    // });
    next();
  }, 2000);
});

app.post('/td2td-utility/v1/getJobs', (req, res, next) => {
  setTimeout(() => {
    res.json(tdMigrator.getJobs());
    next();
  }, 1000);
});

app.post('/td2td-utility/v1/addJob', (req, res, next) => {
  const job = tdMigrator.addJob(req.body);
  res.json({ success: "true", job });
  next();
});

app.post('/td2td-utility/v1/startJob', (req, res, next) => {
  const job = tdMigrator.startJob(req.body);
  res.json({ success: "true", job });
  next();
});

app.get('/td2td-utility/v1/getDatabaseList', (req, res, next) => {
  setTimeout(() => {
    const schemas = Utils.getRandomSchemas(Utils.getRandom(100));
    res.json(schemas);
    next();
  }, 1000);
});

app.get('/td2td-utility/v1/getTablesList/:name', (req, res, next) => {
  setTimeout(() => {
    const tableNames = Utils.getRandomTables(Utils.getRandom(20)).map(t => {
      return { tableName: t, tableSize: `${Utils.getRandom(100)}` };
    });
    res.json(tableNames);
    next();
  }, 1000);
});

app.post('/tdma/v1/load', (req, res, next) => {
  setTimeout(() => {
    const size = 200;
    const migSpeed = 500;
    migrator.start(size, migSpeed);

    res.json({});
    next();
  }, 1000);
});

app.post('/tdma/v1/source/testconnection', (req, res, next) => {
  setTimeout(() => {
    if (req.body.loginId === 'usr_rdshftadmin') {
      res.send('true');
      next();
      return;
    }

    res.status(417).send({
      code: '1',
      success: 'false',
      error: '[Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;',
      details: TOMCAT_ERROR,
      documentation: 'http://www.localhost:8080/tdma/documentation/',
    });
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

    res.status(417).send({
      code: '1',
      success: 'false',
      error: '[Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;',
      details: TOMCAT_ERROR,
      documentation: 'http://www.localhost:8080/tdma/documentation/',
    });
    next();
  }, 200);
});

app.post('/tdma/v1/schemas', (req, res, next) => {
  setTimeout(() => {
    if (req.body.loginId === 'usr_rdshftadmin') {
      res.send({
        success: "true",
        schemas: [
          "pg_toast",
          "pg_internal",
          "pg_temp_1",
          "pg_catalog",
          "public",
          "information_schema",
          "pg_temp_7",
        ]
      });
      next();
      return;
    }

    res.status(417).send({
      code: '1',
      success: 'false',
      error: '[Amazon](500310) Invalid operation: password authentication failed for user &quot;usr_rdshftadmin1&quot;',
      details: TOMCAT_ERROR,
      documentation: 'http://www.localhost:8080/tdma/documentation/',
    });
    next();
  }, 2000);
});

app.get('/tdma/v1/languages', (req, res, next) => {
  setTimeout(() => {
    res.send({
      source_languages: [
        {
          id: 1,
          description: 'English',
          charsets: ['UTF8', 'iso-8859-1', 'iso-8859-9'],
        },
        {
          id: 2,
          description: 'Japanese',
          charsets: ['Shift_JIS', 'x-euc-jp', 'iso-2022-jp'],
        },
        {
          id: 3,
          description: 'Traditional Chinese',
          charsets: ['big5', 'x-euc-tw'],
        },
        {
          id: 4,
          description: 'Simplified Chinese',
          charsets: ['gb2312'],
        },
        {
          id: 5,
          description: 'Russian',
          charsets: ['iso-8859-5', 'koi8-r'],
        },
      ],
      target_languages: [
        {
          id: 1,
          description: 'English',
          charsets: ['UTF8', 'iso-8859-1', 'iso-8859-9'],
        },
        {
          id: 2,
          description: 'Greek',
          charsets: ['iso-8859-7'],
        },
        {
          id: 3,
          description: 'Japanese',
          charsets: ['Shift_JIS', 'x-euc-jp', 'iso-2022-jp'],
        },
        {
          id: 4,
          description: 'Simplified Chinese',
          charsets: ['gb2312'],
        },
        {
          id: 5,
          description: 'Russian',
          charsets: ['iso-8859-5', 'koi8-r'],
        },
      ],
    });
    next();
  }, 2000);
});

app.post('/tdma/v1/configurations', (req, res, next) => {
  setTimeout(() => {
    res.json({});
    next();
  }, 1000);

  // res.status(417).json(CONFIG_ERROR_JSON);
  // next();
});

app.post('/tdma/v1/progress', (req, res, next) => {
  const { invMigrator, dataMigrator } = migrator;
  const ts = new Date();

  if (!migrator.isRunning()) {
    res.json({});
    next();
    return;
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
    migration_processed: dataMigrator.current,
    migration_total_size: dataMigrator.totalSize,
    migration_processed_size: dataMigrator.processedSize,
    total_errors: migrator.inventory.migErrors,
    tpt_threshold: tptThreshold,
    tpt_sessions: tptSessions,
    latency: latency,
  };

  res.json(progress);
  next();
});

app.post('/tdma/v1/activities', (req, res, next) => {
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

const CONFIG_ERROR_JSON = {
  success: "false",
  details: "org.springframework.transaction.UnexpectedRollbackException: JTA transaction unexpectedly rolled back (maybe due to a timeout); nested exception is javax.transaction.RollbackException: ARJUNA016053: Could not commit transaction.\n\tat org.springframework.transaction.jta.JtaTransactionManager.doCommit(JtaTransactionManager.java:1026)\n\tat org.springframework.transaction.support.AbstractPlatformTransactionManager.processCommit(AbstractPlatformTransactionManager.java:761)\n\tat org.springframework.transaction.support.AbstractPlatformTransactionManager.commit(AbstractPlatformTransactionManager.java:730)\n\tat org.springframework.transaction.interceptor.TransactionAspectSupport.commitTransactionAfterReturning(TransactionAspectSupport.java:485)\n\tat org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:291)\n\tat org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.dao.support.PersistenceExceptionTranslationInterceptor.invoke(PersistenceExceptionTranslationInterceptor.java:136)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.data.jpa.repository.support.CrudMethodMetadataPostProcessor$CrudMethodMetadataPopulatingMethodInterceptor.invoke(CrudMethodMetadataPostProcessor.java:133)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:92)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:213)\n\tat com.sun.proxy.$Proxy94.save(Unknown Source)\n\tat com.td.tdma.datamigrator.service.ConfigurationService.create(ConfigurationService.java:62)\n\tat com.td.tdma.datamigrator.service.ConfigurationService$$FastClassBySpringCGLIB$$4ff3e2c6.invoke(<generated>)\n\tat org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)\n\tat org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:720)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157)\n\tat org.springframework.aop.framework.adapter.MethodBeforeAdviceInterceptor.invoke(MethodBeforeAdviceInterceptor.java:52)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.aspectj.AspectJAfterAdvice.invoke(AspectJAfterAdvice.java:47)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.framework.adapter.AfterReturningAdviceInterceptor.invoke(AfterReturningAdviceInterceptor.java:52)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.aspectj.AspectJAfterThrowingAdvice.invoke(AspectJAfterThrowingAdvice.java:62)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:92)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:655)\n\tat com.td.tdma.datamigrator.service.ConfigurationService$$EnhancerBySpringCGLIB$$373d0488.create(<generated>)\n\tat com.td.tdma.datamigrator.controller.ConfigurationController.createConfiguration(ConfigurationController.java:67)\n\tat com.td.tdma.datamigrator.controller.ConfigurationController$$FastClassBySpringCGLIB$$e73b0e6e.invoke(<generated>)\n\tat org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)\n\tat org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:720)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157)\n\tat org.springframework.aop.framework.adapter.MethodBeforeAdviceInterceptor.invoke(MethodBeforeAdviceInterceptor.java:52)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.aspectj.AspectJAfterAdvice.invoke(AspectJAfterAdvice.java:47)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.framework.adapter.AfterReturningAdviceInterceptor.invoke(AfterReturningAdviceInterceptor.java:52)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.aspectj.AspectJAfterThrowingAdvice.invoke(AspectJAfterThrowingAdvice.java:62)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:92)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\n\tat org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:655)\n\tat com.td.tdma.datamigrator.controller.ConfigurationController$$EnhancerBySpringCGLIB$$3f771080.createConfiguration(<generated>)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:221)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:136)\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:114)\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:827)\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:738)\n\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:85)\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963)\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:897)\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:970)\n\tat org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:872)\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:707)\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:846)\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:790)\n\tat io.undertow.servlet.handlers.ServletHandler.handleRequest(ServletHandler.java:85)\n\tat io.undertow.servlet.handlers.security.ServletSecurityRoleHandler.handleRequest(ServletSecurityRoleHandler.java:62)\n\tat io.undertow.servlet.handlers.ServletDispatchingHandler.handleRequest(ServletDispatchingHandler.java:36)\n\tat org.wildfly.extension.undertow.security.SecurityContextAssociationHandler.handleRequest(SecurityContextAssociationHandler.java:78)\n\tat io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)\n\tat io.undertow.servlet.handlers.security.SSLInformationAssociationHandler.handleRequest(SSLInformationAssociationHandler.java:131)\n\tat io.undertow.servlet.handlers.security.ServletAuthenticationCallHandler.handleRequest(ServletAuthenticationCallHandler.java:57)\n\tat io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)\n\tat io.undertow.security.handlers.AbstractConfidentialityHandler.handleRequest(AbstractConfidentialityHandler.java:46)\n\tat io.undertow.servlet.handlers.security.ServletConfidentialityConstraintHandler.handleRequest(ServletConfidentialityConstraintHandler.java:64)\n\tat io.undertow.security.handlers.AuthenticationMechanismsHandler.handleRequest(AuthenticationMechanismsHandler.java:60)\n\tat io.undertow.servlet.handlers.security.CachedAuthenticatedSessionHandler.handleRequest(CachedAuthenticatedSessionHandler.java:77)\n\tat io.undertow.security.handlers.NotificationReceiverHandler.handleRequest(NotificationReceiverHandler.java:50)\n\tat io.undertow.security.handlers.AbstractSecurityContextAssociationHandler.handleRequest(AbstractSecurityContextAssociationHandler.java:43)\n\tat io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)\n\tat org.wildfly.extension.undertow.security.jacc.JACCContextIdHandler.handleRequest(JACCContextIdHandler.java:61)\n\tat io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)\n\tat io.undertow.server.handlers.PredicateHandler.handleRequest(PredicateHandler.java:43)\n\tat io.undertow.servlet.handlers.ServletInitialHandler.handleFirstRequest(ServletInitialHandler.java:292)\n\tat io.undertow.servlet.handlers.ServletInitialHandler.access$100(ServletInitialHandler.java:81)\n\tat io.undertow.servlet.handlers.ServletInitialHandler$2.call(ServletInitialHandler.java:138)\n\tat io.undertow.servlet.handlers.ServletInitialHandler$2.call(ServletInitialHandler.java:135)\n\tat io.undertow.servlet.core.ServletRequestContextThreadSetupAction$1.call(ServletRequestContextThreadSetupAction.java:48)\n\tat io.undertow.servlet.core.ContextClassLoaderSetupAction$1.call(ContextClassLoaderSetupAction.java:43)\n\tat io.undertow.servlet.api.LegacyThreadSetupActionWrapper$1.call(LegacyThreadSetupActionWrapper.java:44)\n\tat io.undertow.servlet.api.LegacyThreadSetupActionWrapper$1.call(LegacyThreadSetupActionWrapper.java:44)\n\tat io.undertow.servlet.api.LegacyThreadSetupActionWrapper$1.call(LegacyThreadSetupActionWrapper.java:44)\n\tat io.undertow.servlet.api.LegacyThreadSetupActionWrapper$1.call(LegacyThreadSetupActionWrapper.java:44)\n\tat io.undertow.servlet.api.LegacyThreadSetupActionWrapper$1.call(LegacyThreadSetupActionWrapper.java:44)\n\tat io.undertow.servlet.api.LegacyThreadSetupActionWrapper$1.call(LegacyThreadSetupActionWrapper.java:44)\n\tat io.undertow.servlet.handlers.ServletInitialHandler.dispatchRequest(ServletInitialHandler.java:272)\n\tat io.undertow.servlet.handlers.ServletInitialHandler.access$000(ServletInitialHandler.java:81)\n\tat io.undertow.servlet.handlers.ServletInitialHandler$1.handleRequest(ServletInitialHandler.java:104)\n\tat io.undertow.server.Connectors.executeRootHandler(Connectors.java:202)\n\tat io.undertow.server.HttpServerExchange$1.run(HttpServerExchange.java:805)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\n\tat java.lang.Thread.run(Thread.java:745)\nCaused by: javax.transaction.RollbackException: ARJUNA016053: Could not commit transaction.\n\tat com.arjuna.ats.internal.jta.transaction.arjunacore.TransactionImple.commitAndDisassociate(TransactionImple.java:1212)\n\tat com.arjuna.ats.internal.jta.transaction.arjunacore.BaseTransaction.commit(BaseTransaction.java:126)\n\tat com.arjuna.ats.jbossatx.BaseTransactionManagerDelegate.commit(BaseTransactionManagerDelegate.java:89)\n\tat org.jboss.tm.usertx.client.ServerVMClientUserTransaction.commit(ServerVMClientUserTransaction.java:178)\n\tat org.springframework.transaction.jta.JtaTransactionManager.doCommit(JtaTransactionManager.java:1023)\n\t... 103 more\nCaused by: javax.persistence.PersistenceException: org.hibernate.exception.ConstraintViolationException: could not execute statement\n\tat org.hibernate.jpa.spi.AbstractEntityManagerImpl.convert(AbstractEntityManagerImpl.java:1692)\n\tat org.hibernate.jpa.spi.AbstractEntityManagerImpl.convert(AbstractEntityManagerImpl.java:1602)\n\tat org.hibernate.jpa.spi.AbstractEntityManagerImpl.convert(AbstractEntityManagerImpl.java:1608)\n\tat org.hibernate.jpa.internal.EntityManagerImpl$CallbackExceptionMapperImpl.mapManagedFlushFailure(EntityManagerImpl.java:235)\n\tat org.hibernate.internal.SessionImpl.flushBeforeTransactionCompletion(SessionImpl.java:2967)\n\tat org.hibernate.internal.SessionImpl.beforeTransactionCompletion(SessionImpl.java:2339)\n\tat org.hibernate.engine.jdbc.internal.JdbcCoordinatorImpl.beforeTransactionCompletion(JdbcCoordinatorImpl.java:485)\n\tat org.hibernate.resource.transaction.backend.jta.internal.JtaTransactionCoordinatorImpl.beforeCompletion(JtaTransactionCoordinatorImpl.java:316)\n\tat org.hibernate.resource.transaction.backend.jta.internal.synchronization.SynchronizationCallbackCoordinatorNonTrackingImpl.beforeCompletion(SynchronizationCallbackCoordinatorNonTrackingImpl.java:47)\n\tat org.hibernate.resource.transaction.backend.jta.internal.synchronization.RegisteredSynchronization.beforeCompletion(RegisteredSynchronization.java:37)\n\tat com.arjuna.ats.internal.jta.resources.arjunacore.SynchronizationImple.beforeCompletion(SynchronizationImple.java:76)\n\tat com.arjuna.ats.arjuna.coordinator.TwoPhaseCoordinator.beforeCompletion(TwoPhaseCoordinator.java:368)\n\tat com.arjuna.ats.arjuna.coordinator.TwoPhaseCoordinator.end(TwoPhaseCoordinator.java:91)\n\tat com.arjuna.ats.arjuna.AtomicAction.commit(AtomicAction.java:162)\n\tat com.arjuna.ats.internal.jta.transaction.arjunacore.TransactionImple.commitAndDisassociate(TransactionImple.java:1200)\n\t... 107 more\nCaused by: org.hibernate.exception.ConstraintViolationException: could not execute statement\n\tat org.hibernate.exception.internal.SQLStateConversionDelegate.convert(SQLStateConversionDelegate.java:112)\n\tat org.hibernate.exception.internal.StandardSQLExceptionConverter.convert(StandardSQLExceptionConverter.java:42)\n\tat org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:109)\n\tat org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:95)\n\tat org.hibernate.engine.jdbc.internal.ResultSetReturnImpl.executeUpdate(ResultSetReturnImpl.java:207)\n\tat org.hibernate.engine.jdbc.batch.internal.NonBatchingBatch.addToBatch(NonBatchingBatch.java:45)\n\tat org.hibernate.persister.entity.AbstractEntityPersister.insert(AbstractEntityPersister.java:2897)\n\tat org.hibernate.persister.entity.AbstractEntityPersister.insert(AbstractEntityPersister.java:3397)\n\tat org.hibernate.action.internal.EntityInsertAction.execute(EntityInsertAction.java:89)\n\tat org.hibernate.engine.spi.ActionQueue.executeActions(ActionQueue.java:582)\n\tat org.hibernate.engine.spi.ActionQueue.executeActions(ActionQueue.java:456)\n\tat org.hibernate.event.internal.AbstractFlushingEventListener.performExecutions(AbstractFlushingEventListener.java:337)\n\tat org.hibernate.event.internal.DefaultFlushEventListener.onFlush(DefaultFlushEventListener.java:39)\n\tat org.hibernate.internal.SessionImpl.flush(SessionImpl.java:1282)\n\tat org.hibernate.internal.SessionImpl.managedFlush(SessionImpl.java:465)\n\tat org.hibernate.internal.SessionImpl.flushBeforeTransactionCompletion(SessionImpl.java:2963)\n\t... 117 more\nCaused by: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint \"configuration_pkey\"\n  Detail: Key (id)=(1) already exists.\n\tat org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2284)\n\tat org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2003)\n\tat org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:200)\n\tat org.postgresql.jdbc.PgStatement.execute(PgStatement.java:424)\n\tat org.postgresql.jdbc.PgPreparedStatement.executeWithFlags(PgPreparedStatement.java:161)\n\tat org.postgresql.jdbc.PgPreparedStatement.executeUpdate(PgPreparedStatement.java:133)\n\tat org.jboss.jca.adapters.jdbc.WrappedPreparedStatement.executeUpdate(WrappedPreparedStatement.java:537)\n\tat org.hibernate.engine.jdbc.internal.ResultSetReturnImpl.executeUpdate(ResultSetReturnImpl.java:204)\n\t... 128 more\n",
  error: "JTA transaction unexpectedly rolled back (maybe due to a timeout); nested exception is javax.transaction.RollbackException: ARJUNA016053: Could not commit transaction."
};

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
