.class public Lcom/flo/tamapoke/Bridge;
.super Ljava/lang/Object;
.source "Bridge.java"

.implements Landroid/hardware/SensorEventListener;
.implements Ljava/lang/Runnable;

# Pont exposé à la page sous le nom window.TPStore :
#   getItem(k) / setItem(k, v) : sauvegarde dans SharedPreferences "tamapoke"
#   readAsset(chemin)          : fichier des assets en base64 (secours si XHR file:// échoue)
#   moveToBack()               : passe l'appli en arrière-plan (bouton retour)
#   stepState()                : 1 podomètre actif, 0 permission à accorder, -1 pas de capteur
#   getSteps()                 : compteur matériel cumulé depuis le démarrage (-1 si pas encore lu)
#   askStepPermission()        : demande ACTIVITY_RECOGNITION (Android 10+)
#
# Le compteur TYPE_STEP_COUNTER compte en permanence, même appli fermée : on
# n'écoute que pendant que l'appli est ouverte (start/stop), la page fait la
# différence avec la dernière valeur lue.

.field private final act:Landroid/app/Activity;
.field private final prefs:Landroid/content/SharedPreferences;
.field private sm:Landroid/hardware/SensorManager;
.field private sensor:Landroid/hardware/Sensor;
.field private registered:Z
.field private volatile steps:F
.field private volatile state:I


.method public constructor <init>(Landroid/app/Activity;)V
    .registers 4
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-string v0, "tamapoke"
    const/4 v1, 0x0
    invoke-virtual {p1, v0, v1}, Landroid/app/Activity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v0
    iput-object v0, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;

    const/high16 v0, -0x40800000    # -1.0f
    iput v0, p0, Lcom/flo/tamapoke/Bridge;->steps:F
    const/4 v0, -0x1
    iput v0, p0, Lcom/flo/tamapoke/Bridge;->state:I

    const-string v0, "sensor"
    invoke-virtual {p1, v0}, Landroid/app/Activity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;
    move-result-object v0
    check-cast v0, Landroid/hardware/SensorManager;
    iput-object v0, p0, Lcom/flo/tamapoke/Bridge;->sm:Landroid/hardware/SensorManager;
    if-eqz v0, :done
    const/16 v1, 0x13              # Sensor.TYPE_STEP_COUNTER
    invoke-virtual {v0, v1}, Landroid/hardware/SensorManager;->getDefaultSensor(I)Landroid/hardware/Sensor;
    move-result-object v0
    iput-object v0, p0, Lcom/flo/tamapoke/Bridge;->sensor:Landroid/hardware/Sensor;
    :done
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->syncService()V
    return-void
.end method


# appelé par onResume : vérifie la permission puis écoute le capteur
.method public start()V
    .registers 5
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->syncService()V
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->sensor:Landroid/hardware/Sensor;
    if-nez v0, :has
    const/4 v1, -0x1
    iput v1, p0, Lcom/flo/tamapoke/Bridge;->state:I
    return-void

    :has
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v2, 0x1d
    if-lt v1, v2, :granted
    iget-object v1, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-string v2, "android.permission.ACTIVITY_RECOGNITION"
    invoke-virtual {v1, v2}, Landroid/app/Activity;->checkSelfPermission(Ljava/lang/String;)I
    move-result v1
    if-eqz v1, :granted
    const/4 v1, 0x0
    iput v1, p0, Lcom/flo/tamapoke/Bridge;->state:I
    return-void

    :granted
    iget-boolean v1, p0, Lcom/flo/tamapoke/Bridge;->registered:Z
    if-nez v1, :ok
    iget-object v1, p0, Lcom/flo/tamapoke/Bridge;->sm:Landroid/hardware/SensorManager;
    const/4 v2, 0x3                # SENSOR_DELAY_NORMAL
    invoke-virtual {v1, p0, v0, v2}, Landroid/hardware/SensorManager;->registerListener(Landroid/hardware/SensorEventListener;Landroid/hardware/Sensor;I)Z
    move-result v1
    iput-boolean v1, p0, Lcom/flo/tamapoke/Bridge;->registered:Z
    if-nez v1, :ok
    const/4 v1, -0x1
    iput v1, p0, Lcom/flo/tamapoke/Bridge;->state:I
    return-void

    :ok
    const/4 v1, 0x1
    iput v1, p0, Lcom/flo/tamapoke/Bridge;->state:I
    return-void
