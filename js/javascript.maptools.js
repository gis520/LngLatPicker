var mapObj,geocoderTool;
//初始化地图对象，加载地图
function mapInit(){
	mapObj = new AMap.Map("iCenter",{
	center:new AMap.LngLat(116.397428,39.90923), //地图中心点
	resizeEnable:true,
	level:13  //地图显示的缩放级别
	});	
	mapObj.plugin(["AMap.ToolBar","AMap.OverView","AMap.Geocoder"],function(){		
		toolBar = new AMap.ToolBar({offset:new AMap.Pixel(0,30)});
		mapObj.addControl(toolBar);	

		//加载鹰眼
		overView = new AMap.OverView({isOpen:true});
		mapObj.addControl(overView);
		
		geocoderTool = new AMap.Geocoder({
				radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
				extensions: "all" //返回地址描述以及附近兴趣点和道路信息，默认“base”
			});
			//返回地理编码结果
			AMap.event.addListener(geocoderTool, "complete", geocoder_CallBack); 
	});
	AMap.event.addListener(mapObj,'complete',autoLocationToCity);
	AMap.event.addListener(mapObj,'mousemove',function(e){
		 mapObj.clearMap();
		 var markerContent = document.createElement("div");
		 markerContent.style.backgroundColor="#F7F9FB";
		 //点标记中的文本
		 var markerSpan = document.createElement("span");
		 markerSpan.innerHTML = e.lnglat;
		 markerContent.appendChild(markerSpan);
		 markerText = new AMap.Marker({
			map:mapObj,
			position:e.lnglat, //基点位置
			offset:new AMap.Pixel(20,16), //相对于基点的偏移位置
			content:markerContent   //自定义点标记覆盖物内容
		});
	});
	
	AMap.event.addListener(mapObj,'click',function(e){
		document.getElementById("resultCoord").value = e.lnglat;
	});
	
	document.getElementById("curCityText").onclick = changeCityAct;
	document.getElementById("popup_close").onclick = closeListAct;
}

//加载地图时自动定位到用户所在城市，显示城市名称
function autoLocationToCity()
{
	 var currCenter = mapObj.getCenter();
	 geocoderTool.getAddress(currCenter);//根据当前地图中心点，获取城市名称
}

function getDestination()
{	
	var searchKey = document.getElementById("searchValue").value;
	if(searchKey.length>0&&searchKey!="请输入目标地名")
	{
		geocoderTool.getLocation(searchKey);//获取目标点坐标
	}
	else
	{
		alert("请输入需要搜索定位的地名！");
	}
	
}

//在城市列表中选择城市名称，改变当前地图显示中心点
function changeCityAct()
{
    if(document.getElementById("popup_allcities").style.display = "none")
	{
		document.getElementById("popup_allcities").style.display = "block";
		
		//显示城市列表的同时，为各城市名绑定click事件，事件下执行城市定位
		var spanObj = document.getElementsByTagName("span");//先得到所有的SPAN标记
		for(var i=0;i<spanObj.length;i++)
		{
			if(spanObj[i].parentNode.className == 'link')//找出span标记父节点的class=link的标记
			{
				spanObj[i].onclick = function(){
					geocoderTool.getLocation(this.innerHTML,geocoder_CallBack); 
				};
			}
		}
	}
}


//地理编码返回结果展示   
function geocoder_CallBack(data){
    //地理编码结果数组
    var geocode = new Array();
    geocode = data.geocodes;  
		mapObj.clearMap();
	
	if(data.regeocode)
	{
		var currentCity;
		//返回地址描述
		currentCity = data.regeocode.addressComponent.province;
		document.getElementById("curCity").innerHTML = currentCity;
	
	}
	else{
		//for (var i = 0; i < geocode.length; i++) {
			var windowsArr = new Array();  
			var markerOption = {
				map:mapObj,					
				icon:"http://api.amap.com/webapi/static/Images/0.png",  
				position:new AMap.LngLat(geocode[0].location.getLng(),geocode[0].location.getLat())
			};            
			var mar = new AMap.Marker(markerOption);  
			
			var infoWindow = new AMap.InfoWindow({  
				content:geocode[0].formattedAddress,  
				size:new AMap.Size(150,0),  
				offset:{x:0,y:-30}
			});  
			windowsArr.push(infoWindow);  
			
			var aa = function(e){infoWindow.open(mapObj,mar.getPosition());};  
			AMap.event.addListener(mar,"click",aa); 
			mapObj.setZoomAndCenter(13,new AMap.LngLat(geocode[0].location.getLng(),geocode[0].location.getLat())); 
		//}
	}	
}  
function getCoord()
{
	var myobj=document.getElementById("resultCoord");
	var mydata=myobj.value;
	 if(window.clipboardData) {
		 window.clipboardData.clearData();    
		window.clipboardData.setData("text",mydata); 
	}
	else {    
          alert("当前浏览器不支持复制，请使用IE浏览器！");    
     } 
}
function textFocus()
{
	document.getElementById("searchValue").value="";
}

//关闭城市列表面板
function closeListAct()
{
	document.getElementById("popup_allcities").style.display = "none";
}