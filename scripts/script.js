(function () {
    var card = {};

    document.querySelector('.div2').style.display = 'none';
    document.querySelector('.types_container').hidden = true;

    fetch('/get_cards').then(res => {
        res.text().then(txt => {
            var array = JSON.parse(txt);

            array.forEach(name => {
                var card_option = document.createElement('option');
                card_option.className = 'card_option';
                card_option.id = name;
                card_option.innerHTML = name;

                document.querySelector('.cards_select').appendChild(card_option);
            });
        });
    });

    document.querySelector('.button_start').addEventListener('click', function createCardTemplate(event) {
        var value = document.querySelector('.cards_select').value;

        if (value !== 'Select Card') {
            document.querySelector('.button_start').removeEventListener('click', createCardTemplate);

            document.querySelector('.div1').style.display = 'none';

            fetch('/get_card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: value
                })
            }).then(res => {
                res.text().then(txt => {
                    var obj = JSON.parse(txt);

                    document.querySelector('.div2').style.display = 'flex';
                    document.querySelector('.types_container').hidden = false;

                    const canvas = document.querySelector('.card_canvas');
                    const ctx = canvas.getContext('2d');

                    const image_background = new Image();
                    image_background.src = './images/test-merfolk.jpg';

                    const image_frame = new Image();
                    image_frame.src = './images/card.svg';

                    const imageLoader = document.querySelector('#file');
                    imageLoader.addEventListener('change', handleImage, false);

                    var x = 0;
                    var y = 0;

                    var imageWidth = 0;
                    var imageHeight = 0;

                    var background_scale = 1;

                    var cof = 0.75;

                    var card_type = 'creature';

                    var backgroundX = 0;
                    var backgroundY = 0;

                    function drawCard(scale, canvas, ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        if (image_backgroundLoaded && image_frameLoaded) {
                            const devicePixelRatio = window.devicePixelRatio || 1;
                            canvas.width = image_frame.width*devicePixelRatio*scale;
                            canvas.height = image_frame.height*devicePixelRatio*scale;
                            canvas.style.width = `${image_frame.width*cof*scale}px`;
                            canvas.style.height = `${image_frame.height*cof*scale}px`;
                            ctx.imageSmoothingEnabled = false;

                            canvas.style.width = `${image_frame.width*cof}px`;
                            canvas.style.height = `${image_frame.height*cof}px`;

                            ctx.imageSmoothingQuality = 'high';

                            ctx.drawImage(image_frame, 0, 0, image_frame.width*scale, image_frame.height*scale);
                            ctx.globalCompositeOperation = 'destination-over';

                            const aspectRatio = image_background.width/image_background.height;

                            var newWidth = image_background.width*scale;
                            var newHeight = image_background.height*scale;

                            if (image_background.width/image_background.height > image_frame.width/image_frame.height) {
                                newHeight = canvas.height;
                                newWidth = newHeight * aspectRatio;
                            } else {
                                newWidth = canvas.width;
                                newHeight = newWidth / aspectRatio;
                            }

                            const scaledWidth = newWidth*background_scale;
                            const scaledHeight = newHeight*background_scale;

                            imageWidth = newWidth;
                            imageHeight = newHeight;

                            var imageX = (canvas.width-imageWidth*background_scale)/2+x*background_scale;
                            var imageY = (canvas.height-imageHeight*background_scale)/2+y*background_scale;

                            if (imageX > 0) imageX = 0;
                            if (imageY > 0) imageY = 0;
                            if (imageX + scaledWidth < canvas.width) imageX = canvas.width-scaledWidth;
                            if (imageY + scaledHeight < canvas.height) imageY = canvas.height-scaledHeight;

                            x = (imageX - (canvas.width-imageWidth*background_scale)/2)/background_scale;
                            y = (imageY - (canvas.height-imageHeight*background_scale)/2)/background_scale;

                            ctx.imageSmoothingQuality = 'high';

                            ctx.drawImage(image_background, imageX, imageY, scaledWidth, scaledHeight);

                            var fontSize = 60;

                            ctx.globalCompositeOperation = 'source-over';
                            ctx.font = `${50*scale}px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';

                            var name_value = document.querySelector('.name_input').value;
                            var name_width = ctx.measureText(name_value).width;

                            ctx.fillText(document.querySelector('.name_input').value, 10, 48);

                            var mana_value = document.querySelector('.mana_input').value;

                            ctx.font = `${45.4184/cof*scale}px Franklin Gothic`;
                            ctx.fillStyle = '#aed1eaff';

                            var x1 = 439;
                            var y1 = 63;

                            ctx.font = `bold ${fontSize*scale}px Franklin Gothic`;

                            if (mana_value === '2' || mana_value === '3' || mana_value === '9') {
                                x1 = x1+2;
                            } else if (mana_value === '8') x1 = x1+1;

                            var mana_width = ctx.measureText(mana_value).width;

                            ctx.fillText(mana_value, (x1-mana_width/2)*scale, y1*scale);

                            var x2 = 55*scale;
                            var y2 = 630;

                            var attack_value = document.querySelector('.attack_input').value;
                            var attack_width = ctx.measureText(attack_value).width;

                            console.log(attack_width, scale);

                            if (attack_value === '2' || attack_value === '3' || attack_value === '9') {
                                x2 += 2*scale;
                            } else if (attack_value === '8') x2 += 1*scale;

                            if (card_type !== 'spell') ctx.fillText(attack_value, x2-attack_width/2, y2*scale);

                            var x3 = 431*scale;
                            var y3 = 630;

                            var health_value = document.querySelector('.hp_input').value;
                            var health_width = ctx.measureText(health_value).width;

                            if (health_value === '2' || health_value === '3' || health_value === '9') {
                                x3 += 2*scale;
                            } else if (health_value === '8') x3 += 1*scale;

                            if (card_type !== 'spell') ctx.fillText(health_value, x3-health_width/2, y3*scale);

                            ctx.font = `${40*scale}px Franklin Gothic`;

                            var legend_text = document.querySelector('.legend_text_input').value;   
                            var legend_text_width = ctx.measureText(legend_text).width;

                            var x4 = 245*scale;
                            var y4 = 657;

                            ctx.fillText(legend_text, x4-legend_text_width/2, y4*scale);

                            if (legend_text && card_type !== 'spell') {
                                var x5 = 189;
                                var y5 = 82;

                                ctx.fillStyle = '#aed1eaff';
                                ctx.font = `${27*scale}px Franklin Gothic`;
                                ctx.fillText('LEGEND', x5*scale, y5*scale);
                            }

                            if (document.querySelector('.text_textarea').value) drawText(scale, ctx, canvas);
                        }
                    }

                    function handleImage(e) {
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            image_background.src = event.target.result;
                            image_background.onload = function () {
                                image_backgroundLoaded = true;
                                drawCard(1, canvas, ctx);
                            }
                        }
                        reader.readAsDataURL(e.target.files[0]);  
                    }

                    function drawText(scale, ctx, canvas) {
                        var mod = 2;
                        var initialFontSize = 40*scale;
                        var fontSize = initialFontSize;
                        var text = document.querySelector('.text_textarea').value;
                        var w = 373*1.1*scale;
                        var h = 180*1.1*scale;

                        var x = 240*scale;
                        var y = 560*scale;

                        var polygon = [
                            {x: x-w/2, y: y-h/2-20},
                            {x: x+w/2, y: y-h/2-20},
                            {x: x+w/2, y: y+h/2-82},
                            {x: x+w/2-45, y: y+h/2-82},
                            {x: x+w/2-45, y: y+h/2-82+80},
                            {x: x+w/2-75-280, y: y+h/2-82+80},
                            {x: x+w/2-75-280, y: y+h/2-82+80-82},
                            {x: x+w/2-60-280-70, y: y+h/2-82+80-82}
                        ]

                        for (var i = 0; i < polygon.length; i++) {
                            if (scale) {
                                polygon[i].x = polygon[i].x*scale;
                                polygon[i].y = polygon[i].y*scale;
                            }
                        }

                        if (document.querySelector('.legend_text_input').value) {
                            y -= 10*scale;

                            polygon = [
                                {x: x-w/2, y: y-h/2-20},
                                {x: x+w/2, y: y-h/2-20},
                                {x: x+w/2, y: y+h/2-82},
                                {x: x+w/2-45, y: y+h/2-82},
                                {x: x+w/2-45, y: y+h/2-125+80},
                                {x: x+w/2-75-280, y: y+h/2-125+80},
                                {x: x+w/2-75-280, y: y+h/2-82+80-82},
                                {x: x+w/2-60-280-70, y: y+h/2-82+80-82}
                            ]

                            for (var i = 0; i < polygon.length; i++) {
                                if (scale) {
                                    polygon[i].x = polygon[i].x*scale;
                                    polygon[i].y = polygon[i].y*scale;
                                }
                            }
                        }
                        
                        var w0 = polygon[1].x-polygon[0].x;
                        var w1 = polygon[4].x-polygon[5].x;

                        var h0 = polygon[2].y-polygon[1].y;
                        var h1 = polygon[4].y-polygon[3].y;

                        h0*=0.82;
                        h1*=0.82;
                        w1*=0.96;
                        w0*=1.1;

                        var h2 = h0+h1;

                        var lines = fitText(text, w0, w1, h0, h1, fontSize);

                        var prevFit = checkText(text, w0, w1, h0, h1, fontSize);

                        while (true) {
                            var nowFit = checkText(text, w0, w1, h0, h1, fontSize);

                            if (nowFit) {
                                if (mod <= 1.01) break;
                                fontSize *= mod;
                            } else {
                                fontSize /= mod;
                            }

                            if (prevFit !== nowFit) {
                                mod = (mod + 1) / 2;
                            }

                            prevFit = nowFit;
                        }

                        if (fontSize > initialFontSize) fontSize = initialFontSize;

                        ctx.font = `${fontSize}px Franklin Gothic`;
                        ctx.fillStyle = '#aed1eaff';

                        lines = fitText(text, w0, w1, h0, h1, fontSize);

                        /*ctx.beginPath();
                        ctx.fillStyle = 'black';
                        ctx.moveTo(polygon[0].x, polygon[0].y);
                        ctx.lineTo(polygon[1].x, polygon[1].y);
                        ctx.lineTo(polygon[2].x, polygon[2].y);
                        ctx.lineTo(polygon[3].x, polygon[3].y);
                        ctx.lineTo(polygon[4].x, polygon[4].y);
                        ctx.lineTo(polygon[5].x, polygon[5].y);
                        ctx.lineTo(polygon[6].x, polygon[6].y);
                        ctx.lineTo(polygon[7].x, polygon[7].y);
                        ctx.fill();*/

                        var n = lines.length;
                        var spaceHeight = fontSize*0.1*scale;
                        var fontHeight = fontSize+spaceHeight;
                        var boxHeight = n * fontHeight - spaceHeight;

                        var trueX = polygon[0].x;
                        var trueY = polygon[0].y;

                        var nwide = 0;

                        for (var i = 0; i < lines.length; i++) {
                            if (lines[i].is_wide) nwide++;
                        }

                        var fh = fontHeight*0.92;
                        var localY = trueY+(h0-nwide*fh)/2+fh;
                        var h_top = y-(localY-fh);
                        var h_bottom = y+h0+h1-(localY-fh+fh*lines.length)-25;

                        if (h_bottom < h_top){
                            localY -= (h_top-h_bottom)/2;
                        }

                        for (var i = 0; i < lines.length; i++) {
                            ctx.fillStyle = '#aed1eaff';

                            var parts = lines[i].text.split(/(\[b\]|\[\/b\])/).filter(Boolean);

                            var x = canvas.width/2-lines[i].width/2;

                            var lineY = localY+i*fontHeight;

                            if (lines.length === 1) lineY += 15*scale;
                            if (lines.length === 2) lineY += 15*scale;
                            if (lines.length === 3) lineY += -5*scale;
                            if (lines.length === 4) lineY -= 10*scale;
                            
                            for (var j = 0; j < parts.length; j++) {
                                if (parts[j] === '[b]') {
                                    ctx.font = `bold ${fontSize}px Franklin Gothic`;
                                } else if (parts[j] === '[/b]') {
                                    ctx.font = `${fontSize}px Franklin Gothic`;
                                } else {
                                    ctx.fillText(parts[j], x, lineY);
                                    console.log(parts[j], x, lineY);
                                    x += ctx.measureText(parts[j]).width;
                                }
                            }
                        }
                    }

                    function fitText(text, w0, w1, h0, h1, fontSize) {
                        if (text) {
                            ctx.font = fontSize + `px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';
                    
                            var lines = [];
                            var is_wide = true;
                    
                            var y = 0;
                            var spaceHeight = fontSize*0.1;
                            var lineHeight = fontSize+spaceHeight;
                    
                            var newString = text.replace(new RegExp("\\n", 'g'), " \n ");
                            var words = newString.split(' ');
                            var line = '';
                            var w=w0;
                    
                            for (var n = 0; n < words.length; n++) {
                                var cur = words[n];
                                var crret = cur == '\n';
                                if (crret) cur = '';
                    
                                var testLine = line + ' ' + cur;
                                var metricsTestLine = testLine.replace(/\[b\]|\[\/b\]/g, '');
                                var testMetrics = ctx.measureText(metricsTestLine);
                                var testWidth = testMetrics.width;
                    
                                if (testWidth > w || crret) {
                                    var metricsLine = line.replace(/\[b\]|\[\/b\]/g, '');
                                    var lineMetrics = ctx.measureText(metricsLine);
                                    var lineWidth = lineMetrics.width;
                    
                                    lines.push({
                                        text: line.trim(), 
                                        width: lineWidth, 
                                        is_wide: is_wide
                                    });
                    
                                    line = cur;
                                    y += lineHeight;
                    
                                    if (y+lineHeight-spaceHeight>h0) {
                                        is_wide = false;
                                        w=w1;
                                    }
                                } else line = testLine;
                            }
                    
                            var metricsLine = line.replace(/\[b\]|\[\/b\]/g, '');
                            var lineMetrics = ctx.measureText(metricsLine);
                            var lineWidth = lineMetrics.width;
                    
                            lines.push({
                                text: line.trim(), 
                                width: lineWidth, 
                                is_wide: is_wide
                            });
                    
                            return lines;
                        }
                    }
                    
                    function checkText(text, w0, w1, h0, h1, fontSize) {
                        if (text) {
                            var lines = fitText(text, w0, w1, h0, h1, fontSize);
                            var spaceHeight = fontSize*0.1;
                            var lineHeight = fontSize+spaceHeight;
                            var linesHeight = lines.length*lineHeight-spaceHeight;
                    
                            if (linesHeight>h0+h1) {
                                return false;
                            }
                    
                            return true;
                        }
                    }

                    var image_backgroundLoaded = false;
                    var image_frameLoaded = false;

                    image_background.onload = function () {
                        image_backgroundLoaded = true;
                        drawCard(1, canvas, ctx);
                    }

                    image_frame.onload = function () {
                        image_frameLoaded = true;
                        drawCard(1, canvas, ctx);
                    }

                    document.querySelector('.name_input').addEventListener('input', () => {
                        drawCard(1, canvas, ctx);
                    });

                    document.querySelector('.mana_input').addEventListener('input', () => {
                        var value = document.querySelector('.mana_input').value;
                        if (value.length > 2) document.querySelector('.mana_input').value = value.slice(0, 2);
                        drawCard(1, canvas, ctx);
                    });

                    document.querySelector('.attack_input').addEventListener('input', () => {
                        var value = document.querySelector('.attack_input').value;
                        if (value.length > 2) document.querySelector('.attack_input').value = value.slice(0, 2);
                        drawCard(1, canvas, ctx);
                    });

                    document.querySelector('.hp_input').addEventListener('input', () => {
                        var value = document.querySelector('.hp_input').value;
                        if (value.length > 2) document.querySelector('.hp_input').value = value.slice(0, 2);
                        drawCard(1, canvas, ctx);
                    });

                    document.querySelector('.create_button').addEventListener('click', () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        drawCard(2, canvas, ctx);

                        var link = document.createElement('a');
                        var name_value = document.querySelector('.name_input').value;
                        if (name_value) {
                            link.download = `${encodeURIComponent(name_value)}.png`;
                        } else link.download = `card.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                    });

                    document.querySelector('.legend_text_input').addEventListener('input', () => {
                        if (document.querySelector('.legend_text_input').value) {
                            image_frame.src = './images/card-legend.svg';
                            image_frame.onload = function () {
                                image_frameLoaded = true;
                                drawCard(1, canvas, ctx);
                            }
                        } else {
                            image_frame.src = './images/card.svg';
                            image_frame.onload = function () {
                                image_frameLoaded = true;
                                drawCard(1, canvas, ctx);
                            }
                        }
                    });

                    document.querySelector('.text_textarea').addEventListener('input', () => {
                        drawCard(1, canvas, ctx);
                    });

                    var lastX;
                    var lastY;
                    var offsetX = 0;
                    var offsetY = 0;

                    function calculateCoefficient(offsetLeft) {
                        const range = 190 - 10;
                        const progress = (offsetLeft - 10) / range;
                        const coefficient = 1 + progress;
                        return coefficient;
                    }

                    const container = document.querySelector('.line-container');
                    const line = document.querySelector('.line');
                    const circle = document.querySelector('.circle');

                    var mouseDown = false;

                    circle.addEventListener("mousedown", (e) => {
                        mouseDown = true;
                        e.preventDefault();
                    });

                    document.addEventListener("mouseup", () => {
                        mouseDown = false;
                    });

                    document.addEventListener("mousemove", (e) => {
                        if (!mouseDown) return;

                        const lineRect = line.getBoundingClientRect();
                        const minX = lineRect.left;
                        const maxX = lineRect.right - circle.offsetWidth;

                        var mouseX = e.clientX - circle.offsetWidth / 2;

                        if (mouseX < minX) {
                            mouseX = minX;
                        } else if (mouseX > maxX) {
                            mouseX = maxX;
                        }

                        const positionInPixels = mouseX-lineRect.left;
                        var positionInPercent = (positionInPixels/(lineRect.width-circle.offsetWidth)) * 100;

                        if (positionInPercent < 10) {
                            positionInPercent = 10;
                        } else if (positionInPercent > 90) {
                            positionInPercent = 90;
                        }

                        const coefficient = 1+((positionInPercent-10)/(90-10))*2;
                        circle.style.left = positionInPercent + "%";

                        background_scale = coefficient;

                        drawCard(1, canvas, ctx);
                    });

                    var isDragging = false;
                    var lastMousePos;

                    canvas.addEventListener('mousedown', (e) => {
                        if (e.button === 0) {
                            isDragging = true;
                            lastMousePos = {
                                x: e.clientX, 
                                y: e.clientY
                            };
                        }
                    });

                    canvas.addEventListener('mousemove', (e) => {
                        if (isDragging) {
                            if (!circle.style.left) circle.style.left = `10%`;
                            var dx = e.clientX - lastMousePos.x;
                            var dy = e.clientY - lastMousePos.y;

                            x += dx/background_scale;
                            y += dy/background_scale;

                            drawCard(1, canvas, ctx);

                            lastMousePos = { x: e.clientX, y: e.clientY };
                        }
                    });

                    canvas.addEventListener('mouseup', (e) => {
                        if (e.button === 0) {
                            isDragging = false;
                        }
                    });

                    canvas.addEventListener('mouseleave', () => {
                        isDragging = false;
                    });

                    var mana_elements = [/*'fire', */'water'/*, 'earth', 'wind', 'lightling', 'ice', 'dark', 'blood', 'light', 'mechanincs'*/];

                    document.querySelector('.manaitem_btn').addEventListener('click', () => {
                        document.querySelector('.card-text').children[0].innerHTML = + `<m></m>`;
                    });

                    var types_names = ['creature', 'spell'];
                    card.type = types_names[0];

                    types_names.forEach(type => {
                        var type_element = document.createElement('div');

                        if (type === types_names[0]) {
                            type_element.className = `${type} first_type`;
                        } else type_element.className = `${type} type`;

                        type_element.type = type;
                        type_element.innerHTML = type;

                        type_element.addEventListener('click', (event) => {
                            var type = event.target.type;

                            var obj1 = {
                                'creature': () => {
                                    document.querySelector('.attack_input').disabled = false;
                                    document.querySelector('.hp_input').disabled = false;
                                    document.querySelector('.legend_text_input').disabled = false;

                                    card_type = 'creature';

                                    if (document.querySelector('.legend_text_input').value) {
                                        image_frame.src = './images/card-legend.svg';
                                        image_frame.onload = function () {
                                            image_frameLoaded = true;
                                            drawCard(1, canvas, ctx);
                                        }
                                    } else {
                                        image_frame.src = './images/card.svg';
                                        image_frame.onload = function () {
                                            image_frameLoaded = true;
                                            drawCard(1, canvas, ctx);
                                        }
                                    }
                                },
                                'spell': () => {
                                    document.querySelector('.attack_input').disabled = true;
                                    document.querySelector('.hp_input').disabled = true;
                                    document.querySelector('.legend_text_input').disabled = true;

                                    card_type = 'spell';

                                    image_frame.src = './images/card-spell.svg';
                                    image_frame.onload = function () {
                                        image_frameLoaded = true;
                                        drawCard(1, canvas, ctx);
                                    }
                                }
                            }

                            if (type !== 'unknown') {
                                card.type = type;

                                var func = obj1[type];
                                func();

                                for (var i = 0; i < document.querySelector('.types_container').childNodes.length; i++) {
                                    var file = document.querySelector('.types_container').childNodes[i];
                                    var file_type = file.type;

                                    if (file.classList[0] === type) {
                                        file.className = `${file_type} first_type`;
                                    } else file.className = `${file_type} type`;
                                }
                            }
                        });

                        document.querySelector('.types_container').appendChild(type_element);
                    });

                    document.querySelector('.gen_image_button').addEventListener('click', (event) => {
                        var value = document.querySelector('.gen_image_textarea').value;

                        if (value) {
                            fetch('/generate-image', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    value: value
                                })
                            }).then(res => {
                                res.text().then(txt => {
                                    console.log(txt);
                                });
                            });
                        }
                    });
                });
            });
        }
    });

    document.querySelector('.add_card_button').addEventListener('click', (event) => {
        var value = document.querySelector('.add_card_input').value;

        if (value) {
            fetch('/create_card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: encodeURIComponent(value)
                })
            }).then(res => {
                res.text().then(txt => {
                    document.querySelector('.add_card_input').value = '';

                    var data = JSON.parse(txt);

                    var card_option = document.createElement('option');
                    card_option.className = 'card_option';
                    card_option.id = data.name;
                    card_option.innerHTML = data.name;

                    document.querySelector('.cards_select').appendChild(card_option);
                });
            });
        }
    })
})()