.class public Lcom/flo/tamapoke/WidgetProvider;
.super Landroid/appwidget/AppWidgetProvider;
.source "WidgetProvider.java"


.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/appwidget/AppWidgetProvider;-><init>()V
    return-void
.end method


.method public onUpdate(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;[I)V
    .registers 4
    invoke-static {p1}, Lcom/flo/tamapoke/Widget;->render(Landroid/content/Context;)V
    return-void
.end method
