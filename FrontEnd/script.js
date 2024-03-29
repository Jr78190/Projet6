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
    // worksList.innOerHTML = ''; 
    
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

document.getElementById("loginId").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:email, password:password }) 
    })
    
    .then(response => {
        if (response.ok) {
            // Authentification réussie, extrayez le token de la réponse
            return response.json();
        } else {
            alert("Adresse e-mail ou mot de passe incorrect.");
            throw new Error("Adresse e-mail ou mot de passe incorrect.");
        }
    })

    .then(data => {
        // Stockez le token dans localStorage après une authentification réussie
        
        localStorage.setItem('userToken', data.token);

        // Redirigez l'utilisateur vers la page d'admin
        window.location.href = "./admin.html"; 
    })
    .catch(error => {
        console.error("Erreur lors de la requête d'authentification:", error);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById("logout");
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        // Supprimer le token du localStorage 
        localStorage.removeItem("userToken");
        // Rediriger l'utilisateur vers la page de login
        window.location.href = "./login.html"; 
    });
});

// MODAL

// Sélection de la modal et du bouton pour ouvrir la modal
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");

// Affichage de la modal lorsque vous cliquez sur le bouton "Open Modal"
btn.addEventListener("click", function() {
  modal.style.display = "block";
});

// Cacher la modal lorsque vous cliquez sur la croix
var closeBtn = document.getElementById("close-modal");
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

