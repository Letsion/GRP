Vue.component("tab-done", {
  props: ["data"],
  methods: {
    saveCharacter() {
      if (this.data.sex === 0) {
        this.data.facialHair = 29;
        this.data.facialHairColor1 = 0;
      }

      if ("alt" in window) {
        alt.emit("creator:Done", this.data);
      }
    },
    discardCharacter() {
      if ("alt" in window) {
        alt.emit("creator:Cancel");
      }
    },
    importCharacter() {
      const characterJSON = this.$refs.textarea.value;
      let character;
      try {
        character = JSON.parse(characterJSON);
      } catch (err) {
        this.$refs.textarea.value = `INVALID CHARACTER JSON CODE. RESETTING...`;

        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }

        this.timeout = setTimeout(() => {
          this.$refs.textarea.value = JSON.stringify(this.data, null, "\t");
        }, 2500);
        return;
      }

      Object.keys(character).forEach((key) => {
        this.data[key] = character[key];
      });

      this.$root.$emit("updateCharacter");
      this.$root.$emit("resetSelection");
    },
    copyAll() {
      this.$refs.textarea.select();
      document.execCommand("copy");
    },
  },
  template: `
        <div class="options">
            <p>Abspeichern?</p>
            <div class="option">
                <button class="full" @click="saveCharacter" style="margin-bottom: 12px">Speichern</button>
                <button class="full danger" @click="discardCharacter">Abbrechen</button>
            </div>
        </div>
    `,
});
