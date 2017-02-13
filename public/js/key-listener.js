class KeyListener {

    constructor(action_char_pairs){
        this.action_char_pairs = action_char_pairs;
    }

    isPushed(action){
        var char = this.action_char_pairs[action];
        var code = this.charToCode(char);
        return KeyListener.pushed[code];
    }

    charToCode(char) {
        return char.charCodeAt(0) - 32;
    }
}

KeyListener.pushed = [];
for(var i=0; i<500; i++){
    KeyListener.pushed[i] = false;
}

document.addEventListener('keydown', function(e) {
    KeyListener.pushed[e.keyCode] = true;
});

document.addEventListener('keyup', function(e) {
    KeyListener.pushed[e.keyCode] = false;
});