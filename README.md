comandos utilizados para db nueva
npm i next 
npm i prisma @prisma/client
npx prisma init 
npx prisma generate


comandos utilizados para db ya creada con tablas
npm i next 
npm i prisma @prisma/client
npx prisma init 
// Migra la db creada a nuestro esquema
npx prisma db pull
npx prisma generate


comandos utilizados para db creada con tablas
npm i next 
npm i prisma @prisma/client
npx prisma init 
// pushea nuesto esquema de prisma creando las tablas en la db
npx prisma db push 
npx prisma generate
