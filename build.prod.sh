sudo git pull origin main && \
sudo docker-compose pull && \
sudo docker-compose down && \
sudo docker-compose -f docker-compose.yml -f docker-compose.override.prod.yml up -d
