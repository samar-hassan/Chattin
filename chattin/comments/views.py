from comments.models import Comment, CommentDisLike, CommentLike
from comments.serializers import AddCommentSerializer, UpdateCommentSerializer
from django.db.models import Count, Exists, OuterRef, Prefetch
from django.shortcuts import get_object_or_404
from django.views import generic
from rest_framework import status
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chattin.permissions import IsOwner


class ArticleDetail(generic.TemplateView):
    template_name = "comments/article.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user if self.request.user.is_authenticated else None
        user_id = user.id if user else None
        context["comments"] = (
            Comment.objects.filter(page_id=kwargs["id"], level=0)
            .annotate(
                like_count=Count("likes"),
                dislike_count=Count("dislikes"),
                is_liked=Exists(
                    CommentLike.objects.filter(
                        comment_id=OuterRef("id"), user_id=user_id
                    )
                ),
                is_disliked=Exists(
                    CommentDisLike.objects.filter(
                        comment_id=OuterRef("id"), user_id=user_id
                    )
                ),
            )
            .select_related("user")
            .prefetch_related(
                Prefetch(
                    "replies",
                    queryset=Comment.objects.filter(level=1)
                    .annotate(
                        like_count=Count("likes"),
                        dislike_count=Count("dislikes"),
                        is_liked=Exists(
                            CommentLike.objects.filter(
                                comment_id=OuterRef("id"), user_id=user_id
                            )
                        ),
                        is_disliked=Exists(
                            CommentDisLike.objects.filter(
                                comment_id=OuterRef("id"), user_id=user_id
                            )
                        ),
                    )
                    .select_related("user")
                    .prefetch_related(
                        Prefetch(
                            "replies",
                            queryset=Comment.objects.filter(level=2)
                            .annotate(
                                like_count=Count("likes"),
                                dislike_count=Count("dislikes"),
                                is_liked=Exists(
                                    CommentLike.objects.filter(
                                        comment_id=OuterRef("id"), user_id=user_id
                                    )
                                ),
                                is_disliked=Exists(
                                    CommentDisLike.objects.filter(
                                        comment_id=OuterRef("id"), user_id=user_id
                                    )
                                ),
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
    """API view to update comment."""

    permission_classes = (IsOwner,)
    serializer_class = UpdateCommentSerializer
    queryset = Comment.objects.all()


class CommentDestroyView(DestroyAPIView):
    """API view to delete comment."""

    permission_classes = (IsOwner,)
    queryset = Comment.objects.all()


class LikeView(UpdateAPIView):
    """API view to like comment."""

    permission_classes = (IsAuthenticated,)
    queryset = Comment.objects.all()

    def update(self, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=kwargs["pk"])
        if not self.request.user.id in list(comment.likes.values_list("id", flat=True)):
            comment.likes.add(self.request.user)
        return Response("Liked Comment", status=status.HTTP_200_OK)


class LikeDestroyView(DestroyAPIView):
    """API view to remove like."""

    permission_classes = (IsAuthenticated,)

    def delete(self, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=kwargs["pk"])
        if self.request.user.id in list(comment.likes.values_list("id", flat=True)):
            comment.likes.remove(self.request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DislikeView(UpdateAPIView):
    """API view to dislike comment."""

    permission_classes = (IsAuthenticated,)
    queryset = Comment.objects.all()

    def update(self, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=kwargs["pk"])
        if not self.request.user.id in list(
            comment.dislikes.values_list("id", flat=True)
        ):
            comment.dislikes.add(self.request.user)
        return Response("Disliked Comment", status=status.HTTP_200_OK)


class DislikeDestroyView(DestroyAPIView):
    """API view to remove dislike."""

    permission_classes = (IsAuthenticated,)

    def delete(self, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=kwargs["pk"])
        if self.request.user.id in list(comment.dislikes.values_list("id", flat=True)):
            comment.dislikes.remove(self.request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
