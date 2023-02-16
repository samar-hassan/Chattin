from django.urls import path

from chattin.comments.views import ArticleDetail

app_name = "comments"
urlpatterns = [
    path("<int:id>/", view=ArticleDetail.as_view(), name="article"),
]
