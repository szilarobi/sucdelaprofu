SUC DE LA PROFU' – V8.3.1 APP CHECK STABLE

Modificări:
- Firebase Web SDK actualizat la 12.16.0.
- App Check este inițializat înainte de Firestore.
- Primul token App Check este solicitat explicit înainte de orice citire/scriere.
- Service Worker nu mai interceptează resursele Firebase, Google sau reCAPTCHA.
- Diagnostic disponibil în consola browserului prin:
  window.__profuFirebaseDiagnostics

Mesaje normale în Console:
✓ Firebase initialized
✓ App Check initialized
✓ App Check token received
✓ Firestore connected

Testare după publicare:
1. Încarcă toate fișierele pe GitHub.
2. Acceptă actualizarea PWA sau șterge cache-ul site-ului.
3. Deschide recenzii.html și publică o recenzie de test.
4. Așteaptă câteva minute și verifică Firebase > App Check > APIs > Cloud Firestore.
5. Nu activa Enforce până când apar cereri Verified.
