import { debounce } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { A } from '@ember/array';
import Route from '@ember/routing/route';
import { set, get } from '@ember/object';

export default Route.extend({
  model() {
    return {
      messages: A()
    };
  },

  afterModel(model, transition) {
    transition.send('respond');
  },

  sanitizeMessage(to, message) {
    return {
      to,
      text: htmlSafe(message.replace(/\n/g, '<br>'))
    };
  },

  position: -1,

  sayThing() {
    let model = this.modelFor(this.routeName);
    let i = get(this, 'position');
    set(this, 'position', i + 1);
    this.script = this.script || [
      'Hi there!',
      '<img src="http://cdn.inquisitr.com/wp-content/uploads/2014/07/tumblr_n8f4er3xus1ry46hlo1_r1_500.gif" />'
    ];
    get(model, 'messages').pushObject({
      from: 'tomster@emberjs.com',
      text: this.script[get(this, 'position')] || "Shhh! I'm eating"
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
      debounce(this, 'sayThing', 1000);
    }
  }
});
