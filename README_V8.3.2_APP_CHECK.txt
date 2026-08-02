SUC DE LA PROFU' – V8.3.2 APP CHECK MOBILE FIX

Modificări:
- App Check este inițializat înainte de Firestore, conform fluxului oficial Firebase.
- Pagina nu mai este blocată de un apel manual getToken(forceRefresh=true).
- Firestore atașează automat tokenul App Check cererilor sale.
- Diagnosticul tokenului rulează în fundal și nu dezactivează formularul.
- JavaScript folosește Network First în Service Worker pentru a evita codul vechi din cache.
- Cache PWA: v8.3.2-app-check-mobile-fix.

După încărcarea pe GitHub:
1. Acceptă Actualizează în PWA.
2. Închide complet aplicația și redeschide-o.
3. Testează încărcarea și publicarea unei recenzii.
4. Așteaptă 5-15 minute și verifică App Check > APIs > Cloud Firestore.
5. Nu activa Enforce până când apar cereri Verified.
