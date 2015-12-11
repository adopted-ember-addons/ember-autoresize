import Ember from 'ember';
import adobeBlank from './adobe-blank';
import { measureText } from "dom-ruler";

const { RSVP, run } = Ember;

function injectAdobeBlankToElement(element) {
  var sheet;
  // Find the stylesheet object created by the DOM element
  for (var i = document.styleSheets.length - 1; i >= 0; i--) {
    let stylesheet = document.styleSheets[i];
    if (stylesheet.ownerNode === element) {
      sheet = stylesheet;
      break;
    }
  }

  if (!sheet) {
    return false;
  }

  if (sheet.insertRule) {
    sheet.insertRule(`@font-face { ${adobeBlank} }`, 0);
  } else {
    sheet.addRule('@font-face', adobeBlank, 0);
  }
  return true;
}

var _injectAdobeBlankPromise;
function injectAdobeBlank() {
  if (!_injectAdobeBlankPromise) {
    _injectAdobeBlankPromise = new RSVP.Promise(function(resolve) {
      const element = document.createElement('style');
      const parent = document.head || document.body;
      parent.appendChild(element);

      // Under memory pressure or in some other cases Chrome may not update
      // the document.styleSheets property synchronously. Here we poll to
      // be sure it has updated.
      //
      // See: https://github.com/tim-evans/ember-autoresize/issues/27
      //
      function checkInjection() {
        let injected = injectAdobeBlankToElement(element);
        if (injected) {
          run(null, resolve);
        } else {
          window.setTimeout(checkInjection, 0);
        }
      }
      checkInjection();
    });
  }
  return _injectAdobeBlankPromise;
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
  if (loadedFonts[fontFamily] == null) {
    loadedFonts[fontFamily] = injectAdobeBlank().then(function() {
      return new RSVP.Promise(function (resolve, reject) {
        checkIfFontLoaded(fontFamily, Ember.copy(options, true), run.bind(resolve), run.bind(reject));
      });
    });
  }

  return loadedFonts[fontFamily];
}
