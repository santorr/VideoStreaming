# Use the official Apache 2.4 image from Docker Hub
FROM httpd:2.4

# Copy all static files (HTML, CSS, JS, etc.) to the Apache root
COPY public/ /usr/local/apache2/htdocs/

# Enable .htaccess support by allowing override rules in the Apache config
RUN sed -i 's|<Directory "/usr/local/apache2/htdocs">|<Directory "/usr/local/apache2/htdocs">\n    AllowOverride All|' /usr/local/apache2/conf/httpd.conf

# Expose port 80 for HTTP access
EXPOSE 80
