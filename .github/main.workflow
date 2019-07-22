workflow "Run tests" {
  on = "push"
  resolves = ["GitHub Action for npm"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
  env = {
    NODE_ENV = "development"
  }
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "test"
}
