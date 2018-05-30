var conf = require('../../nightwatch.conf.BASIC.js')

module.exports = {
  'Demo test todo-list': function (browser) {
    browser
      .url('http://localhost:8080')   // visit the url
      .waitForElementVisible('body') // wait for the body to be rendered
      .pause(1000)
      .setValue('#task', 'first  todo !')
      .click('#add')
      .setValue('#task', 'second  todo !')
      .click('#add')
      .assert.containsText('.total-items', '共有2个')

      .pause(1000)
      .click('tbody:first-child .edit-btn')
      .setValue('tbody:first-child form input', 'edit')
      .click('tbody:first-child .save-btn')
      .pause(2000)
      .assert.containsText('.total-items', '共有2个')
      .pause(1000)
      .click('tbody:first-child .delete-btn')
      .assert.containsText('.total-items', '共有1个')
      .end()
  }
}