function Shape(canvas,cobj,copy) {
    this.canvas=canvas;
    this.copy=copy;
    this.cobj=cobj;
    this.width=canvas.width;
    this.height=canvas.height;
    this.type="line";
    this.style="stroke";
    this.fillStyle="#000";
    this.strokeStyle="#000";
    this.lineWidth=1;
    this.history=[];
    this.bianNum=5;
    this.isback=true;
    this.clearSize=25;

}
Shape.prototype={
    init:function () {
        this.cobj.fillStyle=this.fillStyle;
        this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.lineWidth=this.lineWidth;
    },
    draw:function () {
        this.init();
        var that=this;
        that.copy.onmousedown=function (e) {
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.copy.onmousemove=function (e) {
                that.isback=true;
                var endx=e.offsetX;
                var endy=e.offsetY;
                var r=Math.sqrt(Math.pow((endx-startx),2)+Math.pow((endy-starty),2));
                that.cobj.clearRect(0,0,that.width,that.height);
                if (that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                that.cobj.beginPath();
                that[that.type](startx,starty,endx,endy,r);
            };
            that.copy.onmouseup=function () {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                
            }
            
        }
    },
    line:function (x, y, x1, y1) {
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function (x,y,x1,y1) {
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    circle:function (x,y,x1,y1,r) {
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function (x,y,x1,y1,r) {
        var angle=Math.PI*2/this.bianNum;
        for (var i=0;i<this.bianNum;i++){
            this.cobj.lineTo(Math.cos(i*angle)*r+x,Math.sin(i*angle)*r+y)
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function (x,y,x1,y1,r) {
        var angle=Math.PI*2/(this.bianNum*2);
        this.cobj.beginPath();
        for (var i = 0; i <this.bianNum*2; i++) {
            if (i%2==0){
                this.cobj.lineTo(Math.cos(angle*i)*r+x,
                    Math.sin(angle*i)*r+y);
            }else {
                this.cobj.lineTo(Math.cos(angle*i)*r/3+x,
                    Math.sin(angle*i)*r/3+y);
            }


        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen:function () {
        var that=this;
        that.copy.onmousedown=function (e) {
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function (e) {
                that.init();
                that.isback=true;
                var endx=e.offsetX;
                var endy=e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            };
            that.copy.onmouseup=function () {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }

        }
    },
    clear:function (clearObj) {
        var that=this;
        that.copy.onmousemove=function (e) {
            var ox=e.offsetX;
            var oy=e.offsetY;

            move(ox,oy);

        };
        function move(ox,oy) {

            var lefts=ox-that.clearSize/2;
            var tops=oy-that.clearSize/2;
            if (lefts<0){
                lefts=0;
            }
            if (lefts>that.width-that.clearSize){
                lefts=that.width-that.clearSize
            }
            if (tops<0){
                tops=0;
            }
            if (tops>that.height-that.clearSize){

                tops=that.height-that.clearSize
            }

            clearObj.css({
                width:that.clearSize,
                height:that.clearSize,
                left:lefts,
                top:tops,
                display:"block"
            })
        }
        that.copy.onmousedown=function (e) {
            that.copy.onmousemove=function (e) {
                var endx=e.offsetX;
                var endy=e.offsetY;
                move(endx,endy);
                that.cobj.clearRect(endx,endy,that.clearSize,that.clearSize);
            };
            that.copy.onmouseup=function () {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.clear(clearObj);
            }
        };
    },
    fanxiang:function(data,x,y){
        for(var i=0;i<data.width*data.height;i++){
            data.data[i*4+0]=255-data.data[i*4+0];
            data.data[i*4+1]=255-data.data[i*4+1];
            data.data[i*4+2]=255-data.data[i*4+2];
            data.data[i*4+3]=255;
        }
        this.cobj.putImageData(data,x,y);
    },
    masaike:function(dataobj,num,x,y){
        var widths=dataobj.width;
        var heights=dataobj.height;
        var w=widths/num;
        var h=heights/num;
        for(var i=0;i<num;i++){
            for(var j=0;j<num;j++){
                var r=0;
                var g=0;
                var b=0;
                var data=this.cobj.getImageData(j*w,i*h,w,h);
                for(var k=0;k<data.width*data.height;k++){
                    r+=data.data[k*4+0];
                    g+=data.data[k*4+1];
                    b+=data.data[k*4+2];
                }
                var r1=parseInt(r/(data.width*data.height));
                var g1=parseInt(g/(data.width*data.height));
                var b1=parseInt(b/(data.width*data.height));
                for(var m=0;m<data.width*data.height;m++){
                    data.data[m*4+0]=r1;
                    data.data[m*4+1]=g1;
                    data.data[m*4+2]=b1;
                }
                this.cobj.putImageData(data,x+j*w,y+i*h)
            }
        }
    },
    gaosimoh:function(dataobj,num,x,y){
        var arr=[];
        var widths=dataobj.width;
        var heights=dataobj.height;
        var num = num;
        for(var i=0;i< widths;i++){
            for(var j=0;j<heights;j++){

                var x1=j+num>widths?j-num:j;
                var y1=i+num>heights?i-num:i;
                var dataObj=this.cobj.getImageData(x1,y1,num,num);
                var r=0;var g=0;var b=0;
                for(var k=0;k<dataObj.width*dataObj.height;k++){
                    r+=dataObj.data[k*4+0];
                    g+=dataObj.data[k*4+1];
                    b+=dataObj.data[k*4+2];
                }
                r=parseInt(r/(dataObj.width*dataObj.height));
                g=parseInt(g/(dataObj.width*dataObj.height));
                b=parseInt(b/(dataObj.width*dataObj.height));
                arr.push(r,g,b,255);
            }
        }
        for(var i=0;i<dataobj.data.length;i++){
            dataobj.data[i]=arr[i];
        }
        this.cobj.putImageData(dataobj,x,y);

    }

};