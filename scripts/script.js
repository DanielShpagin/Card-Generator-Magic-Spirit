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
                    console.log(imageLoader);

                    var x = 0;
                    var y = 0;

                    var imageWidth = 0;
                    var imageHeight = 0;

                    var scale = 1;

                    var cof = 0.75;

                    function drawImages() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        if (image_backgroundLoaded && image_frameLoaded) {
                            const devicePixelRatio = window.devicePixelRatio || 1;
                            canvas.width = image_frame.width * devicePixelRatio;
                            canvas.height = image_frame.height * devicePixelRatio;
                            canvas.style.width = `${image_frame.width * cof}px`;
                            canvas.style.height = `${image_frame.height * cof}px`;
                            ctx.scale(devicePixelRatio, devicePixelRatio);
                            ctx.imageSmoothingEnabled = false;

                            canvas.style.width = `${image_frame.width * cof}px`;
                            canvas.style.height = `${image_frame.height * cof}px`;

                            ctx.drawImage(image_frame, 0, 0);
                            ctx.globalCompositeOperation = 'destination-over';

                            const aspectRatio = image_background.width / image_background.height;

                            let newWidth = image_background.width;
                            let newHeight = image_background.height;

                            if (image_background.width / image_background.height > image_frame.width / image_frame.height) {
                                newHeight = canvas.height;
                                newWidth = newHeight * aspectRatio;
                            } else {
                                newWidth = canvas.width;
                                newHeight = newWidth / aspectRatio;
                            }

                            const scaledWidth = newWidth * scale;
                            const scaledHeight = newHeight * scale;

                            imageWidth = newWidth;
                            imageHeight = newHeight;

                            var imageX = (canvas.width - imageWidth * scale) / 2 + x * scale;
                            var imageY = (canvas.height - imageHeight * scale) / 2 + y * scale;

                            if (imageX > 0) imageX = 0;
                            if (imageY > 0) imageY = 0;
                            if (imageX + scaledWidth < canvas.width) imageX = canvas.width - scaledWidth;
                            if (imageY + scaledHeight < canvas.height) imageY = canvas.height - scaledHeight;

                            x = (imageX - (canvas.width - imageWidth * scale) / 2) / scale;
                            y = (imageY - (canvas.height - imageHeight * scale) / 2) / scale;

                            ctx.drawImage(image_background, imageX, imageY, scaledWidth, scaledHeight);

                            var fontSize = 60;

                            ctx.globalCompositeOperation = 'source-over';
                            ctx.font = `50px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';
                            var name_value = document.querySelector('.name_input').value;
                            var name_width = ctx.measureText(name_value).width;
                            ctx.fillText(document.querySelector('.name_input').value, 10, 48);

                            var mana_value = document.querySelector('.mana_input').value;

                            ctx.font = `${45.4184 / cof}px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';

                            var x1 = 439;
                            var y1 = 63;

                            ctx.font = `bold ${fontSize}px Franklin Gothic`;

                            if (mana_value === '2' || mana_value === '3' || mana_value === '9') {
                                x1 = x1+2;
                            } else if (mana_value === '8') x1 = x1+1;

                            var mana_width = ctx.measureText(mana_value).width;

                            console.log(mana_width);

                            ctx.fillText(mana_value, x1-mana_width/2, y1);

                            var x2 = 55;
                            var y2 = 630;

                            var attack_value = document.querySelector('.attack_input').value;
                            var attack_width = ctx.measureText(attack_value).width;

                            if (attack_value === '2' || attack_value === '3' || attack_value === '9') {
                                x2 = x2+2;
                            } else if (attack_value === '8') x2 = x2+1;

                            ctx.fillText(attack_value, x2-attack_width/2, y2);

                            var x3 = 431;
                            var y3 = 630;

                            var health_value = document.querySelector('.hp_input').value;
                            var health_width = ctx.measureText(health_value).width;

                            if (health_value === '2' || health_value === '3' || health_value === '9') {
                                x3 = x3+2;
                            } else if (health_value === '8') x3 = x3+1;

                            ctx.fillText(health_value, x3-health_width/2, y3);

                            ctx.font = `40px Franklin Gothic`;

                            var legend_text = document.querySelector('.legend_text_input').value;
                            var legend_text_width = ctx.measureText(legend_text).width;

                            var x4 = 245;
                            var y4 = 657;

                            ctx.fillText(legend_text, x4-legend_text_width/2, y4);

                            if (legend_text) {
                                var x5 = 195;
                                var y5 = 78;

                                ctx.font = `30px Franklin Gothic`;
                                ctx.fillText('LEGEND', x5, y5);
                            }

                            if (document.querySelector('.text_textarea').value) drawText();
                        }
                    }

                    function handleImage(e) {
                        console.log(e);
                        let reader = new FileReader();
                        reader.onload = function (event) {
                            console.log(event.target.result);
                            image_background.src = event.target.result;
                            image_background.onload = function () {
                                image_backgroundLoaded = true;
                                drawImages();
                            }
                        }
                        reader.readAsDataURL(e.target.files[0]);  
                    }

                    function drawText() {
                        var mod = 2;
                        var initialFontSize = 53 * 1.1;
                        var fontSize = initialFontSize;
                        var text = document.querySelector('.text_textarea').value;
                        var w = 373 * 1.1;
                        var h = 180 * 1.1;

                        var prevFit = checkText(text, w, h, fontSize);

                        while (true) {
                            if (mod <= 1.01) break;

                            var nowFit = checkText(text, w, h, fontSize);

                            if (nowFit) {
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

                        var lines = separationText(text, w, h, fontSize);

                        var x = 220;
                        var y = 510;

                        /*ctx.beginPath();
                        ctx.arc(x, y, 10, 0, 2 * Math.PI);
                        ctx.fillStyle = 'black';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.fillRect(x - w / 2, y - h / 2, w, h);
                        ctx.fillStyle = 'black';
                        ctx.fill();*/

                        ctx.font = `${fontSize}px Franklin Gothic`;
                        ctx.fillStyle = '#8cbde1ff';

                        var n = lines.length;
                        var spaceHeight = fontSize * 0.2;
                        var fontHeight = fontSize + spaceHeight;
                        var boxHeight = n * fontHeight - spaceHeight;

                        for (let i = 0; i < lines.length; i++) {
                            let metrics = ctx.measureText(lines[i]);
                            let textWidth = metrics.width;
                            let x = canvas.width / 2 - textWidth / 2;
                            ctx.fillText(lines[i], x, y + i * fontHeight - boxHeight / 2 + (fontHeight - spaceHeight) / 2);
                        }
                    }

                    function separationText(text, w, h, fontSize) {
                        if (text) {
                            ctx.font = fontSize + `px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';

                            let paragraphs = text.split('\n');
                            let lines = [];

                            for (let p = 0; p < paragraphs.length; p++) {
                                let words = paragraphs[p].split(' ');
                                let line = '';

                                for (let n = 0; n < words.length; n++) {
                                    let testLine = line + ' ' + words[n];
                                    let metrics = ctx.measureText(testLine);
                                    let testWidth = metrics.width;

                                    if (testWidth > w) {
                                        if (n === 0) return false
                                        lines.push(line.trim());
                                        line = words[n];
                                    } else {
                                        line = testLine;
                                    }
                                }


                                lines.push(line.trim());
                            }

                            return lines;
                        }
                    }

                    function checkText(text, width, height, fontSize) {
                        if (text) {
                            ctx.font = fontSize + `px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';

                            let paragraphs = text.split('\n');
                            let line = '';
                            let y = 0;
                            let lineHeight = fontSize * 1.2;

                            for (let p = 0; p < paragraphs.length; p++) {
                                let words = paragraphs[p].split(' ');
                                line = '';

                                for (let n = 0; n < words.length; n++) {
                                    let testLine = line + ' ' + words[n];
                                    let metrics = ctx.measureText(testLine);
                                    let testWidth = metrics.width;

                                    if (testWidth > width) {
                                        if (n === 0) return false;

                                        line = words[n];
                                        y += lineHeight;

                                        if (y + lineHeight > height) {
                                            return false;
                                        }
                                    } else {
                                        line = testLine;
                                    }
                                }

                                y += lineHeight;

                                if (y + lineHeight > height) {
                                    return false;
                                }
                            }

                            return true;
                        }
                    }

                    let image_backgroundLoaded = false;
                    let image_frameLoaded = false;

                    image_background.onload = function () {
                        image_backgroundLoaded = true;
                        drawImages(1, 0, 0);
                    }

                    image_frame.onload = function () {
                        image_frameLoaded = true;
                        drawImages(1, 0, 0);
                    }

                    document.querySelector('.name_input').addEventListener('input', () => {
                        drawImages();
                    });

                    document.querySelector('.mana_input').addEventListener('input', () => {
                        var value = document.querySelector('.mana_input').value;
                        if (value.length > 2) document.querySelector('.mana_input').value = value.slice(0, 2);
                        drawImages();
                    });

                    document.querySelector('.attack_input').addEventListener('input', () => {
                        var value = document.querySelector('.attack_input').value;
                        if (value.length > 2) document.querySelector('.attack_input').value = value.slice(0, 2);
                        drawImages();
                    });

                    document.querySelector('.hp_input').addEventListener('input', () => {
                        var value = document.querySelector('.hp_input').value;
                        if (value.length > 2) document.querySelector('.hp_input').value = value.slice(0, 2);
                        drawImages();
                    });

                    document.querySelector('.create_button').addEventListener('click', () => {
                        let link = document.createElement('a');
                        var name_value = document.querySelector('.name_input').value;
                        if (name_value) {
                            link.download = `${encodeURIComponent(name_value)}.png`;
                        } else link.download = `card.png`;
                        link.download = 'image.png';
                        link.href = canvas.toDataURL();
                        link.click();
                    })

                    document.querySelector('.legend_text_input').addEventListener('input', () => {
                        if (document.querySelector('.legend_text_input').value) {
                            image_frame.src = './images/card-legend.svg';
                            image_frame.onload = function () {
                                image_frameLoaded = true;
                                drawImages();
                            }
                        } else {
                            image_frame.src = './images/card.svg';
                            image_frame.onload = function () {
                                image_frameLoaded = true;
                                drawImages();
                            }
                        }
                    });

                    document.querySelector('.text_textarea').addEventListener('input', () => {
                        drawImages();
                    });

                    let lastX;
                    let lastY;
                    let offsetX = 0;
                    let offsetY = 0;

                    function calculateCoefficient(offsetLeft) {
                        const range = 190 - 10;
                        const progress = (offsetLeft - 10) / range;
                        const coefficient = 1 + progress;
                        return coefficient;
                    }

                    const container = document.querySelector('.line-container');
                    const line = document.querySelector('.line');
                    const circle = document.querySelector('.circle');

                    let mouseDown = false;

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

                        let mouseX = e.clientX - circle.offsetWidth / 2;

                        if (mouseX < minX) {
                            mouseX = minX;
                        } else if (mouseX > maxX) {
                            mouseX = maxX;
                        }

                        const positionInPixels = mouseX - lineRect.left;
                        let positionInPercent = (positionInPixels / (lineRect.width - circle.offsetWidth)) * 100;

                        if (positionInPercent < 10) {
                            positionInPercent = 10;
                        } else if (positionInPercent > 90) {
                            positionInPercent = 90;
                        }

                        const coefficient = 1 + ((positionInPercent - 10) / (90 - 10)) * 2;
                        circle.style.left = positionInPercent + "%";

                        scale = coefficient;

                        drawImages();
                    });

                    let isDragging = false;
                    let lastMousePos;

                    canvas.addEventListener('mousedown', (e) => {
                        if (e.button === 0) { // Ліва кнопка миші
                            isDragging = true;
                            lastMousePos = { x: e.clientX, y: e.clientY };
                        }
                    });

                    canvas.addEventListener('mousemove', (e) => {
                        if (isDragging) {
                            if (!circle.style.left) circle.style.left = `10%`;
                            var dx = e.clientX - lastMousePos.x;
                            var dy = e.clientY - lastMousePos.y;

                            x += dx / scale;
                            y += dy / scale;

                            drawImages(scale);

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
                                    document.querySelector('.card-stats-container').style.display = 'flex';
                                },
                                'spell': () => {
                                    document.querySelector('.attack_input').disabled = true;
                                    document.querySelector('.hp_input').disabled = true;
                                    document.querySelector('.card-stats-container').style.display = 'none';
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
                                    image_background.src = txt;
                                    image_background.onload = function () {
                                        image_backgroundLoaded = true;
                                        drawImages();
                                    }
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