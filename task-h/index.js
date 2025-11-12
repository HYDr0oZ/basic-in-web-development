// index.js
// Author: Baptiste Rault
// Date: 2025-11-12
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
            addParticipantRow(formData);

            // *** MODIFICATION ICI : Réinitialiser le formulaire après soumission réussie ***
            form.reset();
            clearErrors(); // S'assurer que les messages d'erreur sont bien cachés
        }
    });

    function validateForm() {
        let isValid = true;

        // Validation du nom complet
        const fullName = document.getElementById("fullName").value.trim();
        if (fullName === "") {
            showError("fullNameError", "Full name is required.");
            isValid = false;
        } else if (fullName.length < 3) {
            showError("fullNameError", "Full name must be at least 3 characters long.");
            isValid = false;
        }

        // Validation de l'email
        const email = document.getElementById("email").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            showError("emailError", "Email is required.");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError("emailError", "Please enter a valid email address.");
            isValid = false;
        }

        // Validation du téléphone
        const phone = document.getElementById("phone").value.trim();
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (phone === "") {
            showError("phoneError", "Phone number is required.");
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError("phoneError", "Please enter a valid phone number.");
            isValid = false;
        }

        // Validation de la date de naissance
        const birthDate = document.getElementById("birthDate").value;
        if (birthDate === "") {
            showError("birthDateError", "Birth date is required.");
            isValid = false;
        } else {
            const selectedDate = new Date(birthDate);
            const today = new Date();
            const age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            const dayDiff = today.getDate() - selectedDate.getDate();

            // Calculer l'âge exact
            let exactAge = age;
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                exactAge--;
            }

            if (exactAge < 18) {
                showError("birthDateError", "You must be at least 18 years old.");
                isValid = false;
            } else if (selectedDate > today) {
                showError("birthDateError", "Birth date cannot be in the future.");
                isValid = false;
            }
        }

        // Validation des conditions
        const terms = document.getElementById("terms");
        if (!terms.checked) {
            showError("termsError", "You must accept the terms and conditions.");
            isValid = false;
        }

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
    }

    function clearErrors() {
        const errorElements = [
            "fullNameError",
            "emailError",
            "phoneError",
            "birthDateError",
            "termsError"
        ];

        errorElements.forEach(id => {
            const element = document.getElementById(id);
            element.textContent = "";
            element.classList.add("hidden");
        });
    }

    function addParticipantRow(data) {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td style="padding: 0.75rem; border-bottom: 1px solid #e0e0e0;">${data.timestamp}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid #e0e0e0;">${data.fullName}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid #e0e0e0;">${data.email}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid #e0e0e0;">${data.phone}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid #e0e0e0;">${data.birthDate}</td>
        `;
    }

    function formatTimestamp(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});
