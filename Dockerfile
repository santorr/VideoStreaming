FROM httpd:2.4

# Nettoie le dossier Apache par défaut
RUN rm -rf /usr/local/apache2/htdocs/*

# Copie uniquement le contenu public
COPY public/ /usr/local/apache2/htdocs/

EXPOSE 80