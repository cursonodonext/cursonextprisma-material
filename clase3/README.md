comandos utilizados para db nueva
-npx create-next-app@latest
-npm i prisma @prisma/client
-npx prisma init 
-npx prisma generate


comandos utilizados para db ya creada con tablas
-npx create-next-app@latest
-npm i prisma @prisma/client
-npx prisma init 
// Migra la db creada a nuestro esquema
-npx prisma db pull
-npx prisma generate


comandos utilizados para db creada con tablas
-npx create-next-app@latest
-npm i prisma @prisma/client
-npx prisma init 
// pushea nuestro esquema de prisma creando las tablas en la db
-npx prisma db push 
-npx prisma generate
