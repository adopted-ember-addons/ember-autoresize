import Ember from 'ember';
import adobeBlank from './adobe-blank';
import { measureText } from "dom-ruler";

const { RSVP } = Ember;

var sheet;
function injectAdobeBlank() {
  if (sheet) {
    return sheet;
  }

  const element = document.createElement('style');
  const head = document.getElementsByTagName('head')[0] ||
               document.documentElement;
  element.type = 'text/css';
  head.appendChild(element);

  sheet = document.styleSheets[document.styleSheets.length - 1];
  if (sheet.insertRule) {
    sheet.insertRule(`@font-face { ${adobeBlank} }`, 0);
  } else {
    sheet.addRule('@font-face', adobeBlank, 0);
  }
}

const SPECIMEN = " !\"\\#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
var referenceSize;

function getReferenceSize() {
  if (referenceSize) {
    return referenceSize;
  }
  return referenceSize = measureText(SPECIMEN, {
    fontFamily: `"AdobeBlank"`
  }, {});
}

function checkIfFontLoaded(fontFamily, options, resolve, reject) {
  let blankSize = getReferenceSize();
  let size = measureText(SPECIMEN, {
    "font-family": `${fontFamily}, "AdobeBlank"`
  }, {});

  if (size.width !== blankSize.width ||
      size.height !== blankSize.height) {
    resolve();
  } else if (options.timeout <= 0) {
    reject();
  } else {
    setTimeout(function () {
      options.timeout -= 50;
      checkIfFontLoaded(fontFamily, options, resolve, reject);
    }, 50);
  }
}

var loadedFonts = {};
export default function (fontFamily, options={ timeout: 3000 }) {
  injectAdobeBlank();

  if (loadedFonts[fontFamily] == null) {
    loadedFonts[fontFamily] = new RSVP.Promise(function (resolve, reject) {
      checkIfFontLoaded(fontFamily, Ember.copy(options, true), resolve, reject);
    });
  }

  return loadedFonts[fontFamily];
}
