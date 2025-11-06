// index.js
// Author: Baptiste Rault
// Date: 2025-11-06
// Gestion du formulaire d'inscription avec validation personnalisée

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const tableBody = document.getElementById("participantsTable").querySelector("tbody");

    // Remplir automatiquement le timestamp caché
    const timestampInput = document.getElementById("timestamp");
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // Mettre à jour le timestamp au moment de la soumission
        const now = new Date();
        const formattedTimestamp = formatTimestamp(now);
        timestampInput.value = formattedTimestamp;

        // Nettoyer les messages d'erreur précédents
        clearErrors();

        // Valider le formulaire
        if (validateForm()) {
            // Récupérer les valeurs du formulaire
            const formData = {
                timestamp: timestampInput.value,
                fullName: document.getElementById("fullName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                birthDate: document.getElementById("birthDate").value
            };

            // Ajouter une nouvelle ligne au tableau
            addTableRow(formData);

            // Réinitialiser le formulaire
            form.reset();
            document.getElementById("fullName").focus();
        }
    });

    // Fonction de validation personnalisée
    function validateForm() {
        let isValid = true;

        // Validation du nom complet
        const fullName = document.getElementById("fullName").value.trim();
        if (fullName.length < 3) {
            showError("fullNameError", "Full name must contain at least 3 characters");
            isValid = false;
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(fullName)) {
            showError("fullNameError", "Name can only contain letters, spaces, apostrophes and hyphens");
            isValid = false;
        }

        // Validation de l'email
        const email = document.getElementById("email").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError("emailError", "Please enter a valid email address");
            isValid = false;
        }

        // Validation du téléphone
        const phone = document.getElementById("phone").value.trim();
        const phoneRegex = /^[\d\s\-+()]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showError("phoneError", "Phone number must contain at least 10 digits");
            isValid = false;
        }

        // Validation de la date de naissance
        const birthDate = document.getElementById("birthDate").value;
        if (!birthDate) {
            showError("birthDateError", "Birth date is required");
            isValid = false;
        } else {
            const birth = new Date(birthDate);
            const today = new Date();
            const age = today.getFullYear() - birth.getFullYear();
            
            if (birth > today) {
                showError("birthDateError", "Birth date cannot be in the future");
                isValid = false;
            } else if (age < 18) {
                showError("birthDateError", "You must be at least 18 years old");
                isValid = false;
            } else if (age > 120) {
                showError("birthDateError", "Please enter a valid birth date");
                isValid = false;
            }
        }

        // Validation de l'acceptation des conditions
        const terms = document.getElementById("terms").checked;
        if (!terms) {
            showError("termsError", "You must accept the terms and conditions");
            isValid = false;
        }

        return isValid;
    }

    // Afficher un message d'erreur
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    // Nettoyer tous les messages d'erreur
    function clearErrors() {
        const errorElements = document.querySelectorAll(".error-message");
        errorElements.forEach(element => {
            element.textContent = "";
            element.style.display = "none";
        });
    }

    // Formater le timestamp
    function formatTimestamp(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Ajouter une ligne au tableau
    function addTableRow(data) {
        const row = document.createElement("tr");

        const timestampCell = document.createElement("td");
        timestampCell.textContent = data.timestamp;
        row.appendChild(timestampCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = data.fullName;
        row.appendChild(nameCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = data.email;
        row.appendChild(emailCell);

        const phoneCell = document.createElement("td");
        phoneCell.textContent = data.phone;
        row.appendChild(phoneCell);

        const birthDateCell = document.createElement("td");
        const formattedDate = new Date(data.birthDate).toLocaleDateString('fr-FR');
        birthDateCell.textContent = formattedDate;
        row.appendChild(birthDateCell);

        tableBody.appendChild(row);
    }
});
