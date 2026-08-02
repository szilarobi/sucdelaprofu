import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
    initializeAppCheck,
    ReCaptchaEnterpriseProvider,
    getToken
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app-check.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAP3Fxpg6hUAYpFf-MBkDUzkyJVn4hOeRg",
    authDomain: "suc-de-la-profu.firebaseapp.com",
    projectId: "suc-de-la-profu",
    storageBucket: "suc-de-la-profu.firebasestorage.app",
    messagingSenderId: "734130230740",
    appId: "1:734130230740:web:626299b468d9735cbfb241"
};

const app = initializeApp(firebaseConfig);

// App Check trebuie inițializat înainte de orice serviciu Firebase.
// Nu blocăm însă pagina așteptând manual tokenul: SDK-ul atașează automat
// tokenul App Check cererilor Firestore, conform fluxului recomandat Firebase.
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
        "6LekJXItAAAAAGbgfG1LykDP743qxSaofMFDOMyR"
    ),
    isTokenAutoRefreshEnabled: true
});

// Firestore este inițializat numai după App Check.
const db = getFirestore(app);
const reviewsCollection = collection(db, "reviews");
let loadedReviews = [];

window.__profuFirebaseDiagnostics = {
    sdkVersion: "12.16.0",
    appInitialized: true,
    appCheckInitialized: true,
    appCheckTokenReceived: false,
    firestoreInitialized: true,
    lastError: null
};

console.info("✓ Firebase initialized");
console.info("✓ App Check initialized");
console.info("✓ Firestore initialized after App Check");

// Diagnostic neblocant. Dacă reCAPTCHA are nevoie de puțin timp pe mobil,
// pagina și Firestore nu sunt oprite. App Check va reîncerca automat.
getToken(appCheck, false)
    .then(tokenResult => {
        if (tokenResult?.token) {
            window.__profuFirebaseDiagnostics.appCheckTokenReceived = true;
            console.info("✓ App Check token received", {
                tokenLength: tokenResult.token.length
            });
        }
    })
    .catch(error => {
        window.__profuFirebaseDiagnostics.lastError = {
            code: error?.code || "unknown",
            message: error?.message || String(error)
        };
        console.warn("App Check token not ready yet; SDK will retry automatically.", error);
    });

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reviewForm");
    const reviewText = document.getElementById("reviewText");
    const charCount = document.getElementById("reviewCharCount");
    const errorBox = document.getElementById("reviewError");
    const successBox = document.getElementById("reviewSuccess");
    const submitButton = document.getElementById("reviewSubmitButton");
    const reviewsSort = document.getElementById("reviewsSort");

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    const header = document.getElementById("header");
    const topButton = document.getElementById("backToTop");

    if (reviewText && charCount) {
        reviewText.addEventListener("input", () => {
            charCount.textContent = reviewText.value.length;
            reviewText.classList.remove("error");
        });
    }

    document.querySelectorAll("#reviewForm input").forEach(field => {
        field.addEventListener("input", () => field.classList.remove("error"));
        field.addEventListener("change", () => field.classList.remove("error"));
    });

    if (form) {
        form.addEventListener("submit", async event => {
            event.preventDefault();

            const name = document.getElementById("reviewName");
            const city = document.getElementById("reviewLocality");
            const rating = form.querySelector('input[name="rating"]:checked');
            const consent = document.getElementById("reviewConsent");
            const honeypot = document.getElementById("reviewWebsite");
            const starRating = document.querySelector(".starRating");

            form.querySelectorAll(".error").forEach(field => field.classList.remove("error"));
            starRating?.classList.remove("ratingError");
            errorBox.hidden = true;

            if (honeypot?.value.trim()) return;

            let valid = true;
            let firstInvalid = null;
            const cleanName = name.value.trim();
            const cleanCity = city.value.trim();
            const cleanReview = reviewText.value.trim();

            if (cleanName.length < 2 || cleanName.length > 60) {
                name.classList.add("error");
                valid = false;
                firstInvalid = firstInvalid || name;
            }

            if (cleanCity.length > 60) {
                city.classList.add("error");
                valid = false;
                firstInvalid = firstInvalid || city;
            }

            if (!rating) {
                starRating?.classList.add("ratingError");
                valid = false;
            }

            if (cleanReview.length < 10 || cleanReview.length > 700) {
                reviewText.classList.add("error");
                valid = false;
                firstInvalid = firstInvalid || reviewText;
            }

            if (!consent.checked) {
                consent.classList.add("error");
                valid = false;
                firstInvalid = firstInvalid || consent;
            }

            if (!valid) {
                errorBox.textContent = "Te rugăm să completezi corect câmpurile obligatorii și să accepți publicarea recenziei.";
                errorBox.hidden = false;
                firstInvalid?.focus();
                return;
            }

            const lastReviewAt = Number(localStorage.getItem("profuLastReviewAt") || 0);
            if (Date.now() - lastReviewAt < 60_000) {
                errorBox.textContent = "Ai trimis recent o recenzie. Te rugăm să aștepți un minut înainte de o nouă trimitere.";
                errorBox.hidden = false;
                return;
            }

            setSubmitting(true, submitButton);

            try {
                // Firestore solicită automat și atașează tokenul App Check.
                await addDoc(reviewsCollection, {
                    name: cleanName,
                    city: cleanCity,
                    rating: Number(rating.value),
                    review: cleanReview,
                    createdAt: serverTimestamp()
                });

                localStorage.setItem("profuLastReviewAt", String(Date.now()));
                form.reset();
                charCount.textContent = "0";
                starRating?.classList.remove("ratingError");
                successBox.hidden = false;

                setTimeout(() => {
                    successBox.hidden = true;
                    document.getElementById("publishedReviewsTitle")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 1200);
            } catch (error) {
                console.error("Eroare la publicarea recenziei:", error);
                errorBox.textContent = "Recenzia nu a putut fi publicată. Verifică conexiunea și încearcă din nou.";
                errorBox.hidden = false;
            } finally {
                setSubmitting(false, submitButton);
            }
        });
    }

    reviewsSort?.addEventListener("change", renderReviews);
    subscribeToReviews();
    initializeNavigation(menuToggle, nav, header, topButton);
});

