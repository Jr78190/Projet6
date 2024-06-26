// Variable de contrôle pour vérifier si les travaux ont déjà été chargés
let worksLoaded = false;
// Fonction pour effectuer l'appel à l'API
const apiUrl = 'http://localhost:5678/api/works';

const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
};

// Fonction pour récupérer les travaux depuis l'API
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

// Fonction pour afficher les travaux dans l'élément 'works-list'
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
        img.dataset.imageId = work.id; // Utilisation de l'ID de l'image comme valeur de l'attribut data-image-id
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

// Fonction pour mettre à jour l'affichage en fonction de la connexion de l'utilisateur
const login = document.getElementById('login');
function updateSectionDisplay() {
    const userToken = localStorage.getItem('userToken');

    const sectionHome = document.querySelector('.section-home');
    const sectionAdmin = document.querySelector('.section-admin');

    const BandeAdmin = document.querySelector('.bande-admin');

    if (sectionHome && sectionAdmin) {
        if (userToken) {
            sectionHome.style.display = 'none';
            sectionAdmin.style.display = 'block';
            BandeAdmin.style.display = 'block';

            login.innerHTML ="logout";
        } else {
            sectionHome.style.display = 'block';
            sectionAdmin.style.display = 'none';
            BandeAdmin.style.display = 'none';

            login.innerHTML ="login";
        }
    } else {
        console.error("Erreur : Les éléments 'section-home' ou 'section-admin' n'existent pas.");
    }
}

updateSectionDisplay();

// Écouteur d'événement pour le bouton de connexion/déconnexion
login.addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.removeItem('userToken');
    localStorage.clear(); 
    window.location.href ='login.html';
});

// Modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const addPhotoBtn = document.querySelector(".btn-ajout");
const ReturnModalBtn = document.querySelector(".btn-return");
const secondModal = document.querySelector("#second-modal");

// Fonction pour ouvrir la modal
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

        // Vérifiez si les travaux ont déjà été chargés pour éviter plusieurs appels API
        if (!worksLoaded) {
            fetchWorksFromApi()
                .then(data => {
                    displayWorksImages(data); // Affiche les travaux dans la modal
                    worksLoaded = true; 
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des travaux:', error);
                });
        }
};

openModalBtn.addEventListener("click", function () {
    openModal();

// Ajout d'un événement pour ouvrir la deuxième modal
addPhotoBtn.addEventListener("click", function () {
    secondModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
});
});

// Fonction pour fermer la modal
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// Écouteur d'événement pour fermer la modal
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Fonction pour retourner en arrière
const ReturnModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    secondModal.classList.add("hidden");
};

ReturnModalBtn.addEventListener("click", ReturnModal);

// Écouteurs d'événement pour fermer la deuxième modal
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

        const img = document.createElement('img');
        img.src = work.imageUrl;

        // Ajout de l'image à l'intérieur de la div
        div.appendChild(img);
        // Ajout de la div contenant l'image à l'intérieur de la modal
        modalImg.appendChild(div);

        const Icon = document.createElement('i');
        Icon.classList.add('icon-background', 'fa-solid', 'fa-trash-can'); 

        // Ajout de l'ID de l'image en tant qu'attribut data-image-id à l'icône de poubelle
        Icon.dataset.imageId = work.id;

        // Ajout de l'écouteur d'événements pour supprimer l'image correspondante
        Icon.addEventListener('click', function() {
           const imageId = this.dataset.imageId;
            // Demander confirmation avant de supprimer l'image
            const confirmationDeleteImage = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
            if (confirmationDeleteImage) {
                deleteImageById(imageId);
            }
        });
        // Ajout de l'icône de poubelle à l'intérieur de la div
        div.appendChild(Icon);

        // Ajout de la div contenant l'image et l'icône de poubelle à l'intérieur de la modal
        modalImg.appendChild(div);
    });
}

// Fonction pour supprimer une image de la modal
function deleteImageModal(imageId) {
    const modalImg = document.querySelector(`.modal-image [data-image-id="${imageId}"]`);
    if (modalImg) {
        const modalFigure = modalImg.parentNode;
        modalFigure.parentNode.removeChild(modalFigure);
    }
}

function deleteImageGallery(imageId) {
    const galleryImg = document.querySelector(`#works-list [data-image-id="${imageId}"]`);
    if (galleryImg) {
        const galleryFigure = galleryImg.parentNode;
        galleryFigure.parentNode.removeChild(galleryFigure);
    }
}

