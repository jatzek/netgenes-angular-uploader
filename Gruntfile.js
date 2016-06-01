/**
 * Created by jacek on 01.06.16.
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify: {
            options : {
                mangle : false,
                report : 'gzip'
            },
            build :{

                files : {
                    'dist/<%= pkg.name %>.min.js' : 'src/netgenes-angular-uploader.js'
                }
            }
        },
        bump : {
            options : {
                files : ['package.json', 'bower.json'],
                updateConfigs : ['pkg'],
                commitFiles: ['-a'],
                tagName : '%VERSION%',
                push: 'tag',
                pushTo: 'origin'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('build',['uglify:build']);

    grunt.registerTask('patch',['build','bump:patch']);
    grunt.registerTask('minor',['build','bump:minor']);
    grunt.registerTask('major',['build','bump:major']);
};