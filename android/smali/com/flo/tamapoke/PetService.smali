.class public Lcom/flo/tamapoke/PetService;
.super Landroid/app/Service;
.source "PetService.java"

.implements Landroid/hardware/SensorEventListener;
.implements Ljava/lang/Runnable;

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
#
# v19 : toutes les 15 min, si le jeu l'a permis (bg_hc) et que la permission
# Health Connect en arrière-plan est accordée, lit les pas de la montre depuis
# minuit (bg_hcN). Pas depuis le plan = max(podomètre, Health Connect - bg_today0),
# même règle que health.js : jamais de double comptage.

.field private sm:Landroid/hardware/SensorManager;
.field private registered:Z
.field private lastUpdate:J
.field private lastWidget:J
.field private handler:Landroid/os/Handler;


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
    .registers 3
    invoke-super {p0}, Landroid/app/Service;->onCreate()V
    new-instance v0, Landroid/os/Handler;
    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;
    move-result-object v1
    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V
    iput-object v0, p0, Lcom/flo/tamapoke/PetService;->handler:Landroid/os/Handler;
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->showStatus()V
    return-void
.end method


.method public onStartCommand(Landroid/content/Intent;II)I
    .registers 7
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->showStatus()V
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->listen()V
    # v19 : première lecture Health Connect 1 min après le plan
    const-wide/32 v0, 0xea60
    invoke-direct {p0, v0, v1}, Lcom/flo/tamapoke/PetService;->schedule(J)V
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
    iget-object v0, p0, Lcom/flo/tamapoke/PetService;->handler:Landroid/os/Handler;
    if-eqz v0, :nohandler
    invoke-virtual {v0, p0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V
    :nohandler
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
    long-to-int v7, v7                           # v7 = pas du téléphone depuis le plan
    const-string v4, "bg_ph"
    invoke-interface {v3, v4, v7}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;
    invoke-interface {v3}, Landroid/content/SharedPreferences$Editor;->apply()V
    invoke-direct {p0, v7}, Lcom/flo/tamapoke/PetService;->update(I)V
    :ret
    return-void
.end method


# v19 : réponse de Health Connect (HealthBg) : pas depuis minuit
.method public onHc(J)V
    .registers 7
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v1
    long-to-int v2, p1
    const-string v3, "bg_hcN"
    invoke-interface {v1, v3, v2}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->apply()V
    const-string v3, "bg_ph"
    const/4 v2, 0x0
    invoke-interface {v0, v3, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v2
    invoke-direct {p0, v2}, Lcom/flo/tamapoke/PetService;->update(I)V
    return-void
.end method


.method private schedule(J)V
    .registers 4
    iget-object v0, p0, Lcom/flo/tamapoke/PetService;->handler:Landroid/os/Handler;
    if-eqz v0, :done
    invoke-virtual {v0, p0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V
    invoke-virtual {v0, p0, p1, p2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z
    :done
    return-void
.end method


# Runnable : lecture Health Connect (si permise) puis on recommence dans 15 min
.method public run()V
    .registers 9
    :try_start_0
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    const-string v1, "bg_hc"
    const/4 v2, 0x0
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v1
    if-eqz v1, :again
    invoke-static {p0}, Lcom/flo/tamapoke/HealthBg;->allowed(Landroid/content/Context;)Z
    move-result v1
    if-eqz v1, :again
    const-string v1, "bg_mid"
    const-wide/16 v2, 0x0
    invoke-interface {v0, v1, v2, v3}, Landroid/content/SharedPreferences;->getLong(Ljava/lang/String;J)J
    move-result-wide v2
    const-wide/16 v4, 0x0
    cmp-long v1, v2, v4
    if-lez v1, :again                            # pas encore de plan
    # même journée que le plan seulement (après minuit, le jeu rattrape à l'ouverture)
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J
    move-result-wide v4
    sub-long v4, v4, v2
    const-wide/32 v6, 0x5265c00
    cmp-long v1, v4, v6
    if-gez v1, :again
    invoke-static {p0, v2, v3}, Lcom/flo/tamapoke/HealthBg;->query(Lcom/flo/tamapoke/PetService;J)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :again
    :again
    const-wide/32 v0, 0xdbba0
    invoke-direct {p0, v0, v1}, Lcom/flo/tamapoke/PetService;->schedule(J)V
    return-void
.end method


# pas depuis le plan (p1 = téléphone) -> jauge, rencontre, œuf, notification
.method private update(I)V
    .registers 14
    move v7, p1
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v2
    invoke-interface {v2}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v3
    const-string v4, "bg_today0"
    const/4 v8, 0x0
    invoke-interface {v2, v4, v8}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v9
    const-string v4, "bg_hcN"
    const/4 v8, -0x1
    invoke-interface {v2, v4, v8}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v8
    if-ltz v8, :nohc
    sub-int/2addr v8, v9                         # pas de la montre pas encore comptés
    if-le v8, v7, :nohc
    move v7, v8
    :nohc
    add-int v8, v9, v7
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
    # heures calmes (v17) : on n'annonce pas ; ce sera fait au premier pas après
    const/4 v10, 0x0
    invoke-static {p0, v10}, Lcom/flo/tamapoke/Notif;->quiet(Landroid/content/Context;Z)Z
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
    invoke-direct {p0, v2, v3, v7}, Lcom/flo/tamapoke/PetService;->checkInc(Landroid/content/SharedPreferences;Landroid/content/SharedPreferences$Editor;I)V
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
    # widget : au plus toutes les bg_wgt ms (mode Équilibré : 5 min)
    iget-wide v6, p0, Lcom/flo/tamapoke/PetService;->lastWidget:J
    sub-long v6, v4, v6
    invoke-direct {p0}, Lcom/flo/tamapoke/PetService;->prefs()Landroid/content/SharedPreferences;
    move-result-object v2
    const-string v3, "bg_wgt"
    const-wide/16 v8, 0x3a98
    invoke-interface {v2, v3, v8, v9}, Landroid/content/SharedPreferences;->getLong(Ljava/lang/String;J)J
    move-result-wide v8
    cmp-long v10, v6, v8
    if-ltz v10, :ret
    iput-wide v4, p0, Lcom/flo/tamapoke/PetService;->lastWidget:J
    invoke-static {p0}, Lcom/flo/tamapoke/Widget;->render(Landroid/content/Context;)V

    :ret
    return-void
.end method


# l'œuf de l'incubateur a reçu assez de pas : on prévient (une fois)
.method private checkInc(Landroid/content/SharedPreferences;Landroid/content/SharedPreferences$Editor;I)V
    .registers 10
    const-string v0, "bg_incLeft"
    const/4 v1, -0x1
    invoke-interface {p1, v0, v1}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v1
    if-ltz v1, :done
    if-lt p3, v1, :done
    const-string v0, "bg_incN"
    const/4 v2, 0x0
    invoke-interface {p1, v0, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v2
    if-nez v2, :done
    const-string v0, "bg_fg"
    const/4 v2, 0x0
    invoke-interface {p1, v0, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v2
    if-nez v2, :done
    const/4 v2, 0x1
    invoke-static {p0, v2}, Lcom/flo/tamapoke/Notif;->quiet(Landroid/content/Context;Z)Z
    move-result v2
    if-nez v2, :done
    const-string v0, "bg_incN"
    const/4 v2, 0x1
    invoke-interface {p2, v0, v2}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;
    const-string v0, "bg_incT"
    const-string v2, "TamaPoke"
    invoke-interface {p1, v0, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v3
    const-string v0, "bg_incX"
    const-string v2, ""
    invoke-interface {p1, v0, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v4
    const/16 v0, 0x33
    invoke-static {p0, v0, v3, v4}, Lcom/flo/tamapoke/Notif;->post(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)V
    :done
    return-void
.end method
