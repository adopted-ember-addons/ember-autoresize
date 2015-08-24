import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Route.extend({
  model() {
    return {
      messages: Ember.A()
    };
  },

  sanitizeMessage(to, message) {
    return {
      to,
      text: Ember.String.htmlSafe(message.replace(/\n/g, '<br>'))
    };
  },

  script: [

  ],

  sayThing() {
    let model = this.modelFor(this.routeName);
    let controller = this.controllerFor(this.routeName);
    get(model, 'messages').pushObject({
      from: 'tomster@emberjs.com',
      text: 'Hi'
    });
  },

  actions: {
    sendChat(message) {
      let model = this.modelFor(this.routeName);
      let controller = this.controllerFor(this.routeName);
      get(model, 'messages').pushObject(
        this.sanitizeMessage('tomster@emberjs.com', message)
      );
      set(controller, 'msg', '');
      this.send('respond');
    },

    respond() {
      Ember.run.debounce(this, 'sayThing', 1000);
    }
  }
});
