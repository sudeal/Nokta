# Docker Komutları

## Development Ortamı
```bash
# Development container'ını başlat
docker-compose up nokta-app-dev

# Arka planda çalıştır
docker-compose up -d nokta-app-dev

# Container'ları durdur
docker-compose down
```

## Production Ortamı
```bash
# Production container'ını başlat
docker-compose up nokta-app-prod

# Arka planda çalıştır
docker-compose up -d nokta-app-prod
```

## Genel Komutlar
```bash
# Tüm container'ları durdur ve kaldır
docker-compose down

# Image'ları yeniden build et
docker-compose build --no-cache

# Container'ların durumunu kontrol et
docker-compose ps

# Log'ları görüntüle
docker-compose logs nokta-app-dev
docker-compose logs nokta-app-prod

# Container'a terminal ile bağlan
docker-compose exec nokta-app-dev sh
```

## Portlar
- **Development**: http://localhost:3000
- **Production**: http://localhost:80 