FROM composer:2.0 as step0

WORKDIR /usr/local/code/
COPY composer.lock /usr/local/code/
COPY composer.json /usr/local/code/
RUN composer update --ignore-platform-reqs --optimize-autoloader \
    --no-plugins --no-scripts --prefer-dist \
    `if [ "$TESTING" != "true" ]; then echo "--no-dev"; fi`

# Add Source Code
COPY ./src /usr/local/code/src
COPY ./bin /usr/local/bin

# Executables
RUN chmod +x /usr/local/bin/users