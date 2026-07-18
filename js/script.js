// ==============================
// SUC DE LA PROFU' V4.0.1
// ==============================

let qtyMere = 0;
let qtySfecla = 0;

const pretMere = 40;
const pretSfecla = 45;

const qtyMereDisplay = document.getElementById("qtyMere");
const qtySfeclaDisplay = document.getElementById("qtySfecla");

const minusMere = document.getElementById("minusMere");
const plusMere = document.getElementById("plusMere");

const minusSfecla = document.getElementById("minusSfecla");
const plusSfecla = document.getElementById("plusSfecla");



const totalText = document.querySelector(".cart h1");


// Actualizează totalul
function updateCart() {

    const totalProduse = qtyMere + qtySfecla;

    const totalPlata =
        qtyMere * pretMere +
        qtySfecla * pretSfecla;

    // Cantitățile de pe cardurile produselor
    qtyMereDisplay.textContent = qtyMere;
    qtySfeclaDisplay.textContent = qtySfecla;

    // Coșul flotant
    document.getElementById("cartCount").textContent =
        totalProduse === 1
            ? "1 produs"
            : `${totalProduse} produse`;

    document.getElementById("cartValue").textContent =
        `${totalPlata} lei`;

    // Totalul din formular, dacă există
    const totalComanda = document.getElementById("totalComanda");

    if (totalComanda) {
        totalComanda.textContent = `${totalPlata} RON`;
    }
}


//Adaugare cantitati

minusMere.addEventListener("click", function () {

    if (qtyMere > 0) {
        qtyMere--;
        updateCart();
    }

});

plusMere.addEventListener("click", function () {

    qtyMere++;
    updateCart();

});

minusSfecla.addEventListener("click", function () {

    if (qtySfecla > 0) {
        qtySfecla--;
        updateCart();
    }

});

plusSfecla.addEventListener("click", function () {

    qtySfecla++;
    updateCart();

});





function valideazaFormular() {

    const nume = document.getElementById("nume");
    const telefon = document.getElementById("telefon");
    const adresa = document.getElementById("adresa");

    // Elimină marcajele vechi
    [nume, telefon, adresa].forEach(camp => {
        camp.classList.remove("error");
    });

    // Verifică mai întâi dacă există produse
    if (qtyMere === 0 && qtySfecla === 0) {

        alert(
            "Te rugăm să alegi cel puțin un produs înainte de a trimite comanda."
        );

        document.getElementById("produse").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return false;
    }

    let valid = true;

    // Validare nume
    if (nume.value.trim() === "") {
        nume.classList.add("error");
        valid = false;
    }

    // Validare telefon
    const telefonCurat = telefon.value.replace(/\s/g, "");

    if (!/^07\d{8}$/.test(telefonCurat)) {
        telefon.classList.add("error");
        valid = false;
    }

    // Validare adresă
    if (adresa.value.trim() === "") {
        adresa.classList.add("error");
        valid = false;
    }

    if (!valid) {

        document.getElementById("comanda").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return false;
    }

    return true;
}


function resetComanda(){

    // Reset cantități
    qtyMere = 0;
    qtySfecla = 0;

    // Actualizează totalul și cantitățile afișate
    updateCart();

    // Golește formularul
    document.getElementById("nume").value = "";
    document.getElementById("telefon").value = "";
    document.getElementById("adresa").value = "";
    document.getElementById("observatii").value = "";

    // Elimină eventualele marcaje de eroare
    document.querySelectorAll(".error").forEach(camp=>{
        camp.classList.remove("error");
    });

     // Revine la începutul formularului
    document.getElementById("produse").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}



// WhatsApp

const whatsappButton = document.getElementById("sendOrder");


if (whatsappButton) {

    whatsappButton.addEventListener("click", () => {

        if (!valideazaFormular()) {
            return;
        }

    const nume = document.getElementById("nume").value.trim();
    const telefon = document.getElementById("telefon").value.trim();
    const adresa = document.getElementById("adresa").value.trim();
    const observatii = document.getElementById("observatii").value.trim();

    const total =
        qtyMere * pretMere +
        qtySfecla * pretSfecla;

    let mesaj =
`Bună ziua!

Doresc să comand:
🍎 Suc de mere 5L: ${qtyMere} x ${pretMere} RON
❤️ Suc mere + sfeclă: ${qtySfecla} x ${pretSfecla} RON

TOTAL: ${total} RON
-------------------------
Nume: ${nume}
Telefon: ${telefon}
Adresă: ${adresa}
Observații: ${observatii || "-"}`;

    document.getElementById("successMessage").style.display = "flex";

    setTimeout(() => {

        window.open(
            "https://wa.me/40741195757?text=" +
            encodeURIComponent(mesaj),
            "_blank"
        );

        document.getElementById("successMessage").style.display = "none";

        resetComanda();

    }, 1500);

});

}

const floatingOrderButton =
    document.getElementById("floatingOrderButton");

