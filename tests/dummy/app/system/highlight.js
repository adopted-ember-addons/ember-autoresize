import Handlebars from 'handlebars';

function Reader(text) {
  this.text = text;
  this.index = 0;
  this.state = null;
}

Reader.prototype.peek = function (count=1) {
  let start = this.index;
  return this.text.slice(start, start + count);
}

Reader.prototype.read = function (count=1) {
  let start = this.index;
  this.index = start + count;
  return this.text.slice(start, start + count);
}

Reader.prototype.has = function (str) {
  return this.text.indexOf(str, this.index) !== -1;
}

Reader.prototype.rest = function () {
  this.index = this.text.length;
  return this.text.slice(this.index);
}

Reader.prototype.until = function (str, inclusive=true) {
  let start = this.index;
  let end = this.text.indexOf(str, start);
  if (end === -1) {
    console.log(this.text);
    throw new Error('no ending');
  }

  if (inclusive) {
    end += str.length;
  }

  this.index = end;
  return this.text.slice(start, end);
}

function AST(reader) {
  this.reader = reader;
  this.value = [];
}

AST.prototype.start = function (type) {
  this.currentType = type;
  this.buffer = [];
}

AST.prototype.finish = function () {
  this.end(this.currentType);
}

AST.prototype.end = function (type) {
  if (this.currentType === type) {
    this.original = this.reader.text;
    this.value.push({
      type,
      value: this.buffer.join('')
    });
    this.buffer = [];
    this.currentType = null;
  } else {
    throw new Error('unmatched end ' + this.currentType + ' != ' + type);
  }
}

AST.prototype.readUntil = function (chr, inclusive=true) {
  this.push(this.reader.until(chr, inclusive));
}

AST.prototype.readWhitespace = function () {
  let chr = this.reader.peek();
  while (chr === ' ' || chr === '\n') {
    this.push(this.reader.read());
    chr = this.reader.peek();
  }
}

AST.prototype.push = function (string) {
  this.buffer.push(string);
}

function highlightHtml(statement) {
  let reader = new Reader(statement.value);
  let ast = new AST(reader);

  ast.start('text');

  while (reader.peek()) {
    switch (ast.currentType) {
    case 'text':
      if (!reader.has('<')) {
        ast.push(reader.rest());
        break;
      }

      ast.readUntil('<', true);

      // Comments
      if (reader.peek(4) === '<!--') {
        ast.end('text');
        ast.start('comment');
        ast.push(reader.until('-->'));
        ast.end('comment');
      } else if (reader.peek() === '/') {
        ast.push(reader.read());
        ast.end('text');
        ast.start('tag');
      } else {
        ast.end('text');
        ast.start('tag');
      }
      break;
    case 'tag':
      while (reader.peek() !== ' ' &&
             reader.peek() !== '>') {
        ast.push(reader.read());
      }
      ast.readWhitespace();
      ast.end('tag');

      if (reader.peek(2) === '/>' ||
          reader.peek() === '>') {
        ast.start('text');
      } else {
        ast.start('attr-key');
      }
      break;
    case 'attr':
      ast.readWhitespace();
      ast.end('attr');
      if (reader.peek() === '>') {
        ast.start('text');
      } else {
        ast.start('attr-key');
      }
      break;
    case 'attr-key':
      ast.readUntil('=', false);
      ast.end('attr-key');

      ast.start('attr-assign');
      ast.readUntil('=', true);
      ast.end('attr-assign');

      ast.start('attr-value');
      break;
    case 'attr-value':
      let quote = reader.peek();
      if (quote === '"' || quote === "'") {
        ast.push(reader.read());
        if (reader.peek()) {
          ast.readUntil(quote);
        }
      } else {
        ast.readUntil(' ');
      }
      ast.end('attr-value');
      ast.start('attr');
      break;
    }
    ast.readWhitespace();
  }
  ast.finish();

  return ast.value;
}

