# Call Me Maybe

WebRTC simple one-on-one video chat application, built in React, mongodb and express.

## setting environment variables

in order to this work, you need to set variables in `server/env/.env`.

> NOTE: if you set `PORT` in `server/env/.env` other than 3001, you need to
> change proxy's PORT to your PORT in `client/package.json` `"proxy": "http://localhost:<YOUR-PORT>`

## Running locally

**installing dependencies**
```bash
cd client && \
  yarn install && \
  cd ../server && \
  yarn install
```

**On local machine**
```bash
# simply start server (default PORT is 3001)
cd server && \
  yarn server:dev
# and client (default PORT is 3000)
# and visit localhost:3000
cd client && \
  yarn start
```

**building client-side code and serving it as static**
```bash
# simply run and visit localhost:<YOUR-PORT> (default 3001)
cd server && \
  yarn build:server:dev
```

**Hosting locally and accessing on other devices (installing ngrok required)**

I am using ngrok cuz it allows us to serve our app on https. Https is required for `getUserMedia`.

```bash
# (!!!) start server+client as before and then run following command.
# -bind-tls=true creates only https url.
# --host-header=rewrite fixes "invalid host header" error
ngrok http -bind-tls=true --host-header=rewrite 3000 # visit localhost:4040 and follow from there

# 3000 is client-side PORT value, if you set it other than 3000, replace it with your value here.
#
# You can also, listen on server-side PORT (default 3001). I don't do it, cuz you have to re-build each time you
# update client-side code.
```

I use chrome to send url to my other devices, so I don't have to type url each time on other machines.