.end method


# appelé par onPause
.method public stop()V
    .registers 3
    iget-boolean v0, p0, Lcom/flo/tamapoke/Bridge;->registered:Z
    if-eqz v0, :done
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->sm:Landroid/hardware/SensorManager;
    invoke-virtual {v0, p0}, Landroid/hardware/SensorManager;->unregisterListener(Landroid/hardware/SensorEventListener;)V
    const/4 v0, 0x0
    iput-boolean v0, p0, Lcom/flo/tamapoke/Bridge;->registered:Z
    :done
    return-void
.end method


.method public onSensorChanged(Landroid/hardware/SensorEvent;)V
    .registers 4
    iget-object v0, p1, Landroid/hardware/SensorEvent;->values:[F
    if-eqz v0, :done
    array-length v1, v0
    if-eqz v1, :done
    const/4 v1, 0x0
    aget v0, v0, v1
    iput v0, p0, Lcom/flo/tamapoke/Bridge;->steps:F
    :done
    return-void
.end method


.method public onAccuracyChanged(Landroid/hardware/Sensor;I)V
    .registers 3
    return-void
.end method


# Runnable : la demande de permission part du thread principal
.method public run()V
    .registers 5
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v1, 0x1d
    if-lt v0, v1, :done
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const/4 v1, 0x1
    new-array v1, v1, [Ljava/lang/String;
    const/4 v2, 0x0
    const-string v3, "android.permission.ACTIVITY_RECOGNITION"
    aput-object v3, v1, v2
    const/16 v2, 0x2a
    invoke-virtual {v0, v1, v2}, Landroid/app/Activity;->requestPermissions([Ljava/lang/String;I)V
    :done
    return-void
.end method


.method public stepState()I
    .registers 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget v0, p0, Lcom/flo/tamapoke/Bridge;->state:I
    return v0
.end method


.method public getSteps()F
    .registers 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget v0, p0, Lcom/flo/tamapoke/Bridge;->steps:F
    return v0
.end method


.method public askStepPermission()V
    .registers 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    invoke-virtual {v0, p0}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V
    return-void
.end method


.method public getItem(Ljava/lang/String;)Ljava/lang/String;
    .registers 4
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;
    const/4 v1, 0x0
    invoke-interface {v0, p1, v1}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v0
    return-object v0
.end method


.method public setItem(Ljava/lang/String;Ljava/lang/String;)V
    .registers 4
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;
    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v0
    invoke-interface {v0, p1, p2}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;
    move-result-object v0
    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V
    return-void
.end method


.method public readAsset(Ljava/lang/String;)Ljava/lang/String;
    .registers 7
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    :try_start_0
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    invoke-virtual {v0}, Landroid/app/Activity;->getAssets()Landroid/content/res/AssetManager;
    move-result-object v0
    invoke-virtual {v0, p1}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;
    move-result-object v0
    new-instance v1, Ljava/io/ByteArrayOutputStream;
    invoke-direct {v1}, Ljava/io/ByteArrayOutputStream;-><init>()V
    const/16 v2, 0x4000
    new-array v2, v2, [B
    :loop
    invoke-virtual {v0, v2}, Ljava/io/InputStream;->read([B)I
    move-result v3
    if-ltz v3, :done
    const/4 v4, 0x0
    invoke-virtual {v1, v2, v4, v3}, Ljava/io/ByteArrayOutputStream;->write([BII)V
    goto :loop
    :done
    invoke-virtual {v0}, Ljava/io/InputStream;->close()V
    invoke-virtual {v1}, Ljava/io/ByteArrayOutputStream;->toByteArray()[B
    move-result-object v2
    const/4 v4, 0x2
    invoke-static {v2, v4}, Landroid/util/Base64;->encodeToString([BI)Ljava/lang/String;
    move-result-object v0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    return-object v0

    :catch_0
    const/4 v0, 0x0
    return-object v0
.end method


.method public moveToBack()V
    .registers 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const/4 v1, 0x1
    invoke-virtual {v0, v1}, Landroid/app/Activity;->moveTaskToBack(Z)Z
    return-void
.end method


# ------------------------------------------------------------------ arrière-plan
# démarre ou arrête le service selon le réglage bg_on (activé par défaut)
.method private syncService()V
    .registers 6
    :try_start_0
    new-instance v0, Landroid/content/Intent;
    iget-object v1, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-class v2, Lcom/flo/tamapoke/PetService;
    invoke-direct {v0, v1, v2}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V
    iget-object v2, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;
    const-string v3, "bg_on"
    const/4 v4, 0x1
    invoke-interface {v2, v3, v4}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v2
    if-eqz v2, :stop
    invoke-virtual {v1, v0}, Landroid/content/Context;->startForegroundService(Landroid/content/Intent;)Landroid/content/ComponentName;
    goto :end
    :stop
    invoke-virtual {v1, v0}, Landroid/content/Context;->stopService(Landroid/content/Intent;)Z
    :end
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    return-void
    :catch_0
    return-void
.end method


# PendingIntent d'une alerte (id 100..111) ; l'action suffit à la retrouver pour l'annuler
.method private alertIntent(ILandroid/content/Intent;)Landroid/app/PendingIntent;
    .registers 6
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const/high16 v1, 0xc000000
    invoke-static {v0, p1, p2, v1}, Landroid/app/PendingIntent;->getBroadcast(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;
    move-result-object v0
    return-object v0
.end method


.method private newAlert()Landroid/content/Intent;
    .registers 4
    new-instance v0, Landroid/content/Intent;
    iget-object v1, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-class v2, Lcom/flo/tamapoke/AlarmReceiver;
    invoke-direct {v0, v1, v2}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V
    const-string v1, "com.flo.tamapoke.ALERT"
    invoke-virtual {v0, v1}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;
    return-object v0
.end method


.method private cancelAlerts()V
    .registers 6
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-string v1, "alarm"
    invoke-virtual {v0, v1}, Landroid/app/Activity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;
    move-result-object v1
    check-cast v1, Landroid/app/AlarmManager;
    const/16 v2, 0x64
    :loop
    const/16 v3, 0x70
    if-ge v2, v3, :done
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->newAlert()Landroid/content/Intent;
    move-result-object v3
    invoke-direct {p0, v2, v3}, Lcom/flo/tamapoke/Bridge;->alertIntent(ILandroid/content/Intent;)Landroid/app/PendingIntent;
    move-result-object v3
    invoke-virtual {v1, v3}, Landroid/app/AlarmManager;->cancel(Landroid/app/PendingIntent;)V
    add-int/lit8 v2, v2, 0x1
    goto :loop
    :done
    return-void
.end method


# efface les alertes déjà affichées (rencontre 50, rappels 100..111)
.method private clearAlertNotifs()V
    .registers 5
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-string v1, "notification"
    invoke-virtual {v0, v1}, Landroid/app/Activity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;
    move-result-object v0
    check-cast v0, Landroid/app/NotificationManager;
    const/16 v1, 0x32
    invoke-virtual {v0, v1}, Landroid/app/NotificationManager;->cancel(I)V
    const/16 v1, 0x64
    :loop
    const/16 v2, 0x70
    if-ge v1, v2, :done
    invoke-virtual {v0, v1}, Landroid/app/NotificationManager;->cancel(I)V
    add-int/lit8 v1, v1, 0x1
    goto :loop
    :done
    return-void
.end method


# plan JSON envoyé par le jeu :
#  { fg, base, today, toEnc, title, lbl, wildT, wildX, a:[{at, t, x}, ...] }
.method public setPlan(Ljava/lang/String;)V
    .registers 16
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;
    invoke-direct {v0, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->cancelAlerts()V

    iget-object v1, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;
    invoke-interface {v1}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v1

    const-string v2, "fg"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z
    move-result v3
    const-string v2, "bg_fg"
    invoke-interface {v1, v2, v3}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    const-string v2, "base"
    const-wide/16 v4, -0x1
    invoke-virtual {v0, v2, v4, v5}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;J)J
    move-result-wide v4
    const-string v2, "bg_base"
    invoke-interface {v1, v2, v4, v5}, Landroid/content/SharedPreferences$Editor;->putLong(Ljava/lang/String;J)Landroid/content/SharedPreferences$Editor;

    const-string v2, "today"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I
    move-result v4
    const-string v2, "bg_today0"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;
    const-string v2, "bg_today"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    const-string v2, "toEnc"
    const/4 v4, -0x1
    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I
    move-result v4
    const-string v2, "bg_toEnc"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;
    const-string v2, "bg_encN"
    const/4 v4, 0x0
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    const-string v2, "title"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v4
    const-string v2, "bg_title"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;
    const-string v2, "lbl"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v4
    const-string v2, "bg_lbl"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;
    const-string v2, "wildT"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v4
    const-string v2, "bg_wildT"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;
    const-string v2, "wildX"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v4
    const-string v2, "bg_wildX"
    invoke-interface {v1, v2, v4}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->apply()V

    if-eqz v3, :sched
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->clearAlertNotifs()V

    :sched
    const-string v2, "a"
    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;
    move-result-object v2
    if-eqz v2, :svc
    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I
    move-result v3
    const/16 v4, 0xc
    if-le v3, v4, :lenok
    move v3, v4
    :lenok
    iget-object v4, p0, Lcom/flo/tamapoke/Bridge;->act:Landroid/app/Activity;
    const-string v5, "alarm"
    invoke-virtual {v4, v5}, Landroid/app/Activity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;
    move-result-object v4
    check-cast v4, Landroid/app/AlarmManager;
    const/4 v5, 0x0

    :loop
    if-ge v5, v3, :svc
    invoke-virtual {v2, v5}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;
    move-result-object v6
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->newAlert()Landroid/content/Intent;
    move-result-object v7
    add-int/lit8 v8, v5, 0x64
    const-string v9, "id"
    invoke-virtual {v7, v9, v8}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;
    const-string v9, "t"
    invoke-virtual {v6, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v10
    invoke-virtual {v7, v9, v10}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    const-string v9, "x"
    invoke-virtual {v6, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v10
    invoke-virtual {v7, v9, v10}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    invoke-direct {p0, v8, v7}, Lcom/flo/tamapoke/Bridge;->alertIntent(ILandroid/content/Intent;)Landroid/app/PendingIntent;
    move-result-object v7
    const-string v9, "at"
    invoke-virtual {v6, v9}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;)J
    move-result-wide v10
    const/4 v12, 0x0                 # RTC_WAKEUP
    invoke-virtual {v4, v12, v10, v11, v7}, Landroid/app/AlarmManager;->setExactAndAllowWhileIdle(IJLandroid/app/PendingIntent;)V
    add-int/lit8 v5, v5, 0x1
    goto :loop

    :svc
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->syncService()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    return-void
    :catch_0
    return-void
.end method


.method public setBackground(Z)V
    .registers 5
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;
    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v0
    const-string v1, "bg_on"
    invoke-interface {v0, v1, p1}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;
    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->commit()Z
    if-nez p1, :on
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->cancelAlerts()V
    :on
    invoke-direct {p0}, Lcom/flo/tamapoke/Bridge;->syncService()V
    return-void
.end method


.method public isBackground()Z
    .registers 4
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    iget-object v0, p0, Lcom/flo/tamapoke/Bridge;->prefs:Landroid/content/SharedPreferences;
    const-string v1, "bg_on"
    const/4 v2, 0x1
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v0
    return v0
.end method
