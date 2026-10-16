.class public Lcom/flo/tamapoke/PetService;
.super Landroid/app/Service;
.source "PetService.java"

.implements Landroid/hardware/SensorEventListener;

# Service de premier plan (notification permanente) : écoute le podomètre
# même écran verrouillé et appli fermée.
#
# Le jeu (JavaScript) lui laisse un « plan » dans SharedPreferences quand il
# passe en arrière-plan (Bridge.setPlan) :
#   bg_base   compteur cumulé au moment du plan     bg_today0 pas du jour à ce moment
#   bg_toEnc  pas restants avant la prochaine rencontre (-1 = rien à annoncer)
#   bg_fg     appli au premier plan (pas d'alerte)  bg_encN   rencontre déjà annoncée
#   bg_title / bg_lbl / bg_wildT / bg_wildX : textes dans la langue du jeu
# Les vrais calculs (rencontres, entraînement) restent faits par le jeu à la
# réouverture : le service ne fait qu'afficher et prévenir.

.field private sm:Landroid/hardware/SensorManager;
.field private registered:Z
.field private lastUpdate:J


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/app/Service;-><init>()V
    return-void
.end method


.method public onBind(Landroid/content/Intent;)Landroid/os/IBinder;
    .registers 3
    const/4 v0, 0x0
    return-object v0
.end method


.method public onCreate()V
    .registers 1
    invoke-super {p0}, Landroid/app/Service;->onCreate()V
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->showStatus()V
    return-void
.end method


.method public onStartCommand(Landroid/content/Intent;II)I
    .registers 5
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->showStatus()V
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->listen()V
    const/4 v0, 0x1                  # START_STICKY
    return v0
.end method


.method public onDestroy()V
    .registers 2
    iget-boolean v0, p0, Lcom/flo/tamapoke/PetService;->registered:Z
    if-eqz v0, :skip
    iget-object v0, p0, Lcom/flo/tamapoke/PetService;->sm:Landroid/hardware/SensorManager;
    invoke-virtual {v0, p0}, Landroid/hardware/SensorManager;->unregisterListener(Landroid/hardware/SensorEventListener;)V
    const/4 v0, 0x0
    iput-boolean v0, p0, Lcom/flo/tamapoke/PetService;->registered:Z
    :skip
    invoke-super {p0}, Landroid/app/Service;->onDestroy()V
    return-void
.end method


