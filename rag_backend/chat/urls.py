from django.urls import path
from .views import AskView, AskStreamView, SeedConversationView

urlpatterns = [
    path("ask/", AskView.as_view(), name="ask"),
    path("ask/stream/", AskStreamView.as_view(), name="ask-stream"),
    path("chat/seed/", SeedConversationView.as_view(), name="chat-seed"),
]
