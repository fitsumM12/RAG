import json
from typing import Generator, Iterable
import requests
from django.conf import settings
from openai import OpenAI


def _openai_client() -> OpenAI:
    return OpenAI()


def generate_answer(prompt: str) -> str:
    provider = settings.LLM_PROVIDER.lower()
    if provider == "local":
        payload = {"model": settings.LOCAL_LLM_MODEL, "prompt": prompt, "stream": False}
        resp = requests.post(settings.LOCAL_LLM_URL, json=payload, timeout=120)
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "")

    client = _openai_client()
    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return resp.choices[0].message.content or ""


def stream_answer(prompt: str) -> Iterable[str]:
    provider = settings.LLM_PROVIDER.lower()
    if provider == "local":
        payload = {"model": settings.LOCAL_LLM_MODEL, "prompt": prompt, "stream": True}
        resp = requests.post(settings.LOCAL_LLM_URL, json=payload, stream=True, timeout=120)
        resp.raise_for_status()
        for line in resp.iter_lines():
            if not line:
                continue
            data = json.loads(line.decode("utf-8"))
            token = data.get("response")
            if token:
                yield token
        return

    client = _openai_client()
    stream = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        stream=True,
    )
    for event in stream:
        if event.choices and event.choices[0].delta and event.choices[0].delta.content:
            yield event.choices[0].delta.content
