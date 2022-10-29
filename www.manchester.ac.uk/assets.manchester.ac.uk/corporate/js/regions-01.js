//var map = Raphael('map', '768', '496');
var width = 736;
var height = 395;
var map = Raphael("map",  width, height);
//var map = Raphael("map",  "100%", "100%");
map.setViewBox(0, 0, 1835.9, 1066.4);
//map.setSize('100%', '100%');
/*
var rect = map.rect(0, 0, 1008.45, 650.94);
rect.attr("fill", "#f5f5f5");
rect.attr("stroke", "#f5f5f5");
*/
//map.canvas.setAttribute("preserveAspectRatio", "xMidYMid meet");
map.canvas.setAttribute("preserveAspectRatio", "none");
/*
map.canvas.setAttribute('externalResourcesRequired','true');
map.canvas.addEventListener("load", function() {
	console.log("image is loaded!");
	alert("Raphael JS loaded");
});
*/

//var svg = document.querySelector("svg");
//svg.removeAttribute("width");
//svg.removeAttribute("height");

var regions = [];

function getRegionColour(region) {
	"use strict";
	
	var colour;

	switch(region) {
		case "Middle East and North Africa":
			colour = "#d9e021";
			break;
		case "East Asia":
			colour = "#d9e021";
			break;
		case "South Asia":
			colour = "#8cc63f";
			break;
		case "North America":
			colour = "#22b573";
			break;
		case "Europe and Central Asia":
			colour = "#39b54a";
			break;
		case "Latin America":
			colour = "#00a99d";
			break;
		case "Sub-Saharan Africa":
			colour = "#8cc63f";
			break;
		case "South East Asia and Australasia":
			colour = "#00a99d";
			break;
	}

	return colour;
}

function getRegionHoverColour(region) {
	"use strict";

	var colour;

	switch(region) {
		case "Middle East and North Africa":
			colour = "#aeb31a";
			break;
		case "East Asia":
			colour = "#aeb31a";
			break;
		case "South Asia":
			colour = "#709e32";
			break;
		case "North America":
			colour = "#1b915c";
			break;
		case "Europe and Central Asia":
			colour = "#2e913b";
			break;
		case "Latin America":
			colour = "#00877e";
			break;
		case "Sub-Saharan Africa":
			colour = "#709e32";
			break;
		case "South East Asia and Australasia":
			colour = "#00877e";
			break;
	}

	return colour;
}

var middle_east_and_north_africa = map.path("M1100.87,531h-14.75l8.88,8.88v11.25L1108.87,565h16.33l6.75-6.83L1143.87,570H1152v11.13L1132.87,603h-14.42l-15.58,16H1081.2l-7.93,6.36-7.27-7.47V603.8l-14.37-14.33-7.62-7.58V569.8l-6.37-6.33L1018,543.88V538h-12V523.22l16.64-17.6-6.88-6.27,41.23-.21V463.38l23.58.08,6.42,6.67V483l11.87,12H1115v-5h33.95l7.05,6.88v28.25l9,9.7V556h-19.05l-6.08-6h-20.25ZM1006,550.22V525H992.87l-6.92,6H966.87l-15.58-16H933v20H917.87l-15.08-15H883.87L876,511.8V497H832.87l-12.75,13H794.87L777,525.3v7.58L766.62,546h-9.75L741,558.63v8.25l-10,9.75V586h24V570h4V557h19v-9.12L841.87,590h19l29.67-20,15.33,2.26,7.33-3.14L957.87,590H963V574.88l66.74,1Z");
middle_east_and_north_africa.attr({'fill': '#d9e021', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'Middle East and North Africa'});
middle_east_and_north_africa.data({'id': 'middle_east_and_north_africa', 'name': 'Middle East and North Africa'});
middle_east_and_north_africa.hover( function() { this.attr({ 'fill': getRegionHoverColour("Middle East and North Africa") }) }, function() { this.attr({ 'fill': getRegionColour("Middle East and North Africa") }) });

