import * as alt from "alt-server";

alt.on("clothes:open", (ply) => {
  /**
   * @type {Player}
   */
  let player = ply;
});

alt.on("clothes:sync", (ply) => {
  /**
   * @type {Player}
   */
  let player = ply;
  //vorübergehend
  alt.setTimeout(() => {
    if (player.character.skin.sex === 1) {
      player.setClothes(1, 0, 0, 0);
      player.setClothes(3, 0, 0, 0);
      player.setClothes(4, 1, Math.random() * 5, 0);
      player.setClothes(6, 1, Math.random() * 5, 0);
      player.setClothes(8, 15, 0, 0);
      player.setClothes(11, 1, Math.random() * 5, 0);
    } else {
      player.setClothes(3, 0, 0, 0);
      player.setClothes(4, 0, Math.random() * 3, 0);
      player.setClothes(6, 5, Math.random() * 3, 0);
      player.setClothes(8, 15, 0, 0);
      player.setClothes(11, 0, Math.random() * 5, 0);
    }
  }, 100);
});
