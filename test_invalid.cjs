const { Country, State } = require('country-state-city');
console.log(State.getStatesOfCountry("Afghanistan"));
console.log(State.getStatesOfCountry("INVALID"));