var east_asia = map.path("M1497.87,390H1523v23h-9v33.88l-4.5,4.58,11.5,11.42V490h-12V473h-12V455h-8.47l-8,7.11-4.75-4.43,9.08-8.68h-8l-19.33,18.61,11.92,12.4,5.42-5h8.25L1469,485.88V499h7.95L1491,512.88V533.3l-7,6.58V550.3L1468.87,568h-14.75l-11.25,11h-16l-13.13-10.81-21.58-.53-8.54,8.42-18.75-18.85,4.25-8.8-7.42-10.69-10.58-7.1-33.44,11.7L1255,522.63V509.26L1237.12,491H1224V468.88l26-13.5V436h4V421h14.87l4.88-18h11.13l11-11h32L1339,380.88,1349.12,391h79.5l8.38-12.12V357h27.37ZM1573,408.88V428h14.87l6.82-8.31S1574,408.13,1573,408.88Zm-.13,30.12c-.5,0,2.13,4.88,2.13,4.88v21.75L1562.87,481H1538v7h39.62l8.38-11.12V444.13l-5.13-5.13ZM1534,510h8V498h-8C1533,498,1534,510,1534,510Z");
east_asia.attr({'fill': '#d9e021', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'East Asia'});
east_asia.data({'id': 'east_asia', 'name': 'East Asia'});
east_asia.hover( function() { this.attr({ 'fill': getRegionHoverColour("East Asia") }) }, function() { this.attr({ 'fill': getRegionColour("East Asia") }) });

var south_asia = map.path("M1361.7,537.92l-12.5,11.7-8,29.82-5.37-4.44h-22.75L1275,609.88v24.33l-12.33,12.25L1245,628.88V614.8l-17-16.92V583h-8.22l-11.67-11.71L1192.87,556H1165V536h20V526h9.74l17.62-18.11-.25-16.89h25L1255,509.26v13.63l62.67,19.51,33.53-11.74ZM1272,661h7V640.63l-7,7Z");
south_asia.attr({'fill': '#8cc63f', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'South Asia'});
south_asia.data({'id': 'south_asia', 'name': 'South Asia'});
south_asia.hover( function() { this.attr({ 'fill': getRegionHoverColour("South Asia") }) }, function() { this.attr({ 'fill': getRegionColour("South Asia") }) });

