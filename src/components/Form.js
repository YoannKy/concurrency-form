const DEFAULT_INTERVAL = 3000;
const CHEAP_VALUE = "cheap";
const FAST_VALUE = "fast";
const RELIABLE_VALUE = "reliable";
const PENDING_STATUS = "pending";

export default {
  data() {
    return {
      advantages: [{
        name: "fast",
        selected: false
      },{
        name: "reliable",
        selected: false
      },{
        name: "cheap",
        selected: false
      }],
      histories: [],
      promises: [],
      initialState: {
        fast: false,
        reliable: false,
        cheap: false
      },
      currentState: null
    };
  },
  mounted() {
    setInterval(() => {
      this.promises.forEach((promise, index) => {
        if (!this.histories[index]) {
          this.histories.push({
            index,
            cheap: PENDING_STATUS,
            fast: PENDING_STATUS,
            reliable: PENDING_STATUS 
          });
        }

        promise.then(({cheap, fast, reliable}) => {
          this.histories[index] = ({
            index,
            cheap,
            fast,
            reliable
          });
        })
      });

      const lastPromise = this.promises[this.promises.length - 1];

      if (lastPromise) {
        lastPromise.then(({cheap, fast, reliable}) => {
          this.advantages = this.advantages.map(advantage => {
            switch (advantage.name) {
              case CHEAP_VALUE:
                advantage.selected = cheap;
                break;
              case FAST_VALUE:
                advantage.selected = fast;
                break;
              case RELIABLE_VALUE:
                advantage.selected = reliable;
                break;
            }
            return advantage;
          });
        })
      }
    }, DEFAULT_INTERVAL);
  },
  methods: {
    /**
     * @description Handle click on checkbox, prevent check by default and wrap its state in a promise
     * @param {Event} event
     */
    addToQueue(event) {
      event.preventDefault();

      const { target } = event;
      let state;
      if (this.currentState) {
        state = {
          ...this.initialState,
          ...this.currentState,
          [target.name]: !this.currentState[target.name]
        };
      } else {
        state = {
          ...this.initialState,
          [target.name]: target.checked
        };
      }

      if (Object.keys(state).every(advantage => state[advantage])) {
        const randomIndex = Math.floor(Math.random() * this.advantages.length);
        const advantage = this.advantages.find((element, index) => index === randomIndex);
        state[advantage.name] = false;
      }

      this.currentState = {...state};

      const promise = new Promise(resolve => {
        setTimeout(resolve, this.generateRandomNumber(), state);
      });

      this.promises.push(promise);
    },
    /**
     * @description Generate a random number
     * @return {number}
     */
     generateRandomNumber() {
      const min = 1000;
      const max = 10000;

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
