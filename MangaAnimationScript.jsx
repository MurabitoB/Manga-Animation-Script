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
var fps; //fps offset
var layerCounts; //counts of layer

// layer Info
var mangaArray = new Array();
var manga = {
    
    srcInfo:
    {
        width:0,
        height:0
    },
    pages:
    {
        page: 0,
        top: 0,
        order: 0,
        totalOrder: 0
    }
};

try 
{
//CompItems
mainComp = app.project.activeItem;
mainLayer = mainComp.layer(1);
layerCounts = mainComp.numLayers;
fps = Math.round(mainComp.frameRate)/30;

bakeButton.onClick = function()
{
    mangaArray[layerCounts-1] = manga;
    for(var i = 0 ; i < layerCounts;i++)
    {
        mangaArray[i] = manga;
    }
    alert("work");
   // Array.forEach(mangaArray,setLayerInfo,null);
    alert("works");
    alert(parseInt(mangaArray[2].srcInfo.width));
    alert(parseInt(mainLayer.name.substr(4,2)));
    alert(parseInt(mainLayer.name.substr(7,2)));
    mainLayer.inPoint = 10;
    mainLayer.outPoint = 20;
}

}
catch(e)
{
    alert("No Comp or Layer exist");
}
function setLayerInfo( element , index , array )
{
    alert("into function");
    var layername = mainLayer(index + 1);
    var strIndex = 0;
    element.pages.page = parseInt(layername.name.substr(0,3));
    element.pages.top = parseInt(layername.name.substr(4,2));
    element.pages.order = parseInt(layername.name.substr(7,2));
    
}

mainWindow.show();
mainWindow.center();