.class public Lcom/flo/tamapoke/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"

# Activité unique : une WebView plein écran qui charge assets/www/index.html.
#
#   onCreate      : réglages WebView + pont JS "TPStore" (SharedPreferences)
#   onPause       : tpPause()  -> le jeu note l'heure et sauvegarde
#   onResume      : tpResume() -> applique le temps passé appli fermée
#   onBackPressed : tpBack()   -> ferme l'écran en cours, sinon arrière-plan

.field private web:Landroid/webkit/WebView;
.field private bridge:Lcom/flo/tamapoke/Bridge;


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method


.method protected onCreate(Landroid/os/Bundle;)V
    .registers 6

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    # barres système à la couleur du fond
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v0
    const v1, -0xefede8
    invoke-virtual {v0, v1}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v0, v1}, Landroid/view/Window;->setNavigationBarColor(I)V

    new-instance v0, Landroid/webkit/WebView;
    invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V
    iput-object v0, p0, Lcom/flo/tamapoke/MainActivity;->web:Landroid/webkit/WebView;
    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
    move-result-object v2
    const/4 v3, 0x1
    invoke-virtual {v2, v3}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V
    invoke-virtual {v2, v3}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V
    invoke-virtual {v2, v3}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V
    invoke-virtual {v2, v3}, Landroid/webkit/WebSettings;->setAllowFileAccessFromFileURLs(Z)V
    const/4 v3, 0x0
    invoke-virtual {v2, v3}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V
    const/16 v3, 0x64
    invoke-virtual {v2, v3}, Landroid/webkit/WebSettings;->setTextZoom(I)V

    new-instance v2, Lcom/flo/tamapoke/Bridge;
    invoke-direct {v2, p0}, Lcom/flo/tamapoke/Bridge;-><init>(Landroid/app/Activity;)V
    iput-object v2, p0, Lcom/flo/tamapoke/MainActivity;->bridge:Lcom/flo/tamapoke/Bridge;
    const-string v3, "TPStore"
    invoke-virtual {v0, v2, v3}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    new-instance v2, Lcom/flo/tamapoke/Chrome;
    invoke-direct {v2}, Lcom/flo/tamapoke/Chrome;-><init>()V
    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    invoke-virtual {p0, v0}, Landroid/app/Activity;->setContentView(Landroid/view/View;)V

    const-string v2, "file:///android_asset/www/index.html"
    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    return-void
.end method


.method private js(Ljava/lang/String;)V
    .registers 4
    iget-object v0, p0, Lcom/flo/tamapoke/MainActivity;->web:Landroid/webkit/WebView;
    if-eqz v0, :done
    const/4 v1, 0x0
    invoke-virtual {v0, p1, v1}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V
    :done
    return-void
.end method


.method public runJs(Ljava/lang/String;)V
    .registers 2
    invoke-direct {p0, p1}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    return-void
.end method


.method protected onPause()V
    .registers 3
    const-string v0, "window.tpPause&&tpPause()"
    invoke-direct {p0, v0}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    iget-object v0, p0, Lcom/flo/tamapoke/MainActivity;->web:Landroid/webkit/WebView;
    if-eqz v0, :skip
    invoke-virtual {v0}, Landroid/webkit/WebView;->onPause()V
    :skip
    iget-object v0, p0, Lcom/flo/tamapoke/MainActivity;->bridge:Lcom/flo/tamapoke/Bridge;
    if-eqz v0, :nob
    invoke-virtual {v0}, Lcom/flo/tamapoke/Bridge;->stop()V
    :nob
    invoke-super {p0}, Landroid/app/Activity;->onPause()V
    return-void
.end method


