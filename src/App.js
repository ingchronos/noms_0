import logo from "./logo.svg";
import "./App.css";
import Body from "./components/Body";
import NOM from "./NOM-015.js";
import APENDICES from "./NOM-016A.js";
import React, { Component, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
var lifeTree = [];
var str = [];
str = NOM;
//----------DOF--------------------------------------
var dofStart = [];
var prefStart = [];

var titleNOMStart = [];
var headNOM = [];
var headerNOM = [];

str = str.replace(/ {2,}/g, " ");
str = str.replace(/\t/g, " ");

dofStart = NOM.search("\nDOF") + 1;
console.log(dofStart);

titleNOMStart = NOM.search("\nNORMA OFICIAL");
headerNOM = NOM.substring(dofStart, titleNOMStart);

var dofEnd = headerNOM.search("\n") + 1;

lifeTree.push({
  name: NOM.substring(dofStart, dofEnd), //DOF 12 12 12
  id: 10000,
  children: [{ name: NOM.substring(dofEnd, titleNOMStart), id: 10001 }], //AL MARGEN...CONSIDERANDO...
});

//--------------titulo - children[prefacio.children[SSA.children[Secretaria del Estado]]]

var titleNOMEnd = str.search("\nPREFACIO") + 1;
var indiceStart = str.search("\nINDICE");
var prefacio = str.substring(titleNOMEnd, indiceStart);

//NORMA OFICIAL MEXICANA....
lifeTree.push({ name: NOM.substring(titleNOMStart, titleNOMEnd), id: 11000 });
console.log("NOM SPLIT");
console.log(lifeTree[1].name.split("\n"));

//PREFACIO Dependecias.....
console.log("Prefacio");
console.log(prefacio.split("\n"));
prefacio = prefacio.split("\n");
lifeTree.push({
  name: prefacio[0] + "\n" + prefacio[1],
  id: 12000,
  children: [],
});

const indexPr = lifeTree.findIndex(
  (x) => x.name == prefacio[0] + "\n" + prefacio[1]
);

prefacio.map((dependency, i) => {
  if (i > 1) {
    if (dependency == dependency.toUpperCase()) {
      lifeTree[indexPr].children.push({
        name: dependency,
        id: 12000 + i,
        children: [],
      });
    } else {
      lifeTree[indexPr].children[
        lifeTree[indexPr].children.length - 1
      ].children.push({
        name: dependency,
        id: 12000 + i,
      });
    }
  }
});

//----------INDICE---------------------

//FIND INDICE, FIND \N FIND NEXT WITH THE SAME VALUE (THIS IS THE INDEX_END)

var sndStep = str.substring(indiceStart + 1, indiceStart + 30).search("\n");
var trdStep = str.substring(
  indiceStart + sndStep + 1,
  indiceStart + sndStep + 10
); //0. Introducc
var indiceEnd =
  str.substring(indiceStart + sndStep + 10, str.length).search(trdStep) +
  indiceStart +
  sndStep +
  10;

var indiceContent = str.substring(indiceStart + sndStep + 1, indiceEnd);

console.log("INDICE");
console.log(str.substring(indiceStart, indiceEnd)); //INDICE 1 2 3 4....
var indice = str.substring(indiceStart + 1, indiceEnd);
indice = indice.split("\n");
lifeTree.push({
  name: indice[0],
  id: 13000,
  children: [],
});

//--------------------------------------------------

str = str.substring(indiceEnd - 1, str.length);

var regexp = RegExp(/\n[0-9]+\./, "g");
var matches = str.matchAll(regexp);
var indexes = [];
var strNumerals = [];
var re = / \b/g;
var match2 = 0;

for (const match of matches) {
  const pedazo = str.substring(match.index, match.index + 30);
  //console.log(pedazo);
  match2 = 0;

  match2 = re.exec(pedazo);
  if (match2) {
    indexes.push([match.index + 1, match.index + Number(match2.index) + 1]);
    //console.log("match.index, match.index + match2.index");
    //console.log(str.substring(match.index, match.index + match2.index + 1));
  }

  re.lastIndex = 0;
}

for (let i = 0; i < indexes.length; i++) {
  const articuloN = indexes[i];
  strNumerals[i] = str.substring(articuloN[0], articuloN[1]); //array de titulos de los articulos en texto
}
console.log(indexes);
console.log(strNumerals);

strNumerals = strNumerals.map((numeral, index) => {
  var numarray = numeral.split(".");
  //var numarray = strNumerals[70].split(".");
  numarray = numarray.map((value) => parseInt(value, 10));

  return numarray;
  console.log("numeral");
  console.log(numeral);
});

//--------------------------------REMOVE NAN'S
/* strNumerals = strNumerals.map((numeral, index) => {
  numeral = numeral.filter(function (el) {
    return !Number.isNaN(el);
  });
  return numeral;
}); */

function removeNaN(arr) {
  var arr = arr.map((numeral, index) => {
    numeral = numeral.filter(function (el) {
      return !Number.isNaN(el);
    });
    return numeral;
  });
  return arr;
}

strNumerals = removeNaN(strNumerals);

console.log(strNumerals);

var letrasArticulos = strNumerals;
var content = [];
for (let m = 0; m < letrasArticulos.length; m++) {
  let articuloDespues = 0;
  if (m == letrasArticulos.length - 1) {
    articuloDespues = str.length;
  } else {
    articuloDespues = indexes[m + 1][0];
  }
  let articuloAntes = 0;
  articuloAntes = indexes[m][1];
  const nombre = letrasArticulos[m];
  let antesDeTitulo = 0;

  let letras = str.substring(articuloAntes, articuloDespues);

  content.push([nombre, letras]);
}
console.log("content");
console.log(content);

console.log("strNumerals");
console.log(strNumerals);

var auxiliar = 0;
var first_time = true;
var idxRoot = lifeTree.length;

strNumerals = strNumerals.map((lvl, index) => {
  //[5,11,2]
  let level = lvl;
  let idx = index;
  if (lvl.length === 1) {
    lifeTree.push({
      id: index,
      name: content[index][1],
      num: level.join("."),
    }); //create primary objects 1,2,3,4,5,6
    idxRoot = idxRoot + 1;
  }
  if (lvl.length === 2) {
    if (lifeTree[idxRoot - 1].children) {
      lifeTree[idxRoot - 1].children.push({
        id: index,
        name: content[index][1],
        num: level.join("."),
      });
    } else {
      lifeTree[idxRoot - 1].children = [
        { id: index, name: content[index][1], num: level.join(".") },
      ];
    }
  }

  if (lvl.length === 3) {
    if (lifeTree[idxRoot - 1].children[level[1] - 1].children) {
      lifeTree[idxRoot - 1].children[level[1] - 1].children.push({
        id: index,
        name: content[index][1],
        num: level.join("."),
      });
    } else {
      lifeTree[idxRoot - 1].children[level[1] - 1].children = [
        { id: index, name: content[index][1], num: level.join(".") },
      ];
    }
  }

  if (lvl.length === 4) {
    if (
      lifeTree[idxRoot - 1].children[level[1] - 1].children[level[2] - 1]
        .children
    ) {
      lifeTree[idxRoot - 1].children[level[1] - 1].children[
        level[2] - 1
      ].children.push({
        id: index,
        name: content[index][1],
        num: level.join("."),
      });
    } else {
      lifeTree[idxRoot - 1].children[level[1] - 1].children[
        level[2] - 1
      ].children = [
        { id: index, name: content[index][1], num: level.join(".") },
      ];
    }
  }

  if (lvl.length === 5) {
    if (
      lifeTree[idxRoot - 1].children[level[1] - 1].children[level[2] - 1]
        .children[level[3] - 1].children
    ) {
      lifeTree[idxRoot - 1].children[level[1] - 1].children[
        level[2] - 1
      ].children[level[3] - 1].children.push({
        id: index,
        name: content[index][1],
        num: level.join("."),
      });
    } else {
      lifeTree[idxRoot - 1].children[level[1] - 1].children[
        level[2] - 1
      ].children[level[3] - 1].children = [
        { id: index, name: content[index][1], num: level.join(".") },
      ];
    }
  }

  if (lvl.length === 6) {
    if (
      lifeTree[idxRoot - 1].children[level[1] - 1].children[level[2] - 1]
        .children[level[3] - 1].children[level[4] - 1].children
    ) {
      lifeTree[idxRoot - 1].children[level[1] - 1].children[
        level[2] - 1
      ].children[level[3] - 1].children[level[4] - 1].children.push({
        id: index,
        name: content[index][1],
        num: level.join("."),
      });
    } else {
      lifeTree[idxRoot - 1].children[level[1] - 1].children[
        level[2] - 1
      ].children[level[3] - 1].children[level[4] - 1].children = [
        { id: index, name: content[index][1], num: level.join(".") },
      ];
    }
  }
});
console.log("lifeTree");
console.log(lifeTree);

str = APENDICES;

const regexpA = RegExp("\nApéndice", "g");
const matchesA = str.matchAll(regexpA);
var indexesA = [];
var strNumeralsA = [];
const reA = /\n[A-Z]+\.[0-9]{1}/g;

for (const match of matchesA) {
  const pedazo = str.substring(match.index + 1, match.index + 500);
  //console.log(pedazo);
  match2 = 0;

  //match2 = reA.exec(pedazo);
  match2 = pedazo.search(reA);
  if (match2) {
    indexesA.push([match.index, match.index + Number(match2) + 1]);
    //console.log("match.index, match.index + match2.index");
    //console.log(str.substring(match.index, match.index + match2 + 1)); //apendice A: rayos X, apendice B: consultorios,...
  }

  //re.lastIndex = 0;
}
for (let i = 0; i < indexesA.length; i++) {
  const articuloN = indexesA[i];
  strNumeralsA[i] = str.substring(articuloN[0], articuloN[1]); //array de titulos de los articulos en texto
}
console.log("APENDICITIS");
console.log(indexesA);
console.log(strNumeralsA);

letrasArticulos = strNumeralsA;
var contentA = [];
for (let m = 0; m < letrasArticulos.length; m++) {
  let articuloDespues = 0;
  if (m == letrasArticulos.length - 1) {
    articuloDespues = str.length;
  } else {
    articuloDespues = indexesA[m + 1][0];
  }
  let articuloAntes = 0;
  articuloAntes = indexesA[m][1];
  const nombre = letrasArticulos[m];
  let antesDeTitulo = 0;

  let letras = str.substring(articuloAntes, articuloDespues);

  contentA.push([nombre, letras]);
}
console.log("contentA"); //["apendice A","Contenido apendice A"]
console.log(contentA);

//numerales dentro de los articulos -------------------------------------------------------

const indexesC = [];
var strA = [];
const regexp3 = /\n[A-Z]{1}\.[0-9]{1}|\n[A-Z]{2}\.[0-9]{1}/g;
var strNumeralsAi = [];

const re3 = / \b/g;

matches = str.matchAll(regexp3);
for (const match of matches) {
  const pedazo = str.substring(match.index, match.index + 30);
  //console.log(pedazo);
  match2 = 0;
  match2 = re3.exec(pedazo);
  if (match2) {
    indexesC.push([match.index + 1, match.index + Number(match2.index)]);
    strNumeralsAi.push(
      str.substring(match.index + 1, match.index + Number(match2.index))
    );
    //console.log("match.index, match.index + match2.index");
    //console.log(strA.substring(match.index, match.index + match2.index + 1));
  }
  re3.lastIndex = 0;
}

console.log(indexesC);
console.log("strNumeralsAi");
console.log(strNumeralsAi);
//----------------------------------------------------------------------------

function getNumeralsForApendix(strFn, root, apendiceA) {
  const regexpFunction = /\n[A-Z]+\.[0-9]|\n[0-9]+\./g;
  var strNumeralsFn = [];
  var indexesFn = [];
  const reFn = / \b/g;

  matches = strFn.matchAll(regexpFunction);
  for (const match of matches) {
    const pedazo = strFn.substring(match.index, match.index + 30);
    //console.log(pedazo);
    match2 = 0;
    //match2 = reFn.exec(pedazo);
    match2 = pedazo.search(reFn);
    if (match2) {
      indexesFn.push([match.index + 1, match.index + Number(match2)]);
      strNumeralsFn.push(
        strFn.substring(match.index + 1, match.index + Number(match2))
      );
      //console.log("match.index, match.index + match2.index");
      //console.log(strA.substring(match.index, match.index + match2.index + 1));
    }
    re3.lastIndex = 0;
  }

  // get the text

  letrasArticulos = strNumeralsFn;
  var contentFn = [];
  for (let m = 0; m < letrasArticulos.length; m++) {
    let articuloDespues = 0;
    if (m == letrasArticulos.length - 1) {
      articuloDespues = strFn.length;
    } else {
      articuloDespues = indexesFn[m + 1][0];
    }
    let articuloAntes = 0;
    articuloAntes = indexesFn[m][1];
    const nombre = letrasArticulos[m];
    let antesDeTitulo = 0;

    let letras = strFn.substring(articuloAntes, articuloDespues);

    contentFn.push([nombre, letras]);
  }

  //split the text

  strNumeralsFn = strNumeralsFn.map((numeral, index) => {
    var numarray = numeral.split(".");
    //var numarray = strNumeralsAi[70].split(".");
    numarray = numarray.map((value) => parseInt(value, 10));

    return numarray;
    console.log("numeral");
    console.log(numeral);
  });

  //delete NaNs
  strNumeralsFn = strNumeralsFn.map((numeral, index) => {
    numeral = numeral.filter(function (el) {
      return !Number.isNaN(el);
    });
    return numeral;
  });
  return [strNumeralsFn, contentFn];
}

function getNumeralsForApendixB(strNumeralsFn, contentFn, root, apendiceA) {
  var idxRoot = 0;
  strNumeralsFn = strNumeralsFn.map((lvl, index) => {
    //[5,11,2]

    let level = lvl;
    let idx = index;

    if (lvl.length === 1) {
      if (lifeTree[root].children[apendiceA].children) {
        lifeTree[root].children[apendiceA].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        }); //create primary objects 1,2,3,4,5,6
        idxRoot = idxRoot + 1;
      } else {
        lifeTree[root].children[apendiceA].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
        idxRoot = idxRoot + 1;
      }
    }
    if (lvl.length === 2) {
      if (lifeTree[root].children[apendiceA].children[idxRoot - 1].children) {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 3) {
      if (
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children
      ) {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 4) {
      if (
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children
      ) {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 5) {
      if (
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children[level[3] - 1].children
      ) {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children[level[3] - 1].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children[level[3] - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 6) {
      if (
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children[level[3] - 1].children[level[4] - 1]
          .children
      ) {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children[level[3] - 1].children[
          level[4] - 1
        ].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[apendiceA].children[idxRoot - 1].children[
          level[1] - 1
        ].children[level[2] - 1].children[level[3] - 1].children[
          level[4] - 1
        ].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }
  });
}

function getNumeralsForIndexB(strNumeralsFn, contentFn, root, apendiceA) {
  var idxRoot = 0;
  strNumeralsFn = strNumeralsFn.map((lvl, index) => {
    //[5,11,2]

    let level = lvl;
    let idx = index;

    if (lvl.length === 1) {
      if (lifeTree[root].children) {
        lifeTree[root].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        }); //create primary objects 1,2,3,4,5,6
        idxRoot = idxRoot + 1;
      } else {
        lifeTree[root].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
        idxRoot = idxRoot + 1;
      }
    }
    if (lvl.length === 2) {
      if (lifeTree[root].children[idxRoot - 1].children) {
        lifeTree[root].children[idxRoot - 1].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[idxRoot - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 3) {
      if (
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children
      ) {
        lifeTree[root].children[idxRoot - 1].children[
          level[1] - 1
        ].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 4) {
      if (
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children
      ) {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 5) {
      if (
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children[level[3] - 1].children
      ) {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children[level[3] - 1].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children[level[3] - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }

    if (lvl.length === 6) {
      if (
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children[level[3] - 1].children[level[4] - 1].children
      ) {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children[level[3] - 1].children[level[4] - 1].children.push({
          id: (index + 1) * 200 + apendiceA,
          name: contentFn[index][1],
          num: level.join("."),
        });
      } else {
        lifeTree[root].children[idxRoot - 1].children[level[1] - 1].children[
          level[2] - 1
        ].children[level[3] - 1].children[level[4] - 1].children = [
          {
            id: (index + 1) * 200 + apendiceA,
            name: contentFn[index][1],
            num: level.join("."),
          },
        ];
      }
    }
  });
}

// CLOSE FNC OF GET THE NUMERALS FOR APENDIX------------------------------------------------------------

//

var contentC = [];

letrasArticulos = strNumeralsAi;
//var contentA = [];
for (let m = 0; m < letrasArticulos.length; m++) {
  let articuloDespues = 0;
  if (m == letrasArticulos.length - 1) {
    articuloDespues = str.length;
  } else {
    articuloDespues = indexesC[m + 1][0];
  }
  let articuloAntes = 0;
  articuloAntes = indexesC[m][1];
  const nombre = letrasArticulos[m];
  let antesDeTitulo = 0;

  let letras = str.substring(articuloAntes, articuloDespues);

  contentC.push([nombre, letras]);
}
console.log("contentC"); //["apendice A","Contenido apendice A"]
console.log(contentC);

strNumeralsAi = strNumeralsAi.map((numeral, index) => {
  var numarray = numeral.split(".");
  //var numarray = strNumeralsAi[70].split(".");
  numarray = numarray.map((value) => parseInt(value, 10));

  return numarray;
  console.log("numeral");
  console.log(numeral);
});

if (str.includes("Normativo")) {
  lifeTree.push({ name: "Apéndices Normativos", id: 8000, children: [] });
}
if (str.includes("Informativo")) {
  lifeTree.push({ name: "Apéndices Informativos", id: 9000, children: [] });
}
//--------------------------------REMOVE NAN'S
strNumeralsAi = strNumeralsAi.map((numeral, index) => {
  numeral = numeral.filter(function (el) {
    return !Number.isNaN(el);
  });
  return numeral;
});
console.log("strNumeralsAi");
console.log(strNumeralsAi);
const indexN = lifeTree.findIndex((x) => x.name === "Apéndices Normativos");
const indexI = lifeTree.findIndex((x) => x.name === "Apéndices Informativos");

const contentAA = contentA.map((apendix, index) => {
  if (apendix[0].includes("Normativo")) {
    lifeTree[indexN].children.push({
      name: apendix[0],
      id: index + 1 + 100,
      num: "-",
    });
    const [strNFn, cntFn] = getNumeralsForApendix(apendix[1], indexN, index);
    getNumeralsForApendixB(strNFn, cntFn, indexN, index);
  }

  if (apendix[0].includes("Informativo")) {
    lifeTree[indexI].children.push({
      name: apendix[0],
      id: index + 1 + 100,
      num: "-",
    });
    index = 0;
    const [strNFn, cntFn] = getNumeralsForApendix(apendix[1], indexI, index);
    getNumeralsForApendixB(strNFn, cntFn, indexI, index);
  }
});

const textoo = contentA[0][1];

console.log(contentA);

//remark titles in root -------------------------------

lifeTree.map((title, index) => {
  let strAux = " ";
  title.name.split("\n").map((str, renglon) => {
    if (renglon === 0) {
      title.rootTitle = str;
    } else {
      strAux = strAux.concat(str);
    }
  });
  title.name = strAux;
});

lifeTree[1].name = NOM.substring(titleNOMStart, titleNOMEnd);
const indexIn = lifeTree.findIndex((x) => x.rootTitle === indice[0]);

const [strNFnB, cntFnA] = getNumeralsForApendix(indiceContent, indexIn, 0);
getNumeralsForIndexB(strNFnB, cntFnA, indexIn, 0);

function searchRecursive(data, id) {
  let found = data.find((d) => d.id === id);
  if (!found) {
    let i = 0;
    while (!found && i < data.length) {
      if (data[i].children && data[i].children.length) {
        found = searchRecursive(data[i].children, id);
      }
      i++;
    }
  }
  return found;
}

var allIDs = [];

function asignID(life) {
  life.map((item) => {
    item.id = uuidv4();
    allIDs.push(item.id);
    if (item.children) {
      asignID(item.children);
    }
  });
  return life;
}

asignID(lifeTree);

function asignAnt(life) {
  life.map((item) => {
    item.key = item.id;
    item.title = item.name;
    if (item.children) {
      asignID(item.children);
    }
  });
  return life;
}

const antTree = asignAnt(lifeTree);
export { antTree };

/* function IDtoString(life) {
  life.map((item) => {
    if (isNaN(item.id)) {
    } else {
      item.id = item.id.toString(10);
    }
    if (item.children) {
      IDtoString(item.children);
    }
  });
  return life;
}

IDtoString(lifeTree); */
console.log("lifeTree");
console.log(lifeTree);

function App() {
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchResults, setSearchResults] = useState("");
  const [numSearch, setNumSearch] = useState(0);
  const [idSearched, setIdSearched] = useState("");

  const expandAll = (clickazo) => {
    if (clickazo === 1) {
      setIdSearched(allIDs);
    }
    if (clickazo === 0) {
      setIdSearched(["1"]);
    }
    //console.log("IdSearched");
    //console.log(idSearched);
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    var numRef = 0;
    var arrIDs = [];
    var parent = [];
    var flag = false;
    function recursiveSearch(arr, value) {
      arr.map((item, i) => {
        if (item.name) {
          if (item.name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
            numRef = numRef + 1;
            item.searched = numRef;
            arrIDs.push(parent);
            arrIDs = arrIDs.filter((item, index) => {
              return arrIDs.indexOf(item) === index;
            });
            setIdSearched(arrIDs);
          } else {
            item.searched = null;
          }
        }
        if (item.rootTitle) {
          if (item.rootTitle.toLowerCase().indexOf(value.toLowerCase()) != -1) {
            numRef = numRef + 1;
            item.searched = numRef;
            arrIDs.push(item.id);
            arrIDs = arrIDs.filter((item, index) => {
              return arrIDs.indexOf(item) === index;
            });
            setIdSearched(arrIDs);
          } else {
            item.searched = null;
          }
        }
        if (item.children) {
          parent = item.id; //is has a child, save the id of the parent to open if there is a result in child
          flag = true;
          recursiveSearch(item.children, value);
        }
      });
    }
    const searchLifeTree = lifeTree;
    if (searchTerm === null) {
      setSearchTerm(null);
      setIdSearched("");
    } else {
      recursiveSearch(searchLifeTree, searchTerm);
    }
    console.log("searchTerm");
    console.log(searchTerm);

    setSearchResults(searchLifeTree);
    setNumSearch(numRef);
  };

  const [activeStep, setActiveStep] = React.useState(1);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  var toggleBtn = false;

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  console.log("activeStep");
  console.log(activeStep);
  return (
    <div className="App">
      <Body
        treeData={lifeTree}
        searchKeyword={searchHandler}
        termS={searchTerm}
        numResults={searchTerm === "" ? null : numSearch}
        atras={handleBack}
        adelante={handleNext}
        step={activeStep}
        expandedArr={allIDs}
        //expandedArr={idSearched}
        expandA={expandAll}
        btnExtA={toggleBtn}
      />
    </div>
  );
}

export default App;