var north_america = map.path("M526,357.8l21,21.08V396H533.28l-7.42,7H493.12l-8.25,8H495v24h-8.55l-7.58,8H467.12L458,448.88V463H441.95l-15.08,15H413v13.8l-24,24.08V544h-6.72l-17.42-17H337.28l6.58,7H303.28l-15.59,13.55L277.87,528h-5.31l-4.67,4.84-18-17.84H201v8.13l7,6.75v10.25l8,7.75v8.25l-13-13.25V532l-12-12.08V504.3l-12.79-13L170,482.88V470.13l-5-5.25V425.3l11.26-11,7.22-7.33L195,394.88V382.47l-13-12.58V359.55s-8.45-11-10.45-11-7.24-7.42-7.24-7.42L174,330.88V309.8l-10-10.39-18.48-18.47L116.87,253H105.16s-17.33,16.7-20,19.32-14.08-.26-14.08-.26L42.87,301H35.12l12.33-12.46L60.87,275H53.24s-7.67-6.22-6.62-7.26,0-18.18,0-18.18L39.87,257H31v-8.12l6.93-5.72-5.44-5.72L46.87,224H71.78L77,215.88v-8.33l7.27-6.39L80,196.94,74.87,203H53c-1,0,0-8,0-8H66.2l-6.25-6.17L64.87,184H75.62l5.25,5h20.92L86,172.88V152h25.78l11.08-11h10.75l5.25-5h14.67l4.4-6L170,141.88V152h11.12l12.75,13h8l33.58,33.5L248.87,185H271v13h13.95l4.92-5H298v4.8L312.87,213H317v6h-3.8l-4.25,4.17,4.92,4.83H336v14.47l6-5.58V231h8v-6h12v4.47L371.87,240H389v-6h5v7.3l5,4.58V242h8.45l5.55-8.12V226h11v12.22l8.38-7.67,5.92,5.33-8,8,6.48,6.92L453,233.88v-5.67l4.17-4.25,7.83,7.92V242c0,3-6,0-6,0v8.88L445.6,265l-6.94-7.35-5.94,6.14-8.3,8.86L416.87,281H405v5h-6v6h-7.55l-6.68,5.4L367,313.88V331.8l6-5.92V341h10.45l22.42,22H413v19.47l7.87,8.53h7.58l5.55-8.12V370.8l16-15.92V338.55L445.67,334l7.33-7.08V313.47l5-4.58V305h25v6.13l8,7.75v17.33l9.33,9.08L520,325.88V351.8Zm-97-84.25v8.33l-4.23,4.92,5.76,5.42,9.84-8.94,6.17,6.73h9.33s-20.35-22.73-19.18-22.73ZM624.87,65H615V58H593.95L585,48.88V57h-4.05L573,48.88V57h-6.13l-8.6,7.19L549,54.88V63H524V74h17.62l3.25,3H528.53l-3.42,3.33L532.87,88H555.2l11.67-12.39,3.33,3-8.25,8.86L566.87,93H553v5H542.78L537,91.88V103h-5V95.22l-7.17-7.42L521,91.88v14.33l7.93,7-3,4.39L518.87,111H513.7l-15.08,12.19,7.58-.57,6.67-6.87,3.73,4.32-7.6,6.82v7.75l10-9.75v8.67l7.67,7.42,3.33-3.08V132h14.87l10.42-10.5-4.42-4.5H541v-8h12.45l3.42,3h5.92l-5.92-6h6.33l7.08,6,7-6.85L583.87,99h12.58L606,86.88V80h16.53l5.63-6.71ZM383.53,215.52l6-6-15.67-13.06c0-.79,4.15-5.54,4.15-5.54V180.47l5-4.58V167.3l-12,11.58V189h-6V179h-4v-8h-9v-6H336v6h-8.55l11.42,11H316v7h20.62l8.25,8H315v12h12.95L322,211.88V219h27.87l5.42-5.5,6.58,6.5h15l-6.5-7.07,5.17-6.07ZM321.95,167h4.92s6.25-8,6-7H347V148.88l-5.73-5.65L334.95,137H319v3.88l-12,11.75v6.25l-9,9.42V176h14.87Zm57.68-71.06.16-.17C379.65,95.77,379.61,95.84,379.63,95.94ZM371.87,116l13.92-14.32s-6-4.81-6.16-5.74L370.2,106H350v10h21.87ZM411,102.88,416.92,97S400,96.47,399,96.88V109h12ZM382,127v-8h-5.13c-.25,0-1,9-1,9H362v6h15v7H362.12l4.75,5h15.67l5.75-5.67,4.58,4.67h11.58l6.55-9.12V133h-8v-9.45l5.26-4.67-4-4.58L395,122.88V133h-8v-6Zm73.45-15.23,8.75-9.15-4.33-4.54,5.33-4.71-5-5.38H450v6.88L447.12,101H438v6h11.87Zm14.74,3,6.32-6.32s-5.45-5.95-5.82-6.32l-6.57,6.57Zm-20.5,33.37-6.57,6.57,6.07,6.07,6.32-6.32S450.05,148.52,449.68,148.14ZM495.5,251.46s-5.45-5.95-5.82-6.32l-6.57,6.57,6.07,6.07ZM497,198h10v-8.77L505.87,188H497ZM387,164v6.88c0,.61,9.87-6.88,9.87-6.88Zm151,84V237.88L504.87,205h-20.5l5.63-9.12V187h-6.63l-9.5,9h-8.75l10.75-11h-11L440,206.88V218h18.87l7,7h13.75l7.82,7.57L501,245.88v9.5l-14,14.5V279H466v9h20.62l26.5,25.84,19.5-20.16-19-18.95,8.5-8.4,14.75,15,11.75-11.35L525.87,248ZM430.87,175.88l12.5,12.5,11.5-11.5-12.5-12.5Zm-10,10-12.5-12.5-11.5,11.5,12.5,12.5Zm.9-6.5,9.1-9.1-9.9-9.9-9.1,9.1ZM423,206.63l7-6.37-5.22-5.12c-.56.56-17.81,15.75-17.81,15.75V221h16Zm39.12-46.79L471.87,170h18l7.5,6.85,10.25-10.9L500.87,160H481.62l-10-10.31C470.49,150.82,462.12,159.85,462.12,159.85Zm-30.25-7.71,17.38-17.37-8.12-8.12-8.87,8.63,3.13,3.13L426.74,147Zm62.69-32.82L507.62,107H514V75H502.87L488,86.63v8.25l6.31,6.63s-8.5,8.69-8.32,8.88Z");
north_america.attr({'fill': '#22b573', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'North America', 'id': 'north_america'});
north_america.data({'id': 'north_america', 'name': 'North America'});
north_america.hover( function() { this.attr({ 'fill': getRegionHoverColour("North America") }) }, function() { this.attr({ 'fill': getRegionColour("North America") }) });

