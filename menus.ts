// Menus.ts - Extension Helper for Menu Screens

//% color="#b527c4" icon="\uf00b"
//% advanced=true
namespace menus {
    // Define the structure of a single button in the menus
    export class MenuButton{
        sprite: Sprite;
        onFocus?: () => void
        onBlur?: () => void
        onSelect?: () => void

        constructor(sprite: Sprite){
            this.sprite=sprite;
        }

        get x(): number {
            return this.sprite.x;
        }

        set x(value: number) {
            this.sprite.x = value;
        }

        get y(): number {
            return this.sprite.y;
        }

        set y(value: number) {
            this.sprite.y = value;
        }
        
        Select() {
            if (this.onSelect) this.onSelect();
        }

        Focus() {
            if (this.onFocus) this.onFocus();
        }

        Blur() {
            if (this.onBlur) this.onBlur();
        }
    }
    
    // Define the structure of a menu
    export interface Menu {
        buttons: MenuButton[]; // List of buttons in the menu
        selectedIndex: number; // Track index of currently selected button
        active: boolean; // Track state of menu (visible on screen)
        cursorSprite?: Sprite; // Optional sprite that visually indicates the selected button
        onLayoutUpdate?: (menu: Menu) => void; // Optional callback to update the layout when the selection changes
        usePositionNavigation?: boolean; // Optional toggle for navigation based on button positions
    }

    // Global event listeners
    let globalOnSelect: (btn: MenuButton) => void;

    export function onSelect(fn: (btn: MenuButton) => void){
        globalOnSelect = fn;
    }

    // Function to create a menu
    export function createMenu(): Menu {
        return {
            buttons: [],
            selectedIndex: 0, // Start with the first button selected
            active: true, // Menu is active (visible)
            usePositionNavigation: false // Default to using index-based navigation
        }
    }
    
    // Function to create a button
    export function createButton(sprite: Sprite): IMenuButton {
        let button: IMenuButton = {
            sprite: sprite,
            selectHandler: () => {},
            highlightHandler: () => {},
            onUnhighlight: () => {}
        }

        return button;
    }

    // Function to add a button to a menuUI
    export function addButton(menu: Menu, btn: IMenuButton): void {
        menu.buttons.push(btn);
    }

    // Function to update the currently selected button in the Menu
    export function updateSelection(menu: Menu, direction: number | { x: number, y: number}){
        //Check if we are able to update selection
        if(!menu.active||menu.buttons.length===0) return;

        const current = menu.buttons[menu.selectedIndex];

        if (current.onUnhighlight) current.onUnhighlight();

        if (menu.usePositionNavigation && typeof direction !== "number"){
            // If we should navigate buttons based on coordinate positions
            updateSelectionByPosition(menu, direction);
        } else if (typeof direction === "number") {
            //If we should navigate buttons through the array with index
            const total = menu.buttons.length;
            menu.selectedIndex = (menu.selectedIndex + direction + total) % total;
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

        // Track new button
        const selectedBtn = menu.buttons[menu.selectedIndex];

        //If using sprite cursor
        if (menu.cursorSprite){
            menu.cursorSprite.setPosition(selectedBtn.sprite.x, selectedBtn.sprite.y);
        }

        if(selectedBtn.highlightHandler) selectedBtn.highlightHandler();
        if(menu.onLayoutUpdate) menu.onLayoutUpdate(menu);
    }

    // Function to update the selection based on relative position of the buttons
    function updateSelectionByPosition(menu: Menu, dir: {x: number, y: number}){
        const current = menu.buttons[menu.selectedIndex].sprite;
        let closestIndex = menu.selectedIndex;
        let closestScore = -Infinity;

        for (let i = 0; i < menu.buttons.length; i++){
            // Skip selected button
            if (i === menu.selectedIndex) continue;

            // Calculate distance with pythag
            const other = menu.buttons[i].sprite;
            const dx = other.x - current.x;
            const dy = other.y - current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) continue;

            const normDX = dx / dist;
            const normDY = dy / dist;

            // Dot product to measure how well aligned the two vectors are
            const dot = normDX * dir.x + normDY * dir.y;
            // skip buttons that aren't in the intended direction
            if (dot <= 0.1) continue;
            // add penalty for distance
            const score = dot - (dist * 0.01)

            if (score > closestScore) {
                closestScore = score;
                closestIndex = i;
            }
        }
        
        menu.selectedIndex = closestIndex;
    }

    // Function to confirm the selection of the currently selected buttons
    export function confirm(menu: Menu) {
        if (!menu.active) return;

        const selected = menu.buttons[menu.selectedIndex];

        // if we have on selected event, trigger it.
        if (selected.selectHandler()) selected.selectHandler();
    }

    // Function to show the Menu
    export function show(menu: Menu){
        menu.active = true;
        for (let btn of menu.buttons) {
            btn.sprite.setFlag(SpriteFlag.Invisible, false);
        }
        if (menu.cursorSprite) menu.cursorSprite.setFlag(SpriteFlag.Invisible, false);
    }

    // Function to hide the Menu
    export function hide(menu: Menu) {
        menu.active = false;
        for (let btn of menu.buttons){
            btn.sprite.setFlag(SpriteFlag.Invisible, true);
        }
        if (menu.cursorSprite) menu.cursorSprite.setFlag(SpriteFlag.Invisible, true);
    }

    // Function to destroy the menu and clean up
    export function destroy(menu: Menu) {
        for (let btn of menu.buttons) {
            sprites.destroy(btn.sprite);
            }
        if (menu.cursorSprite) {
            menu.cursorSprite.destroy();
            
        }
        menu.active = false;
    }
}