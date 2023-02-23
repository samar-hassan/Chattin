from comments.models import Comment
from django.db.models import Count, Prefetch
from django.views import generic

from rest_framework import status
from rest_framework.generics import DestroyAPIView, UpdateAPIView, CreateAPIView
from rest_framework.response import Response

from chattin.permissions import IsOwner
from comments.serializers import (
    AddCommentSerializer, UpdateCommentSerializer,
)


class ArticleDetail(generic.TemplateView):
    template_name = "comments/article.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["comments"] = (
            Comment.objects.filter(page_id=kwargs["id"], level=0)
            .annotate(like_count=Count("likes"), dislike_count=Count("dislikes"))
            .select_related("user")
            .prefetch_related(
                Prefetch(
                    "replies",
                    queryset=Comment.objects.filter(level=1)
                    .annotate(
                        like_count=Count("likes"), dislike_count=Count("dislikes")
                    )
                    .select_related("user")
                    .prefetch_related(
                        Prefetch(
                            "replies",
                            queryset=Comment.objects.filter(level=2)
                            .annotate(
                                like_count=Count("likes"),
                                dislike_count=Count("dislikes"),
                            )
                            .select_related("user"),
                        ),
                    ),
                ),
            )
            .order_by("-date_created")
        )
        return context


class CommentCreateView(CreateAPIView):
    """API view to add comment."""
    permission_classes = (IsOwner,)
    serializer_class = AddCommentSerializer


class CommentUpdateView(UpdateAPIView):
    permission_classes = (IsOwner, )
    serializer_class = UpdateCommentSerializer
    queryset = Comment.objects.all()


class CommentDestroyView(DestroyAPIView):
    permission_classes = (IsOwner, )
    queryset = Comment.objects.all()