var europe_and_central_asia = map.path("M751,129v5h12.45L753,141.88v16.25L743.87,170H753v5H741.95L735,178.88V213H717.87l-9.08,9,22.08,22h-12l-8.42-8.5L694.87,251h30.75l-14.75,15H683.28l-23.42,23H641.12L635,291.88v5.67l-15,15.08v21.25s-9.88-7.88-9.13-6.88h-9.08L591,315.88V298.3l-6-6.42V269h15.53l3.33-4.23-6.43-6.24,6.57-7.65V224H588.12L598,210.88V189.3l-4-4.42v-9.42L580.87,163h-6.33s-13.42,1.46-15.08-.21-5.58-5.79-5.58-5.79h5.42l-6.42-6h17.42l5.58-6H566.2l-9.92-10.17,7.58-7.83h22.08l14.92-15H589.28l13.58-14h10.08L617,90.88V88h11.12l5.75-6h17.08L638.87,94h20.25l-8.25-8h7.58l12.42,12h13.08L673,86.88V77h10.95l4.92-5h14.92l7.08-7h22.42L738,69.88V83h17.2l4.67,4.58-5,6.42H718.62l-12.75,13h8.92l7.08-7h17.92l-6.92,7h8.75l5.25-5h7.75l-27.75,28h8.42l15.58-16h10.42l5.58-6h11.67l4.92,4.67L766.87,129Zm2.87,162h-15l-9.42,9H718.87l6.92,7.13,5.67,5.88h20.42L759,302.63v-7.75S752.95,290,753.87,291ZM802,380h4v5h4v7h-6v3.88L801.62,401h11.25l-5.75,6h-5.25l-3.5,4h10.5l4.25-4h15.75l4.5-4h-5.5l4.13-7.37V393h-7V381.88l-7.12-7L811,368.13V361h-7.13l7-7h-9L795,358.13v6.75l7,6.75Zm-20.8,21.69,4.67-3.69H790V386.38l4-3.5V378H783v7h-6v1.63l4.56,4-5.28,5.5ZM1650,158h32.87L1670,145.13V129H1567.87l14.25,14H1530v14h-14V142.88L1505.62,133H1409v25h-24v15.88L1358.12,147H1329v9h-43.13L1265,174.13V128h-28V115h-27v13.88l11.93,12.06L1213.37,151h-25.5l-15.25,14.64,12.25,11.64-20.5,20.9,34,34.81h-12.5l-28.59-29.06-15.59,14.44,14.32,15V274h-11V240.88l-20-19.75V202h-14v26.88l19,18.75v10.25L1117.62,246h-29.75l8.75,9-7.75,8h-44l-49.75,49.75L971.37,289H1002V264H959.87l-14.75-15H911.87L883,274.63v24.25l-34,33.75V359h13.87L875,343.63v15.25l14.25,14.25L903,359.38v-34.5l16-15.75V293h16v13.88l-12,11.75v13.25L933.12,342H959v10H939v12H928v12.88l8.12,8.12H874.87l-30.75,31H828v8H805.87L820,437.88V454H778v30.88L789.62,497h21.25l11.44-13.06L839,465.63V455h17.87l8.25-8h10.75L906,477.13V489h7V470.88L886.62,445h14.25L945,489.13V473h19v9.88L982.12,501H1057V463.38l23.58.08,6.42,6.67v12.75L1098.87,495h17l.5-5h32.5l7.13,6.88v28.2l9.75,10.91H1185V526h9.74l17.62-18.11-.25-16.89H1224V468.88l26-13.5v-20.5l4-.5v-14.5l14.25.31,5.62-17.19h11l11.25-11h31.75L1339,380.88,1349.12,391h79.5l8.38-11.87V357h27.87l20.75,20.13,12.5,12.88H1523v23h-9v18h18.87L1549,411.63V351.88L1535.12,338H1503V284h40.87l11.25-11H1570V246h26V225h13v54h-11v29.88l35,35.25V284.88l-12-12.25V251.88L1635.12,241H1649V224.88l20.5-20.75L1650,184.88ZM915,127H904.87c-1.5,0-8.87,5.88-8.87,5.88V143h19Zm-38,41.63,13,13.25V154.13l5.81-5-12.94-13.75c0,.5-5.09-3.75-5.09-3.75l-11.84,11.5L877,154.88Zm282.37-89.75-11-11-10,11,10.5,10.5Zm-4.95,15.21,13.35,12.79L1174,99.8V91.73L1169.8,88h-8.66C1161.73,87,1154.42,94.1,1154.42,94.1ZM1189,84.88v27l18.75-18.75ZM1357.87,90h.09C1357.9,90,1357.87,90,1357.87,90Zm19.5,23.1,13-13.4L1379.87,90H1358C1359.29,90.76,1377.37,113.1,1377.37,113.1ZM1421,99V89h-20.07c0,.82-2.06,10-2.06,10Zm-20.13-10h.06C1400.93,88.92,1400.91,88.91,1400.87,89Zm9.13,37V115h-18.13c-1.25-2,0,11,0,11ZM1071.85,235.22,1056,219.88v-22l32-34.67V156h-6.13l-9.42,9h-9.58L1043,186.55v33.33l16.26,14.92Z");
europe_and_central_asia.attr({'fill': '#39b54a', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'Europe and Central Asia'});
europe_and_central_asia.data({'id': 'europe_and_central_asia', 'name': 'Europe and Central Asia'});
europe_and_central_asia.hover( function() { this.attr({ 'fill': getRegionHoverColour("Europe and Central Asia") }) }, function() { this.attr({ 'fill': getRegionColour("Europe and Central Asia") }) });

