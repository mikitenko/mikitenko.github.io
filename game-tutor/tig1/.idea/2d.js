var Context = {
    canvas: null,
    context: null,
    create: function(canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = canvas.getContext('2d');
    }
};

var Canvas = function(w, h) {
    this.canvas = null;
    this.context = null;
    this.create = function(canvas_tag_id) {
        $(this.canvas).attr( { width: w, height: h } );
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = canvas.getContext('2d');
    }
};

var Sprite = function(fn) {

    // to do: load width/height into variables

    this.TO_RADIANS = Math.PI/180;
    this.image = null;
    this.is_pattern = false;
    this.pattern = null;
    this.pattern_x_times = 0;
    this.load = function(filename) { this.image = new Image(); this.image.src = filename; return this; };
    this.to_pattern = function(x_times) { this.pattern_x_times = x_times; this.pattern = Context.context.createPattern(this.image, 'repeat'); this.is_pattern = true; };

    //alert(new Image());

    // Load the sprite
    if (fn != undefined && fn != "" && fn != null)
    {
        this.load(fn);
        console.log("Loaded sprite " + fn);
    }
    else
    {
        console.log("Unable to load sprite. Filename '" + fn + "' is undefined or null.");
    }


    // Normal draw
    this.draw = function(x, y) {
        Context.context.drawImage(this.image, x, y, BLOCK_W, BLOCK_H);
    };

    // Stretched draw
    this.draw2 = function(x, y, w, h) {
        if (this.is_pattern) {
            //Context.context.fillStyle = Context.context.createPattern(this.image, 'repeat');;
            //Context.context.fillRect(x, y, w, h);
            for (var i = 0; i < this.pattern_x_times; i++) {
                Context.context.drawImage(this.image, x + w*i, y, w, h);
            }
        } else {
            Context.context.drawImage(this.image, x, y, w, h);
        }
    };
    
    // Rotated draw
    this.rot = function(x, y, angle) {
        Context.context.save();
        Context.context.translate(x,y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
        Context.context.restore();
    }
};

var Rect = function(x,y,w,h) {
    this.isRect = true;;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + w;
    this.y2 = y + h;
    this.width = w;
    this.height = h;
};

var Collision = function() {
    this.test = function(r1, r2) {
       // if (r1.isRect && r2.isRect) {

            //alert("test");

            if (r1.x1 < r2.x2 && r1.x1 > r2.x2 && r1.y1 < r2.y2 && r1.y2 > r2.y1) {
                return true;
            }
       // }
        return false;
    }
    
};