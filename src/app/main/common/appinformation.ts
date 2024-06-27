/*
Build Process in Release machine
================================
nvm list
nvm use 10.16.0
node --max_old_space_size=11600 ./node_modules/@angular/cli/bin/ng build --prod

Angular CLI : 7.3.9
Node : 10.16.0
npm : 6.9.0

Angular Material
================
ng add @angular/material

Flex Installation
==================
npm install @angular/flex-layout@15.0.0-beta.42
    (or)
npm install @angular/flex-layout@7.0.0-beta.23

D3
================
npm install d3

Offline Material Icons
======================
Website : https://www.npmjs.com/package/material-icons-font
npm install material-icons-font --save

PopOver
=======
Website :https://www.npmjs.com/package/@material-extended/mde
npm install @material-extended/mde@2.3.1

Encryption and Decryption
=========================
npm install crypto-js --save
npm install @types/crypto-js --save

Core
====
npm install @angular/core@7.2.16

Notification
============
npm install firebase@7.17.1

// Inside node_modules/@firebase/logger/dist/src/logger.d.ts 
// Comment the line Numbers 70,71,78,79,84,85


*/ 