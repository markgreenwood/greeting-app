var assert = require('chai').assert;
var greet = require('../lib/greet');
var cp = require('child_process');
var emoji = require('node-emoji');

describe('greet function', function() {

  it('greets with name if name supplied', function() {
    var actual = greet('Penny');
    var expected = 'Hello, Penny';
    assert.equal(actual, expected);
  });

  it('greets with hostile greeting if type = "hostile"', function() {
    var actual = greet('Kripke', { type: 'hostile' });
    var expected = 'Hello, Kripke, you scumbag low-life ' + emoji.get('rage');
    assert.equal(actual, expected);
  });

  it('greets with hot beverage if type = "hospitable"', function() {
    var actual = greet('Leonard', { type: 'hospitable' });
    var expected = 'Hello, Leonard, would you like a hot beverage? ' + emoji.get('coffee');
    assert.equal(actual, expected);
  });

  it('greets with "friend" if no name is supplied', function() {
    var actual = greet();
    var expected = 'Hello, friend';
    assert.equal(actual, expected);
  });

});

describe('cmd-line-greeter', function() {

  it('prints greeting with name to terminal if invoked with name as an argument', function() {
    var name = 'Penny';
    var actual = cp.execSync('node ./lib/greet.js ' + name);
    assert.equal(actual.toString().trim(), 'Hello, ' + name); 
  });

  it('prints a hostile greeting to terminal if invoked with name and --type=hostile', function() {
    var name = 'Kripke';
    var actual = cp.execSync('node ./lib/greet.js ' + name + ' --type=hostile');
    assert.equal(actual.toString().trim(), 'Hello, ' + name + ', you scumbag low-life ' + emoji.get('rage'));
  });

  it('prints a hospitable greeting to terminal if invoked with name and --type=hospitable', function() {
    var name = 'Leonard';
    var actual = cp.execSync('node ./lib/greet.js ' + name + ' --type=hospitable');
    assert.equal(actual.toString().trim(), 'Hello, ' + name + ', would you like a hot beverage? ' + emoji.get('coffee'));
  });

  it('prints greeting with friend to terminal, asks for name, and responds if invoked with no argument', function(done) {
    // Major thanks to Marty Nelson for help constructing and debugging this test!!!
    const child = cp.exec('node ./lib/greet.js');
    var step = 0;
    child.stdout.on('data', (actual) => {
      if (step == 0) {
        assert.equal(actual, 'Hello, friend. What\'s your name?');
        step++;   
        child.stdin.write('Tester\n');
      }
      else {
        assert.equal(actual, 'Hello, Tester. Nice to meet you!\n');
        done();        
      }
    });
  });
});