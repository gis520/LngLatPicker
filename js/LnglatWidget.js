LnglatWidget={
	 
	
	/**
	 * 关键词搜索
	 */
	searchByKeyword:function(){
		//获得搜索框的内容
		var str=$("#searchTxt").val();
		var radioValue=$('input:radio[name="searchTypeButton"]:checked').val();
		if(radioValue=="serachByName"){
		//编码定位
		geocoderTool.getLocation(str,LnglatWidget.geocoder_CallBack); 
			
		}else if(radioValue=="serachByLngLat"){
			//定位
			var lnglat=str.split(",");
			var lng=lnglat[0];
			var lat=lnglat[1];
			mapObj.clearMap();
			LnglatWidget.addMarker(lng,lat);
			mapObj.setZoomAndCenter(14,new AMap.LngLat(lng,lat));
			
		}

		// placeSearch.search(str);
		
		
	},
	/**
 	* 查询成功时的回调函数
 	*/
	placeSearch_CallBack:function(data){
	 mapObj.setFitView();
	},
	/**
	 * 地理编码回调函数
	 */
	geocoder_CallBack:function(data){
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
			var windowsArr = new Array();  
			var markerOption = {
				map:mapObj,					
				icon:"images/0.png",  
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
			//定位
			mapObj.setZoomAndCenter(11,new AMap.LngLat(geocode[0].location.getLng(),geocode[0].location.getLat())); 
		}	
	},
	/**
	 * 经纬度搜索
	 */
	searchByLngLat:function(lng,lat){
		
	},
	/**
	 *获得经纬度 
	 */
	getLngLat:function(e){
		 var position=e.lnglat;
		 mapObj.setCenter(position);
		 debugger;
		 $("#lnglatTxt").val(position);
		 
		
	},
	/**
	 * mark and infoWindow
	 */
	addMarker:function(lng,lat){
			var windowsArr = new Array();  
			var markerOption = {
				map:mapObj,					
				icon:"images/0.png",  
				position:new AMap.LngLat(lng,lat)
			};            
			var mar = new AMap.Marker(markerOption);  
			
			var infoWindow = new AMap.InfoWindow({  
				content:"经度："+lng+" "+"纬度："+lat,  
				size:new AMap.Size(150,0),  
				offset:{x:0,y:-30}
			});  
			windowsArr.push(infoWindow);  
			
			var aa = function(e){infoWindow.open(mapObj,mar.getPosition());};  
			AMap.event.addListener(mar,"click",aa); 
			
	},
	/**
	 * 复制功能
	 */
	clipBoard:function(){
		/* 定义所有class为copy-input标签，点击后可复制class为input的文本 */
    	$(".copy-input").zclip({
        path: "js/ZeroClipboard.swf",
        copy: function(){
        return $(this).parent().find(".input").val();
        },
        afterCopy:function(){/* 复制成功后的操作 */
            var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
            $("body").find(".copy-tips").remove().end().append($copysuc);
            $(".copy-tips").fadeOut(3000);
        	}
   		 });
	}
	
	
};
