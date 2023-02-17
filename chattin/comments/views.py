from comments.models import Comment
from django.db.models import Count, Prefetch
from django.views import generic


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
