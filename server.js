let express = require('express');
let bodyParser = require('body-parser');
let sass = require('node-sass');
let fs = require('fs');

let app = express();
let saveLoc = `./default/sgrid_${new Date().getTime()}.css`;

function sassMapBuilder(variables) {
  return `$config: (min-row-height: ${variables[0]}, max-row-span: ${variables[1]}, num-columns: ${variables[2]}, gutter: ${variables[3]}, prefix: "${variables[4]}");`;
}

function dynamicSass(variables) {
  return new Promise((resolve, reject) => {
    let sassOptionsDefaults = {
      outputStyle: 'expanded'
    };
    let dataString = sassMapBuilder(variables) + '@import "./default/sgrid-template.scss"';
    let sassOptions = Object.assign({}, sassOptionsDefaults, {
      data: dataString
    });
    sass.render(sassOptions, (err, result) => {
      fs.writeFile(saveLoc, result.css.toString(), () => {
        resolve();
      });
    });
  });
}

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/send-variables', (req, res) => {
  let data = req.body;
  dynamicSass([data['minRowHeight'], data['maxRowSpan'], data['numColumns'], data['gutter'], data['prefix']]).then(() => {
    res.end();
  });
});

app.get('/download', (req, res) => {
  res.download(saveLoc, 'sgrid.css', () => {
    fs.unlink(saveLoc);
  });
});

app.listen(3030);