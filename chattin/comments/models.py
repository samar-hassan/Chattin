from django.conf import settings
from django.db import models


class Comment(models.Model):
    page_id = models.PositiveBigIntegerField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="comments", on_delete=models.CASCADE
    )
    replied_to = models.ForeignKey(
        "self", related_name="replies", on_delete=models.CASCADE
    )
    text = models.TextField()
    level = models.PositiveBigIntegerField(default=1)
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="liked_comments",
        through="comments.CommentLike",
    )
    dislikes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="disliked_comments",
        through="comments.CommentDisLike",
    )

    date_created = models.DateTimeField(auto_now_add=True, db_index=True)
    date_updated = models.DateTimeField(auto_now=True)


class CommentLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "comment")


class CommentDisLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "comment")
