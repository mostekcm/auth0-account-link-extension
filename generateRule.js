import crypto from 'crypto';
import config from './lib/config';
import fs from 'fs';

const templatePath = './rules/link.js';
const ruleStartToken = "@@RULE_START@@";
const newline = '\n';

//const hashApiKey = () => crypto.createHmac('sha256', config('PUBLIC_WT_URL'))
//      .update(config('EXTENSION_SECRET'))
//      .digest('hex');

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, tpl) => {
      if (err) {
        reject(err);
      }

      resolve(tpl);
    });
  });
};

const replaceTokens = (tokens, template) => (
  Object.entries(tokens).reduce((tpl, [key, value]) => {
    return tpl.replace(`@@${key}@@`, value);
  }, template.toString())
);

const trimComments = (template) => {
  const fnStartPosition = template.indexOf(newline, template.indexOf(ruleStartToken));

  return template.substring(fnStartPosition + newline.length);
};

export default ({username = 'Unknown', extensionURL = ''}) => {
  const tokens = {
    updateTime: new Date().toISOString(),
    extensionURL: extensionURL.replace(/\/$/g, ''),
    username
  };

  return readFile(templatePath)
    .then(trimComments)
    .then(template => replaceTokens(tokens, template));
};
