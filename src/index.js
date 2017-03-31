
function blurify(options) {
    this.options = options;
    this.blur = options.blur || 4;
    this.mode = options.mode || 'css';
    this.ratio = options.ratio || 0.2;
    this.blurStep = options.blurStep || 1;
    this.blurOffset = options.blurOffset || 1;
    this.imageType = options.imageType || `image/jpeg`;
    this.image = options.image;
    // get canvas element which used to render map.
    this.$els = [options.ele];

    if (this.mode == 'auto') {
        this.useCanvasMode();
        // cssSupport('filter', 'blur(1px)') ? this.useCSSMode() : this.useCanvasMode();
    } else if (this.mode == 'css') {
        this.useCSSMode();
    } else {
        this.useCanvasMode();
    }
}

blurify.prototype.useCSSMode = function() {
    this.$els.map(el => {
        el.style['filter'] = el.style['-webkit-filter'] = `blur(${this.options.blur}px)`;
    });
}

blurify.prototype.useCanvasMode = function() {    
    this.blurCanvas();
}

// blurify top and bottom part based on canvas.
blurify.prototype.blurify = function(canvas, blur) {
    let ctx = canvas.getContext('2d'), blurStep = this.blurStep, blurOffset = this.blurOffset,
        topImageData, blurImg = new Image(), tmpCanv = document.createElement("canvas"), tmpCtx, bottomImageData;
    tmpCanv.width = canvas.width;
    tmpCanv.height = parseInt(canvas.height* this.ratio);
    tmpCtx = tmpCanv.getContext("2d")

    // get top partial image then fill into tmpCanv
    topImageData = ctx.getImageData(0,0,canvas.width, tmpCanv.height);
    tmpCtx.putImageData(topImageData,0,0);
    
    // common function to blur partial image got from origin canvas.
    blurImg.src = tmpCanv.toDataURL(this.imageType);
    ctx.globalAlpha = 1 / (2 * blur);
    for (let y = -blur; y < blur; y += blurStep) {
        for (let x = -blur; x <= blur; x += blurStep) {
            // drawImage(image/canvas/video, offsetX, offsetY) // repeat offsetDraw to blur the image !! curious. parseInt(canvas.height/10)
            ctx.drawImage(blurImg, x, y);
            if (x >= 0 && y >= 0) ctx.drawImage(blurImg, -(x - blurOffset), -(y - blurOffset));
        }
    }

    // get bottom partial image
    let offsetY = canvas.height - tmpCanv.height;
    bottomImageData = ctx.getImageData(0, offsetY, canvas.width, tmpCanv.height);
    tmpCtx.putImageData(bottomImageData,0,0);

    // common function to blur partial image got from origin canvas.  blur the specific part!!!
    blurImg.src = tmpCanv.toDataURL(this.imageType);
    ctx.globalAlpha = 1 / (2 * blur);
    for (let y = -blur; y < blur; y += blurStep) {
        for (let x = -blur; x <= blur; x += blurStep) {
            // drawImage(image/canvas/video, offsetX, offsetY) // repeat offsetDraw to blur the image !! curious. parseInt(canvas.height/10)
            ctx.drawImage(blurImg, x, y + offsetY);
            if (x >= 0 && y >= 0) ctx.drawImage(blurImg, -(x - blurOffset), -(y + offsetY - blurOffset));
        }
    }

    ctx.globalAlpha = 1;
}

blurify.prototype.blurCanvas = function() {
    // create new canvas to draw image.
    var canvas = this.drawImage();
    if (!canvas) return;
    // blurify current canvas by blur..
    this.blurify(canvas, this.blur);
}

blurify.prototype.drawImage = function() {
    if (this.$els instanceof Array && this.$els[0] !== undefined && this.$els[0].tagName === "CANVAS") {
        let canvas = this.$els[0], ctx;    
        ctx = canvas.getContext("2d");
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        ctx.drawImage(this.image, 0, 0);
        return this.$els[0]
    } else {
        return null;
    }
}


// static class..
function preloadImages(images) {
    let newimages = [],
        loadedImagesCount = 0,
        postAction = function () {};

    images = (typeof images != 'object') ? [images] : images;

    function imageLoadPost() {
        loadedImagesCount++;
        if (loadedImagesCount == images.length) postAction(newimages);
    }

    images.map((image, i) => {
        newimages[i] = new Image();
        newimages[i].crossOrigin = '*';
        newimages[i].src = image.dataset ? image.dataset.src : image.getAttribute('data-src');
        newimages[i].onload = function () {
            imageLoadPost();
        };
        newimages[i].onerror = function () {
            imageLoadPost();
        };
    });

    return {
        done(callback) {
            postAction = callback || postAction;
        },
    };
}
