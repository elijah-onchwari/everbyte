ARG NODE_ENV
ARG PORT
ARG APP_URL
ARG CLIENT_URL
ARG TYPEORM_HOST
ARG TYPEORM_PORT
ARG TYPEORM_DATABASE
ARG TYPEORM_USERNAME-
ARG TYPEORM_PASSWORD
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_DATABASE
ARG EMAIL_HOST
ARG EMAIL_PORT
ARG EMAIL_FROM
ARG EMAIL_USERNAME
ARG EMAIL_PASSWORD
ARG IS_DEMO
ARG SALT_ROUNDS

######################################################################################################
################################ DEV DEPENDENCIES ###################################################
#####################################################################################################

FROM node:20.11.1-alpine3.18 AS devDependencies

LABEL maintainer="Elijah Onchwari <elijah@everbyte.co>" \
      description="Everbyte project" \
      vendor="Everbyte Inc." 

RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && npm install yarn -g --force \
    && mkdir /srv/everbyte && chown -R node:node /srv/everbyte

COPY wait .deploy/api/entrypoint.prod.sh .deploy/api/entrypoint.compose.sh ./
RUN chown node:node wait && chmod +x /wait /entrypoint.compose.sh /entrypoint.prod.sh && dos2unix /entrypoint.prod.sh && dos2unix /entrypoint.compose.sh

USER node:node

WORKDIR /srv/everbyte

# COPY --chown=node:node apps/everbyte/package.json ./apps/everbyte/
COPY --chown=node:node apps/api/package.json ./apps/api/

COPY --chown=node:node packages/common/package.json ./packages/common/
COPY --chown=node:node packages/config/package.json ./packages/config/
COPY --chown=node:node packages/contracts/package.json ./packages/contracts/
COPY --chown=node:node packages/core/package.json ./packages/core/

# COPY --chown=node:node decorate-angular-cli.js lerna.json package.json yarn.lock ./
COPY --chown=node:node lerna.json package.json yarn.lock ./

RUN yarn install --network-timeout 1000000 --frozen-lockfile && yarn cache clean




######################################################################################################
############################### PROD DEPENDENCIES ###################################################
#####################################################################################################
FROM node:20.11.1-alpine3.18 AS prodDependencies

RUN npm install yarn -g --force \
    && mkdir /srv/everbyte && chown -R node:node /srv/everbyte

USER node:node

WORKDIR /srv/everbyte

COPY --chown=node:node apps/api/package.json ./apps/api/

COPY --chown=node:node packages/common/package.json ./packages/common/
COPY --chown=node:node packages/config/package.json ./packages/config/
COPY --chown=node:node packages/contracts/package.json ./packages/contracts/
COPY --chown=node:node packages/core/package.json ./packages/core/

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --network-timeout 1000000 --frozen-lockfile --production && yarn cache clean




######################################################################################################
############################### DEVELOPEMENT ###################################################
#####################################################################################################
FROM node:20.11.1-alpine3.18 AS development

WORKDIR /srv/everbyte
 
COPY --chown=node:node --from=devDependencies /srv/everbyte .
COPY --chown=node:node . .

RUN mkdir /import && chown node:node /import && \
	touch ormlogs.log && chown node:node ormlogs.log && chown node:node wait && \
	chmod +x wait entrypoint.compose.sh entrypoint.prod.sh 

USER node:node

######################################################################################################
############################### BUILD ###################################################
#####################################################################################################
FROM node:20.11.1-alpine3.18 AS build

USER node:node

WORKDIR /srv/everbyte

RUN mkdir dist

COPY --chown=node:node --from=development /srv/everbyte .

ENV NODE_ENV=${NODE_ENV:-production}

RUN yarn build:all
RUN yarn build:api:prod




######################################################################################################
############################### PRODUCTION ###############################################################
#####################################################################################################
FROM node:20.11.1-alpine3.18 AS production

WORKDIR /srv/everbyte

COPY --chown=node:node --from=devDependencies /wait /entrypoint.prod.sh /entrypoint.compose.sh ./
COPY --chown=node:node --from=prodDependencies /srv/everbyte/node_modules/ ./node_modules/
COPY --chown=node:node --from=build /srv/everbyte/packages/ ./packages/

COPY --chown=node:node --from=build /srv/everbyte/dist/apps/api .

RUN npm install pm2@4.5.1 -g && \
	mkdir /import && chown node:node /import && \
	touch ormlogs.log && chown node:node ormlogs.log && chown node:node wait && \
	chmod +x wait entrypoint.compose.sh entrypoint.prod.sh 

USER node:node

ENV NODE_ENV=${NODE_ENV:-production}
ENV API_PORT=${API_PORT:-3000}
ENV NEST_DEBUG=${NEST_DEBUG}
ENV PORT=${PORT:-3000}
ENV APP_URL=${APP_URL:-http://localhost:3000}
ENV CLIENT_URL=${CLIENT_URL:-http://localhost:4200}
ENV TYPEORM_HOST=${TYPEORM_HOST}
ENV TYPEORM_PORT=${TYPEORM_PORT}
ENV TYPEORM_DATABASE=${TYPEORM_DATABASE}
ENV TYPEORM_USERNAME=${TYPEORM_USERNAME}
ENV TYPEORM_PASSWORD=${TYPEORM_PASSWORD}
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV REDIS_DATABASE=${REDIS_DATABASE}
ENV EMAIL_HOST=${EMAIL_HOST}
ENV EMAIL_PORT=${EMAIL_PORT}
ENV EMAIL_FROM=${EMAIL_FROM}
ENV EMAIL_USERNAME=${EMAIL_USERNAME}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
ENV IS_DEMO=${IS_DEMO}
ENV SALT_ROUNDS=${SALT_ROUNDS}

EXPOSE ${API_PORT}

ENTRYPOINT [ "./entrypoint.prod.sh" ]

CMD [ "node", "main.js" ]
