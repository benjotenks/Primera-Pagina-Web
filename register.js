document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('RegisterEmail').value;
    const pass = document.getElementById('RegisterPass').value;
    // 'http://localhost:8090/graphql' 
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

    const result = await response.json();
    console.log(result);
})