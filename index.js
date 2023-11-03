var express = require('express');
var socket = require('socket.io');
var path = require('path');
var port = process.env.PORT || 5000;

var app = express();
var server = express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(port, () => console.log(`Listening on 5001`));

io = socket(server);

vid = {};
users = [];
pendingOnline = [];

setInterval(function() {

    onlineRand = rand(0, 100);
    io.sockets.emit('onlineQuery', onlineRand);
    console.log(pendingOnline);
    users = pendingOnline;
    pendingOnline = [];

    for(usr in vid){
    console.log(usr);
    	if(!users.includes(usr)){
    		if(users.length>2)delete vid[usr];
    	}
    }

}, 1000);

io.on('connection', function(socket) {

    io.to(socket.id).emit('connected', socket.id);

    users.push(socket.id);
    //console.log(JSON.stringify(vid));

    socket.on('data', function(data) {
        //vid[socket.id]=JSON.parse(data);

        dat = JSON.parse(data);
        pix = dat['imgData'].split(',');

        px = [];
        pxNum = 0;
        for (i = 0; i < pix.length; i += 1) {
            q = pix[i];

            if (q.length > 3) {
                iter = parseInt(q.slice(3, ));
                for (j = 0; j < iter; j++) {
                    px.push('' + q.slice(0, 3));
                    //if((pxNum+1)%3==0)px.push('255');
                    //console.log(pxNum+' '+q.slice(0,3));

                    pxNum++;
                }
            } else {

                px.push(q);
                //console.log(pxNum+' '+q.slice(0,3));
                //if((pxNum+1)%3==0)px.push('255');

                pxNum++;
            }
        }

        dat['imgData'] = px.toString();
        vid[socket.id] = dat;

        //console.log(px.length);

        tmp = clone(vid);
        //delete tmp[socket.id]

        for (v in tmp) {

            pxData = tmp[v]['imgData'].split(',');
            pixelLength = pxData.length;

            console.log(pixelLength);

            convScale = tmp[socket.id]['rcvScale'].split('-');
            senderScale = tmp[v]['rcvMySendScale'].split('-');

            if (convScale.toString() != senderScale.toString) {

                xTakes = 1;
                xSkips = senderScale[0] / convScale[0] - 1;
                if (xSkips < 1 && xSkips != 0) {
                    xTakes = Math.round(1 / xSkips);
                    xSkips = 1;
                }
                yTakes = 1;
                ySkips = senderScale[1] / convScale[1] - 1;
                if (ySkips < 1 && ySkips != 0) {
                    yTakes = Math.round(1 / ySkips);
                    ySkips = 1;
                }

                //console.log(convScale.toString()+' '+senderScale.toString());

                //console.log(xTakes+' '+xSkips);

                resultPix = [];

                for (pixelNum = 0; pixelNum < pixelLength; pixelNum += 0) {

                    for (ty = 0; ty < yTakes; ty++) {
                        //	console.log(yTakes+' '+ty);


                        for (innerPixelNum = 0; innerPixelNum < senderScale[0]; innerPixelNum += 0) {

                            for (tx = 0; tx < xTakes; tx++) {
                                resultPix.push(pxData[pixelNum]);
                                resultPix.push(pxData[pixelNum + 1]);
                                resultPix.push(pxData[pixelNum + 2]);
                                pixelNum += 3;
                                innerPixelNum++;
                            }
                            for (xs = 0; xs < xSkips; xs++) {
                                pixelNum += 3;
                                innerPixelNum++;
                            }
                        }
                    }

                    pixelNum += ySkips * senderScale[0] * 3;



                }
                


            }
            strr=[];
			lastVal='99999';
			arrLen=0;
				for(i=0;i<resultPix.length;i+=1){
			        	//if((i+1)%4!=0){
			        	m=resultPix[i];
			        	//if(m.length==3){
			        		if(m==lastVal){
			        			last = parseInt(strr[arrLen-1].slice(3,));
			        			if(!last)last=1;
			        			strr[arrLen-1]=m+(last+1);
			        			//alert(strr[arrLen-1]);
			        			lastVal=m;
			        			}else{
			        			strr.push(m);
			        			lastVal=m;
			        			arrLen+=1;
			        		}
			     }
			console.log(pixelLength + ' - ' + resultPix.length+' - '+strr.length); //pixelNum+' '+pixelLength);
			
            tmp[v]['imgData'] = strr.toString();//resultPix.toString();
            tmp[v]['convertedScale'] = convScale[0] + '-' + convScale[1];


        }





        io.to(socket.id).emit('returnData', JSON.stringify(tmp));




    });

    socket.on('yesOnline', function(data) {
        if (data == onlineRand) pendingOnline.push(socket.id);
    });

    socket.on('audio', function(data) {
		console.log('rcv'+data);
    });

});


function copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;

    for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
