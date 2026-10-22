.class public Lcom/flo/tamapoke/Health;
.super Ljava/lang/Object;
.source "Health.java"
.implements Landroid/os/OutcomeReceiver;

# Health Connect (Android 14+, API du système) : total des pas d'une période,
# toutes sources confondues (montre, téléphone…), dédoublonné par Health Connect.
# N'est appelé que si Build.VERSION.SDK_INT >= 34 (voir Bridge).

.field private act:Lcom/flo/tamapoke/MainActivity;
.field private tag:Ljava/lang/String;


.method public constructor <init>(Lcom/flo/tamapoke/MainActivity;Ljava/lang/String;)V
    .registers 3
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/flo/tamapoke/Health;->act:Lcom/flo/tamapoke/MainActivity;
    iput-object p2, p0, Lcom/flo/tamapoke/Health;->tag:Ljava/lang/String;
    return-void
.end method


.method public static steps(Lcom/flo/tamapoke/MainActivity;JJLjava/lang/String;)Ljava/lang/String;
    .registers 12
    # p0 = act, p1/p2 = début (ms), p3/p4 = fin (ms), p5 = tag
    :try_start_0
    const-class v0, Landroid/health/connect/HealthConnectManager;
    invoke-virtual {p0, v0}, Landroid/app/Activity;->getSystemService(Ljava/lang/Class;)Ljava/lang/Object;
    move-result-object v0
    check-cast v0, Landroid/health/connect/HealthConnectManager;
    if-eqz v0, :fail
    new-instance v1, Landroid/health/connect/TimeInstantRangeFilter$Builder;
    invoke-direct {v1}, Landroid/health/connect/TimeInstantRangeFilter$Builder;-><init>()V
    invoke-static {p1, p2}, Ljava/time/Instant;->ofEpochMilli(J)Ljava/time/Instant;
    move-result-object v2
    invoke-virtual {v1, v2}, Landroid/health/connect/TimeInstantRangeFilter$Builder;->setStartTime(Ljava/time/Instant;)Landroid/health/connect/TimeInstantRangeFilter$Builder;
    move-result-object v1
    invoke-static {p3, p4}, Ljava/time/Instant;->ofEpochMilli(J)Ljava/time/Instant;
    move-result-object v2
    invoke-virtual {v1, v2}, Landroid/health/connect/TimeInstantRangeFilter$Builder;->setEndTime(Ljava/time/Instant;)Landroid/health/connect/TimeInstantRangeFilter$Builder;
    move-result-object v1
    invoke-virtual {v1}, Landroid/health/connect/TimeInstantRangeFilter$Builder;->build()Landroid/health/connect/TimeInstantRangeFilter;
    move-result-object v1
    new-instance v2, Landroid/health/connect/AggregateRecordsRequest$Builder;
    invoke-direct {v2, v1}, Landroid/health/connect/AggregateRecordsRequest$Builder;-><init>(Landroid/health/connect/TimeRangeFilter;)V
    sget-object v3, Landroid/health/connect/datatypes/StepsRecord;->STEPS_COUNT_TOTAL:Landroid/health/connect/datatypes/AggregationType;
    invoke-virtual {v2, v3}, Landroid/health/connect/AggregateRecordsRequest$Builder;->addAggregationType(Landroid/health/connect/datatypes/AggregationType;)Landroid/health/connect/AggregateRecordsRequest$Builder;
    move-result-object v2
    invoke-virtual {v2}, Landroid/health/connect/AggregateRecordsRequest$Builder;->build()Landroid/health/connect/AggregateRecordsRequest;
    move-result-object v2
    invoke-virtual {p0}, Landroid/app/Activity;->getMainExecutor()Ljava/util/concurrent/Executor;
    move-result-object v3
    new-instance v4, Lcom/flo/tamapoke/Health;
    invoke-direct {v4, p0, p5}, Lcom/flo/tamapoke/Health;-><init>(Lcom/flo/tamapoke/MainActivity;Ljava/lang/String;)V
    invoke-virtual {v0, v2, v3, v4}, Landroid/health/connect/HealthConnectManager;->aggregate(Landroid/health/connect/AggregateRecordsRequest;Ljava/util/concurrent/Executor;Landroid/os/OutcomeReceiver;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :err
    const-string v0, ""
    return-object v0
    :fail
    const-string v0, "no HealthConnectManager"
    return-object v0
    :err
    move-exception v0
    invoke-virtual {v0}, Ljava/lang/Object;->toString()Ljava/lang/String;
    move-result-object v0
    return-object v0
.end method


.method private send(J)V
    .registers 6
    # p0 = this, p1/p2 = nombre de pas (-1 = erreur)
    new-instance v0, Ljava/lang/StringBuilder;
    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V
    const-string v1, "window.tpHc&&tpHc("
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    iget-object v1, p0, Lcom/flo/tamapoke/Health;->tag:Ljava/lang/String;
    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v1, ","
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v0, p1, p2}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;
    const-string v1, ")"
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v0
    iget-object v1, p0, Lcom/flo/tamapoke/Health;->act:Lcom/flo/tamapoke/MainActivity;
    invoke-virtual {v1, v0}, Lcom/flo/tamapoke/MainActivity;->runJs(Ljava/lang/String;)V
    return-void
.end method


.method public onResult(Ljava/lang/Object;)V
    .registers 6
    const-wide/16 v0, -0x1
    :try_start_0
    check-cast p1, Landroid/health/connect/AggregateRecordsResponse;
    sget-object v2, Landroid/health/connect/datatypes/StepsRecord;->STEPS_COUNT_TOTAL:Landroid/health/connect/datatypes/AggregationType;
    invoke-virtual {p1, v2}, Landroid/health/connect/AggregateRecordsResponse;->get(Landroid/health/connect/datatypes/AggregationType;)Ljava/lang/Object;
    move-result-object v2
    const-wide/16 v0, 0x0
    if-eqz v2, :done
    check-cast v2, Ljava/lang/Long;
    invoke-virtual {v2}, Ljava/lang/Long;->longValue()J
    move-result-wide v0
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :err
    :done
    invoke-direct {p0, v0, v1}, Lcom/flo/tamapoke/Health;->send(J)V
    return-void
    :err
    const-wide/16 v0, -0x1
    invoke-direct {p0, v0, v1}, Lcom/flo/tamapoke/Health;->send(J)V
    return-void
.end method


.method public onError(Ljava/lang/Throwable;)V
    .registers 5
    new-instance v0, Ljava/lang/StringBuilder;
    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V
    const-string v1, "window.tpHcErr&&tpHcErr("
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {p1}, Ljava/lang/Object;->toString()Ljava/lang/String;
    move-result-object v1
    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v1, ")"
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v0
    iget-object v1, p0, Lcom/flo/tamapoke/Health;->act:Lcom/flo/tamapoke/MainActivity;
    invoke-virtual {v1, v0}, Lcom/flo/tamapoke/MainActivity;->runJs(Ljava/lang/String;)V
    return-void
.end method
