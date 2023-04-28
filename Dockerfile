FROM ubuntu:latest

# Update and install Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/www/html/

# Copy Nginx configuration file
COPY . /var/www/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
