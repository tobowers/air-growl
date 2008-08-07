air = {
    Event: {
        COMPLETE: "mocked_complete"
    },
    Introspector: {
      Console:  {
          log: function (txt) {
              if ("console" in window) {
                  console.log(txt);
              }
          }
      },
      Screen: {
          mainScreen: {
              bounds: {
                  height: 1000,
                  width: 1000
              }
          }
      }
    }
};
