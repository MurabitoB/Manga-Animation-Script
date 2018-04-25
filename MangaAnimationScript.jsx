//make UI
var mainWindow = new Window("palette","Mura auto Animation",undefined);
//mainWindow.add("image",undefined,"C:/img.png");
var groupOne = mainWindow.add("group",undefined,"groupOne");
groupOne.add("statictext",undefined,"The prototype of auto animaiton");
var bakeButton = groupOne.add("Button",undefined,"Bake");
groupOne.orientation = "column";

// global variable
var mainComp;
var mainLayer;
var fps; // fps offset
var layerCounts; // counts of layer

// layer Info
var mangaArray = new Array();


try 
{
//CompItems
mainComp = app.project.activeItem;
mainLayer = mainComp.layer(1);
layerCounts = mainComp.numLayers;
fps = Math.round(mainComp.frameRate)/30; //offset of frame rate

//按下按鈕

bakeButton.onClick = function()
{
    //setMid(mainLayer.width / 2)
    mangaArray = setLayerInfo();
 //   alert(mangaArray[0].srcInfo.pageCount);
    setAllScale(mainComp);
    cutLayerTime(mangaArray);
    setFinalPosition(mangaArray);
    setAllKeyframe(mainComp);
}
}
catch(e)
{
    alert("No Comp or Layer exist");
}

function setAllScale(comp)
{
    for(var i = 1 ;i <= layerCounts ; i++)
    {
        setScale(comp.layer(i),mangaArray[i-1].srcInfo.aspectRatio,comp.width,comp.height);
    }
}
function setAllKeyframe(comp)
{
    for(var i = 1 ;i <= layerCounts ; i++)
    {
        setPositionKeyframe(comp.layer(i));
    }
}
//設定圖片最終大小
function setScale(layer,ratio,compWidth,compHeight)
{
   if(ratio > 2)
   {
    layer.scale.setValue([100 *(compWidth / layer.width ),100 * (compWidth / layer.width)]);
   }
   else
   {
    layer.scale.setValue([100 *(compHeight / layer.height ),100 * (compHeight / layer.height)]);
   }
   //  layer.scale.setValue([120,100]);
}
//紀錄圖片資訊
function setLayerInfo( )
{
    var mangaArr = new Array();
    var layername;
    var currentPageSize = 1;
    var group = 1;
    //按照圖層順序塞資訊
    for(var i =  0; i < layerCounts; i++)
    {
        mangaArr[i] = setPara(mainComp.layer(i+1).name);
        mangaArr[i].srcInfo.width = mainComp.layer(i+1).width;
        mangaArr[i].srcInfo.height = mainComp.layer(i+1).height;
        mangaArr[i].srcInfo.aspectRatio = mangaArr[i].srcInfo.width / mangaArr[i].srcInfo.height;
        
    }
    //倒序判斷order
    for(var i = layerCounts - 2  ; i >= 0; i--)
    {       
        
       if(i == 0 || mangaArr[i].pages.top != mangaArr[i + 1].pages.top || mangaArr[i].pages.page != mangaArr[i + 1].pages.page)
        {
            var size = mangaArr[i + 1].pages.order;
            for(var j = 0 ; j < size ; j++)
            {
                mangaArr[i + 1 + j].srcInfo.pageCount = size;
                mangaArr[i + 1 + j].srcInfo.group = group;
            }
            group++;
        }
        if (i == 0)
        {
            
            var size = mangaArr[i].pages.order;
            for(var j = 0 ; j < size ; j++)
            {
                mangaArr[i + j].srcInfo.pageCount = size;
                mangaArr[i + j].srcInfo.group = group;
            }
            group++;
        }
    }
    return mangaArr;
}

//從檔名中切割資訊
function setPara(layername)
{
    var manga = {
    srcInfo:
    {
        width:0,
        height:0,
        pageCount:0,
        group:0, 
        aspectRatio:0 //長寬比
    },
    pages:
    {
        page: 0,
        top: 0,
        order: 0,
        totalOrder: 0
    }
};

    manga.pages.page = parseInt(layername.substr(0,1))* 100 + parseInt(layername.substr(1,1))*10 + parseInt(layername.substr(2,1)) ;
    manga.pages.top = parseInt(layername.substr(4,2)); // 在整個畫面中屬於第幾層
    manga.pages.order = parseInt(layername.substr(7,2)); // 在同一層中由左到右第幾個
    return manga;
}
//定義演出時間
function cutLayerTime(layerArr)
{
    var start = 0;
    var duration = 3.5;
    var groupT = 1;
    for(var i = layerCounts-1; i >= 0 ;i--)
    {
        if(groupT != layerArr[i].srcInfo.group)
        {
            start+=1.5;
            groupT++;
        }
        layerDuration(mainComp.layer(i+1),start,duration);
    }
   
}
//設定最終layout位置
function setFinalPosition(layerArr)
{
    var halfCompHeight = mainComp.height / 2
    var compWidth = mainComp.width;
    for(var i = layerCounts-1; i >= 0 ;i--)
    {
       mainComp.layer(i+1).position.setValue([ compWidth / (1 + layerArr[i].srcInfo.pageCount) * layerArr[i].pages.order , halfCompHeight]);
    }
}
//設定圖層起始點和終點
function layerDuration(layer,startTime,layerDuration)
{
    layer.inPoint = startTime ;
    layer.outPoint = startTime + layerDuration;
}
//設定位移關鍵影格
function setPositionKeyframe(layer)
{
    var finalX = layer.position.value[0];
    var finalY = layer.position.value[1];
    var noise = Math.random();
    var compHalfWidth = mainComp.width / 2;
    var compHalfHeight = mainComp.height / 2;
    var animationTime = 2;
    layer.opacity.setValueAtTime(layer.inPoint,0);
    layer.opacity.setValueAtTime(layer.inPoint+0.5,100);
    layer.opacity.setValueAtTime(layer.outPoint-0.5,100);
    layer.opacity.setValueAtTime(layer.outPoint,0);
    if(Math.random()> 0.75) //從右邊進場
    { 
      layer.position.setValueAtTime(layer.inPoint, [finalX + compHalfWidth * noise ,finalY]);
      layer.position.setValueAtTime(layer.outPoint - animationTime , [finalX,finalY]);
    }
    else if (Math.random()>0.5)//從左邊進場
    {
      layer.position.setValueAtTime(layer.inPoint, [finalX - compHalfWidth * noise ,finalY]);
      layer.position.setValueAtTime(layer.outPoint - animationTime , [finalX,finalY]);
    }
    else if (Math.random()>0.25)//從上面進場
    {
      layer.position.setValueAtTime(layer.inPoint, [finalX,finalY - compHalfHeight * noise]);
      layer.position.setValueAtTime(layer.outPoint - animationTime , [finalX,finalY]);
    }
    else //從下面進場
    {
      layer.position.setValueAtTime(layer.inPoint, [finalX,finalY + compHalfHeight * noise]);
      layer.position.setValueAtTime(layer.outPoint - animationTime , [finalX,finalY]);
    }
}
function setAllOpacity()
{

}
mainWindow.show();
mainWindow.center();