.method private prefs()Landroid/content/SharedPreferences;
    .registers 3
    const-string v0, "tamapoke"
    const/4 v1, 0x0
    invoke-virtual {p0, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v0
    return-object v0
.end method


.method private statusText()Ljava/lang/String;
    .registers 5
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    new-instance v1, Ljava/lang/StringBuilder;
    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V
    const-string v2, "bg_today"
    const/4 v3, 0x0
    invoke-interface {v0, v2, v3}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v2
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    const-string v2, " "
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v2, "bg_lbl"
    const-string v3, "pas aujourd\'hui"
    invoke-interface {v0, v2, v3}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v2
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v0
    return-object v0
.end method


.method private showStatus()V
    .registers 7
    :try_start_0
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    const-string v1, "bg_title"
    const-string v2, "TamaPoke"
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->statusText()Ljava/lang/String;
    move-result-object v2
    invoke-static {p0}, Lcom/flo/tamapoke/Notif;->channels(Landroid/content/Context;)Landroid/app/NotificationManager;
    const-string v3, "status"
    const/4 v4, 0x1
    invoke-static {p0, v3, v1, v2, v4}, Lcom/flo/tamapoke/Notif;->build(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)Landroid/app/Notification;
    move-result-object v3
    const/4 v4, 0x1
    invoke-virtual {p0, v4, v3}, Landroid/app/Service;->startForeground(ILandroid/app/Notification;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    return-void
    :catch_0
    return-void
.end method


# s'abonne au compteur de pas (variante « réveil » si le téléphone l'a)
.method private listen()V
    .registers 7
    iget-boolean v0, p0, Lcom/flo/tamapoke/PetService;->registered:Z
    if-nez v0, :done

    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v1, 0x1d
    if-lt v0, v1, :ok
    const-string v0, "android.permission.ACTIVITY_RECOGNITION"
    invoke-virtual {p0, v0}, Landroid/content/Context;->checkSelfPermission(Ljava/lang/String;)I
    move-result v0
    if-nez v0, :done

    :ok
    const-string v0, "sensor"
    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;
    move-result-object v0
    check-cast v0, Landroid/hardware/SensorManager;
    if-eqz v0, :done
    iput-object v0, p0, Lcom/flo/tamapoke/PetService;->sm:Landroid/hardware/SensorManager;
    const/16 v1, 0x13
    const/4 v2, 0x1
    invoke-virtual {v0, v1, v2}, Landroid/hardware/SensorManager;->getDefaultSensor(IZ)Landroid/hardware/Sensor;
    move-result-object v1
    if-nez v1, :have
    const/16 v1, 0x13
    invoke-virtual {v0, v1}, Landroid/hardware/SensorManager;->getDefaultSensor(I)Landroid/hardware/Sensor;
    move-result-object v1
    if-eqz v1, :done

    :have
    const/4 v2, 0x3                  # SENSOR_DELAY_NORMAL
    const v3, 0x23c34600             # 10 min de latence max (le capteur regroupe)
    invoke-virtual {v0, p0, v1, v2, v3}, Landroid/hardware/SensorManager;->registerListener(Landroid/hardware/SensorEventListener;Landroid/hardware/Sensor;II)Z
    move-result v0
    iput-boolean v0, p0, Lcom/flo/tamapoke/PetService;->registered:Z

    :done
    return-void
.end method


.method public onAccuracyChanged(Landroid/hardware/Sensor;I)V
    .registers 3
    return-void
.end method


.method public onSensorChanged(Landroid/hardware/SensorEvent;)V
    .registers 14
    iget-object v0, p1, Landroid/hardware/SensorEvent;->values:[F
    if-eqz v0, :ret
    array-length v1, v0
    if-eqz v1, :ret
    const/4 v1, 0x0
    aget v0, v0, v1
    float-to-long v0, v0                         # v0:v1 = compteur cumulé

    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v2
    invoke-interface {v2}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v3

    const-string v4, "bg_base"
    const-wide/16 v5, -0x1
    invoke-interface {v2, v4, v5, v6}, Landroid/content/SharedPreferences;->getLong(Ljava/lang/String;J)J
    move-result-wide v5                          # v5:v6 = base
    const-wide/16 v7, 0x0
    cmp-long v9, v5, v7
    if-ltz v9, :setbase
    cmp-long v9, v0, v5
    if-gez v9, :have
    # le téléphone a redémarré : le compteur est reparti de zéro
    move-wide v5, v7
    invoke-interface {v3, v4, v5, v6}, Landroid/content/SharedPreferences$Editor;->putLong(Ljava/lang/String;J)Landroid/content/SharedPreferences$Editor;
    goto :have

    :setbase
    invoke-interface {v3, v4, v0, v1}, Landroid/content/SharedPreferences$Editor;->putLong(Ljava/lang/String;J)Landroid/content/SharedPreferences$Editor;
    move-wide v5, v0

    :have
    sub-long v7, v0, v5
    long-to-int v7, v7                           # v7 = pas depuis le plan
    const-string v4, "bg_today0"
    const/4 v8, 0x0
    invoke-interface {v2, v4, v8}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v8
    add-int/2addr v8, v7
    const-string v4, "bg_today"
    invoke-interface {v3, v4, v8}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    # rencontre sauvage : jauge pleine, appli fermée, pas encore annoncée
    const-string v4, "bg_toEnc"
    const/4 v9, -0x1
    invoke-interface {v2, v4, v9}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v9
    if-ltz v9, :commit
    if-lt v7, v9, :commit
    const-string v4, "bg_encN"
    const/4 v10, 0x0
    invoke-interface {v2, v4, v10}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v10
    if-nez v10, :commit
    const-string v4, "bg_fg"
    const/4 v10, 0x0
    invoke-interface {v2, v4, v10}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v10
    if-nez v10, :commit
    const-string v4, "bg_encN"
    const/4 v10, 0x1
    invoke-interface {v3, v4, v10}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;
    const-string v4, "bg_wildT"
    const-string v10, "TamaPoke"
    invoke-interface {v2, v4, v10}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v10
    const-string v4, "bg_wildX"
    const-string v11, ""
    invoke-interface {v2, v4, v11}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v11
    const/16 v4, 0x32
    invoke-static {p0, v4, v10, v11}, Lcom/flo/tamapoke/Notif;->post(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)V

    :commit
    invoke-interface {v3}, Landroid/content/SharedPreferences$Editor;->apply()V

    # notification permanente rafraîchie au plus toutes les 15 s
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J
    move-result-wide v4
    iget-wide v6, p0, Lcom/flo/tamapoke/PetService;->lastUpdate:J
    sub-long v6, v4, v6
    const-wide/16 v8, 0x3a98
    cmp-long v10, v6, v8
    if-ltz v10, :ret
    iput-wide v4, p0, Lcom/flo/tamapoke/PetService;->lastUpdate:J
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->showStatus()V

    :ret
    return-void
.end method
