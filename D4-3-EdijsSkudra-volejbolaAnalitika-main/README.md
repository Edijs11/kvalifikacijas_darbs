# D4-3-EdijsSkudra-volejbolaSacensībuDatuUzskaitesUnAnalītikasSistēma

# Projekta apraksts

Šis ir PIKC "Rīgas Valsts tehnikums" kvalifikācijas darbs volejbola analītika. Mans mērķis ir izveidot lietotni kura varētu tikt izmantota visās volejbola spēlēs. Plānotās iespējas: Pievienot komandas, spēlētājus, spēles, veikt spēli, izgūt datus no spēlēm un no datiem veidot grafikus.

## Izmantotās tehnoloģijas

- JavaScript
- HTML
- Chakra UI
- CSS
- React
- React Router
- Rechart
- Formik
- Yup
- Prisma.io
- Hapi
- Joi

## Izmantotie avoti

- Apguvu HTML, CSS, JavaScript pildot uzdevumus https://www.freecodecamp.org/fcccb371452-9a78-40da-b3f2-756ac85652d1 un https://www.codewars.com/users/Edijs1
- Prisma priekš datubāzes izmantošanas un uzturēšanas - https://www.prisma.io/
- Hapi, Joi HTTP serveris un biblioteka ienākošo datu validācijai - https://hapi.dev/
- React, lai lietotni padarītu ātrāku, vienkāršu un datus varētu pārlādēt nepārlādējot lapu - https://reactjs.org/
- Chakra UI priekš gatavām stila komponentēm - https://chakra-ui.com/
- Formik, yup. formik priekš ievades formām un izvades, yup priekš validācijas - https://formik.org/docs/guides/validation
- Rechart priekš dažādiem grafikiem https://recharts.org/en-US/

## Uzstādīšanas instrukcija

Pirms izmantošanas nepieciešams uzstādīt [Node.js](https://nodejs.org).

Pec Node.js uzstādīšanas no PowerShell vai Command Prompt nepieciešams lejuplādēt nepieciešamās atkarības, kuras norādītas `package.json` failā:

```
cd client
npm install nosaukums
cd ..
cd server
npm install nosaukums
```

## Kā palaist projektu

Projekts sastāv no divām daļām: klients un serveris.

Lai palaistu serveri:

```
cd server
npm run dev
```

Lai palaistu klientu:

```
cd client
npm start
```

<!-- klienta puse uztaisa buvejumu (npm run build) un build mapes saturu uzliek uz servera (ngnix, docker, ...)
servera puses kodu uzliek uz servera un starte serveri (npm start) -->
