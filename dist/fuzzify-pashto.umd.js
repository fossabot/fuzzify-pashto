!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e=e||self).fuzzifyPashto={})}(this,function(e){"use strict";var r="ء-ٰٟ-ۓە",n="(^|[^"+r+"])",a={"اً":{range:"ان"},"ا":{range:"اآهع",plus:["اً"]},"آ":{range:"اآه"},"ٱ":{range:"اآه"},"ٲ":{range:"اآه"},"ٳ":{range:"اآه"},"ی":{range:"ېۍیيئےى"},"ي":{range:"ېۍیيئےى"},"ې":{range:"ېۍیيئےى"},"ۍ":{range:"ېۍیيئےى"},"ئ":{range:"ېۍیيئےى"},"ے":{range:"ېۍیيئےى"},"س":{range:"صسثڅ"},"ص":{range:"صسثڅ"},"ث":{range:"صسثڅ"},"څ":{range:"صسثڅ"},"ج":{range:"چجڅ"},"چ":{range:"چجڅ"},"ه":{range:"اهحہ"},"ۀ":{range:"اهحہ"},"ہ":{range:"اهحہ"},"ع":{range:"اوع",ignorable:!0},"و":{range:"وع",ignorable:!0},"ؤ":{range:"وع"},"ښ":{range:"ښخشخهحغ"},"غ":{range:"ښخشخهحغ"},"خ":{range:"ښخشخهحغ"},"ح":{range:"ښخشخهحغ"},"ش":{range:"شښ"},"ز":{range:"زضظذځژ"},"ض":{range:"زضظذځژ"},"ذ":{range:"زضظذځژ"},"ځ":{range:"زضظذځژ"},"ظ":{range:"زضظذځژ"},"ژ":{range:"زضظژذځږ"},"ر":{range:"رړڑڼ"},"ړ":{range:"رړڑڼ"},"ڑ":{range:"رړڑڼ"},"ت":{range:"طتټدډ"},"ټ":{range:"طتټدډ"},"ٹ":{range:"طتټدډ"},"ط":{range:"طتټدډ"},"د":{range:"طتټدډ"},"ډ":{range:"طتټدډ"},"ڈ":{range:"طتټدډ"},"نب":{range:"نبم"},"ن":{range:"نڼ",plus:["اً"]},"ڼ":{range:"نڼړڑ"},"ک":{range:"ګږکقگك"},"ګ":{range:"ګږکقگك"},"گ":{range:"ګږکقگك"},"ق":{range:"ګږکقگك"},"ږ":{range:"ګږکقگكژ"},"ب":{range:"فپب"},"پ":{range:"فپب"},"ف":{range:"فپب"}},g=Object.keys(a),t=new RegExp(g.reduce(function(e,r,n){return n===g.length-1?e+r:e+r+"|"},""),"g");e.fuzzifyPashto=function(e,g){void 0===g&&(g={});var o=e.trim().replace(/[#-.]|[[-^]|[?|{}]/g,"");g.allowSpacesInWords&&(o=o.replace(/ /g,""));var l=o.replace(t,function(e){var r=a[e],n="["+r.range+"]";r.plus&&(n="("+r.plus.reduce(function(e,r){return e+r+"|"},"")+n+")");return n+(r.ignorable?"?":"")+"ع?"+(g.allowSpacesInWords?" ?":"")}),c="string"===g.matchStart?"^":"anywhere"===g.matchStart?"":n,u="";g.matchWholeWordOnly&&("anywhere"===g.matchStart&&(c=n),u="(?!["+r+"])"),g.returnWholeWord&&!g.matchWholeWordOnly&&(u="["+r+"]*(?!["+r+"])","anywhere"===g.matchStart&&(c=n+"["+r+"]*"));var i="m"+(!1===g.globalMatch?"":"g");return new RegExp(""+c+l+u,i)},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=fuzzify-pashto.umd.js.map