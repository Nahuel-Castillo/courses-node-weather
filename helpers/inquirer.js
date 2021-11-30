const inquirer = require('inquirer');
require('colors');


const inquirerMenu = async( options = [] ) => {

    const choices = options.map( ( { id, name }, i ) => (
        { 
            value: id,
            name: `${ ( ( i + 1 ) + '.' ).green } ${ name }`
        }
    ));

    choices.push( { value: 0, name: `${ '0.'.green } Exit` });
   
    const questions = [
        {
            type: 'list',
            name: 'option',
            message: 'What do you want to do?',
            choices
        }
    ];

    // console.log('========================================'.green);
    // console.log('Select an option'.white);
    // console.log('========================================\n'.green);

    const { option } = await inquirer.prompt( questions );

    return option;
}

const readInput = async message => {

    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate( value ) {
            if ( value.length === 0 ) {
                return 'Please enter a value';
            } 

            return true;
        }
    }];

    const { desc } = await inquirer.prompt( question );
    return desc;
}

const pause = async() => {

    const pauseQuestion=[{
        type: 'input',
        name: 'pause',
        message: `Press ${ 'ENTER'.green } to continue`
    }];

    return await inquirer.prompt( pauseQuestion );
}

const confirm = async message => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message,
        }
    ];

    const { ok } = await inquirer.prompt( question );

    return ok;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    confirm,
}