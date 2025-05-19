# 🏡 Homeiq – En modern plattform för bostadsmarknaden

**Homeiq** är en webbaserad plattform där användare kan köpa, sälja, hyra och hyra ut bostäder. Med modern teknik erbjuder systemet en smidig upplevelse med autentisering, bildhantering och ett användarvänligt gränssnitt. Projektet är byggt med React och Vite på frontend och Node.js/Express på backend.

---

##  Funktioner

-  Publicera bostadsannonser (för hyra eller försäljning)
-  Sök bostäder efter plats, pris och typ
-  Registrera dig och logga in med e-post eller via Google
-  Ladda upp bilder till Firebase Storage
-  Säker autentisering med JWT och Firebase Auth
-  Responsiv design – fungerar på både mobil och dator

---

## 🛠️ Teknikstack

| Delsystem     | Teknologi                                 |
|---------------|--------------------------------------------|
| Frontend      | React, Vite                               |
| Backend       | Node.js, Express                          |
| Databas       | MongoDB (via Mongoose)                    |
| Autentisering | Firebase Auth, Google OAuth, JWT          |
| Bilduppladdning | Firebase Storage                        |
| API-format    | REST                                      |
| State hantering | (valfri: t.ex. React Context, Redux)    |

---

## 🔧 Installation

### Backend

```bash
git clone https://github.com/zabi-23/homeiq.git
cd homeiq
npm install
```

Lägg till en `.env`-fil i projektets rot:

```env
Mongo=mongodb+srv://<ditt-URI>
JWT_SECRET=<hemlig nyckel>
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

Starta backend-servern:
```bash
npm run dev
```

### Frontend

```bash
cd client  
npm install
npm run dev
```

---

## 🧪 API-exempel

```http
POST /api/auth/register
POST /api/auth/login
GET /api/listings/
POST /api/listings/
```

> Alla skyddade rutter kräver JWT-token i `Authorization`-headern.

---

## 📸 Exempelbilder

> Du kan lägga till skärmdumpar här, till exempel:
- Inloggningssida
- Annonsformulär
- Resultatsida

```md
![Login](link-till-bild)
![Listing](link-till-bild)
```

---

## 📄 Licens


Copyright (c) 2025 Zabi Sideqi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👤 Kontakt

För frågor, förbättringsförslag eller samarbeten:

- 📧 E-post: zabi.sideqi.com
- 🌐 Portfolio: https://lnkd.in/dS_Bc8Xh
- 💼 LinkedIn: https://www.linkedin.com/in/zabi-sideqi-4564432a0/

---
