// Partie login
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
                console.log("Redirection vers la page d'administration...");
                window.location.href = "./index.html";
            })
            .catch(error => {
                console.error("Erreur lors de la requête d'authentification:", error);
            });
    });
