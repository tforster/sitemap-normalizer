var url = require('url');

function app(siteMapXmlPath) {
  var urls = [];
  var sitemap = {};

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(siteMapXmlPath)
  });

  lineReader.on('line', function (line) {
    var pattern = /<loc>([\s\S\d%!-_#]*)?<\/loc>/gi;
    var ex = pattern.exec(line);
    if (ex && ex.length > 1) {
      var urlParts = url.parse(ex[1]);
      var paths = urlParts.pathname.split('/');
      var path = paths.slice(1, paths.length).join('/');
      var filename = paths.pop();

      for(var p=1;p<paths.length;p++){
        if(!sitemap[paths[p]]){
          sitemap[paths[p]] = {}
        }
      }


      console.log(path, filename);
    }

  });
  lineReader.on('close', function(){
    console.log('done', sitemap);
  })
}

function toObject(arr) {
  var rv = {}
  rv[arr[0]] = {};
  if (arr.length > 1) {
    for (var i = 1; i < arr.length; ++i)
      rv[arr[i-1]]={};
  }

  return rv;
}

app('./sitemap.xml');
