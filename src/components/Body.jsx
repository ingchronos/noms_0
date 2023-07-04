import React, { Component, useState, useEffect, useRef } from "react";
import Tree from "./TreeGoogle";
import Grid from "@material-ui/core/Grid";
//import SearchBarButton from "./SearchBarButton";
var btnExtIB = 0;
export default function Body(props) {
  const toggleBtn = (value) => {
    btnExtIB = value;
    console.log("btnValue");
    console.log(btnExtIB);
  };
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          {/*           <SearchBarButton
            searchKeywordB={props.searchKeyword}
            numResultsInBody={props.numResults}
            atrasIB={props.atras}
            adelanteIB={props.adelante}
            stepIB={props.step}
            children={"hola"}
            expandB={props.expandA}
            toggleBtnC={toggleBtn}
            condicion={btnExtIB}
          /> */}
          <Tree
            data={props.treeData}
            stepIB={props.step}
            expandedArrIB={props.expandedArr}
            expandB={props.expandA}
            btnExt={btnExtIB}
            sx={{
              height: 240,
              flexGrow: 1,
              maxWidth: 100,
              position: "relative",
              px: 2,
            }}
          />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
}
