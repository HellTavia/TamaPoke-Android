.class public Lcom/flo/tamapoke/Widget;
.super Ljava/lang/Object;
.source "Widget.java"

# Dessine le widget d'écran d'accueil à partir de la photo laissée par le jeu
# (SharedPreferences "w_json" + "w_img") :
#   { name, t0, egg, ok, stl, n: [[v, perMin, plancher] x5], l: [libellés], al: [alertes] }
# Les jauges continuent de descendre avec les règles hors ligne du jeu
# (v - perMin x minutes, sans passer sous le plancher), sans ouvrir l'appli.


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method


.method private static id(Landroid/content/Context;Ljava/lang/String;)I
    .registers 5
    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;
    move-result-object v0
    const-string v1, "id"
    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;
    move-result-object v2
    invoke-virtual {v0, p1, v1, v2}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I
    move-result v0
    return v0
.end method


.method public static render(Landroid/content/Context;)V
    .registers 28
    move-object/from16 v15, p0
    :try_start_0
    const-string v0, "tamapoke"
    const/4 v1, 0x0
    invoke-virtual {v15, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v24                       # prefs
    const-string v0, "w_json"
    const/4 v1, 0x0
    move-object/from16 v2, v24
    invoke-interface {v2, v0, v1}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v0
    if-nez v0, :have
    return-void

    :have
    new-instance v23, Lorg/json/JSONObject;
    move-object/from16 v1, v23
    invoke-direct {v1, v0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    # vues
    invoke-virtual {v15}, Landroid/content/Context;->getPackageName()Ljava/lang/String;
    move-result-object v0
    invoke-virtual {v15}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;
    move-result-object v1
    const-string v2, "tp_widget"
    const-string v3, "layout"
    invoke-virtual {v1, v2, v3, v0}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I
    move-result v1
    if-nez v1, :lay
    return-void
    :lay
    new-instance v22, Landroid/widget/RemoteViews;
    move-object/from16 v2, v22
    invoke-direct {v2, v0, v1}, Landroid/widget/RemoteViews;-><init>(Ljava/lang/String;I)V

    # nom
    const-string v0, "w_name"
    invoke-static {v15, v0}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v0
    const-string v1, "name"
    move-object/from16 v3, v23
    invoke-virtual {v3, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v2, v0, v1}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    # minutes écoulées depuis la photo
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J
    move-result-wide v4
    const-string v0, "t0"
    invoke-virtual {v3, v0, v4, v5}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;J)J
    move-result-wide v6
    sub-long/2addr v4, v6
    long-to-double v4, v4
    const-wide v6, 0x40ed4c0000000000L          # 60000.0
    div-double/2addr v4, v6
    const-wide/16 v6, 0x0
    cmpl-double v0, v4, v6
    if-gez v0, :minsok
    move-wide v4, v6
    :minsok                                      # v4:v5 = minutes

    const-string v0, "ok"
    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v21                       # texte d'état
    const/16 v20, 0x0                            # alerte trouvée ?

    const-string v0, "n"
    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;
    move-result-object v6
    const-string v0, "l"
    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;
    move-result-object v7
    const-string v0, "al"
    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;
    move-result-object v8
    if-eqz v6, :bars_done
    if-eqz v7, :bars_done
    if-eqz v8, :bars_done

    const/4 v9, 0x0                              # i
    :loop
    const/4 v0, 0x5
    if-ge v9, v0, :bars_done
    invoke-virtual {v6, v9}, Lorg/json/JSONArray;->getJSONArray(I)Lorg/json/JSONArray;
    move-result-object v10
    const/4 v0, 0x0
    invoke-virtual {v10, v0}, Lorg/json/JSONArray;->getDouble(I)D
    move-result-wide v11                         # v
    const/4 v0, 0x1
    invoke-virtual {v10, v0}, Lorg/json/JSONArray;->getDouble(I)D
    move-result-wide v13                         # par minute
    const/4 v0, 0x2
    invoke-virtual {v10, v0}, Lorg/json/JSONArray;->getDouble(I)D
    move-result-wide v25                         # plancher
    cmpl-double v0, v11, v25
    if-gtz v0, :decay                            # au-dessus du plancher : elle descend
    move-wide/from16 v17, v11                    # déjà au plancher ou dessous : ne bouge plus
    goto :have_cur
    :decay
    mul-double v17, v13, v4
    sub-double v17, v11, v17
    cmpl-double v0, v17, v25
    if-gez v0, :have_cur
    move-wide/from16 v17, v25
    :have_cur
    move-wide/from16 v13, v17
    double-to-int v0, v13                        # valeur actuelle
    move/from16 v19, v0

    # barre i
    new-instance v0, Ljava/lang/StringBuilder;
    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V
    const-string v1, "w_bar"
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v0, v9}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v0
    invoke-static {v15, v0}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v0
    const/16 v1, 0x64
    const/4 v10, 0x0
    move/from16 v3, v19
    invoke-virtual {v2, v0, v1, v3, v10}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    # libellé i
    new-instance v0, Ljava/lang/StringBuilder;
    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V
    const-string v1, "w_lbl"
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v0, v9}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v0
    invoke-static {v15, v0}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v0
    invoke-virtual {v7, v9}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v2, v0, v1}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    # première alerte (ordre de priorité donné par le jeu)
    if-nez v20, :next
    const/16 v0, 0x19
    move/from16 v1, v19
    if-ge v1, v0, :next
    invoke-virtual {v8, v9}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;
    move-result-object v0
    invoke-virtual {v0}, Ljava/lang/String;->length()I
    move-result v1
    if-eqz v1, :next
    move-object/from16 v21, v0
    const/16 v20, 0x1
    :next
    add-int/lit8 v9, v9, 0x1
    goto :loop

    :bars_done
    const-string v0, "w_status"
    invoke-static {v15, v0}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v0
    move-object/from16 v1, v21
    invoke-virtual {v2, v0, v1}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    # œuf : pas de jauges
    const-string v0, "w_bars"
    invoke-static {v15, v0}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v0
    const-string v1, "egg"
    move-object/from16 v3, v23
    invoke-virtual {v3, v1}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z
    move-result v1
    if-eqz v1, :visible
    const/16 v1, 0x8
    goto :setvis
    :visible
    const/4 v1, 0x0
    :setvis
    invoke-virtual {v2, v0, v1}, Landroid/widget/RemoteViews;->setViewVisibility(II)V

    # pas du jour (tenus à jour par le service)
    const-string v0, "w_steps"
    invoke-static {v15, v0}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v0
    move-object/from16 v1, v24
    const-string v4, "bg_today"
    const/4 v5, 0x0
    invoke-interface {v1, v4, v5}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v4
    new-instance v5, Ljava/lang/StringBuilder;
    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V
    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    const-string v4, " "
    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v4, "stl"
    invoke-virtual {v3, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;
    move-result-object v4
    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v4
    invoke-virtual {v2, v0, v4}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    # image du compagnon
    const-string v0, "w_img"
    const/4 v4, 0x0
    invoke-interface {v1, v0, v4}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v0
    if-eqz v0, :noimg
    const/4 v4, 0x0
    invoke-static {v0, v4}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B
    move-result-object v0
    array-length v4, v0
    const/4 v5, 0x0
    invoke-static {v0, v5, v4}, Landroid/graphics/BitmapFactory;->decodeByteArray([BII)Landroid/graphics/Bitmap;
    move-result-object v0
    if-eqz v0, :noimg
    const-string v4, "w_img"
    invoke-static {v15, v4}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v4
    invoke-virtual {v2, v4, v0}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V
    :noimg

    # toucher le widget ouvre le jeu
    new-instance v0, Landroid/content/Intent;
    const-class v4, Lcom/flo/tamapoke/MainActivity;
    invoke-direct {v0, v15, v4}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V
    const/high16 v4, 0x30000000
    invoke-virtual {v0, v4}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;
    const/4 v4, 0x1
    const/high16 v5, 0xc000000
    invoke-static {v15, v4, v0, v5}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;
    move-result-object v0
    const-string v4, "w_root"
    invoke-static {v15, v4}, Lcom/flo/tamapoke/Widget;->id(Landroid/content/Context;Ljava/lang/String;)I
    move-result v4
    invoke-virtual {v2, v4, v0}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-static {v15}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;
    move-result-object v0
    new-instance v4, Landroid/content/ComponentName;
    const-class v5, Lcom/flo/tamapoke/WidgetProvider;
    invoke-direct {v4, v15, v5}, Landroid/content/ComponentName;-><init>(Landroid/content/Context;Ljava/lang/Class;)V
    invoke-virtual {v0, v4, v2}, Landroid/appwidget/AppWidgetManager;->updateAppWidget(Landroid/content/ComponentName;Landroid/widget/RemoteViews;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    return-void
    :catch_0
    return-void
.end method
