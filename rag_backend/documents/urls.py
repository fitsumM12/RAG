from django.urls import path
from .views import UploadDocumentView, DocumentListView

urlpatterns = [
    path("upload/", UploadDocumentView.as_view(), name="upload-document"),
    path("documents/", DocumentListView.as_view(), name="list-documents"),
]
