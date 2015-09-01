import Handlebars from 'handlebars';

function Reader(text) {
  this.text = text;
  this.index = 0;
  this.state = null;
}

Reader.prototype.peek = function (count=1) {
  let start = this.index;
  return this.text.slice(start, start + count);
};

Reader.prototype.read = function (count=1) {
  let start = this.index;
  this.index = start + count;
  return this.text.slice(start, start + count);
};

Reader.prototype.has = function (str) {
  return this.text.indexOf(str, this.index) !== -1;
};

Reader.prototype.rest = function () {
  this.index = this.text.length;
  return this.text.slice(this.index);
};

Reader.prototype.until = function (str, inclusive=true) {
  let start = this.index;
  let end = this.text.indexOf(str, start);
  if (end === -1) {
    throw new Error('Cannot find "' + str + '"');
  }

  if (inclusive) {
    end += str.length;
  }

  this.index = end;
  return this.text.slice(start, end);
};

function AST(reader) {
  this.reader = reader;
  this.value = [];
}

AST.prototype.start = function (type) {
  this.currentType = type;
  this.buffer = [];
};

AST.prototype.finish = function () {
  this.end(this.currentType);
};

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
};

AST.prototype.readUntil = function (chr, inclusive=true) {
  this.push(this.reader.until(chr, inclusive));
};

AST.prototype.readWhitespace = function () {
  let chr = this.reader.peek();
  while (/\s/.test(chr)) {
    this.push(this.reader.read());
    chr = this.reader.peek();
  }
};

AST.prototype.push = function (string) {
  this.buffer.push(string);
};

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

      ast.readUntil('<', false);

      // Comments
      if (reader.peek(4) === '<!--') {
        ast.end('text');
        ast.start('comment');
        ast.readUntil('-->');
        ast.end('comment');
        ast.start('text');
      } else if (reader.peek() === '/') {
        ast.push(reader.read(2));
        ast.end('text');
        ast.start('tag');
      } else {
        ast.push(reader.read());
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

      if (reader.peek(2) === '/>') {
        ast.start('text');
        ast.readUntil('/>');
      } else if (reader.peek() === '>') {
        ast.start('text');
        ast.readUntil('>');
      } else {
        ast.start('attr-key');
      }
      break;
    case 'attr':
      ast.readWhitespace();
      ast.end('attr');
      if (reader.peek() === '>') {
        ast.start('text');
        ast.readUntil('>');
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

function highlightDirective(statement) {
  let nodes = [];

  let opening = '?';
  let closing = '?';
  switch (statement.type) {
  case 'SubExpression':
    opening = '(';
    closing = ')';
    break;
  case 'MustacheStatement':
    opening = '{{';
    closing = '}}';
    break;
  case 'BlockStatement':
    let whitespace = (new Array(statement.loc.start.column + 1)).join(' ');
    opening = `${whitespace}{{`;
    closing = `}}`;
    break;
  }

  nodes.push({
    type: 'text',
    value: opening
  });

  let path = statement.path.parts.join('.');
  let hasBlock = statement.program;
  let hasBlockParams = hasBlock && statement.program.blockParams;
  let hasParams = statement.params.length ||
                  statement.hash ||
                  hasBlockParams;

  if (statement.program) {
    nodes.push({
      type: 'hbs-directive',
      value: `#${path}`
    });

    if (hasParams) {
      nodes.push({
        type: 'text',
        value: ' '
      });
    }
  } else if (hasParams) {
    nodes.push({
      type: 'hbs-directive',
      value: path
    });

    nodes.push({
      type: 'text',
      value: ' '
    });
  } else {
    nodes.push({
      type: 'hbs-path',
      value: path
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

  if (hasBlockParams) {
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
    nodes.pop();
    nodes.push({
      type: 'text',
      value: '|'
    });
  }

  nodes.push({
    type: 'text',
    value: closing
  });

  if (hasBlock) {
    nodes.push({
      type: 'text',
      value: '\n'
    });

    nodes.push.apply(nodes, highlightProgram(statement.program));

    nodes.push({
      type: 'text',
      value: opening
    });

    nodes.push({
      type: 'hbs-directive',
      value: '/' + statement.path.parts.join('.')
    });

    nodes.push({
      type: 'text',
      value: '}}\n'
    });
  }

  return nodes;
}

function highlightMustache(statement) {
  let nodes = [];
  switch (statement.type) {
  case 'ContentStatement':
    nodes.push.apply(nodes, highlightHtml(statement));
    break;
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
  case 'SubExpression':
  case 'MustacheStatement':
  case 'BlockStatement':
    nodes.push.apply(nodes, highlightDirective(statement));
    break;
  case 'CommentStatement':
    let whitespace = new Array(statement.loc.start.column + 1).join(' ');
    nodes.push({
      type: 'text',
      value: whitespace
    });
    nodes.push({
      type: 'comment',
      value: `{{! ${statement.value} }}`
    });
    nodes.push({
      type: 'text',
      value: '\n'
    });
    break;
  default:
    console.log(statement.type);
    break;
  }
  return nodes;
}

function highlightProgram(program) {
  var nodes = [];
  program.body.forEach(function (statement) {
    nodes.push.apply(nodes, highlightMustache(statement));
  });
  return nodes;
}

export default function (string) {
  return highlightProgram(Handlebars.parse(string));
}
