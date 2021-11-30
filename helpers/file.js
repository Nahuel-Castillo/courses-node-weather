const fs = require('fs');

const filePath = './db/history.json';

const saveDB = ( data ) => {

    try {
        fs.writeFileSync( filePath, JSON.stringify( data) );

    } catch (error) {
        console.log('Cant write file');
    }
}

const readDB = () => {
    try {

        if ( !fs.existsSync( filePath ) ) return null;
        
        const data = JSON.parse( fs.readFileSync( filePath,'utf8' ) );
        
        return data;

    } catch (error) {
        
        console.log('Cant read file');
    }

    return null;
}

module.exports = {
    saveDB,
    readDB
}