const packagePromptList = [
  {
    name: "author",
    message: "input author name: ",
    type: "input",
    validate: function (input) {
      const done = this.async();
      setTimeout(function () {
        // 校验是否为空，是否是字符串
        if (!input.trim()) {
          done("You should provide a author name");
          return;
        }
      }, 500);
      //   const pattern = /^(http(s)?:\/\/([^\/]+?\/){2}|git@[^:]+:[^\/]+?\/).*?.git$/;
      //   if (!pattern.test(input.trim())) {
      //     done("The git remote url is validate");
      //     return;
      //   }
      done(null, true);
    },
  },
  {
    name: "description",
    message: "input project description: ",
    type: "input",
    validate: function (input) {
      const done = this.async();
      setTimeout(function () {
        // 校验是否为空，是否是字符串
        if (!input.trim()) {
          done("You should provide a project description");
          return;
        }
      }, 500);
      done(null, true);
    },
  },
];

module.exports = packagePromptList;
