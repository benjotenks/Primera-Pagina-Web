document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = document.getElementById('RegisterEmail').value;
    const pass = document.getElementById('RegisterPass').value;

    try {
        const response = await fetch('https://primera-pagina-web-twl9.onrender.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation addUser($input: UserInput) {
                        addUser(input: $input) {
                            id
                            email
                            pass
                        }    
                    } 
                `,
                variables: {
                    input: {
                        email: email,
                        pass: pass,
                    }
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Resultado:', result);
    } catch (error) {
        console.error('Error:', error);
    }
});
