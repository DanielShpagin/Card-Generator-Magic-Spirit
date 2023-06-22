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

        /*console.log(document.querySelector('.manaitem_dropdown_content').children);
        for (var i = 0; i < document.querySelector('.manaitem_dropdown_content').children.length; i++) {
            var child = document.querySelector('.manaitem_dropdown_content').children[i];
            child.addEventListener('click', (event) => {
                console.log(event.target.innerHTML);
                document.querySelector('.manaitem_dropdown_btn').innerHTML = event.target.innerHTML;
                console.log(document.querySelector('.manaitem_dropdown_btn').innerHTML);
            });
        }*/

        /*document.querySelector('.manaitem_dropdown_content').children.forEach(child => {
            child.addEventListener('click', (event) => {
                document.querySelector('.manaitem_dropdown_btn').innerHTML = event.target.innerHTML;
            });
        });*/

        /*var mana_elements = [/*'fire', *//*'water'/*, 'earth', 'wind', 'lightling', 'ice', 'dark', 'blood', 'light', 'mechanincs'*//*];
        for (var i = 0; i < mana_elements.length; i++) {
            var manaitem_option = document.createElement('option');
            //manaitem_option.style.backgroundImage = `url(/images/${mana_elements[i]}-element.svg)`;
            manaitem_option.style.backgroundImage = `url('/images/${mana_elements[i]}-element.svg')`;
 
            document.querySelector('.manaitem_select').appendChild(manaitem_option);
        }*/

        /*document.querySelector('.manaitem_dropdown_btn').addEventListener('click', () => {
            document.querySelector('.manaitem_dropdown_content').classList.toggle('show');
        });

        /*document.addEventListener('DOMContentLoaded', () => {
            const dropdownBtn = document.querySelector('.dropdown-btn');
            const dropdownContent = document.querySelector('.dropdown-content');

            dropdownBtn.addEventListener('click', () => {
                dropdownContent.classList.toggle('show');
            });
        });*/

        if (value !== 'Select Card') {
            document.querySelector('.button_start').removeEventListener('click', createCardTemplate);

            /*document.querySelector('.div1').style.display = 'none';
            document.querySelector('.div2').style.display = 'block';*/

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

                    console.log(canvas);

                    let isScaling = false;

                    const image_background = new Image();
                    image_background.src = './images/test-merfolk.jpg';

                    const image_frame = new Image();
                    image_frame.src = './images/card.svg';

                    var centerCanvasX = canvas.width / 2;
                    var centerCanvasY = canvas.height / 2;

                    var x = 0;
                    var y = 0;

                    var imageWidth = 0;
                    var imageHeight = 0;

                    var scale = 1;

                    var cof = 0.75;

                    function drawImages() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        if (image_backgroundLoaded && image_frameLoaded) {
                            console.log(centerCanvasX);
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

                            var fontSize = 53;

                            ctx.globalCompositeOperation = 'source-over';
                            ctx.font = `${fontSize}px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';
                            ctx.fillText(document.querySelector('.name_input').value, 15.073, 49);

                            var mana_value = document.querySelector('.mana_input').value;

                            ctx.font = `${45.4184 / cof}px Franklin Gothic`;
                            ctx.fillStyle = '#8cbde1ff';

                            var x = 440;
                            var y = 35;

                            ctx.font = `${fontSize}px Arial`;

                            var mana_width = ctx.measureText(mana_value).width;
                            var mana_height = fontSize;

                            console.log(x-mana_width/2, y+mana_height/2)

                            ctx.fillText(mana_value, x-mana_width/2, y+mana_height/2);

                            var x1 = 55;
                            var y1 = 615;

                            var attack_value = document.querySelector('.attack_input').value;

                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";

                            ctx.fillText(attack_value, x1, y1);

                            var x2 = 430;
                            var y2 = 610;

                            var health_value = document.querySelector('.hp_input').value;

                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(health_value, x2, y2);

                            if (document.querySelector('.text_textarea').value) drawText();
                        }
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

                        var x = 240;
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

                    if (canvas) {
                        console.log(canvas);
                        image_background.onload = function () {
                            image_backgroundLoaded = true;
                            drawImages(1, 0, 0);
                        }

                        image_frame.onload = function () {
                            image_frameLoaded = true;
                            drawImages(1, 0, 0);
                        }
                    }

                    document.querySelector('.name_input').addEventListener('input', () => {
                        console.log(document.querySelector('.name_input').value);
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

                    document.querySelector('.text_textarea').addEventListener('input', () => {
                        drawImages();
                    })

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

                        // Розрахунок коефіцієнта від 1 до 3
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
                                    document.querySelector('.card-image').style.backgroundImage = `url(${txt})`;
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