.class public Lcom/flo/tamapoke/HealthBg;
.super Ljava/lang/Object;
.source "HealthBg.java"
.implements Landroid/os/OutcomeReceiver;

# v19 : lecture Health Connect appli fermée (Android 15+, permission
# READ_HEALTH_DATA_IN_BACKGROUND). Appelé par PetService toutes les 15 min :
# total des pas depuis minuit (bg_mid, envoyé par le jeu), rendu à
# PetService.onHc(n). Le jeu fait le vrai calcul à la réouverture.

.field private svc:Lcom/flo/tamapoke/PetService;


.method public constructor <init>(Lcom/flo/tamapoke/PetService;)V
    .registers 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/flo/tamapoke/HealthBg;->svc:Lcom/flo/tamapoke/PetService;
    return-void
.end method


# permission accordée ? (Android 15+ seulement)
.method public static allowed(Landroid/content/Context;)Z
    .registers 4
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v1, 0x23
    if-lt v0, v1, :no
    const-string v0, "android.permission.health.READ_STEPS"
    invoke-virtual {p0, v0}, Landroid/content/Context;->checkSelfPermission(Ljava/lang/String;)I
    move-result v0
    if-nez v0, :no
    const-string v0, "android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND"
    invoke-virtual {p0, v0}, Landroid/content/Context;->checkSelfPermission(Ljava/lang/String;)I
    move-result v0
    if-nez v0, :no
    const/4 v0, 0x1
    return v0
    :no
    const/4 v0, 0x0
    return v0
.end method


# p0 = service, p1/p2 = début (minuit, ms)
.method public static query(Lcom/flo/tamapoke/PetService;J)V
    .registers 10
    :try_start_0
    const-class v0, Landroid/health/connect/HealthConnectManager;
    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/Class;)Ljava/lang/Object;
    move-result-object v0
    check-cast v0, Landroid/health/connect/HealthConnectManager;
    if-eqz v0, :done
    new-instance v1, Landroid/health/connect/TimeInstantRangeFilter$Builder;
    invoke-direct {v1}, Landroid/health/connect/TimeInstantRangeFilter$Builder;-><init>()V
    invoke-static {p1, p2}, Ljava/time/Instant;->ofEpochMilli(J)Ljava/time/Instant;
    move-result-object v2
    invoke-virtual {v1, v2}, Landroid/health/connect/TimeInstantRangeFilter$Builder;->setStartTime(Ljava/time/Instant;)Landroid/health/connect/TimeInstantRangeFilter$Builder;
    move-result-object v1
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J
    move-result-wide v2
    invoke-static {v2, v3}, Ljava/time/Instant;->ofEpochMilli(J)Ljava/time/Instant;
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
    invoke-virtual {p0}, Landroid/content/Context;->getMainExecutor()Ljava/util/concurrent/Executor;
    move-result-object v3
    new-instance v4, Lcom/flo/tamapoke/HealthBg;
    invoke-direct {v4, p0}, Lcom/flo/tamapoke/HealthBg;-><init>(Lcom/flo/tamapoke/PetService;)V
    invoke-virtual {v0, v2, v3, v4}, Landroid/health/connect/HealthConnectManager;->aggregate(Landroid/health/connect/AggregateRecordsRequest;Ljava/util/concurrent/Executor;Landroid/os/OutcomeReceiver;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :done
    :done
    return-void
.end method


.method public onResult(Ljava/lang/Object;)V
    .registers 5
    :try_start_0
    check-cast p1, Landroid/health/connect/AggregateRecordsResponse;
    sget-object v0, Landroid/health/connect/datatypes/StepsRecord;->STEPS_COUNT_TOTAL:Landroid/health/connect/datatypes/AggregationType;
    invoke-virtual {p1, v0}, Landroid/health/connect/AggregateRecordsResponse;->get(Landroid/health/connect/datatypes/AggregationType;)Ljava/lang/Object;
    move-result-object v0
    if-eqz v0, :done
    check-cast v0, Ljava/lang/Long;
    invoke-virtual {v0}, Ljava/lang/Long;->longValue()J
    move-result-wide v0
    iget-object v2, p0, Lcom/flo/tamapoke/HealthBg;->svc:Lcom/flo/tamapoke/PetService;
    invoke-virtual {v2, v0, v1}, Lcom/flo/tamapoke/PetService;->onHc(J)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :done
    :done
    return-void
.end method


# erreur (permission retirée, limite de lectures…) : on réessaiera au prochain tour
.method public onError(Ljava/lang/Throwable;)V
    .registers 2
    return-void
.end method
