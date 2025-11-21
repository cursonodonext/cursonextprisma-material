instalar next
instalar  shacdn componentes npx shadcn@latest init
npx shadcn@latest add button label input 

instalar prisma y prisma client y instalar betterauth
npm install prisma@^6.19.0 @prisma/client@^6.19.0
npx prisma init
npm install better-auth

crear .env y un secreto  desde : https://www.better-auth.com/docs/installation

Agregar variables de entorno  
DATABASE_URL="postgresql://cursonextlab:TrRql98vnIBGWXHOJE7xVFhmygMCi226@dpg-d46e05mmcj7s73ed5deg-a.oregon-postgres.render.com/cursonextlab"
# Better Auth Configuration
BETTER_AUTH_SECRET="9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Nodemailer SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=desbloqueocelusa@gmail.com
SMTP_PASS=pakelswmravotnul
SMTP_FROM_NAME="Better Auth App"
SMTP_FROM_EMAIL=desbloqueocelusa@gmail.com

// generar tablas especificas para usar betterauth que las utiliza tambien con 0auth
npx @better-auth/cli generate

//añadir tabla roles  con la relacion usuarios -> en tabla users : role Role  @default(user)
enum Role {
  user
  admin
}
crear archivo lib/auth.js
crear api/auth/[...all]/route.js
crear archivo auth-client.js para utilizarlo en /login y /register
crear page register y perfil con boton de logout
crear page login page e usar auth-client

crear auth-guard.js para añadir los handler para la autorizacion en el backend
hacer un endpoint y probar la autenticacion con withAuth

Crear recuperacion de contraseña con Nodemailer
crear archivo email y hacer la funcion  sendPasswordResetEmail y verifyEmailConfig
crear pagina forgot-password y reset-password