var latin_america = map.path("M631.68,731.94,609,752.38v42.5L596.37,812h-14.5L563,826.38v11.5L555.87,849H542v18.88L536.37,878h-21.5l13.5,13.5L516.87,903H498v16H484.87l8.9,8.61L484,935.55v5.33l-8.83,8.83,9.83,9.83v5.33l-12,12.33v11.67L498.53,1015H477.87L443,979.72V926.88l-11-10.75,9-9.25v-122l-59-59.42V685.88L400,668V646.88L412.87,636h69l16.5,16.75,14,14.25h18.5L547,683.38V693h13.87s12,17,16.5,17h32.5ZM417.2,582.55l-30-15.67-14,4.67,29.47,17.78ZM440.58,599,426,584.88v6l-11.48,4.33Zm-44.63,54.31L393.45,641H370.87L363,632.47V613H337V595.88L351.87,581h-19l-14.42,14H304.87L284,574.13V549.88l3.44-2.58L277.87,528h-5.31l-4.67,4.84-18-17.84H211v12.88L227,544l7,7v7.92L245,570v22h11.87s8.17,9.57,10.25,9.57,9.13-2.91,12.08.05,7,7.38,7,7.38h12.71l4.25-4h6.75l7.86,8.3.22-.28,10.92,9h10l12.58,12.46L364.12,647h23.75Z");
latin_america.attr({'fill': '#00a99d', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'Latin America'});
latin_america.data({'id': 'latin_america', 'name': 'Latin America'});
latin_america.hover( function() { this.attr({ 'fill': getRegionHoverColour("Latin America") }) }, function() { this.attr({ 'fill': getRegionColour("Latin America") }) });

var sub_saharan_africa = map.path("M1116,631v7.47l-17.45,18-41.12,41.67L1042,712.88V729.3l11,10.58V763.3L1026.87,792H1015v18.13l-15,14.75v9.58L970.87,867H937.53l-7.43,6L918,860.88V835.47l-11-10.58V799.63l-15-14.75V759.22l11.67-11.75L899,742.88V726.8l-8-8-20-19.92V685.55l11-9.28L873.87,668h-9.58l-13.42-13H821.95l-14.08,14h-23l-54.5-54.81,7.5-8.31L738,586h17V570h4V557h19v-9.12L841.87,590h19l29.67-19.77,15.33,2.06,7.33-3.35L957.87,590H963V574.88l67.42,1,.26,9.38L1045,599.88V614.3l14.89,14.81,10,9.89h24.92l8.08-8Zm-43,160.13-11,10.75V819h21.87L1099,772.88v-21l-26,20Z");
sub_saharan_africa.attr({'fill': '#8cc63f', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'Sub-Saharan Africa'});
sub_saharan_africa.data({'id': 'sub_saharan_africa', 'name': 'Sub-Saharan Africa'});
sub_saharan_africa.hover( function() { this.attr({ 'fill': getRegionHoverColour("Sub-Saharan Africa") }) }, function() { this.attr({ 'fill': getRegionColour("Sub-Saharan Africa") }) });

