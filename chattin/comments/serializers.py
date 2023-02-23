
from django.db.transaction import atomic
from rest_framework import serializers

from comments.models import Comment


class AddCommentSerializer(serializers.ModelSerializer):
    """Serializer for adding comments"""

    class Meta:
        model = Comment
        fields = ('page_id', 'replied_to', 'text', 'level')

    @atomic
    def create(self, validated_data):
        validated_data['user'] = self.context["request"].user
        return super().create(validated_data)


class UpdateCommentSerializer(serializers.ModelSerializer):
    """Serializer for updating comments"""

    class Meta:
        model = Comment
        fields = ('text', )
