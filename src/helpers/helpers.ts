const regex = Object.freeze({
    string: (/^[\w\s]{1,25}$/),
    descriptionString: (/^[\w\.\,\s]{1,1000}$/),
    emailString: (/^[a-z\_0-9]+@[a-z]{4,}\.[a-z]{3,}$/),
    onlyNumbers: (/^[0-9]+$/),
    password:  new RegExp( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ) 
});

const ERROR_MESSAGES = Object.freeze({
    required: 'campo requerido',
    email: 'correo inválido',
    min: ( min: number ) => 'minimo ' + min + ' caracteres',
    max: ( max: number ) => 'máximo ' + max + ' caracteres',
    pattern: 'Patrón de datos inválido',
    notMatch: 'La contraseña no coincide',
    patternPass: 'La contrasena debe incluir mayuscula, minusculas y numeros'
});

export {
    regex,
    ERROR_MESSAGES
}