.class public Lcom/flo/tamapoke/Notif;
.super Ljava/lang/Object;
.source "Notif.java"

# Outils de notification (Android 8+ : canaux obligatoires)
#   channels(ctx)                  : crée les canaux "status" (discret) et "alerts"
#   build(ctx, canal, titre, texte, permanente)
#   post(ctx, id, titre, texte)    : alerte (touchée = ouvre le jeu)


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method


.method public static channels(Landroid/content/Context;)Landroid/app/NotificationManager;
    .registers 6
    const-string v0, "notification"
    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;
    move-result-object v0
    check-cast v0, Landroid/app/NotificationManager;

    new-instance v1, Landroid/app/NotificationChannel;
    const-string v2, "status"
    const-string v3, "Podomètre (permanent)"
    const/4 v4, 0x2
    invoke-direct {v1, v2, v3, v4}, Landroid/app/NotificationChannel;-><init>(Ljava/lang/String;Ljava/lang/CharSequence;I)V
    invoke-virtual {v0, v1}, Landroid/app/NotificationManager;->createNotificationChannel(Landroid/app/NotificationChannel;)V

    new-instance v1, Landroid/app/NotificationChannel;
    const-string v2, "alerts"
    const-string v3, "Alertes du compagnon"
    const/4 v4, 0x3
    invoke-direct {v1, v2, v3, v4}, Landroid/app/NotificationChannel;-><init>(Ljava/lang/String;Ljava/lang/CharSequence;I)V
    invoke-virtual {v0, v1}, Landroid/app/NotificationManager;->createNotificationChannel(Landroid/app/NotificationChannel;)V
    return-object v0
.end method


.method public static build(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)Landroid/app/Notification;
    .registers 11
    new-instance v0, Landroid/app/Notification$Builder;
    invoke-direct {v0, p0, p1}, Landroid/app/Notification$Builder;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;
    move-result-object v1
    const-string v2, "ic_notif"
    const-string v3, "drawable"
    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;
    move-result-object v4
    invoke-virtual {v1, v2, v3, v4}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I
    move-result v1
    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setSmallIcon(I)Landroid/app/Notification$Builder;

    invoke-virtual {v0, p2}, Landroid/app/Notification$Builder;->setContentTitle(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;
    invoke-virtual {v0, p3}, Landroid/app/Notification$Builder;->setContentText(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;
    invoke-virtual {v0, p4}, Landroid/app/Notification$Builder;->setOngoing(Z)Landroid/app/Notification$Builder;
    xor-int/lit8 v1, p4, 0x1
    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setAutoCancel(Z)Landroid/app/Notification$Builder;
    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setShowWhen(Z)Landroid/app/Notification$Builder;

    new-instance v1, Landroid/content/Intent;
    const-class v2, Lcom/flo/tamapoke/MainActivity;
    invoke-direct {v1, p0, v2}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V
    const/high16 v2, 0x30000000      # NEW_TASK | SINGLE_TOP
    invoke-virtual {v1, v2}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;
    const/4 v2, 0x0
    const/high16 v3, 0xc000000       # UPDATE_CURRENT | IMMUTABLE
    invoke-static {p0, v2, v1, v3}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;
    move-result-object v1
    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setContentIntent(Landroid/app/PendingIntent;)Landroid/app/Notification$Builder;

    invoke-virtual {v0}, Landroid/app/Notification$Builder;->build()Landroid/app/Notification;
    move-result-object v0
    return-object v0
.end method


.method public static post(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)V
    .registers 7
    invoke-static {p0}, Lcom/flo/tamapoke/Notif;->channels(Landroid/content/Context;)Landroid/app/NotificationManager;
    move-result-object v0
    const-string v1, "alerts"
    const/4 v2, 0x0
    invoke-static {p0, v1, p2, p3, v2}, Lcom/flo/tamapoke/Notif;->build(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)Landroid/app/Notification;
    move-result-object v1
    invoke-virtual {v0, p1, v1}, Landroid/app/NotificationManager;->notify(ILandroid/app/Notification;)V
    return-void
.end method


# heures calmes : bg_qs / bg_qe en minutes depuis minuit (-1 = désactivé) ;
# l'œuf peut passer quand même (bg_qegg)
.method public static quiet(Landroid/content/Context;Z)Z
    .registers 8
    const-string v0, "tamapoke"
    const/4 v1, 0x0
    invoke-virtual {p0, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v0
    if-eqz p1, :noegg
    const-string v2, "bg_qegg"
    invoke-interface {v0, v2, v1}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v2
    if-nez v2, :no
    :noegg
    const-string v2, "bg_qs"
    const/4 v3, -0x1
    invoke-interface {v0, v2, v3}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v2
    const-string v4, "bg_qe"
    invoke-interface {v0, v4, v3}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v4
    if-ltz v2, :no
    if-ltz v4, :no
    if-eq v2, v4, :no
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;
    move-result-object v0
    const/16 v1, 0xb
    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I
    move-result v1
    mul-int/lit8 v1, v1, 0x3c
    const/16 v3, 0xc
    invoke-virtual {v0, v3}, Ljava/util/Calendar;->get(I)I
    move-result v3
    add-int/2addr v1, v3
    # v1 = minute de la journée ; v2 = début, v4 = fin
    if-ge v2, v4, :wrap
    if-lt v1, v2, :no
    if-ge v1, v4, :no
    goto :yes
    :wrap
    if-ge v1, v2, :yes
    if-lt v1, v4, :yes
    :no
    const/4 v0, 0x0
    return v0
    :yes
    const/4 v0, 0x1
    return v0
.end method
