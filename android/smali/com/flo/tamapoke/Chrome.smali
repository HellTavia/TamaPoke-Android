.class public Lcom/flo/tamapoke/Chrome;
.super Landroid/webkit/WebChromeClient;
.source "Chrome.java"

# Autorise la page (nos propres fichiers) à utiliser la caméra pour scanner
# les QR codes de duel. Android demande d'abord la permission CAMERA à
# l'utilisateur (Bridge.askCamera) ; ici on ne fait que la relayer à la page.


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/webkit/WebChromeClient;-><init>()V
    return-void
.end method


.method public onPermissionRequest(Landroid/webkit/PermissionRequest;)V
    .registers 3
    invoke-virtual {p1}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;
    move-result-object v0
    invoke-virtual {p1, v0}, Landroid/webkit/PermissionRequest;->grant([Ljava/lang/String;)V
    return-void
.end method
