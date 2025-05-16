// Menus.ts - Extension Helper for Menu Screens

//% color="#b527c4" icon="\uf00b"
//% advanced=true
namespace menus {

    type Callback = () => void;
    type ButtonCallback = (btn: Button) => void;
    const noOp: Callback = () => {};

    // Define the structure of a single button in the menus
    export class Button{
        // Static/global callbacks shared across all buttons
        private static focusGlobal: ButtonCallback = noOp as ButtonCallback;
        private static blurGlobal: ButtonCallback = noOp as ButtonCallback;
        private static selectGlobal: ButtonCallback = noOp as ButtonCallback;

        static onFocusGlobal(cb: ButtonCallback) {
            Button.focusGlobal = cb;
        }
        static onBlurGlobal(cb: ButtonCallback) {
            Button.blurGlobal = cb;
        }
        static onSelectGlobal(cb: ButtonCallback) {
            Button.selectGlobal = cb;
        }

        sprite: Sprite;
        //Local per-button Callbacks
        private focusLocal: Callback = noOp;
        private blurLocal: Callback = noOp;
        private selectLocal: Callback = noOp;
        private destroyLocal: Callback = noOp;

        constructor(image: Image, kind: number) {
            this.sprite = sprites.create(image, kind)
        }

        //public setters for local callbacks
        onFocus(cb: Callback) { this.focusLocal = cb; }
        onBlur(cb: Callback) { this.blurLocal = cb; }
        onSelect(cb: Callback) { this.selectLocal = cb; }
        onDestroy(cb: Callback) { this.destroyLocal = cb; }

        // Triggers events for both local and global callbacks
        focus() { 
            Button.focusGlobal(this);
            this.focusLocal(); 
        }
        blur() {
            Button.blurGlobal(this);
            this.blurLocal(); 
        }
        select() {
            Button.selectGlobal(this);
            this.selectLocal(); 
        }
        destroy() { 
            this.destroyLocal(); 
            sprites.destroy(this.sprite);
        }

        
        // Convenience accessors
        get x(): number { return this.sprite.x; }
        set x(value: number) { this.sprite.x = value; }

        get y(): number { return this.sprite.y; }
        set y(value: number) { this.sprite.y = value; }
    }

    // Define the structure of a menu
    export class Menu {
        buttons: Button[]; // List of buttons in the menu
        currentBtnIndex: number; // Track index of currently selected button
        active: boolean; // Track state of menu (visible on screen)
        cursorSprite?: Sprite; // Optional sprite that visually indicates the selected button
        onLayoutUpdate?: (menu: Menu) => void; // Optional callback to update the layout when the selection changes
        usePositionNavigation?: boolean; // Optional toggle for navigation based on button positions

        constructor(){
            this.buttons = [];
            this.currentBtnIndex = 0;
            this.active = true;
        }

        // Function to add a button to a menu
        addButton(btn: Button) {
            this.buttons.push(btn);
        }

        // Helper Function to update the selection based on relative position of the buttons
        private updateSelectionByPosition(dir: { x: number, y: number }) {
            const current: Button = this.buttons[this.currentBtnIndex];
            let closestIndex: number = this.currentBtnIndex;
            let closestScore: number = -Infinity;

            for (let i = 0; i < this.buttons.length; i++) {
                // Skip selected button
                if (i === this.currentBtnIndex) continue;

                // Calculate distance with pythag
                const other: Button = this.buttons[i];
                const dx: number = other.x - current.x;
                const dy: number = other.y - current.y;
                const dist: number = Math.sqrt(dx * dx + dy * dy);
                if (dist === 0) continue;

                const normDX: number = dx / dist;
                const normDY: number = dy / dist;

                // Dot product to measure how well aligned the two vectors are
                const dot: number = normDX * dir.x + normDY * dir.y;
                // skip buttons that aren't in the intended direction
                if (dot <= 0.1) continue;
                // add penalty for distance
                const score: number = dot - (dist * 0.01)

                if (score > closestScore) {
                    closestScore = score;
                    closestIndex = i;
                }
            }
            this.currentBtnIndex = closestIndex;
        }

        // Function to update the currently selected button in the Menu
        updateSelection(direction: number | { x: number, y: number }) {
            //Check if we are able to update selection
            if (!this.active || this.buttons.length === 0) return;

            // Track previous button
            const oldBtn: Button = this.buttons[this.currentBtnIndex];

            oldBtn.blur();

            if (this.usePositionNavigation && typeof direction !== "number") {
                // If we should navigate buttons based on coordinate positions
                this.updateSelectionByPosition(direction);
            } else if (typeof direction === "number") {
                //If we should navigate buttons through the array with index
                const total = this.buttons.length;
                this.currentBtnIndex = (this.currentBtnIndex + direction + total) % total;
                //MATH BREAKDOWN
                /**
                 * selectedIndex is the current index of the selected button in the array of buttons.
                 * we add the direction to the selectedIndex to move up or down the list of buttons.
                 * we also add the total number of buttons to make sure the result is positive 
                 * even if the index + direction would go negative. 
                 * Ex: if we're at index 0 and move -1, we'd be at button number -1 which is invalid.
                 * we use the modulo operator (%) to wrap the index around the range of our array,
                 * Ex: (3 + 1 + 3) % 3 = (7) % 3 = 1
                 */
            }

            const nextButton: Button = this.buttons[this.currentBtnIndex];

            if (this.cursorSprite) {
                this.cursorSprite.setPosition(nextButton.sprite.x, nextButton.sprite.y);
            }

            nextButton.focus()
            if (this.onLayoutUpdate) this.onLayoutUpdate(this);
        }

        focusOnly (index: number){
            if (index >= 0 && index < this.buttons.length) {
                if (this.currentBtnIndex !== index){
                    this.buttons[this.currentBtnIndex].blur();
                    this.currentBtnIndex = index;
                    this.buttons[this.currentBtnIndex].focus();
                    if (this.cursorSprite) {
                        const btn: Button = this.buttons[this.currentBtnIndex];
                        this.cursorSprite.setPosition(btn.x, btn.y);
                    }
                    if (this.onLayoutUpdate) this.onLayoutUpdate(this);
                }
            }
        }

        blurAll(){
            for (let btn of this.buttons){
                btn.blur();
            }
        }

        select() {
            if (!this.active) return;

            const currentBtn: Button = this.buttons[this.currentBtnIndex];

            currentBtn.select();
        }

        show() {
            this.active = true;
            for (let btn of this.buttons) {
                btn.sprite.setFlag(SpriteFlag.Invisible, false);
            }
            if (this.cursorSprite) this.cursorSprite.setFlag(SpriteFlag.Invisible, false);
        }

        hide() {
            this.active = false;
            for (let btn of this.buttons) {
                btn.sprite.setFlag(SpriteFlag.Invisible, true);
            }
            if (this.cursorSprite) this.cursorSprite.setFlag(SpriteFlag.Invisible, true);
        }

        destroy() {
            for (let btn of this.buttons) {
                btn.destroy();
            }
            if (this.cursorSprite) {
                this.cursorSprite.destroy();
            }
            this.active = false;
        }
    }

    export function createMenu(): Menu {
        return new Menu();
    }

    export function createButton(image: Image, kind: number): Button {
        return new Button(image, kind);
    }
}