.method protected onResume()V
    .registers 3
    invoke-super {p0}, Landroid/app/Activity;->onResume()V
    iget-object v0, p0, Lcom/flo/tamapoke/MainActivity;->bridge:Lcom/flo/tamapoke/Bridge;
    if-eqz v0, :nob
    invoke-virtual {v0}, Lcom/flo/tamapoke/Bridge;->start()V
    :nob
    iget-object v0, p0, Lcom/flo/tamapoke/MainActivity;->web:Landroid/webkit/WebView;
    if-eqz v0, :skip
    invoke-virtual {v0}, Landroid/webkit/WebView;->onResume()V
    :skip
    const-string v0, "window.tpResume&&tpResume()"
    invoke-direct {p0, v0}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    return-void
.end method


.method public onBackPressed()V
    .registers 2
    const-string v0, "window.tpBack?tpBack():TPStore.moveToBack()"
    invoke-direct {p0, v0}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    return-void
.end method


.method protected onDestroy()V
    .registers 2
    iget-object v0, p0, Lcom/flo/tamapoke/MainActivity;->web:Landroid/webkit/WebView;
    if-eqz v0, :skip
    invoke-virtual {v0}, Landroid/webkit/WebView;->destroy()V
    :skip
    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V
    return-void
.end method


# résultat du sélecteur de documents (sauvegarde : 43 = enregistrer, 44 = ouvrir)
.method protected onActivityResult(IILandroid/content/Intent;)V
    .registers 9
    invoke-super {p0, p1, p2, p3}, Landroid/app/Activity;->onActivityResult(IILandroid/content/Intent;)V
    const/16 v0, 0x2b
    if-ne p1, v0, :open

    const/4 v1, 0x0
    const/4 v0, -0x1
    if-ne p2, v0, :saved
    if-eqz p3, :saved
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;
    move-result-object v2
    iget-object v3, p0, Lcom/flo/tamapoke/MainActivity;->bridge:Lcom/flo/tamapoke/Bridge;
    invoke-virtual {v3}, Lcom/flo/tamapoke/Bridge;->takePending()Ljava/lang/String;
    move-result-object v3
    invoke-static {p0, v2, v3}, Lcom/flo/tamapoke/Files;->write(Landroid/content/Context;Landroid/net/Uri;Ljava/lang/String;)Z
    move-result v1
    :saved
    if-eqz v1, :no
    const-string v0, "window.tpFileSaved&&tpFileSaved(true)"
    goto :call
    :no
    const-string v0, "window.tpFileSaved&&tpFileSaved(false)"
    :call
    invoke-direct {p0, v0}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    return-void

    :open
    const/16 v0, 0x2d
    if-ne p1, v0, :open2
    const/4 v0, -0x1
    if-ne p2, v0, :done
    if-eqz p3, :done
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;
    move-result-object v1
    if-eqz v1, :done
    :try_start_d
    invoke-virtual {p0}, Landroid/app/Activity;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v2
    const/4 v3, 0x3
    invoke-virtual {v2, v1, v3}, Landroid/content/ContentResolver;->takePersistableUriPermission(Landroid/net/Uri;I)V
    :try_end_d
    .catch Ljava/lang/Exception; {:try_start_d .. :try_end_d} :done
    new-instance v2, Ljava/lang/StringBuilder;
    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V
    const-string v3, "window.tpDirPicked&&tpDirPicked("
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Landroid/net/Uri;->toString()Ljava/lang/String;
    move-result-object v1
    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v3, ")"
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    invoke-direct {p0, v1}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    return-void

    :open2
    const/16 v0, 0x2c
    if-ne p1, v0, :done
    const/4 v0, -0x1
    if-ne p2, v0, :done
    if-eqz p3, :done
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;
    move-result-object v1
    invoke-static {p0, v1}, Lcom/flo/tamapoke/Files;->read(Landroid/content/Context;Landroid/net/Uri;)Ljava/lang/String;
    move-result-object v1
    if-eqz v1, :done
    new-instance v2, Ljava/lang/StringBuilder;
    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V
    const-string v3, "window.tpFileLoaded&&tpFileLoaded("
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v3, ")"
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    invoke-direct {p0, v1}, Lcom/flo/tamapoke/MainActivity;->js(Ljava/lang/String;)V
    :done
    return-void
.end method