var south_east_asia_and_australasia = map.path("M1352,607V590.63l-11.44-12,8.3-29.42,12.67-11.5,7.59,10.83-4,8.67,18.35,18.58,8.64-8.54,21.59.13,12.79,10-.66-.17-10.93,11L1435,608.88V631l-9.13,12h-10.58l-22.42-22H1381v25h-4V625.13l-8-8.25V607Zm283,162h-9v-8h-10v17.88l-11.5,11.58L1585,770.88V756h-24.38l-12.75,13h-14.75l-32.25,32h-28.33l-15.68,13.73.15,40.15v14.58l-9,9.42V892h19.45l8.42-8h17.42l7.58-8h20.58l7.42-7h26.58l7.55,6.88V895.3l19-19.42v32l17.68,17.89,7.18-5.77H1610v8l10.87-8h10.92l7.22-10.12v-9.75l19-19.25V868.47l10-9.58V826.13l-33-33.25Zm-36-48v4.88l15,12.85V740h9.87l6.75-7h9.25l12.75,13h9.25L1643,727.38v-6.5L1629,706h-38.13l-5.75,7.06,7.75,7.94Zm-236.13-56c.5,0,26.13,26.88,26.13,26.88v12.25L1408.87,722H1419V711.63L1371.87,665Zm91,48h14.5L1487,690.88V662h-8.63l-16.5,16h-7.25l-5.75,6H1439c.65.87.87,15,.87,15Zm-15-29h.13C1439,683.94,1438.91,683.94,1438.87,684ZM1493,552.88V570h8.87Zm2,60.5,11-11.5V594h-11C1494,594,1495,613.38,1495,613.38Zm43.62,34.25-9.25-9.25-12.25,12.25,9.25,9.25Zm-38.75,67.25c.5,0,13.25-13.25,13.25-13.25s-9.75-8.25-9.25-7.75l-12.5,12.5S1499.37,714.88,1499.87,714.88ZM1473,734h-34.63l-10.25-10.81c-.37-.37-6,5.65-6,5.65L1433.87,741H1473Zm266,200.63-10,10.25v8.5L1719.87,966h11.75L1748,946.88V920h-9Zm30.87-39.25-9.25-9.25-7,7,4.5,5.5s-5.25,5.75-5.75,5.25l9.5,9.5,7.75-7.75-5-5ZM1598,940.63V961h11.87l8-15h-11Z");
south_east_asia_and_australasia.attr({'fill': '#00a99d', 'opacity': '1', 'stroke': '#006837', 'stroke-width': '2', 'stroke-opacity': '1', title: 'South East Asia and Australasia'});
south_east_asia_and_australasia.data({'id': 'south_east_asia_and_australasia', 'name': 'South East Asia and Australasia'});
south_east_asia_and_australasia.hover( function() { this.attr({ 'fill': getRegionHoverColour("South East Asia and Australasia") }) }, function() { this.attr({ 'fill': getRegionColour("South East Asia and Australasia") }) });

regions.push(middle_east_and_north_africa, east_asia, south_asia, north_america, europe_and_central_asia, latin_america, sub_saharan_africa, south_east_asia_and_australasia);
/*
for (var i = 0, len = regions.length; i < len; i++) {
	//alert(regions[i].data("name"));
	//regions[i].mouseover( function() { this.attr({ 'fill': getRegionHoverColour(regions[i].data("name")) }) });
	//regions[i].mouseout( function() { this.attr({ 'fill': getRegionColour(regions[i].data("name")) }) });
	regions[i].mouseover( function() { alert("hello"); });
}
*/