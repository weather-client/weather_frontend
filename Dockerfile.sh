sudo docker build -t weather-frontend .
sudo docker stop weather-frontend
sudo docker rm weather-frontend
sudo docker run -d --name weather-frontend -p 3001:3000 weather-frontend