// Fonction pour effectuer l'appel à l'API
const apiUrl = 'http://localhost:5678/api/works';

const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
};

function fetchWorksFromApi() {
    return fetch(apiUrl, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erreur lors de la récupération des travaux.');
            }
        });
}

// Fonction pour traiter les données récupérées et les afficher dans l'élément 'works-list'
function displayWorks(data) {
    const worksList = document.getElementById('works-list');
    worksList.innerHTML = '';

    data.forEach(work => {
        // Création des éléments HTML pour chaque travail
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        // Attribution des attributs et du contenu
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        // Ajout des éléments à la liste de travaux
        figure.appendChild(img);
        figure.appendChild(figcaption);
        worksList.appendChild(figure);
    });
}

// Appel de l'API et traitement des données au chargement de la page
fetchWorksFromApi()
    .then(displayWorks)
    .catch(error => {
        console.error('Erreur lors de la récupération des travaux:', error);
    });


     // Récupération des boutons de catégorie et ajout d'un écouteur d'événement à chacun
   const filterButtons = document.querySelectorAll(".btnC");
   
   filterButtons.forEach(button => {
       button.addEventListener('click', () => {
           const categoryId = button.id;
           
           fetchWorksFromApi()
           .then(data => {
               // Sélection de l'élément où afficher les travaux
               const worksList = document.getElementById('works-list');
               
               // Effacement du contenu précédent de la liste de travaux
               worksList.innerHTML = '';
               
               // Parcours des travaux récupérés
               data.forEach(work => {
                   // Vérification si le travail appartient à la catégorie sélectionnée ou si toutes les catégories sont sélectionnées
                   if (categoryId == '' || work.categoryId == categoryId || categoryId == 'Tous') {
                       // Création des éléments HTML pour chaque travail
                       const figure = document.createElement('figure');
                       const img = document.createElement('img');
                       const figcaption = document.createElement('figcaption');
                       
                       // Attribution des attributs et du contenu
                       img.src = work.imageUrl;
                       img.alt = work.title;
                       figcaption.textContent = work.title;
                       
                       // Ajout des éléments à la liste de travaux
                       figure.appendChild(img);
                       figure.appendChild(figcaption);
                       worksList.appendChild(figure);
                   }
               });
           })
           .catch(error => {
               console.error('Erreur:', error);
           });
       });
   });


// Partie Login //

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginId").addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Adresse e-mail ou mot de passe incorrect.");
                    throw new Error("Adresse e-mail ou mot de passe incorrect.");
                }
            })
            .then(data => {
                localStorage.setItem('userToken', data.token);
                console.log("Token utilisateur stocké :", data.token);
                updateSectionDisplay();
                console.log("Redirection vers la page d'administration...");
                window.location.href = "./index.html";
            })
            .catch(error => {
                console.error("Erreur lors de la requête d'authentification:", error);
            });
    });

    updateSectionDisplay();
});

function updateSectionDisplay() {
    const userToken = localStorage.getItem('userToken');

    const sectionHome = document.querySelector('.section-home');
    const sectionAdmin = document.querySelector('.section-admin');

    if (sectionHome && sectionAdmin) {
        if (userToken) {
            sectionHome.style.display = 'none';
            sectionAdmin.style.display = 'block';
        } else {
            sectionHome.style.display = 'block';
            sectionAdmin.style.display = 'none';
        }
    } else {
        console.error("Erreur : Les éléments 'section-home' ou 'section-admin' n'existent pas.");
    }
}

// Modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const addPhotoBtn = document.querySelector(".btn-ajout");
const ReturnModalBtn = document.querySelector(".btn-return");

// Nouvelle modal
const secondModal = document.querySelector("#second-modal");

const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

openModalBtn.addEventListener("click", function () {
    // Afficher la modal
    openModal();

    // Appeler l'API et afficher les images des travaux dans la modal
    fetchWorksFromApi()
        .then(displayWorksImages)
        .catch(error => {
            console.error('Erreur lors de la récupération des travaux:', error);
        });
});

// Ajoutez un événement pour ouvrir la deuxième modal
addPhotoBtn.addEventListener("click", function () {
    secondModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
});

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Pour retourner en arriere 

const ReturnModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    secondModal.classList.add("hidden");
}

ReturnModalBtn.addEventListener("click", ReturnModal);

// Pour fermer la deuxième modal
document.querySelectorAll(".btn-close2").forEach(function (btnClose) {
    btnClose.addEventListener("click", function () {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
        secondModal.classList.add("hidden");
    });
});

// Fonction pour afficher les images des travaux dans la modal
function displayWorksImages(data) {
    const modalImg = document.querySelector(".modal-image");

    data.forEach(work => {
        // Création d'un élément div pour envelopper l'image
        const div = document.createElement('div');
        div.classList.add('image-container'); // Ajout de la classe 'image-container' à la div

        const img = document.createElement('img');
        img.src = work.imageUrl;
        // Ajout de l'image à l'intérieur de la div
        div.appendChild(img);
        // Ajout de la div contenant l'image à l'intérieur de la modal
        modalImg.appendChild(div);

        const Icon = document.createElement('i');
        Icon.classList.add('fa-solid', 'fa-trash-can'); 

        // Ajout de l'écouteur d'événements pour supprimer l'image correspondante
        Icon.addEventListener('click', function() {
            modalImg.removeChild(div); 
        });
        // Ajout de l'icône de poubelle à l'intérieur de la div
        div.appendChild(Icon);

        // Ajout de la div contenant l'image et l'icône de poubelle à l'intérieur de la modal
        modalImg.appendChild(div);
    });
}

 // Ajout Gallery

 const addWorkForm = document.querySelector('.all-form');

 addWorkForm.addEventListener('submit', function(event) {
 event.preventDefault(); 
 
 const formData = new FormData(); 
 
 // Récupérer les valeurs des champs du formulaire
 const title = document.getElementById('ajout-titre').value;
 const imageFile = document.getElementById('ajout-image').files[0]; 
 const category = document.getElementById('view-categories').value; 
 const userId = localStorage.getItem("userToken")
 
 // Ajouter les valeurs au FormData
 formData.append('userToken', userId);
 formData.append('image', imageFile);
 console.log(imageFile)
 formData.append('title', title);
 console.log(title)
 formData.append('category', category);
 console.log(category)

 // Envoyer la requête POST à l'API Swagger
 fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
    body: formData
 })
 .then(response => {
    alert(response.json())
    alert(localStorage.getItem("userToken"))
    if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la requête.');
    }
    return response.json(); 
 })
 .then(data => {
    alert(data)
    alert(localStorage.getItem("userToken"))
    console.log('Travail ajouté avec succès :', data);
    closeModal();
 })
 .catch(error => {
    console.error('Erreur :', error);
 });
});

