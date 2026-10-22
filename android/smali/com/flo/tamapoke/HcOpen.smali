.class public Lcom/flo/tamapoke/HcOpen;
.super Ljava/lang/Object;
.source "HcOpen.java"
.implements Ljava/lang/Runnable;

# Essaie dans l'ordre : autorisations de TamaPoke dans Health Connect, accueil
# de Health Connect, écran Jetpack de Health Connect, fiche de l'appli dans Android.

.field private act:Landroid/app/Activity;


.method public constructor <init>(Landroid/app/Activity;)V
    .registers 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/flo/tamapoke/HcOpen;->act:Landroid/app/Activity;
    return-void
.end method


.method private tryStart(Landroid/content/Intent;)Z
    .registers 4
    :try_start_0
    iget-object v0, p0, Lcom/flo/tamapoke/HcOpen;->act:Landroid/app/Activity;
    invoke-virtual {v0, p1}, Landroid/app/Activity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :fail
    const/4 v0, 0x1
    return v0
    :fail
    const/4 v0, 0x0
    return v0
.end method


.method public run()V
    .registers 6
    iget-object v0, p0, Lcom/flo/tamapoke/HcOpen;->act:Landroid/app/Activity;
    invoke-virtual {v0}, Landroid/app/Activity;->getPackageName()Ljava/lang/String;
    move-result-object v1

    new-instance v2, Landroid/content/Intent;
    const-string v3, "android.health.connect.action.MANAGE_HEALTH_PERMISSIONS"
    invoke-direct {v2, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V
    const-string v3, "android.intent.extra.PACKAGE_NAME"
    invoke-virtual {v2, v3, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    invoke-direct {p0, v2}, Lcom/flo/tamapoke/HcOpen;->tryStart(Landroid/content/Intent;)Z
    move-result v3
    if-nez v3, :done

    new-instance v2, Landroid/content/Intent;
    const-string v3, "android.health.connect.action.HEALTH_HOME_SETTINGS"
    invoke-direct {v2, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V
    invoke-direct {p0, v2}, Lcom/flo/tamapoke/HcOpen;->tryStart(Landroid/content/Intent;)Z
    move-result v3
    if-nez v3, :done

    new-instance v2, Landroid/content/Intent;
    const-string v3, "androidx.health.ACTION_HEALTH_CONNECT_SETTINGS"
    invoke-direct {v2, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V
    invoke-direct {p0, v2}, Lcom/flo/tamapoke/HcOpen;->tryStart(Landroid/content/Intent;)Z
    move-result v3
    if-nez v3, :done

    new-instance v2, Landroid/content/Intent;
    const-string v3, "android.settings.APPLICATION_DETAILS_SETTINGS"
    invoke-direct {v2, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V
    new-instance v3, Ljava/lang/StringBuilder;
    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V
    const-string v4, "package:"
    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v3
    invoke-static {v3}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v3
    invoke-virtual {v2, v3}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;
    invoke-direct {p0, v2}, Lcom/flo/tamapoke/HcOpen;->tryStart(Landroid/content/Intent;)Z
    :done
    return-void
.end method