function subscribeToReviews() {
    const loading = document.getElementById("reviewsLoading");
    const loadError = document.getElementById("reviewsLoadError");
    const reviewsQuery = query(reviewsCollection, orderBy("createdAt", "desc"));

    onSnapshot(
        reviewsQuery,
        snapshot => {
            loadedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            loading.hidden = true;
            loadError.hidden = true;
            renderReviews();
        },
        error => {
            console.error("Eroare la încărcarea recenziilor:", error);
            loading.hidden = true;
            loadError.hidden = false;
        }
    );
}

function renderReviews() {
    const list = document.getElementById("reviewsList");
    const empty = document.getElementById("reviewsEmpty");
    const sortValue = document.getElementById("reviewsSort")?.value || "newest";
    if (!list || !empty) return;

    const reviews = [...loadedReviews];

    if (sortValue === "highest") {
        reviews.sort((a, b) => b.rating - a.rating || timestampValue(b) - timestampValue(a));
    } else if (sortValue === "lowest") {
        reviews.sort((a, b) => a.rating - b.rating || timestampValue(b) - timestampValue(a));
    } else {
        reviews.sort((a, b) => timestampValue(b) - timestampValue(a));
    }

    list.replaceChildren();
    empty.hidden = reviews.length !== 0;

    reviews.forEach(item => list.appendChild(createReviewCard(item)));
    updateSummary(loadedReviews);
}

function createReviewCard(item) {
    const article = document.createElement("article");
    article.className = "publishedReviewCard";

    const top = document.createElement("div");
    top.className = "publishedReviewTop";

    const identity = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = item.name || "Client";
    const city = document.createElement("p");
    city.className = "publishedReviewCity";
    city.textContent = item.city || "Localitate nespecificată";
    identity.append(name, city);

    const date = document.createElement("time");
    date.className = "publishedReviewDate";
    date.textContent = formatDate(item.createdAt);

    top.append(identity, date);

    const stars = document.createElement("div");
    stars.className = "publishedReviewStars";
    stars.setAttribute("aria-label", `${item.rating} din 5 stele`);
    stars.textContent = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);

    const review = document.createElement("p");
    review.className = "publishedReviewText";
    review.textContent = item.review || "";

    article.append(top, stars, review);
    return article;
}

function updateSummary(reviews) {
    const count = reviews.length;
    const average = count
        ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / count
        : 0;

    document.getElementById("reviewsCount").textContent = String(count);
    document.getElementById("reviewsAverage").textContent = count ? average.toFixed(1) : "—";

    const rounded = Math.round(average);
    document.getElementById("reviewsAverageStars").textContent = count
        ? "★".repeat(rounded) + "☆".repeat(5 - rounded)
        : "☆☆☆☆☆";
}

function formatDate(timestamp) {
    const date = timestamp?.toDate ? timestamp.toDate() : null;
    if (!date) return "Publicată acum";

    return new Intl.DateTimeFormat("ro-RO", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function timestampValue(item) {
    return item.createdAt?.toMillis ? item.createdAt.toMillis() : 0;
}

function setSubmitting(active, button) {
    if (!button) return;
    button.disabled = active;
    button.innerHTML = active
        ? '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Se publică…'
        : '<i class="fa-solid fa-star" aria-hidden="true"></i> Publică recenzia';
}

function initializeNavigation(menuToggle, nav, header, topButton) {
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", event => {
            event.stopPropagation();
            nav.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => nav.classList.remove("active"));
        });

        document.addEventListener("click", event => {
            if (nav.classList.contains("active") && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
                nav.classList.remove("active");
            }
        });
    }

    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 40);
        });
    }

    if (topButton) {
        window.addEventListener("scroll", () => {
            topButton.style.display = window.scrollY > 500 ? "block" : "none";
        });
        topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
}
