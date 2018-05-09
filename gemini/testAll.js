'use strict';

gemini.suite('loginPage', (suite) => {
  suite
    .setUrl('/first-time')
    .setCaptureElements('html')
    .capture('Исходное состояние', actions => actions.wait(2000))
    .capture('Поле с именем в фокусе', (actions) => {
      actions.focus('#name');
    })
    .capture('Заполнено имя', (actions) => {
      actions.sendKeys('pewpew');
    })
    .capture('Все поля заполнены', (actions) => {
      actions.focus('#email');
      actions.sendKeys('pewpew@pew.pew');
      actions.focus('#phone');
      actions.sendKeys('555-55-555');
    });
});
