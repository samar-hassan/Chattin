from django.urls import path

from chattin.comments.views import (
    ArticleDetail, CommentCreateView, CommentUpdateView, CommentDestroyView,
)

app_name = "comments"
urlpatterns = [
    path("<int:id>/", ArticleDetail.as_view(), name="article"),
    path("api/comment/add", CommentCreateView.as_view(), name="comment-add"),
    path("api/comment/<int:pk>", CommentUpdateView.as_view(), name="comment-update"),
    path("api/comment/delete/<int:pk>", CommentDestroyView.as_view(), name="comment-delete"),
]
