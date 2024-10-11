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

        // Verificar si la respuesta no fue exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // Manejar errores de GraphQL
        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            return; // Detener aquí si hay errores
        }

        console.log('Resultado:', result.data.addUser); // Mostrar los datos del usuario agregado
    } catch (error) {
        console.error('Error:', error);
    }
});
