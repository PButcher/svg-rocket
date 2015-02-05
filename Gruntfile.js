module.exports = function(grunt) {

	grunt.initConfig({

		connect: {
			server: {
				options: { port: 5001, base: "./" }
			}
		},

		watch: {
			scss: {
				files: ["css/scss/**.scss"],
				tasks: ["sass"],
				options: {
					livereload: true
				}
			},
			html: {
				files: ["*.html"],
				options: {
					livereload: true
				}
			}
		},
		sass: {
		    dist: {
				files: {
					'css/style.css': 'css/scss/style.scss'    // 'destination': 'source'
				}
		    }
		}
	});

	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-notify");

	grunt.registerTask("default", ["connect", "watch"]);
};