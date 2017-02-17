/*

tayebbayri.com

based on 'Bouncing Image Script'
by Lloyd Hassel
 
*/
var bouncingdvdlogo;

(function () {
    "use strict";
    var utils,
        model,
        thecentralscrutinizer,
        view;

    /* Utils
    ------------------------------------ */
    utils = {
        leadingZero: function (number, howManyZeros) {
            var processedNumber,
                preparedNumber = number.toString(),
                i;
            for (i = 0; i < howManyZeros; i += 1) {
                processedNumber = [preparedNumber.slice(0, 0), i.toString(), preparedNumber.slice(0)].join('');
                preparedNumber = processedNumber;
            }
            return processedNumber;
        },
        preloadImages: function (imageUrlArray) {
            var i,
                img;
            for (i = 0; i < imageUrlArray.length; i += 1) {
                img = new Image();
                img.src = imageUrlArray[i];
            }
        },
        generateId: function () {
            return Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
        },
        getRandomString: function (stringArray) {
            var output = stringArray[Math.floor(Math.random() * stringArray.length)];
            return output;
        }
    };

    /* Model
    ------------------------------------ */
    model = {
        logos: []
    };

    /* Controller
    ------------------------------------ */
    thecentralscrutinizer = {
        parameters: {},
        init: function (options) {
            var self = this;
            this.parameters = options;
            this.loadLogos(thecentralscrutinizer.parameters.imagesNums);

            view.init();

            window.addEventListener("resize", function () {
                window.location.reload();
            });
        },
        loadLogos: function (quantity) {
            // store image names in model
            var i;
            for (i = 0; i < quantity; i += 1) {
                model.logos.push(thecentralscrutinizer.parameters.imagesFolder + thecentralscrutinizer.parameters.imagesPrefix + utils.leadingZero(i, 1) + thecentralscrutinizer.parameters.imagesExtension);
            }

            // preload images
            utils.preloadImages(model.logos);
        },
        getLogo: function (selection) {
            var logo = '',
                logoFilename,
                currentLogo = view.$logo.style.backgroundImage,
                currentLogoUrl = currentLogo.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
                currentLogoFilename = currentLogoUrl.substring(currentLogoUrl.lastIndexOf('/') + 1);

            if (selection === 'random') {
                logo = utils.getRandomString(model.logos);
                logoFilename = logo.substring(logo.lastIndexOf('/') + 1);
                //if same image, try again
                if (logoFilename === currentLogoFilename) {
                    logo = utils.getRandomString(model.logos);
                }
            } else {
                logo = model.logos[selection + 1];
            }
            return logo;
        }
    };

    /* View
    ------------------------------------ */
    view = {
        init: function () {
            var self = this;

            // container DOM and style
            self.$container = document.createElement('div');
            self.$container.style.position = 'relative';
            self.$container.style.backgroundColor = '#000';
            self.$container.id = thecentralscrutinizer.parameters.uid;
            self.$container.classList.add('bouncingdvdlogo');
            document.body.appendChild(self.$container);

            // logo DOM and style
            self.$logo = document.createElement('div');
            self.$logo.id = 'dvdbouncinglogo-logo';
            self.$logo.style.position = 'absolute';
            self.$logo.style.width = thecentralscrutinizer.parameters.logoWidth + 'px';
            self.$logo.style.height = thecentralscrutinizer.parameters.logoHeight + 'px';
            self.$container.appendChild(self.$logo);

            this.render();
            self.bounce(self.$logo);

        },
        render: function () {
            this.$logo.style.backgroundImage = 'url(' + thecentralscrutinizer.getLogo('random') + ')';
        },
        bounce: function (element) {
            var self = this,
                elementWidth = element.offsetWidth,
                elementHeight = element.offsetHeight,
                speed = thecentralscrutinizer.parameters.speed,
                xMax = window.innerWidth - (elementWidth / 10),
                yMax = window.innerHeight - (elementHeight / 10),
                xPos = Math.floor(Math.random() * (xMax - elementWidth)),
                yPos = Math.floor(Math.random() * (yMax - elementHeight)),
                xDir = utils.getRandomString(["right", "left"]),
                yDir = utils.getRandomString(["up", "down"]);

            function move() {
                if (xDir === "right") {
                    if (xPos > (xMax - elementWidth - speed)) {
                        xDir = "left";
                        self.render();
                    }
                } else if (xDir === "left") {
                    if (xPos < speed) {
                        xDir = "right";
                        self.render();
                    }
                }
                if (yDir === "down") {
                    if (yPos > (yMax - elementHeight - speed)) {
                        yDir = "up";
                        self.render();
                    }
                } else if (yDir === "up") {
                    if (yPos < speed) {
                        yDir = "down";
                        self.render();
                    }
                }
                if (xDir === "right") {
                    xPos = xPos + speed;
                } else if (xDir === "left") {
                    xPos = xPos - speed;
                }
                if (yDir === "down") {
                    yPos = yPos + speed;
                } else if (yDir === "up") {
                    yPos = yPos - speed;
                }

                element.style.left = xPos + 'px';
                element.style.top = yPos + 'px';
            }
            setInterval(function () {
                move();
            }, 30);
        }
    };

    /* Init
    ------------------------------------ */
    bouncingdvdlogo = function (options) {
        this.init(options);
    };

    bouncingdvdlogo.prototype.init = function (options) {
        var parameters = {
            logoWidth: options.logoWidth || 400,
            logoHeight: options.logoHeight || 200,
            speed: options.speed || 8, //1-50
            imagesFolder: options.imagesFolder || 'logos/',
            imagesPrefix: options.imagesPrefix || 'dvdlogo-',
            imagesExtension: options.imagesExtension || '.jpg',
            imagesNums: options.imagesNums || 7,
            maxSpeed: 50,
            uid: utils.generateId()
        };
        thecentralscrutinizer.init(parameters);
    };
}());