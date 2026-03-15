export const state = new State();

class State {
  _cwd;

  get cwd() {
    return this._cwd;
  }

  set cwd(path) {
    this._cwd = path;
  }
}
