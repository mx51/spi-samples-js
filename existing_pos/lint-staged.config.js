module.exports = {
  linters: {
    '**/*.+(js|md|ts|tsx|css|sass|yml|yaml|scss|json)': ['eslint --fix', 'prettier --write', 'git add'],
  },
};
