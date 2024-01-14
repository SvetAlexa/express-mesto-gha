[![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto бэкенд-часть
Бэкенд-часть для сервиса Mesto.  
Репозиторий с фронтенд-частью можно посмотреть по ссылке [Mesto на React Frontend](https://github.com/SvetAlexa/react-mesto-auth).

## Функциональность
* регистрация и авторизация пользователей
* проверка токена
* создание и удаление карточек с фотографиями
* постановка и удаление лайков
* редактирование данных пользователя
* валидация приходящих на сервер запросов и данных на уровне схемы БД
* реализована централизованная обработка ошибок
* все маршруты (кроме регистрации и авторизации) защищены авторизацией

## Директории

`/models` — содержит файлы описания схем пользователя и карточки  
`/controllers` — содержит файлы описания моделей пользователя и карточки  
`/routes` — содержит описание основных роутов для пользователя и карточки  
`/middlewares` — директория с мидлварами  
`/errors` — директория с файлами кастомных ошибок  
`/utils` — содержит вспомогательные файлы   

## Используемые технологии
* [Node.js](https://nodejs.org/en)
* [Express](https://expressjs.com/ru/)
* [MongoDB](https://www.mongodb.com/try/download/community)
* [mongoose](https://mongoosejs.com/)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [joi](https://www.npmjs.com/package/joi#joi)
* [celebrate](https://www.npmjs.com/package/celebrate?activeTab=readme)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
* [Helmet](https://www.npmjs.com/package/helmet)
* [validator](https://www.npmjs.com/package/validator)
* [ESLint](https://www.npmjs.com/package/eslint) по стайлгайду [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base)
* [Postman](https://www.postman.com/)

## Запуск проекта
Предварительные требования: [Node.js](https://nodejs.org/en) и [MongoDB](https://www.mongodb.com/try/download/community) версия 4

* `git clone git@github.com:SvetAlexa/express-mesto-gha.git` склонировать репозиторий  
* `cd express-mesto-gha` — перейти в папку проекта
* `npm ci` — установить зависимости  
* `npm run start` — запуcтить сервер   
* `npm run dev` — запустить сервер с hot-reload

Сервер слушает порт 3000. Изменить порт можно в файле config.js
