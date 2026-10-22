.class public Lcom/flo/tamapoke/Files;
.super Ljava/lang/Object;
.source "Files.java"

# lecture / écriture d'un document choisi dans le sélecteur d'Android


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method


.method public static write(Landroid/content/Context;Landroid/net/Uri;Ljava/lang/String;)Z
    .registers 6
    if-eqz p1, :fail
    if-eqz p2, :fail
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v0
    const-string v1, "wt"
    invoke-virtual {v0, p1, v1}, Landroid/content/ContentResolver;->openOutputStream(Landroid/net/Uri;Ljava/lang/String;)Ljava/io/OutputStream;
    move-result-object v0
    if-eqz v0, :fail
    const-string v1, "UTF-8"
    invoke-virtual {p2, v1}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B
    move-result-object v1
    invoke-virtual {v0, v1}, Ljava/io/OutputStream;->write([B)V
    invoke-virtual {v0}, Ljava/io/OutputStream;->close()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :fail
    const/4 v0, 0x1
    return v0
    :fail
    const/4 v0, 0x0
    return v0
.end method


.method public static read(Landroid/content/Context;Landroid/net/Uri;)Ljava/lang/String;
    .registers 8
    if-eqz p1, :fail
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v0
    invoke-virtual {v0, p1}, Landroid/content/ContentResolver;->openInputStream(Landroid/net/Uri;)Ljava/io/InputStream;
    move-result-object v0
    if-eqz v0, :fail
    new-instance v1, Ljava/io/ByteArrayOutputStream;
    invoke-direct {v1}, Ljava/io/ByteArrayOutputStream;-><init>()V
    const/16 v2, 0x2000
    new-array v2, v2, [B
    :loop
    invoke-virtual {v0, v2}, Ljava/io/InputStream;->read([B)I
    move-result v3
    if-ltz v3, :end
    const/4 v4, 0x0
    invoke-virtual {v1, v2, v4, v3}, Ljava/io/ByteArrayOutputStream;->write([BII)V
    invoke-virtual {v1}, Ljava/io/ByteArrayOutputStream;->size()I
    move-result v4
    const/high16 v5, 0x200000        # 2 Mo maximum
    if-gt v4, v5, :end
    goto :loop
    :end
    invoke-virtual {v0}, Ljava/io/InputStream;->close()V
    new-instance v0, Ljava/lang/String;
    invoke-virtual {v1}, Ljava/io/ByteArrayOutputStream;->toByteArray()[B
    move-result-object v1
    const-string v2, "UTF-8"
    invoke-direct {v0, v1, v2}, Ljava/lang/String;-><init>([BLjava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :fail
    return-object v0
    :fail
    const/4 v0, 0x0
    return-object v0
.end method


# sauvegarde automatique : crée un document dans le dossier choisi (arbre SAF
# à permission persistante) ; renvoie l'URI du document, ou "" en cas d'échec
.method public static writeInTree(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .registers 10
    const-string v5, ""
    if-eqz p1, :fail
    if-eqz p2, :fail
    if-eqz p3, :fail
    :try_start_0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v0
    invoke-static {v0}, Landroid/provider/DocumentsContract;->getTreeDocumentId(Landroid/net/Uri;)Ljava/lang/String;
    move-result-object v1
    invoke-static {v0, v1}, Landroid/provider/DocumentsContract;->buildDocumentUriUsingTree(Landroid/net/Uri;Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v1
    invoke-virtual {p0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v2
    const-string v3, "text/plain"
    invoke-static {v2, v1, v3, p2}, Landroid/provider/DocumentsContract;->createDocument(Landroid/content/ContentResolver;Landroid/net/Uri;Ljava/lang/String;Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v4
    if-eqz v4, :fail
    invoke-static {p0, v4, p3}, Lcom/flo/tamapoke/Files;->write(Landroid/content/Context;Landroid/net/Uri;Ljava/lang/String;)Z
    move-result v3
    if-eqz v3, :fail
    invoke-virtual {v4}, Landroid/net/Uri;->toString()Ljava/lang/String;
    move-result-object v5
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :fail
    return-object v5
    :fail
    const-string v5, ""
    return-object v5
.end method


.method public static deleteDoc(Landroid/content/Context;Ljava/lang/String;)Z
    .registers 5
    if-eqz p1, :fail
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v1
    invoke-static {v0, v1}, Landroid/provider/DocumentsContract;->deleteDocument(Landroid/content/ContentResolver;Landroid/net/Uri;)Z
    move-result v2
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :fail
    return v2
    :fail
    const/4 v2, 0x0
    return v2
.end method


# le dossier choisi est-il encore accessible (permission persistante) ?
.method public static treeOk(Landroid/content/Context;Ljava/lang/String;)Z
    .registers 8
    if-eqz p1, :no
    :try_start_0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v0
    invoke-virtual {p0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;
    move-result-object v1
    invoke-virtual {v1}, Landroid/content/ContentResolver;->getPersistedUriPermissions()Ljava/util/List;
    move-result-object v1
    invoke-interface {v1}, Ljava/util/List;->iterator()Ljava/util/Iterator;
    move-result-object v1
    :loop
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z
    move-result v2
    if-eqz v2, :no
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;
    move-result-object v2
    check-cast v2, Landroid/content/UriPermission;
    invoke-virtual {v2}, Landroid/content/UriPermission;->getUri()Landroid/net/Uri;
    move-result-object v3
    invoke-virtual {v3, v0}, Landroid/net/Uri;->equals(Ljava/lang/Object;)Z
    move-result v3
    if-eqz v3, :loop
    invoke-virtual {v2}, Landroid/content/UriPermission;->isWritePermission()Z
    move-result v3
    return v3
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :no
    :no
    const/4 v3, 0x0
    return v3
.end method
