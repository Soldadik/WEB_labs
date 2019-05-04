const quoteURL = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=ru&jsonp=makeCollage';
const imageURL = 'https://api.unsplash.com/photos/random/?client_id=2ee621fa11e274615105e66dcac2e3527aabc7d5b1c9812a654dd9331bc42220&&count=4';

//Холст
var Canvas = document.createElement("canvas");
Canvas.id = "collage";
Canvas.style.display = 'block';
Canvas.style.margin = '0 auto';
document.body.appendChild(Canvas);

var getQuote = document.createElement('script');
var testQuote = '';
getQuote.src = quoteURL;
document.getElementsByTagName("head")[0].appendChild(getQuote);

var makeCollage = function makeQuote(response)
{
    var collage = document.getElementById("collage");
    collage.height = 800;
    collage.width = 800;
    var ctx = collage.getContext('2d');
    ctx.font = "28px Times New Roman";
    ctx.fillStyle = 'white';
    ctx.textAlign = "center";
    var lineHeight = 40;

    //Изображения
    images = []
    for (let i = 0; i < 4; i++)
    {
        images[i] = new Image();
        images[i].crossOrigin = 'Anonymous';
    }

    testQuote = response.quoteText;
    var slicedQuote = testQuote.split(" ");
    var loaded_num = 0;

    $.ajax({
        type: 'GET',
        url: imageURL,
        dataType: 'json',
        success: function (data)
        {
            var img = data;
            for (var i = 0; i < images.length; i++)
            {
                images[i].src = img[i].urls.raw + "&w=400&h=400&fit=crop&crop=left";
            }
        }
    });

    for (let i = 0; i < images.length; i++)
    {
        images[i].addEventListener('load', function ()
        {
            var line = 0;
            var quoteLine = "";
            loaded_num++;
            //Яркость картинок
            ctx.filter = 'brightness(40%)'
            if (loaded_num === 4)
            {
                ctx.fillRect(0, 0, collage.width, collage.height);
                //Размещение изображений
                for (var i = 0; i < images.length; i++)
                {
                    ctx.drawImage(images[i], (i % 2) * 400, Math.floor(i / 2) * 400);
                }
                //Яркость текста
                ctx.filter = 'brightness(100%)';
                //Размещение текста
                for (let j = 0; j < slicedQuote.length; j += 6)
                {
                    quoteLine = "";
                    for (let k = j; k < j + 6; k++)
                    {
                        if (slicedQuote[k] !== undefined)
                        {
                            quoteLine = quoteLine + " " + slicedQuote[k];
                        }
                    }
                    ctx.fillText(quoteLine, collage.width / 2, collage.height * 2.25 / 5 + lineHeight * line);
                    line++;
                }
            }
        }, false);
    }
};