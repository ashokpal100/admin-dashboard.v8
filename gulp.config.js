module.exports = function() {
    var client = 'client',
        clientApp = './client/app'
        dist = 'dist',
        docs = 'documentation';
    var config = {
        client: client,
        dist: dist,
        index: client + "/index.html",
        sass : '.tmp/styles/**/*.scss'
    };
    return config;
};