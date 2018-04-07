//make UI
var mainWindow = new Window("palette","Mura auto Animation",undefined);
var groupOne = mainWindow.add("group",undefined,"groupOne");
groupOne.add("statictext",undefined,"The prototype of auto animaiton");
var bakeButton = groupOne.add("Button",undefined,"Bake");
var srcWidth = groupOne.add("edittext",undefined,"width"); //get value  = srcWidth.text
var srcHeight = groupOne.add("edittext",undefined,"height");
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

bakeButton.onClick = function()
{
    mangaArray = setLayerInfo();
}
}
catch(e)
{
    alert("No Comp or Layer exist");
}

function setLayerInfo( )
{
    
    var mangaArr = new Array();
    var layername;
    var currentPageSize = 1;
    //按照圖層順序塞資訊
    for(var i =  0; i < layerCounts; i++)
    {
        mangaArr[i] = setPara(mainComp.layer(i+1).name);
    }
    //倒序判斷order
    for(var i = layerCounts - 2  ; i >= 0; i--)
    {       
        if(mangaArr[i].pages.top != mangaArr[i + 1].pages.top || mangaArr[i].pages.page != mangaArr[i + 1].pages.page)
        {
            var size = mangaArr[i + 1].pages.order;
       //     alert(size);
            for(var j = 0 ; j < size ; j++)
            {
                mangaArr[i + 1 + j].srcInfo.pageCount = size;
            }
        }
        else if (i == 0)
        {
            var size = mangaArr[i].pages.order;
        //    alert(size);
            for(var j = 0 ; j < size ; j++)
            {
                mangaArr[i + j].srcInfo.pageCount = size;
            }
        }
    }
    return mangaArr;
}
function setPara(layername)
{
    var manga = {
    srcInfo:
    {
        width:0,
        height:0,
        pageCount:0
    },
    pages:
    {
        page: 0,
        top: 0,
        order: 0,
        totalOrder: 0
    }
};
    manga.pages.page = parseInt(layername.substr(0,3));
    manga.pages.top = parseInt(layername.substr(4,2)); // 在整個畫面中屬於第幾層
    manga.pages.order = parseInt(layername.substr(7,2)); // 在同一層中由左到右第幾個
    return manga;
}
mainWindow.show();
mainWindow.center();