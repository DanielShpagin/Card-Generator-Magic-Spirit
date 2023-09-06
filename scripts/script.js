(function () {
    document.querySelector('.div2').style.display = 'flex';
    document.querySelector('.types_container').hidden = false;

    const canvas = document.querySelector('.card_canvas');
    const ctx = canvas.getContext('2d');

    var card_type = 'creature';
    var card_color = 'Blue';

    const image_background = new Image();
    image_background.src = './images/test-merfolk.jpg';

    const image_frame = new Image();
    image_frame.src = `./images/card_colors/Blue/card-creature.svg`;

    const imageLoader = document.querySelector('#file');
    imageLoader.addEventListener('change', handleImage, false);

    const uploadJSONButton = document.querySelector('#upload_json_button');
    uploadJSONButton.addEventListener('change', uploadJSON, false);

    var imageX;
    var imageY;

    var background_scale = 1;

    var cof = 0.75;

    function getTextColor(stat, scale, ctx) {
        ctx.shadowColor = `rgba(0, 0, 0, ${0.3/scale})`;
        ctx.shadowBlur = 30 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        if (card_color === 'Blue') return '#aed1eaff';
        if (card_color === 'Green') return '#bff0bcff';
        if (card_color === 'Black') return '#e0e0e0ff';
        if (card_color === 'White') {
            console.log(stat);
            if (stat !== 'Description' && stat !== 'Name') {
                ctx.shadowColor = `rgba(0, 0, 0, ${100})`;
                ctx.shadowBlur = 40 * scale;
            } else {
                ctx.shadowColor = `rgba(0, 0, 0, 0.8)`;
                ctx.shadowBlur = 26 * scale;
            }

            return '#fffdf0ff';
        }
    }

    function drawCard(scale, canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (image_backgroundLoaded && image_frameLoaded) {
            const devicePixelRatio = window.devicePixelRatio || 1;
            canvas.width = image_frame.width * devicePixelRatio * scale;
            canvas.height = image_frame.height * devicePixelRatio * scale;
            canvas.style.width = `${image_frame.width * cof * scale}px`;
            canvas.style.height = `${image_frame.height * cof * scale}px`;
            ctx.imageSmoothingEnabled = false;

            if (!(image_frame.width && image_frame.height)) return;

            canvas.style.width = `${image_frame.width * cof * scale}px`;
            canvas.style.height = `${image_frame.height * cof * scale}px`;

            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(image_frame, 0, 0, image_frame.width * scale, image_frame.height * scale);
            ctx.globalCompositeOperation = 'destination-over';

            const aspectRatio = image_background.width / image_background.height;

            var imageWidth = image_background.width * scale;
            var imageHeight = image_background.height * scale;

            if (image_background.width / image_background.height > image_frame.width / image_frame.height) {
                imageHeight = canvas.height;
                imageWidth = imageHeight * aspectRatio;
            } else {
                imageWidth = canvas.width;
                imageHeight = imageWidth / aspectRatio;
            }

            imageWidth *= background_scale;
            imageHeight *= background_scale;

            if (!imageX && !imageY) {
                imageX = (canvas.width - imageWidth) / 2 * scale;
                imageY = (canvas.height - imageHeight) / 2 * scale;

                /*x = (imageX - (canvas.width - imageWidth * background_scale) / 2) / background_scale;
                y = (imageY - (canvas.height - imageHeight * background_scale) / 2) / background_scale;
    
                ctx.imageSmoothingQuality = 'high';
    
                console.log(imageX, imageY);*/
            }

            if (imageX > 0) imageX = 0;
            if (imageY > 0) imageY = 0;
            if (imageX + imageWidth < canvas.width) imageX = canvas.width - imageWidth;
            if (imageY + imageHeight < canvas.height) imageY = canvas.height - imageHeight;

            console.log(imageX, imageY);

            ctx.drawImage(image_background, imageX * scale, imageY * scale, imageWidth, imageHeight);

            drawDesription(scale, ctx, canvas);
        }
    }

    function drawDesription(scale, ctx, canvas) {
        var fontSize = 60;

        ctx.globalCompositeOperation = 'source-over';
        ctx.font = `${50 * scale}px Franklin Gothic`;
        ctx.fillStyle = getTextColor('Decription', scale, ctx);

        var name_value = document.querySelector('.name_input').value;
        
        ctx.fillStyle = getTextColor('Name', scale, ctx);

        ctx.fillText(document.querySelector('.name_input').value, 10 * scale, 48 * scale);

        var mana_value = document.querySelector('.mana_input').value;

        ctx.fillStyle = getTextColor('Mana', scale, ctx);

        var x1 = 439;
        var y1 = 63;

        ctx.font = `bold ${fontSize * scale}px Franklin Gothic`;

        if (mana_value === '2' || mana_value === '3' || mana_value === '9') {
            x1 += 2;
        } else if (mana_value === '8') x1 += 1;

        var mana_width = ctx.measureText(mana_value).width;

        ctx.fillText(mana_value, x1 * scale - mana_width / 2, y1 * scale);

        var x2 = 55 * scale;
        var y2 = 630;

        var attack_value = document.querySelector('.attack_input').value;
        var attack_width = ctx.measureText(attack_value).width;

        if (attack_value === '2' || attack_value === '3' || attack_value === '9') {
            x2 += 2 * scale;
        } else if (attack_value === '8') x2 += 1 * scale;

        if (card_type !== 'spell') ctx.fillText(attack_value, x2 - attack_width / 2, y2 * scale);

        ctx.fillStyle = getTextColor('Attack', scale, ctx);

        var x3 = 431 * scale;
        var y3 = 630;

        var health_value = document.querySelector('.hp_input').value;
        var health_width = ctx.measureText(health_value).width;

        if (health_value === '2' || health_value === '3' || health_value === '9') {
            x3 += 2 * scale;
        } else if (health_value === '8') x3 += 1 * scale;

        if (card_type !== 'spell') ctx.fillText(health_value, x3 - health_width / 2, y3 * scale);

        ctx.fillStyle = getTextColor('Health', scale, ctx);
        ctx.font = `${40 * scale}px Franklin Gothic`;

        var legend_text = document.querySelector('.legend_text_input').value;
        var legend_text_width = ctx.measureText(legend_text).width;

        var x4 = 245 * scale;
        var y4 = 657;

        ctx.fillText(legend_text, x4 - legend_text_width / 2, y4 * scale);

        if (legend_text && card_type !== 'spell') {
            var x5 = 189;
            var y5 = 82;

            ctx.fillStyle = getTextColor('Legend text', scale, ctx);
            ctx.font = `${27 * scale}px Franklin Gothic`;
            ctx.fillText('LEGEND', x5 * scale, y5 * scale);
        }

        if (document.querySelector('.text_textarea').value) drawText(scale, ctx, canvas);
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

    function uploadJSON(e) {
        var file = e.target.files[0];

        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            var data = JSON.parse(contents);

            var hp = data.hp;
            var attack = data.attack;
            var description = data.description;
            var mana = data.mana;
            var name = data.name;

            var color = data.card_color;
            var type = data.card_type;

            var image = data.image;
            var src = image.src;
            var x = image.x;
            var y = image.y;
            var width = image.width;
            var height = image.height;
            var scale = image.scale;

            var legend_text = data.legend_text;

            if (type === 'creature' || type === 'legend') {
                document.querySelector('.attack_input').disabled = false;
                document.querySelector('.hp_input').disabled = false;
                document.querySelector('.legend_text_input').disabled = false;
                document.querySelector('.legend_text_input').value = '';

                card_type = 'creature';

                if (type === 'legend') {
                    card_type = 'legend';
                    image_frame.src = `./images/card_colors/${card_color}/card-legend.svg`;
                    image_frame.onload = function () {
                        image_frameLoaded = true;
                        drawCard(1, canvas, ctx);
                    }
                } else {
                    card_type = 'creature';
                    image_frame.src = `./images/card_colors/${card_color}/card-creature.svg`;
                    image_frame.onload = function () {
                        image_frameLoaded = true;
                        drawCard(1, canvas, ctx);
                    }
                }
            }

            if (type === 'spell') {
                document.querySelector('.attack_input').disabled = true;
                document.querySelector('.hp_input').disabled = true;
                document.querySelector('.legend_text_input').disabled = true;
                document.querySelector('.legend_text_input').value = '';

                card_type = 'spell';

                image_frame.src = `./images/card_colors/${color}/card-spell.svg`;
                image_frame.onload = function () {
                    image_frameLoaded = true;
                    drawCard(1, canvas, ctx);
                }
            }

            document.querySelector('.hp_input').value = hp;
            document.querySelector('.attack_input').value = attack;
            document.querySelector('.text_textarea').value = description;
            document.querySelector('.mana_input').value = mana;
            document.querySelector('.name_input').value = name;

            if (type === 'legend') document.querySelector('.legend_text_input').value = legend_text;

            console.log(color);

            card_color = color;
            document.querySelector('.color_select').value = color;

            background_scale = scale;
            setPositionFromBackgroundScale(background_scale);

            image_frameLoaded = false;
            image_backgroundLoaded = false;

            image_frame.src = `./images/card_colors/${card_color}/card-${card_type}.svg`;
            image_frame.onload = function () {
                image_frameLoaded = true;
                drawCard(1, canvas, ctx);
            }

            imageX = x;
            imageY = y;

            image_background.src = src;
            image_background.onload = function () {
                image_background.width = width;
                image_background.height = height;

                image_backgroundLoaded = true;

                drawCard(1, canvas, ctx);
            }
        }

        reader.readAsText(file);
    }

    function drawText(scale, ctx, canvas) {
        var mod = 2;
        var initialFontSize = 40 * scale;
        var fontSize = initialFontSize;
        var text = document.querySelector('.text_textarea').value;
        var w = 373 * 1.1 * scale;
        var h = 180 * 1.1 * scale;

        var x = 240 * scale;
        var y = 560 * scale;

        var polygon = [
            { x: x - w / 2, y: y - h / 2 - 20 * scale },
            { x: x + w / 2, y: y - h / 2 - 20 * scale },
            { x: x + w / 2, y: y + h / 2 - 82 * scale },
            { x: x + w / 2 - 45 * scale, y: y + h / 2 - 82 * scale },
            { x: x + w / 2 - 45 * scale, y: y + h / 2 - 2 * scale },
            { x: x + w / 2 - 75 * scale - 280 * scale, y: y + h / 2 - 2 * scale },
            { x: x + w / 2 - 75 * scale - 280 * scale, y: y + h / 2 - 84 * scale },
            { x: x + w / 2 - 410 * scale, y: y + h / 2 - 84 * scale }
        ]

        if (document.querySelector('.legend_text_input').value) {
            y -= 10 * scale;

            polygon = [
                { x: x - w / 2, y: y - h / 2 - 20 * scale },
                { x: x + w / 2, y: y - h / 2 - 20 * scale },
                { x: x + w / 2, y: y + h / 2 - 82 * scale },
                { x: x + w / 2 - 45 * scale, y: y + h / 2 - 82 * scale },
                { x: x + w / 2 - 45 * scale, y: y + h / 2 - 45 * scale },
                { x: x + w / 2 - 335 * scale, y: y + h / 2 - 45 * scale },
                { x: x + w / 2 - 335 * scale, y: y + h / 2 - 84 * scale },
                { x: x + w / 2 - 410 * scale, y: y + h / 2 - 84 * scale }
            ]
        }

        if (card_type === 'spell') {
            polygon = [
                { x: x - w / 2, y: y - h / 2 - 20 * scale },
                { x: x + w / 2, y: y - h / 2 - 20 * scale },
                { x: x + w / 2, y: y + h / 2 - 82 * scale },
                { x: x + w / 2, y: y + h / 2 - 82 * scale },
                { x: x + w / 2, y: y + h / 2 - 20 * scale },
                { x: x - w / 2, y: y + h / 2 - 20 * scale },
                { x: x - w / 2, y: y + h / 2 - 84 * scale },
                { x: x - w / 2, y: y + h / 2 - 84 * scale }
            ]
        }

        var w0 = polygon[1].x - polygon[0].x;
        var w1 = polygon[4].x - polygon[5].x;

        var h0 = polygon[2].y - polygon[1].y;
        var h1 = polygon[4].y - polygon[3].y;

        h0 *= 0.82;
        h1 *= 0.82;
        w1 *= 0.96;
        w0 *= 1.1;

        var h2 = h0 + h1;

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
        ctx.fillStyle = getTextColor('Description', scale, ctx);

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
        var spaceHeight = fontSize * 0.1;
        var fontHeight = fontSize + spaceHeight;
        var boxHeight = n * fontHeight - spaceHeight;

        var trueX = polygon[0].x;
        var trueY = polygon[0].y;

        var nwide = 0;

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].is_wide) nwide++;
        }

        var fh = fontHeight * 0.92;
        var localY = trueY + (h0 - nwide * fh) / 2 + fh;
        var h_top = imageY - (localY - fh);
        var h_bottom = imageY + h0 + h1 - (localY - fh + fh * lines.length) - 25 * scale;

        if (h_bottom < h_top) {
            localY -= (h_top - h_bottom) / 2;
        }

        for (var i = 0; i < lines.length; i++) {            
            ctx.fillStyle = getTextColor('Description', scale, ctx);

            var parts = lines[i].text.split(/(\[b\]|\[\/b\])/).filter(Boolean);

            var x = canvas.width / 2 - lines[i].width / 2;

            var lineY = localY + i * fontHeight;

            if (lines.length === 1) lineY += 15 * scale;
            if (lines.length === 2) lineY += 15 * scale;
            if (lines.length === 3) lineY -= 5 * scale;
            if (lines.length === 4) lineY -= 10 * scale;

            if (card_type === 'spell') {
                if (lines.length === 1) lineY += 9 * scale;
                if (lines.length === 2) lineY += 11 * scale;
                if (lines.length === 3) lineY += 11.5 * scale;
                if (lines.length === 4) lineY += 5 * scale;
            }
                
            for (var j = 0; j < parts.length; j++) {
                if (parts[j] === '[b]') {
                    ctx.font = `bold ${fontSize}px Franklin Gothic`;
                } else if (parts[j] === '[/b]') {
                    ctx.font = `${fontSize}px Franklin Gothic`;
                } else {


                    if (ctx.font.includes('bold')) {
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; // Менш насичена тінь для жирного тексту
                    } else {
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; // Більш насичена тінь для нормального тексту
                    }


                    ctx.fillText(parts[j], x, lineY);   
                    x += ctx.measureText(parts[j]).width;

                    ctx.fillStyle = getTextColor('Description', scale, ctx);
                }
            }
        }
    }

    function fitText(text, w0, w1, h0, h1, fontSize) {
        if (text) {
            ctx.font = fontSize + `px Franklin Gothic`;

            var lines = [];
            var is_wide = true;

            var y = 0;
            var spaceHeight = fontSize * 0.1;
            var lineHeight = fontSize + spaceHeight;

            var newString = text.replace(new RegExp("\\n", 'g'), " \n ");
            var words = newString.split(' ');
            var line = '';
            var w = w0;

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

                    if (y + lineHeight - spaceHeight > h0) {
                        is_wide = false;
                        w = w1;
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
            var spaceHeight = fontSize * 0.1;
            var lineHeight = fontSize + spaceHeight;
            var linesHeight = lines.length * lineHeight - spaceHeight;

            if (linesHeight > h0 + h1) {
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

        var scale = 1;

        if (image_background.height * image_background.width > image_frame.height * image_frame.width) {
            scale = (image_background.height * image_background.width) / (image_frame.height * image_frame.width);
        } else {
            scale = (image_frame.height * image_frame.width) / (image_background.height * image_background.width);
        }

        drawCard(scale, canvas, ctx);

        var link = document.createElement('a');
        var name_value = document.querySelector('.name_input').value;
        if (name_value) {
            link.download = `${encodeURIComponent(name_value)}.png`;
        } else link.download = `card.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    document.querySelector('.create_json_button').addEventListener('click', () => {
        var width = image_background.width * background_scale;
        var height = image_background.height * background_scale;

        var card_color = document.querySelector('.color_select').value;

        var data = {
            name: document.querySelector('.name_input').value,
            mana: document.querySelector('.mana_input').value,
            attack: document.querySelector('.attack_input').value,
            hp: document.querySelector('.hp_input').value,
            description: document.querySelector('.text_textarea').value,
            card_type: card_type,
            card_color: card_color,
            image: {
                src: image_background.src,
                x: imageX,
                y: imageY,
                width: width,
                height: height,
                scale: background_scale
            }
        }

        console.log(imageX, imageY, background_scale);

        if (!card_color) data.card_color = 'Blue';
        if (card_type === 'legend') data.legend_text = document.querySelector('.legend_text_input').value;
        if (card_type === 'spell') {
            delete data.attack;
            delete data.hp;
        }

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);

        if (data.name) {
            downloadAnchorNode.setAttribute("download", `${data.name}.json`);
        } else downloadAnchorNode.setAttribute("download", `card.json`);

        downloadAnchorNode.setAttribute("download", `${data.name}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    document.querySelector('.legend_text_input').addEventListener('input', () => {
        card_type = 'legend';
        if (document.querySelector('.legend_text_input').value) {
            image_frame.src = `./images/card_colors/${card_color}/card-legend.svg`;
            image_frame.onload = function () {
                image_frameLoaded = true;
                drawCard(1, canvas, ctx);
            }
        } else {
            image_frame.src = `./images/card_colors/${card_color}/card-creature.svg`;
            image_frame.onload = function () {
                image_frameLoaded = true;
                drawCard(1, canvas, ctx);
            }
        }
    });

    document.querySelector('.text_textarea').addEventListener('input', () => {
        drawCard(1, canvas, ctx);
    });

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

    function calculatePositionInPercent(background_scale) {
        return 10 + (background_scale - 1) * (90 - 10) / 2;
    }

    function calculateBackgroundScale(positionInPercent) {
        return 1 + ((positionInPercent - 10) / (90 - 10)) * 2;
    }

    function setPositionFromBackgroundScale(background_scale) {
        let positionInPercent = calculatePositionInPercent(background_scale);

        if (positionInPercent < 10) {
            positionInPercent = 10;
        } else if (positionInPercent > 90) {
            positionInPercent = 90;
        }

        circle.style.left = positionInPercent + "%";
    }

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

        const positionInPixels = mouseX - lineRect.left;
        var positionInPercent = (positionInPixels / (lineRect.width - circle.offsetWidth)) * 100;

        if (positionInPercent < 10) {
            positionInPercent = 10;
        } else if (positionInPercent > 90) {
            positionInPercent = 90;
        }

        circle.style.left = positionInPercent + "%";

        background_scale = calculateBackgroundScale(positionInPercent);

        console.log(background_scale);

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

            imageX += dx;
            imageY += dy;

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

    fetch('/get_card_colors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.text().then(txt => {
            var card_colors = JSON.parse(txt);

            for (var i = 0; i < card_colors.length; i++) {
                var option = document.createElement('option');
                option.className = card_colors[i];
                option.innerHTML = card_colors[i];

                document.querySelector('.color_select').appendChild(option);
            }

            document.querySelector('.color_select').addEventListener('change', () => {
                var value = document.querySelector('.color_select').value;
                if (value) card_color = value;

                image_frame.src = `./images/card_colors/${card_color}/card-${card_type}.svg`;
                image_frame.onload = function () {
                    image_frameLoaded = true;
                    drawCard(1, canvas, ctx);
                }
            });
        });
    });

    var types_names = ['creature', 'spell'];
    card_type = types_names[0];

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
                    document.querySelector('.legend_text_input').value = '';

                    card_type = 'creature';

                    if (document.querySelector('.legend_text_input').value) {
                        card_type = 'legend';
                        image_frame.src = `./images/card_colors/${card_color}/card-legend.svg`;
                        image_frame.onload = function () {
                            image_frameLoaded = true;
                            drawCard(1, canvas, ctx);
                        }
                    } else {
                        image_frame.src = `./images/card_colors/${card_color}/card-creature.svg`;
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
                    document.querySelector('.legend_text_input').value = '';

                    card_type = 'spell';

                    image_frame.src = `./images/card_colors/${card_color}/card-spell.svg`;
                    image_frame.onload = function () {
                        image_frameLoaded = true;
                        drawCard(1, canvas, ctx);
                    }
                }
            }

            if (type !== 'unknown') {
                card_type = type;

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
})();