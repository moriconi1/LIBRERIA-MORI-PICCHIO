
async function login(event) {
    event.preventDefault();  // Aggiungi questa linea per prevenire il submit standard del form

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: email,
                password: password
            })
        });

        if (response.ok) {
            window.location.href = '../admin.html'; // Reindirizza se il login è riuscito
        } else {
            alert('Credenziali non valide'); // Mostra un messaggio di errore se il login fallisce
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

function checkEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        requestLogin(event);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('password').addEventListener('keypress', checkEnter);
    document.querySelector('form').addEventListener('submit', requestLogin);  // Aggiungi un listener di evento al form
});
