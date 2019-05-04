var Events = {};

Events.BaseEvent = class {
    constructor(args) {this.trigger = null; this.args = args;}
    play(trigger) {this.trigger = trigger;}
    update() {}
    keydown() {}
    keyup() {}
}

Events.Message = class extends Events.BaseEvent {
    constructor(args) {
        super(args);
        
        this.width = Math.ceil(width / 5 * 3);
        this.height = Math.ceil(height / 3);
        this.time = 0;
        this.waning = false;

        this.container = new PIXI.Container();
        this.container.x = Math.floor(width / 2);

        this.graphics = new PIXI.Graphics();
        this.graphics.x = -this.width / 2;
        this.container.addChild(this.graphics);

        this.graphics.beginFill(0xffffc9);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();

        this.graphics.beginFill(0x004d4d);
        this.graphics.drawRect(1, 1, this.width - 2, this.height - 2);
        this.graphics.endFill();

        this.bitmapText = new BitmapText('', this.width - 6);
        this.bitmapText.x = Math.floor(-this.width / 2 + 3);
        this.bitmapText.y = 3;
        this.container.addChild(this.bitmapText);
    }

    play(trigger) {
        super.play(trigger);
        this.container.y = height;
        this.time = 0;
        this.waning = false;
        this.bitmapText.text = '';
        app.stage.addChild(this.container);
    }

    update(delta) {
        if (this.waning) {
            if (this.time < 0) {
                app.stage.removeChild(this.container);
                this.trigger.next();
            }

            this.time -= delta;
        } else {
            if (this.time % 2 < 1 && this.bitmapText.text != this.args.message) {
                this.bitmapText.text = this.args.message.substr(0, Math.floor(this.time / 2));
            }
            
            if (this.time > 0 && keyPressed.KeyZ) {
                if (this.bitmapText.text != this.args.message) {
                    this.bitmapText.text = this.args.message;
                } else {
                    this.time = 7;
                    this.waning = true;
                }
            }

            this.time += delta;
        }

        this.container.y = Math.floor(height - (Math.pow(Math.min(this.time / 7, 1) - 1, 3) + 1) * this.height * 1.25);
        this.bitmapText.redraw();
    }
}