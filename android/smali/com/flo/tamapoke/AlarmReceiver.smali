.class public Lcom/flo/tamapoke/AlarmReceiver;
.super Landroid/content/BroadcastReceiver;
.source "AlarmReceiver.java"

# - action com.flo.tamapoke.ALERT : alarme programmée par le jeu -> notification
# - démarrage du téléphone / mise à jour de l'appli : relance le service du podomètre


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/content/BroadcastReceiver;-><init>()V
    return-void
.end method


.method public onReceive(Landroid/content/Context;Landroid/content/Intent;)V
    .registers 7
    invoke-virtual {p2}, Landroid/content/Intent;->getAction()Ljava/lang/String;
    move-result-object v0
    const-string v1, "com.flo.tamapoke.ALERT"
    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z
    move-result v1
    if-eqz v1, :boot

    const-string v0, "id"
    const/16 v1, 0x64
    invoke-virtual {p2, v0, v1}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I
    move-result v1
    const-string v0, "t"
    invoke-virtual {p2, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v2
    const-string v0, "x"
    invoke-virtual {p2, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v3
    if-eqz v2, :done
    invoke-static {p1, v1, v2, v3}, Lcom/flo/tamapoke/Notif;->post(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)V
    :done
    invoke-static {p1}, Lcom/flo/tamapoke/Widget;->render(Landroid/content/Context;)V
    return-void

    :boot
    const-string v0, "tamapoke"
    const/4 v1, 0x0
    invoke-virtual {p1, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v0
    const-string v1, "bg_on"
    const/4 v2, 0x1
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z
    move-result v0
    if-eqz v0, :done2
    :try_start_0
    new-instance v0, Landroid/content/Intent;
    const-class v1, Lcom/flo/tamapoke/PetService;
    invoke-direct {v0, p1, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V
    invoke-virtual {p1, v0}, Landroid/content/Context;->startForegroundService(Landroid/content/Intent;)Landroid/content/ComponentName;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :done2
    :done2
    invoke-static {p1}, Lcom/flo/tamapoke/Widget;->render(Landroid/content/Context;)V
    return-void
.end method
