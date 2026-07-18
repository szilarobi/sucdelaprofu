// ==============================
// SUC DE LA PROFU' V4.0.1
// ==============================

let qtyMere = 0;
let qtySfecla = 0;

const pretMere = 40;
const pretSfecla = 45;


const qtyDisplays = document.querySelectorAll(".qty span");
const minusButtons = document.querySelectorAll(".qty button:first-child");
const plusButtons = document.querySelectorAll(".qty button:last-child");

const totalText = document.querySelector(".cart h1");
const whatsappButton = document.querySelector(".cart button");

// Actualizează totalul
function updateCart() {

    qtyDisplays[0].textContent = qtyMere;
    qtyDisplays[1].textContent = qtySfecla;

    const total = qtyMere * pretMere + qtySfecla * pretSfecla;

    totalText.textContent = total + " RON";

}

// Produs 1

minusButtons[0].addEventListener("click", () => {

    if(qtyMere>0){

        qtyMere--;

        updateCart();

    }

});

plusButtons[0].addEventListener("click",()=>{

    qtyMere++;

    updateCart();

});

// Produs 2

minusButtons[1].addEventListener("click",()=>{

    if(qtySfecla>0){

        qtySfecla--;

        updateCart();

    }

});

plusButtons[1].addEventListener("click",()=>{

    qtySfecla++;

    updateCart();

});


function valideazaFormular(){

    let valid = true;

    const nume = document.getElementById("nume");
    const telefon = document.getElementById("telefon");
    const adresa = document.getElementById("adresa");

    // Elimină marcajele vechi
    [nume, telefon, adresa].forEach(camp => {
        camp.classList.remove("error");
    });

    // Nume
    if(nume.value.trim() === ""){
        nume.classList.add("error");
        valid = false;
    }

    // Telefon
    const telefonCurat = telefon.value.replace(/\s/g, "");

    if(!/^07\d{8}$/.test(telefonCurat)){
        telefon.classList.add("error");
        valid = false;
    }

    // Adresă
    if(adresa.value.trim() === ""){
        adresa.classList.add("error");
        valid = false;
    }

   


    // Cel puțin un produs
    if(qtyMere === 0 && qtySfecla === 0 ){
        alert("Te rugăm să alegi cel puțin un produs înainte de a trimite comanda.");
       // Derulare către secțiunea Produse
    document.getElementById("produse").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });   
 


    }
else
if(!valid){
        alert("Te rugăm să completezi toate câmpurile obligatorii (Nume, Telefon și Adresă) înainte de a trimite comanda.");
// Deplasare către formular
    document.getElementById("comanda").scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

    // Cursor pe primul câmp gol
    if(nume.value.trim() === ""){
        nume.focus();
    }else if(!/^07\d{8}$/.test(telefonCurat)){
        telefon.focus();
    }else if(adresa.value.trim() === ""){
        adresa.focus();
    }

    }


    return valid;

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

whatsappButton.addEventListener("click",()=>{
if(!valideazaFormular()){
    return;
}

    const nume=document.getElementById("nume").value;

    const telefon=document.getElementById("telefon").value;

    const adresa=document.getElementById("adresa").value;

    const observatii=document.getElementById("observatii").value;

    const total=qtyMere*pretMere+qtySfecla*pretSfecla;

    let mesaj=
`Bună ziua!

Doresc să comand:

🍎 Suc de mere 5L: ${qtyMere} x ${pretMere} RON
❤️ Suc mere + sfeclă: ${qtySfecla} x ${pretSfecla} RON

TOTAL: ${total} RON
-------------------------
Nume: ${nume}
Telefon: ${telefon}
Adresă: ${adresa}
Observații: ${observatii}`;

document.getElementById("successMessage").style.display="flex";

setTimeout(function(){

    window.open(
        "https://wa.me/40741195757?text="+encodeURIComponent(mesaj),
        "_blank"
    );

    document.getElementById("successMessage").style.display = "none";

    resetComanda();

},1500);
    

});

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