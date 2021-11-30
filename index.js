require('dotenv').config();
const { pause, inquirerMenu, readInput } = require("./helpers/inquirer");
const Searches = require("./models/searches");

const main = async() => {

    const searches = new Searches();
    let opt = 0;

    do {
        
        opt = await inquirerMenu( [ { id: 1, name: 'Search city'}, { id: 2, name: 'History'} ] );

        switch ( opt ) {
            case 1:
                //show message
                const place = await readInput('City: ');
                //search city
                const placesFound = await searches.search( place );
                //select city
                const selectedId = await inquirerMenu( placesFound );
                if ( placesFound === 0) continue;

                const selected = placesFound.find( c => c.id === selectedId );

                //weather
                
                //show results
                if ( selected ) {
                    searches.addHistorySearch( selected.name );

                    const { name, lat, lng } = selected;
                    
                    const { desc, temp, min, max } = await searches.getWeather( lat, lng );

                    console.log('\nCity info'.green);
                    console.log('City:', name);
                    console.log('Lat:', lat);
                    console.log('Lng:', lng);
                    console.log('Weather:', desc);
                    console.log('Temperature:', temp);
                    console.log('Temp min:', min);
                    console.log('Temp max', max);
                }

                break;
            case 2:
                searches.printHistory();
                break;
                
        }
            
        searches.saveHistory();

        console.log();
        await pause();
        
        console.clear();
    } while ( opt !== 0 );
}

main();