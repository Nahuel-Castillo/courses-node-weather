const axios = require('axios').default;
require('colors');

const { readDB, saveDB } = require('../helpers/file');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class Searches {

    _history = [];

    constructor() {
        
        const data = readDB();

        if ( data ) this._history = data;
    }

    async search( place = '' )  {

        try {
            const limit = 5;
            place = escape( place );
            const token = process.env.MAPBOX_KEY;

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: {
                    'access_token': token,
                    'limit': limit
                }
            });

            console.log('loading...'.magenta);
            const resp = await intance.get();
            console.clear();
           
            return resp.data.features.map( ({ id, place_name, center }) => (
                {
                    id,
                    name: place_name,
                    lat: center[1],
                    lng: center[0]
                }
            ));

        } catch (error) {
            return [];
        }
    }

    addHistorySearch( place = '' ) {
        if ( this._history.includes( place.toLowerCase() ) ) return;

        if ( this._history.length >= 5 ) this._history.shift();

        this._history.push( place.toLowerCase() );
    }

    saveHistory() {

        if ( this._history.length > 0 ) {

            const length = this._history.length;

            const min = ( length - 5 >= 0 ) ? length - 5 : 0;

            this._history = this._history.slice(min, length);

            saveDB( this._history );
        }
    }

    // get history() {
    //     return this._history.slice(0, this._history.length).reverse();
    // }

    printHistory() {
        if ( this._history.length > 0) {

            console.log();

            this._history
                .slice(0, this._history.length)
                .reverse()
                .forEach( ( p, i ) => {

                    const idx = (i + 1) + '.'
                    let name = '';

                    p.split(' ').forEach( w => {
                        name += w.capitalize() + ' ';
                    });

                    console.log( `${ idx.green } ${ name.cyan }` );
                });
        }
    }

    async getWeather( lat, lon )  {

        try {
            
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    lat,
                    lon, 
                    appid: process.env.OPENWEATHER_KEY,
                    units: 'metric'
                }
            });
        
            console.log('loading...'.magenta);
            const resp = await instance.get();
            console.clear();
            const { main, weather } = resp.data;
        
            const { temp, temp_min: min, temp_max: max } = main;
            const { description:desc } = weather[0];

            return { desc, temp, min, max };
    
        } catch (error) {
            console.log( error );
        }
    
    }

    
    
}

module.exports = Searches; 