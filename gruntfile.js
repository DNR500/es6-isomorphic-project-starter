module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        files:{
            css:{
                main: 'build/public/css/main.css'
            },
            js:{
                main: 'build/public/js/main.js'
            }
        },
        jsonlint: {
            project: {
                src: [ 'package.json', '.eslintrc.json', 'src/**/*.json', 'test/**/*.json' ]
            }
        },
        eslint: {
            src: ['gruntfile.js', 'src/**/*.js'],
            options: {
                configFile: '.eslintrc.json'
            }
        },
        babel: {
            options: {
                presets: ['es2015-node']
            },
            node:{
                files: [
                    {
                        expand: true, cwd: 'src/node/', src: ['**/*.js'], dest: 'build/node/', ext: '.js'
                    },
                    {
                        expand: true, cwd: 'src/', src: ['server.js'], dest: 'build/'
                    }
                ]
            },
            'node-debug':{
                options: {
                    sourceMap: true
                },
                files:'<%= babel.node.files %>'
            }
        },
        browserify: {
//            options:{
//                transform: [
//                    'browserify-shim',
//                    ['babelify',{'presets': ['babel-preset-es2015']}]
//                ]
//            },
            build: {
                files: {
                    '<%= files.js.main %>': ['src/public/js/main.js']
                }
            },
            debug: {
                files: '<%= browserify.build.files %>',
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        copy: {
            build: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**', '!**/scss/**'], dest: 'build/'},
                    {expand: true, cwd: 'node_modules/bootstrap-sass/assets/fonts', src: ['**'], dest: 'build/public/fonts/'},
                    {expand: true, cwd: 'node_modules/es5-shim/', src: ['es5-shim.min.js'], dest: 'build/public/js/lib/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'node_modules/html5shiv/dist/', src: ['html5shiv.min.js'], dest: 'build/public/js/lib/', flatten: true, filter: 'isFile'}
                ]
            }
        },
        clean: {
            'build-prep': ['build/*.js','build/node/**/*.js', 'build/public/js/app/', 'build/public/js/*.js'],
            slate: ['build']
        },
        nodemon: {
            build: {
                script: 'build/server.js'
            },
            debug: {
                script: '<%= nodemon.build.script %>',
                options: {
                    args: ['debug']
                }
            }
        },
        open:{
            browser : {
                path: 'http://127.0.0.1:4788/',
                app: 'Google Chrome'
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            build: {
                tasks: ['nodemon:build', 'open:browser']
            },
            debug: {
                tasks: ['nodemon:debug', 'open:browser']
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: true,
                keepSpecialComments: 0
            },
            build: {
                files: {
                    '<%= files.css.main %>': '<%= files.css.main %>'
                }
            }
        },
        sass: {
            build: {
                files: {
                    '<%= files.css.main %>': 'src/public/scss/main.scss'
                }
            },
            debug: {
                options: {
                    sourceMap: true
                },
                files: '<%= sass.build.files %>'
            }
        },
        uglify: {
            options: {
                preserveComments: false
            },
            build: {
                files: {
                    '<%= files.js.main %>': '<%= files.js.main %>'
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'})
                ]
            },
            dist: {
                src: 'css/*.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');

    grunt.registerTask('default', ['test']);
    grunt.registerTask('test', ['jsonlint', 'eslint']);
    grunt.registerTask('build', ['clean:slate', 'copy:build', 'clean:build-prep','babel:node', 'browserify:build', 'uglify:build', 'sass:build', 'cssmin:build']);
    grunt.registerTask('build-debug', ['clean:slate', 'copy:build', 'clean:build-prep','babel:node-debug', 'browserify:debug', 'sass:debug']);
    grunt.registerTask('launch-build', ['test','build', 'concurrent:build']);
    grunt.registerTask('launch-debug', ['build-debug', 'concurrent:debug']);
};