namespace images {
    /**
     * Print text on an image
     */
    //% blockId=imagesprinttext
    //% block="print $picture $text at x $x y $y in color $color"
    //% picture.defl=picture
    //% picture.shadow=variables_get
    //% color.shadow=colorindexpicker
    //% group="Text"
    //% inlineInputMode=inline
    export function print(picture: Image, text: string, x: number, y: number, color: number) {
        picture.print(text, x, y, color)
    }

    /**
     * Print text centered on an image
     */
    //% blockId=imagesprinttextcenter
    //% block="print $picture center $text at y $y in color $color"
    //% picture.defl=picture
    //% picture.shadow=variables_get
    //% color.shadow=colorindexpicker
    //% group="Text"
    //% inlineInputMode=inline
    export function printCenter(picture: Image, text: string, y: number, color: number) {
        picture.printCenter(text, y, color)
    }
}