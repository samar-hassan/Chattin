from django.views import generic


class ArticleDetail(generic.TemplateView):
    template_name = "comments/article.html"
