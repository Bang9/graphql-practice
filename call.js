var fetch = require('node-fetch');

exports.callQuery = function(url,query) {
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: query}),
    })
        .then(res => res.json())
        .then(res => console.log(res.data));
}

exports.callMutation = function(url,query,variable) {
    console.log(variable)
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: query, variables:variable}),
    })
        .then(res => res.json())
        .then(res => console.log(res.data));
}