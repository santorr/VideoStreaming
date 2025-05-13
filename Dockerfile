FROM httpd:2.4
COPY public/ /usr/local/apache2/htdocs/
COPY apache/.htaccess /usr/local/apache2/htdocs/videos/.htaccess
RUN sed -i 's|<Directory "/usr/local/apache2/htdocs">|<Directory "/usr/local/apache2/htdocs">\n    AllowOverride All|' /usr/local/apache2/conf/httpd.conf