// Fonction pour supprimer une image de la galerie et de la modal
function deleteImageById(imageId) {
    fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("userToken")}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'image.');
        }
        console.log('Image supprimée avec succès.');
        alert('Image supprimée avec succès.');

        deleteImageModal(imageId);

        deleteImageGallery(imageId);
    })
    .catch(error => {
        console.error('Erreur lors de la suppression de l\'image :', error);
    });
}


// Fonction pour récupérer les catégories depuis l'API
function fetchCategoriesFromApi() {
    return fetchidde('http://localhost:5678/api/categories')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erreur lors de la récupération des catégories.');
            }
        });
}

// Fonction pour afficher les catégories dans le sélecteur
function displayCategories(categories) {
    const selectCategories = document.getElementById('view-categories');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectCategories.appendChild(option);
    });
}

// Appel de l'API pour récupérer les catégories et les afficher dans le sélecteur
fetchCategoriesFromApi()
    .then(displayCategories)
    .catch(error => {
        console.error('Erreur lors de la récupération des catégories :', error);
    });

// Ajout de travaux à la galerie
const addWorkForm = document.querySelector('.all-form');
const worksList = document.getElementById('works-list');
const inputImage = document.getElementById('ajout-image');
const imgFond = document.querySelector('.img-fond');

const ImgDefault = "./assets/images/montagne.png";

inputImage.addEventListener('change', function(event) {
    const selectedImage = event.target.files[0];
    const imageURL = URL.createObjectURL(selectedImage);
    imgFond.src = imageURL;

    // Ajout class à l'image choisi
    imgFond.classList.add('img-choisi');
});

addWorkForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const formData = new FormData(); 

    // Récupérer les valeurs des champs du formulaire
    const title = document.getElementById('ajout-titre').value;
    const imageFile = document.getElementById('ajout-image').files[0]; 
    const category = document.getElementById('view-categories').value; 
    const userId = localStorage.getItem("userToken");

    console.log('Image File:', imageFile); 
    console.log('Title:', title);
    console.log('Category:', category); 
    console.log('User ID:', userId); 

    // Ajouter les valeurs au FormData
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('category', category);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi de la requête.');
        }
        return response.json(); 
    })
    .then(data => {
        // Récupérer l'ID de l'image à partir des données de la réponse JSON
        const imageId = data.id;
    
        const figure = document.createElement('figure');
        
        // Création de l'image dans la galerie 
        const img = document.createElement('img');
        img.src = URL.createObjectURL(imageFile);
        img.alt = title;
        
        // Création de la légende dans la galerie 
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = title;
        
        // Ajout de l'image et de la légende à la figure
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        // Ajout de l'ID de l'image en tant qu'attribut data-image-id à la figure
        figure.dataset.imageId = imageId;
        
        // Ajout de la figure à la galerie des travaux
        worksList.appendChild(figure);
    
        const test = document.querySelector('.modal-image');
        const figureModal = document.createElement('figure');
        
        // Création de l'image dans la modal
        const imgModal = document.createElement('img');
        imgModal.src = URL.createObjectURL(imageFile);
        imgModal.alt = title;
    
        
        // Ajout de l'image à la figure dans la modal
        figureModal.appendChild(imgModal);
    
        // Ajout de l'icône de suppression dans la modal
        const NewdeleteIcon = document.createElement('i');
        NewdeleteIcon.classList.add('icon-background', 'fa-solid', 'fa-trash-can'); 
    
        // Ajout de l'ID de l'image en tant qu'attribut data-image-id à l'icône de poubelle
        NewdeleteIcon.dataset.imageId = imageId;
    
        // Ajout de l'écouteur d'événement pour supprimer l'image correspondante
        NewdeleteIcon.addEventListener('click', function() {
            const imageId = this.dataset.imageId;
            // Demander confirmation avant de supprimer l'image
            const confirmationDeleteImage = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
            if (confirmationDeleteImage) {
                deleteImageById(imageId, data);
            }
        });
    
        // Ajout de l'icône de suppression à la figure de la modal
        figureModal.appendChild(NewdeleteIcon);
    
        // Ajout de la figure à la modal
        test.appendChild(figureModal);
    
        addWorkForm.reset();

        // Remettre l'image par défaut
        imgFond.src = ImgDefault;
        imgFond.classList.remove('img-choisi');
    
        // Fermer toutes les modales après l'ajout de l'image
        secondModal.classList.add("hidden");
    })
    
    .catch(error => {
        console.error('Erreur :', error);
    });
});
