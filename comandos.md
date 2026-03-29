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
docker system prune -a

## Docker Compose

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
docker compose logs -f
```

## Comandos NGINX

```bash
# Verificar a configuração do NGINX
docker compose exec nginx nginx -t
# Reiniciar o NGINX
docker compose exec nginx nginx -s reload
```

## Comandos Extras

Instalar biblioteca em modo `dev`:

```bash
npm install nodemon -D
```

## Rodar o servidor em modo `prod` com Docker

# 1. Build da imagem:
docker build -t chamadas-prod -f Dockerfile.prod .

# 2. Rodar o container:
docker run -d \
    -p 3000:3000 \
    -v $(pwd):/app \
    --name chamadas-prod-container \
    chamadas-prod

## Certificado SSL

```bash
# Gerar certificado autoassinado
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout nginx/certs/key.pem \
  -out nginx/certs/cert.pem \
  -subj "/CN=localhost"
```

Onde:
- `-x509`: Gera um certificado autoassinado.
- `-nodes`: Não criptografa a chave privada. A chave será gerada sem senha, o que é útil para ambientes de desenvolvimento.
- `-days 365`: Define a validade do certificado para 365 dias.
- `-newkey rsa:2048`: Gera uma nova chave RSA de 2048 bits.
- `-keyout`: Especifica o caminho para salvar a chave privada.
- `-out`: Especifica o caminho para salvar o certificado.
- `-subj`: Define o assunto do certificado, onde `CN=localhost` indica que o certificado é válido para `localhost`.

## Rodar em modo produção com Docker Compose

```bash
docker compose -f docker-compose.prod.yml up -d --build