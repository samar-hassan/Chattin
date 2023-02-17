from django import template
register = template.Library()


@register.inclusion_tag('comments/comment.html')
def show_comment(comment, user):
    return {
        'comment': comment,
        'user': user,
    }
