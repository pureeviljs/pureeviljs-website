
'use strict';

const fs = require('fs');
const path = require('path');
const walk = require('walk');
const hbs = require('handlebars');

exports = module.exports = function precompile(options){

    return function(files, metalsmith, done){
        let source = metalsmith.source();

        for (var c in options.directories) {
            var walker = walk.walkSync(options.root + path.sep + options.directories[c], { listeners: {
                file: function (root, fileStats, next) {
                    // make relative from directory rather than root
                    let file = root + path.sep + fileStats.name;
                    let template = file.substr(options.root.length +1, file.length);
                    let partial = fs.readFileSync(file);
                    hbs.registerPartial(template, partial.toString());
                    next();
                }
            }});
        }
        /*var templatefiles = fs.readdirSync(options.directory);
        console.log(templatefiles);
        templatefiles.forEach(function(template) {
            console.log(template)
            let partial = fs.readFileSync(options.directory + path.sep + template);
            console.log(template, partial.toString())
            hbs.registerPartial(template, partial.toString());
        });*/

        for (let k in files){
            if (files.hasOwnProperty(k)){
                if (/\.md$/.test(k)){
                    let html = hbs.compile(files[k].contents.toString())();
                    files[k].contents = new Buffer(html);
                }
            }
        }

        done();
    };

};