function highlightMustache(statement) {
  let nodes = [];
  switch (statement.type) {
  case 'BooleanLiteral':
    nodes.push({
      type: 'hbs-bool',
      value: statement.value.toString()
    });
    break;
  case 'StringLiteral':
    nodes.push({
      type: 'hbs-string',
      value: '"' + statement.value + '"'
    });
    break;
  case 'NumberLiteral':
    nodes.push({
      type: 'hbs-number',
      value: statement.value.toString()
    });
    break;
  case 'PathExpression':
    nodes.push({
      type: 'hbs-path',
      value: statement.parts.join('.')
    });
    break;
  case 'MustacheStatement':
    nodes.push({
      type: 'text',
      value: '{{'
    });

    nodes.push({
      type: 'hbs-directive',
      value: statement.path.parts.join('')
    });

    if (statement.params.length ||
        statement.hash) {
      nodes.push({
        type: 'text',
        value: ' '
      });
    }

    if (statement.params.length) {
      statement.params.forEach(function (param) {
        nodes.push.apply(nodes, highlightMustache(param));
        nodes.push({
          type: 'text',
          value: ' '
        });
      });
      nodes.pop();
    }

    if (statement.hash) {
      statement.hash.pairs.forEach(function (pair) {
        nodes.push({
          type: 'hbs-key',
          value: pair.key
        });
        nodes.push({
          type: 'text',
          value: '='
        });
        nodes.push.apply(nodes, highlightMustache(pair.value));
        nodes.push({
          type: 'text',
          value: ' '
        });
      });
      nodes.pop();
    }

    nodes.push({
      type: 'text',
      value: '}}'
    });
    break;
  default:
    console.log(statement.type);
  }
  return nodes;
}

function highlightBlock(statement) {
  let nodes = [];
  nodes.push({
    type: 'text',
    value: '{{'
  });

  nodes.push({
    type: 'hbs-directive',
    value: '#' + statement.path.parts.join('')
  });

  if (statement.params.length ||
      statement.hash) {
    nodes.push({
      type: 'text',
      value: ' '
    });
  }

  if (statement.params.length) {
    statement.params.forEach(function (param) {
      nodes.push.apply(nodes, highlightMustache(param));
      nodes.push({
        type: 'text',
        value: ' '
      });
    });
    nodes.pop();
  }

  if (statement.hash) {
    statement.hash.pairs.forEach(function (pair) {
      nodes.push({
        type: 'hbs-key',
        value: pair.key
      });
      nodes.push({
        type: 'text',
        value: '='
      });
      nodes.push.apply(nodes, highlightMustache(pair.value));
      nodes.push({
        type: 'text',
        value: ' '
      });
    });
    nodes.pop();
  }

  if (statement.program.blockParams) {
    nodes.push({
      type: 'hbs-keyword',
      value: ' as '
    });
    nodes.push({
      type: 'text',
      value: '|'
    });
    statement.program.blockParams.forEach(function (param) {
      nodes.push({
        type: 'hbs-block-param',
        value: param
      });
      nodes.push({
        type: 'text',
        value: ' '
      });
    });
    nodes.push({
      type: 'text',
      value: '|'
    });
  }

  nodes.push({
    type: 'text',
    value: '}}'
  });

  nodes.push.apply(nodes, highlight(statement.program));

  nodes.push({
    type: 'text',
    value: '{{'
  });

  nodes.push({
    type: 'hbs-directive',
    value: '/' + statement.path.parts.join('')
  });

  nodes.push({
    type: 'text',
    value: '}}'
  });

  return nodes;
}

function highlight(program, text) {
  var text = [];
  program.body.forEach(function (statement) {
    switch (statement.type) {
    case 'ContentStatement':
      text.push.apply(text, highlightHtml(statement));
      break;
    case 'MustacheStatement':
      text.push.apply(text, highlightMustache(statement));
      break;
    case 'BlockStatement':
      text.push.apply(text, highlightBlock(statement));
      break;
    default:
      console.log(statement.type);
      break;
    }
  });
  return text;
}

export default function (string) {
  return highlight(Handlebars.parse(string));
}
