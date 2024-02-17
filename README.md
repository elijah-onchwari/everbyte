# Everbyte Workspace

[uri_everbyte]: https://everbyte.co
[uri_license]: https://www.gnu.org/licenses/agpl-3.0.html
[uri_license_image]: https://img.shields.io/badge/License-AGPL%20v3-blue.svg

![visitors](https://visitor-badge.laobi.icu/badge?page_id=elijah-onchwari.642707636)
[![License: AGPL v3][uri_license_image]][uri_license]

## Technology Stack
-   [NestJs](https://github.com/nestjs/nest)
-   [Angular](https://angular.io)
-   [PostgreSQL](https://www.postgresql.org)
-   [Docker](https://www.docker.com)
-   [kubernetes](https://kubernetes.io)

## Installation 
-   Install [NodeJs](https://nodejs.org/en/download) LTS version or later, e.g. 20.x.
-   Install [Yarn](https://github.com/yarnpkg/yarn) (if you don't have it) with `npm i -g yarn`.
-   Install NPM packages and bootstrap solution using the command `yarn`.
-   Adjust settings in the [`.env.local`](https://github.com/ever-co/ever-gauzy/blob/develop/.env.local) which is used in local runs.
-   Alternatively, you can copy [`.env.sample`](https://github.com/ever-co/ever-gauzy/blob/develop/.env.sample) to `.env` and change default settings there, e.g. database type, name, user, password, etc.
-   Run both API and UI with a single command: `yarn start`.
-   Open Everbyte UI on <http://localhost:4200> in your browser (API runs on <http://localhost:3000/api>).

