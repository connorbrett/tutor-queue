sudo git pull && \
sudo docker-compose -f docker-compose.yml -f docker-compose.override.prod.yml pull && \
sudo docker-compose down && \
sudo docker-compose -f docker-compose.yml -f docker-compose.override.prod.yml up -d --no-build
