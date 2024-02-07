import React from "react";

import { useState, useEffect } from "react";

import { dragAndDrop } from "../../src/react/index";

import reactLogo from "/reactjs-icon.svg";

function App() {
  const playingCardAssets = [
    "/cards/10_of_clubs.png",
    "/cards/jack_of_hearts.png",
    "/cards/queen_of_spades.png",
    "/cards/king_of_diamonds.png",
    "/cards/ace_of_clubs.png",
  ];

  const [values, setValues] = useState(playingCardAssets);

  const playingCards = values.map((card: string) => (
    <li className="item" key={card}>
      <img src={card} />
    </li>
  ));

  useEffect(() => {
    const el = document.getElementById("playing_cards_react_1");

    if (!(el instanceof HTMLElement)) return;

    dragAndDrop({
      parent: el,
      values: [values, setValues],
    });
  });

  return (
    <>
      <div className="logo">
        <img src={reactLogo} alt="React Logo" />
      </div>
      <div className="content">
        <h3>#react_1</h3>
        <h4>
          Init parent by passing in the parent elmeent directly to `dragAndDrop`
          function.
        </h4>
        <ul id="react_1">{playingCards}</ul>
        <div className="divider"></div>
        <h3>#react_2</h3>
        <h4>
          Init parent by passing in a ref of the parent element to `dragAndDrop`
        </h4>
        <ul id="react_2">{playingCards}</ul>
      </div>
    </>
  );
}

export default App;
