namespace SpriteKind {
    export const UI = SpriteKind.create()
}
controller.player1.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    mainMenu.updateSelection(-1);
})
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    mainMenu.confirm();
})
controller.player1.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    mainMenu.updateSelection(1);
})
menus.Button.onFocusGlobal(function(btn){
    btn.sprite.startEffect(effects.smiles, 500);
    music.play(music.createSoundEffect(WaveShape.Sine, 1, 2488, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
let button: menus.Button = menus.createButton(assets.image`NewGameBtn0`, SpriteKind.UI)
button.x = 80;
button.y = 20;
button.onBlur(function () {
    button.sprite.setImage(assets.image`NewGameBtn0`)
})
button.onFocus(function () {
    button.sprite.setImage(assets.image`NewGameBtn1`)
})
button.onSelect(function () {
    console.log("new game");
})
let buttonTwo: menus.Button = menus.createButton(assets.image`LoadBtn0`, SpriteKind.UI)
buttonTwo.x = 80;
buttonTwo.y = 40;
buttonTwo.onBlur(function () {
    buttonTwo.sprite.setImage(assets.image`LoadBtn0`)
})
buttonTwo.onFocus(function () {
    buttonTwo.sprite.setImage(assets.image`LoadBtn1`)
})
buttonTwo.onSelect(function () {
    console.log("load game")
})
let buttonThree: menus.Button = menus.createButton(assets.image`OptionsBtn0`, SpriteKind.UI)
buttonThree.x = 80;
buttonThree.y = 60;
buttonThree.onBlur(function () {
    buttonThree.sprite.setImage(assets.image`OptionsBtn0`)
})
buttonThree.onFocus(function () {
    buttonThree.sprite.setImage(assets.image`OptionsBtn1`)
})
buttonThree.onSelect(function () {
    console.log("options")
})
let mainMenu = menus.createMenu()
mainMenu.addButton(button)
mainMenu.addButton(buttonTwo)
mainMenu.addButton(buttonThree)
mainMenu.blurAll();
mainMenu.focusOnly(0)
