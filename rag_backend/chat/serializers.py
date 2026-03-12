from rest_framework import serializers


class AskSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=4000)
    conversation_id = serializers.IntegerField(required=False)
    top_k = serializers.IntegerField(required=False, min_value=1, max_value=20)
    stream = serializers.BooleanField(required=False)
