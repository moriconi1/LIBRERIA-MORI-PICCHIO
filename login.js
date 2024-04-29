
async function login(event) {
    event.preventDefault();  // Previene il submit standard del form

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'email',
                password: 'password'
            })
        });

        if (response.ok) {
            window.location.href = '../admin.html'; // Reindirizza se il login è riuscito
        } else {
            const errorMessage = await response.text(); // Ottieni il messaggio di errore dal corpo della risposta
            alert(errorMessage); // Mostra un messaggio di errore se il login fallisce
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Si è verificato un errore durante il login. Si prega di riprovare.'); // Gestione generica degli errori
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').addEventListener('submit', login); // Aggiungi un listener di evento al form
});