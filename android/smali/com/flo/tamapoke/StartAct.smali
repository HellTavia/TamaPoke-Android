.class public Lcom/flo/tamapoke/StartAct;
.super Ljava/lang/Object;
.source "StartAct.java"

.implements Ljava/lang/Runnable;

# lance une activité « pour résultat » depuis le thread principal
.field private final act:Landroid/app/Activity;
.field private final intent:Landroid/content/Intent;
.field private final code:I


.method public constructor <init>(Landroid/app/Activity;Landroid/content/Intent;I)V
    .registers 4
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/flo/tamapoke/StartAct;->act:Landroid/app/Activity;
    iput-object p2, p0, Lcom/flo/tamapoke/StartAct;->intent:Landroid/content/Intent;
    iput p3, p0, Lcom/flo/tamapoke/StartAct;->code:I
    return-void
.end method


.method public run()V
    .registers 4
    :try_start_0
    iget-object v0, p0, Lcom/flo/tamapoke/StartAct;->act:Landroid/app/Activity;
    iget-object v1, p0, Lcom/flo/tamapoke/StartAct;->intent:Landroid/content/Intent;
    iget v2, p0, Lcom/flo/tamapoke/StartAct;->code:I
    invoke-virtual {v0, v1, v2}, Landroid/app/Activity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    return-void
    :catch_0
    return-void
.end method
