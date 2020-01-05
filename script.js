// pixal perfect image gallery
// writen @ashen007

(function () {
    'use strict';
    let userDtl = {
        colums: 4,
        hover: true,
        optionMenu: true,
        padding: 5,
        roundConer: true
    };

    let Default = {
        padding: false,
        hover: false,
        fullSize: false,
        roundBorder: false,
        optionMenu: false,
        roundConer: false,
        popup: true
    }

    let prevImg = [];

    function hidePopUp(element) {
        let remove = document.getElementById(element);
        document.querySelector('body').removeChild(remove);
    }

    function cancelBtn(element) {
        let btnWrap = document.createElement('div');
        btnWrap.setAttribute('id', 'cancelBtn');
        btnWrap.style.cssText = 'position: absolute; top: 2%; right: 1%; color: #ffffff; font-size: 30px;';
        btnWrap.insertAdjacentHTML('afterbegin', '<i class="far fa-times-circle"></i>');
        document.getElementById(element).append(btnWrap);
    }

    //----------------------------------------------------------------------------------------
    //create proper formated htlm code block

    if (userDtl.colums) {
        let formating = (function () {
            let element = Array.from(document.querySelectorAll('img.galleryImg'));
            let imgLocation = element.map(element => element.src);
            let imgCount = element.length;
            document.getElementById('gallery').innerHTML = '';

            for (let i = 0; i < userDtl.colums; i++) {
                let createColomn = document.createElement('div');

                createColomn.setAttribute('class', 'colomn');
                document.getElementById('gallery').append(createColomn);
            }

            let addImgToColomn = (function () {
                let colomn = Array.from(document.querySelectorAll('div.colomn'));
                let row = 0;

                // create img tag
                let createImgTag = (function (colomnCount, targetImg = 0) {
                    let createWrapper = document.createElement('div');
                    let createImg = document.createElement('img');

                    createWrapper.setAttribute('class', 'wrapper');
                    createWrapper.style.cssText = 'position: relative;';
                    createImg.setAttribute('class', 'galleryImg');
                    createImg.setAttribute('src', imgLocation[targetImg]);
                    createWrapper.append(createImg);
                    colomn[colomnCount].append(createWrapper);
                })

                // desiding count of rows
                if ((imgCount % colomn.length) != 0) {
                    row = Math.round(imgCount / colomn.length);
                } else {
                    row = imgCount / colomn.length;
                }

                // add images to block
                for (let i = 0; i < row; i++) {
                    if (imgLocation.length <= colomn.length) {
                        if (imgLocation.length < colomn.length) {
                            imgLocation.splice(0, 1);
                        }
                        for (let k = 0; k < imgLocation.length; k++) {
                            createImgTag(k, k);
                        }
                    } else {
                        for (let j = 0; j < colomn.length; j++) {
                            createImgTag(j, 0);

                            if (imgLocation.length >= colomn.length) {
                                imgLocation.splice(0, 1);
                            }
                        }
                    }
                }
            })();

        })();
    }
    //---------------------------------------------------------------------------------------------
    // taking image detailes
    let imageDtails = (function () {
        let imgElement = Array.from(document.querySelectorAll('img.galleryImg'));
        let imgLocation = imgElement.map(img => img.src);
        let imgWidth = imgElement.map(element => element.width);
        let imgHeight = imgElement.map(element => element.height);
        const imgDtl = imgLocation.map((location, i) => ({
            location: location,
            width: imgWidth[i],
            height: imgHeight[i],
            ratio: (imgWidth[i] / imgHeight[i])
        }));

        return {
            element: imgElement,
            src: imgLocation,
            details: imgDtl
        };
    })();
    //---------------------------------------------------------------------------------------------
    // calculate image size for block

    let decidePosibleSize = (function () {
        let parentElemnt = document.getElementById('gallery');
        parentElemnt.style.cssText = 'position: relative; display: flex; flex-wrap: wrap; width: 91%; margin: 0px auto;';
        const parentEleSize = [parentElemnt.offsetHeight, parentElemnt.offsetWidth];

        let size = (function () {
            let coloumnSize = 0;
            let adjestedHeight = [];

            // spacing among images

            if (userDtl.padding || Default.padding) {
                let paddingSize = (userDtl.padding || Default.padding) * userDtl.colums * 2;
                coloumnSize = (parentEleSize[1] - paddingSize) / userDtl.colums;
            } else {
                coloumnSize = (parentEleSize[1] / userDtl.colums);
            }
            for (let i = 0; i < imageDtails.details.length; i++) {
                adjestedHeight[i] = coloumnSize / imageDtails.details[i].ratio;
            }

            return adjestedHeight.map((height, width) => ({
                height: height,
                width: coloumnSize
            }));
        })();
        return {
            size: size,
            parent: parentElemnt
        };
    })();
    //---------------------------------------------------------------------------------------------------
    // add size to images

    let setSizeToImage = (function () {
        for (let i = 0; i < imageDtails.details.length; i++) {
            imageDtails.element[i].style.cssText = 'display: block; width: ' + decidePosibleSize.size[i].width + 'px; height: ' + decidePosibleSize.size[i].height + 'px; padding: ' + userDtl.padding + 'px;';

            if (userDtl.roundConer || Default.roundConer) {
                imageDtails.element[i].style.border = 'none';
                imageDtails.element[i].style.borderRadius = '5%';
            }
        }
    })();
    //----------------------------------------------------------------------------------------------------
    // hovering efect 

    if (Default.optionMenu || userDtl.optionMenu) {
        let createOptionMenu = (function () {
            for (let i = 0; i < imageDtails.element.length; i++) {
                let parentElement = document.createElement('div');
                parentElement.setAttribute('class', 'optionMenu');
                parentElement.style.cssText = 'position: absolute; display: none; top: 44%; right: 25%; transition: 500ms ease-in;';
                parentElement.insertAdjacentHTML('afterbegin', '<div class = "buble"><i class="fas fa-expand"></i></div><div class = "buble"><i class="fas fa-info"></i></div><div class = "buble"><i class="fas fa-share-alt"></i></div><div class = "buble"><i class="fas fa-thumbtack"></i></div>');
                Array.from(document.querySelectorAll('div.wrapper'))[i].append(parentElement);
            }

            let setFunctionalty = (function () {
                let menuBuble = Array.from(document.querySelectorAll('div.buble'));

                for (let i = 0; i < menuBuble.length; i++) {
                    menuBuble[i].style.cssText = 'width: 40px; height: 40px; border: 1px solid #000000; border-radius: 50%; margin: 6px;';
                }
                return menuBuble;
            })();

            return setFunctionalty;
        })();
    }
    //----------------------------------------------------------------------------------------------------
    // hover event handling

    let hoverEfect = (function (hover) {
        let targetedImg = hover.target;

        let hoverEfect = (function (target) {
            target.classList.add('hover');
            target.nextElementSibling.style.display = 'flex';
        });

        if (prevImg.length != 0 && targetedImg.classList.contains('galleryImg')) {
            let removeHoverEfect = (function () {
                for (let i = 0; i < imageDtails.element.length; i++) {
                    if (imageDtails.element[i].classList.contains('hover')) {
                        imageDtails.element[i].classList.remove('hover');
                    }
                }
                prevImg[0].nextElementSibling.style.display = 'none';
            })();
        }

        if (targetedImg.classList.contains('galleryImg')) {
            let insertHoverEfect = (function () {
                prevImg[0] = targetedImg;
                hoverEfect(targetedImg);
            })();
        }
        if (targetedImg.classList.contains('optionMenu')) {
            prevImg[0].classList.add('hover');
        }
    });
    //----------------------------------------------------------------------------------------------------
    // clicking event handling

    let optionMenuClicking = (function (click) {
        let clickedTarget = click.target;

        if (clickedTarget.classList.contains('fas')) {
            if (clickedTarget.classList.contains('fa-expand')) {
                // relavent action
                let expanding = (function () {
                    let createImgStage = document.createElement('div');
                    let createImg = document.createElement('img');

                    function verticalCenter(height) {
                        let imgHeight = height;
                        let screenSize = window.innerHeight;
                        let positionFromTop = Math.round((((screenSize - imgHeight) / 2) / screenSize) * 100);

                        return positionFromTop;
                    }

                    createImgStage.setAttribute('id', 'fullSizeImg');
                    createImg.setAttribute('src', prevImg[0].src);
                    let top = verticalCenter(createImg.height);
                    createImgStage.style.cssText = 'position: fixed; top: 0%; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9);';
                    createImg.style.cssText = 'width: auto; height: auto; display: block; position: relative; margin: 0px auto; top: ' + top + '%;';

                    createImgStage.append(createImg);
                    document.querySelector('body').append(createImgStage);
                    cancelBtn('fullSizeImg');

                    {
                        document.getElementById('cancelBtn').addEventListener('click', function () {
                            hidePopUp('fullSizeImg');
                        }, false);
                    }
                })();
            }
            if (clickedTarget.classList.contains('fa-info')) {
                // relavent action
            }
            if (clickedTarget.classList.contains('fa-share-alt')) {
                // relavent action
            }
            if (clickedTarget.classList.contains('fa-thumbtack')) {
                // relavent action
            }
        }
    });

    //----------------------------------------------------------------------------------------------------
    // hover event handling

    if (Default.hover || userDtl.hover) {
        document.addEventListener('mouseover', hoverEfect, false);
    }
    if (Default.popup || userDtl.popup) {
        document.addEventListener('click', optionMenuClicking, false);
    }
})();