if (floatingOrderButton && whatsappButton) {

    floatingOrderButton.addEventListener("click", function () {

        whatsappButton.click();

    });

}


// =======================
// GALERIE FOTO
// =======================

const galerie = document.querySelectorAll(".gallery img");

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightboxImage");

const closeLightbox = document.getElementById("closeLightbox");

galerie.forEach(img=>{

    img.addEventListener("click",()=>{

        lightbox.style.display="flex";

        lightboxImage.src=img.src;

    });

});



if(lightbox && closeLightbox){

    closeLightbox.addEventListener("click", () => {

        lightbox.style.display = "none";

    });

    lightbox.addEventListener("click", (e) => {

        if(e.target === lightbox){

            lightbox.style.display = "none";

        }

    });

}

const topButton = document.getElementById("backToTop");

if (topButton) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            topButton.style.display = "block";

        } else {

            topButton.style.display = "none";

        }

    });

    topButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* MENU */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", function () {

    console.log("CLICK");

    nav.classList.toggle("active");

    console.log(nav.className);

});

// Închide meniul după selectarea unui link
document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});



// Închide meniul dacă utilizatorul apasă în afara lui
document.addEventListener("click", function(event){

    const clickInMenu = nav.contains(event.target);
    const clickOnButton = menuToggle.contains(event.target);

    if(nav.classList.contains("active") && !clickInMenu && !clickOnButton){

        nav.classList.remove("active");
        menuToggle.innerHTML = "☰";

    }

});





/* HEADER */

const header=document.getElementById("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>40){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});

document.querySelectorAll("input, textarea").forEach(camp => {

    camp.addEventListener("input", function(){

        this.classList.remove("error");

    });

});

document.querySelectorAll("input, textarea").forEach(camp => {

    camp.addEventListener("input", function(){

        this.classList.remove("error");

    });

});

updateCart();


if ("serviceWorker" in navigator) {
    const appUpdateNotice = document.getElementById("appUpdateNotice");
    const updateAppButton = document.getElementById("updateAppButton");
    const dismissUpdateButton = document.getElementById("dismissUpdateButton");
    let waitingServiceWorker = null;
    let reloadingForUpdate = false;

    function showUpdateNotice(worker) {
        waitingServiceWorker = worker;

        if (appUpdateNotice) {
            appUpdateNotice.hidden = false;
            requestAnimationFrame(function () {
                appUpdateNotice.classList.add("visible");
            });
        }
    }

    function hideUpdateNotice() {
        if (!appUpdateNotice) {
            return;
        }

        appUpdateNotice.classList.remove("visible");
        window.setTimeout(function () {
            appUpdateNotice.hidden = true;
        }, 250);
    }

    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./sw.js")
            .then(function (registration) {
                console.log("PWA Service Worker înregistrat.");

                if (registration.waiting) {
                    showUpdateNotice(registration.waiting);
                }

                registration.addEventListener("updatefound", function () {
                    const installingWorker = registration.installing;

                    if (!installingWorker) {
                        return;
                    }

                    installingWorker.addEventListener("statechange", function () {
                        if (
                            installingWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            showUpdateNotice(installingWorker);
                        }
                    });
                });

                // Verifică periodic dacă ai publicat o versiune nouă.
                window.setInterval(function () {
                    registration.update();
                }, 60 * 60 * 1000);
            })
            .catch(function (error) {
                console.error(
                    "Service Worker nu a putut fi înregistrat:",
                    error
                );
            });
    });

    if (updateAppButton) {
        updateAppButton.addEventListener("click", function () {
            if (!waitingServiceWorker) {
                window.location.reload();
                return;
            }

            updateAppButton.disabled = true;
            updateAppButton.textContent = "Se actualizează…";
            waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        });
    }

    if (dismissUpdateButton) {
        dismissUpdateButton.addEventListener("click", hideUpdateNotice);
    }

    navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (reloadingForUpdate) {
            return;
        }

        reloadingForUpdate = true;
        window.location.reload();
    });
}

// ==============================
// BUTON INSTALARE PWA
// ==============================

let deferredInstallPrompt = null;
const installAppButton = document.getElementById("installAppButton");

window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;

    if (installAppButton) {
        installAppButton.hidden = false;
    }
});

if (installAppButton) {
    installAppButton.addEventListener("click", async function () {
        if (!deferredInstallPrompt) {
            return;
        }

        installAppButton.disabled = true;
        deferredInstallPrompt.prompt();

        try {
            await deferredInstallPrompt.userChoice;
        } finally {
            deferredInstallPrompt = null;
            installAppButton.hidden = true;
            installAppButton.disabled = false;
        }
    });
}

window.addEventListener("appinstalled", function () {
    deferredInstallPrompt = null;

    if (installAppButton) {
        installAppButton.hidden = true;
    }

    console.log("Aplicația Suc de la Profu' a fost instalată.");
});
