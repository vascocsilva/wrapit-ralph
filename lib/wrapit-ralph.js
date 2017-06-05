'use babel';

import WrapitRalphView from './wrapit-ralph-view';
import { CompositeDisposable } from 'atom';

export default {

  wrapitRalphView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.wrapitRalphView = new WrapitRalphView(state.wrapitRalphViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.wrapitRalphView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'wrapit-ralph:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wrapitRalphView.destroy();
  },

  serialize() {
    return {
      wrapitRalphViewState: this.wrapitRalphView.serialize()
    };
  },

  toggle() {
    let editor = atom.workspace.getActiveTextEditor();

    if (editor) {
      let selection = editor.getSelectedText();
      let j = 0, newStr = '', newLine = false;
      const spaces = selection.match(/^([\ ]*)/)[0];


      for (let i = 0; i < selection.length; i += 1) {
        if (j < 80) {
          if (!(newLine && selection[i] === ' ')) {
            newStr += selection[i];
            j += 1;
            newLine = false;
          }
        } else {
          newStr += '\n';
          newLine = true;

          if (spaces) {
            newStr += spaces;
          }

          if (selection[i] !== ' ') {
            newStr += selection[i];
            newLine = false;
          }

          j = 0;
        }
      }

      editor.deleteToBeginningOfWord();
      editor.insertText(newStr);
    }
  }

};
