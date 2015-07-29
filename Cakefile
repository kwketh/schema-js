fs = require 'fs'
uglify = require 'uglify-js'
watch = require 'watch'

dirs =
  src: 'src'

jsFiles = [
  dirs.src + '/init.js',
  dirs.src + '/loader.js',
  dirs.src + '/utils/Class.js',
  dirs.src + '/core/Factory.js',
  dirs.src + '/core/Field.js',
  dirs.src + '/fields/Buffer.js',
  dirs.src + '/fields/Array.js',
  dirs.src + '/fields/Group.js',
  dirs.src + '/fields/UInt32.js',
  dirs.src + '/fields/UInt16.js',
  dirs.src + '/fields/UInt8.js',
]

_build = () ->
  # Build schema.js
  code = (jsFiles.map (file) -> return fs.readFileSync(file)).join('\n')
  fs.writeFileSync('schema.js', code)

  # Build schema-min.js
  minified = uglify.minify(jsFiles, compress: true)
  fs.writeFileSync('schema-min.js', minified.code)  

  # End with success
  process.stdout.write 'build complete\n'

_watch = () ->
  watch.watchTree dirs.js, _build 

# Register tasks
task 'build', 'builds schema.js and schema-min.js', _build
task 'watch', 'builds on any file changs', _watch
