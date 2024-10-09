const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String,
            required: true,
            match: [/.+\@.+\..+/, 'Por favor, ingresa un correo electrónico válido.'],
            unique: true,
            },
    pass: {type: String,
           required: true,
           minlength: [8, 'La contraseña debe tener al menos 8 caracteres.'],  
        },
})

module.exports = mongoose.model('User', userSchema);