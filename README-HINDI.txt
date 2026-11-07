MY DOCUMENT WALLET — READY-MADE STARTER

Is ZIP mein:
- index.html: Create Account + Login + document dashboard
- app.js: Firebase Authentication + Firestore integration
- firestore.rules: har user ke documents private rakhne ke rules
- Photo upload: JPG, PNG, WEBP images can be uploaded, viewed/downloaded and deleted.
- Delete: each uploaded document/photo has a Delete button.
- pvc-card.html: PVC card front/back print preview
- style.css: responsive design

IMPORTANT:
Yeh ready-made website project hai, lekin aapke Firebase project se connect karna abhi baaki hai.
Firebase web app config app.js mein paste karna hoga. Firebase Console mein:
1. Website mein Create account aur Login dono hain. Naya user Create account se register kare; baad mein email/password se Login kare.
2. Project settings > Your apps > Web app register karein; config copy karein.
3. Authentication > Sign-in method > Email/Password enable karein.
4. Firestore Database create karein.
5. Firestore Rules mein firestore.rules ka content publish karein.
6. index.html ko HTTPS hosting par publish karein (GitHub Pages/Cloudflare Pages).

FREE PLAN / STORAGE LIMIT:
Is starter mein file contents Firestore mein save hote hain, isliye upload limit 650 KB rakhi gayi hai. Yeh bade PDFs ya unlimited storage ke liye suitable nahi hai. Firestore storage ko normal file-storage service ka replacement na samjhein. Free plan limits apply; billing enable na karein.

PRIVACY:
- Real Aadhaar/PAN ya sensitive documents upload karne se pehle Firebase setup, rules aur HTTPS ko properly verify karein.
- Password/OTP kisi ko na dein.
- Yeh official DigiLocker, Aadhaar, PAN ya government-issued card nahi hai.
- PVC card par Aadhaar/PAN number print na karein.
- QR code tabhi banayein jab final website URL publish ho jaye.

PVC CARD:
pvc-card.html browser mein open karke YOUR NAME aur WALLET WEBSITE ko edit karein. Actual QR code abhi placeholder hai; final website link milne par generate karein. Print shop ko 85.6 x 54 mm PVC card size batayein.
