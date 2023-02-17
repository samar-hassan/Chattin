from django.views import generic

from comments.models import Comment


class ArticleDetail(generic.TemplateView):
    template_name = "comments/article.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['comments'] = Comment.objects.filter(
            page_id=kwargs['id'], level=0).order_by('-date_created')
        return context
