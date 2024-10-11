const express = require('express'); // 
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');

const User = require('./models/user'); // Importamos el modelo de usuario

uri = process.env.MONGODB_URI; // Conexion a la base de datos
/*
Conectamos a la base de datos con la URI previamente establecida
*/
mongoose.connect(uri, { 
}).then(() => {
    console.log('Conexión a la base de datos establecida');
}).catch(err => {
    console.error('Error de conexión a la base de datos:', err);
});



/*
Definimos los tipos de datos para los usuarios y alertas
Definimos User
Creamos un Alert
Definimos el UserInput
Definimos un Query para obtener todos los usuarios y un usuario por ID
Definimos un Mutation para agregar, actualizar y eliminar usuarios
*/
const typeDefs = gql`
type User {
    id: ID!
    email: String!
    pass: String!    
}
type Alert {
    message: String
}
input UserInput {
    email: String!
    pass: String!
}
type Query {
    getUsers: [User]
    getUser(id: ID!): User
}
type Mutation {
    addUser(input: UserInput): User
    updateUser(id: ID!, input: UserInput): User
    deleteUser(id: ID!): Alert    
}
`;
/*
Definimos los resolvers para los Query y Mutation ya establecidos en los typeDefs.
Para las Mutation. Importante recalcar que:
los parametros de una funcion Mutation son 3 :
    1. (parent) [obligatorio] -> Puede ser _
    2. (args) [obligatirio]
    3. (context) [opcional] -> Puede no ponerse

*/
const resolvers = {
    Query: {
        async getUsers() {
            const users = await User.find();
            return users;
        },
        async getUser(_, { id }) {
            const user = await User.findById(id);
            return user;
        },
    },
    Mutation: {
        async addUser(_ , { input }) {
            const user = new User(input);
            await user.save();
            return user;
        },
        async updateUser(_, {id, input }) {
            const user = await User.findByIdAndUpdate(id, input, { new: true });
            return user;
        },
        async deleteUser(_, { id }) {
            await User.deleteOne({ _id, id });
            return {
                message: "User deleted"
            };
        }
    }
};

const app = express(); // Instanciamos la aplicacion 



/*
Permite solicitudes desde localhost:8090 y desde el playground de Apollo
ademas de entregar credenciales para poder testear las solicitudes
*/
const corsOptions = {
    origin: ['http://localhost:8090',
             'http://127.0.0.1:5500', 
             'https://primera-pagina-web-flax.vercel.app/', 
             'https://studio.apollographql.com',
             'https://primera-pagina-web-twl9.onrender.com',
             'httos://primera-pagina-web-twl9.onrender.com/',
             'https://primera-pagina-web-twl9.onrender.com/graphql'], // Nueva URL
    credentials: true
};

/*
Habilitamos el uso de cors con las opciones previamente establecidas
con el detalle de que las solicitudes que no cumplan con las opciones (origin)
seran bloqueadas
*/
app.use(cors(corsOptions));

/*
Iniciamos el servidor de Apollo con los typeDefs y resolvers previamente definidos
*/
async function startServer() {
    const apolloServer = new ApolloServer({ typeDefs, 
                                            resolvers,
                                            cache: 'bounded',
                                            persistedQueries: false,
                                         });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' }); // Habilitamos Apollo en la aplicacion 
}

/*
Iniciamos el servidor en el puerto 8090
*/
const PORT = process.env.PORT || 8090;
startServer().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});

// Sirve archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});