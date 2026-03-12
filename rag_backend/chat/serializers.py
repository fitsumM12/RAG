from rest_framework import serializers


class AskSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=4000)
    conversation_id = serializers.IntegerField(required=False)
    top_k = serializers.IntegerField(required=False, min_value=1, max_value=20)
    stream = serializers.BooleanField(required=False)


class SeedMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["user", "assistant", "system"])
    content = serializers.CharField()
    sources = serializers.ListField(required=False)


class SeedConversationSerializer(serializers.Serializer):
    conversation_id = serializers.IntegerField(required=False)
    title = serializers.CharField(required=False, allow_blank=True)
    messages = SeedMessageSerializer(many=True)
