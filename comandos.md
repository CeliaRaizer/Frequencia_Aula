# Testando manualmente o Docker

# 1. Build da imagem:
docker build -t chamadas-dev -f Dockerfile.dev .

# 2. Rodar o container:
docker run -d \
    -p 3000:3000 \
    -v $(pwd):/app \
    --name chamadas-dev-container \
    chamadas-dev

# 3. logs
docker logs chamadas-dev-container -f

# 4. acessar o container para testes manuais
docker exec -it chamadas-dev-container sh

# 5. Parar o container
docker stop chamadas-dev-container

# 6. Remover o container
docker rm chamadas-dev-container

# copiar um arquivo do container para o host
docker cp chamadas-dev-container:/app/diario.json ./diario.json.bkp

# limpeza geral (cuidado)
docker

# 1. Rodar os serviços

````bash
 docker compose -f docker-compose.yml up -d
 ## ou  --build para forçar o rebuild da imagem (Dockerfile.dev)
 docker compose -f docker-compose.yml up -d --build
```

# 2. parar os serviços

```bash
docker compose down
```

# 3. Verificar os logs

```bash

```