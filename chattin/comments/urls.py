from django.urls import path

from chattin.comments.views import (
    ArticleDetail, CommentCreateView, CommentUpdateView, CommentDestroyView,
    LikeView, LikeDestroyView, DislikeView, DislikeDestroyView,
)

app_name = "comments"
urlpatterns = [
    path("<int:id>/", ArticleDetail.as_view(), name="article"),
    path("api/comment/add", CommentCreateView.as_view(), name="comment-add"),
    path("api/comment/<int:pk>", CommentUpdateView.as_view(), name="comment-update"),
    path("api/comment/delete/<int:pk>", CommentDestroyView.as_view(), name="comment-delete"),
    path("api/comment/like/<int:pk>", LikeView.as_view(), name="like"),
    path("api/comment/remove-like/<int:pk>", LikeDestroyView.as_view(), name="like-destroy"),
    path("api/comment/dislike/<int:pk>", DislikeView.as_view(), name="dislike"),
    path("api/comment/remove-dislike/<int:pk>", DislikeDestroyView.as_view(), name="dislike-destroy"),
]
