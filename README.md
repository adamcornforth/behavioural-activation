# Aider

https://aider.chat/docs/llms/ollama.html

## Using Ollama Chat

```
ollama pull deepseek-r1:8b
ollama serve
```

I chose which model to use from https://aider.chat/docs/leaderboards/

## Using Aider with Ollama Chat

(In a new terminal window)

```
export OLLAMA_API_BASE=http://127.0.0.1:11434
aider --model ollama_chat/deepseek-r1:8b
```

