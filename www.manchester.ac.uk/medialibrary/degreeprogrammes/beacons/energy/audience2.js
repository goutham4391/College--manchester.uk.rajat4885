//alert(window.location.hostname);
// If the user has cookies enabled and they have accepted functional cookies via the cookie banner, then show the audience filter. Otherwise, don't.

let setCookie = false;

if (typeof OptanonActiveGroups !== 'undefined' && OptanonActiveGroups !== null) {
	if (OptanonActiveGroups.indexOf("C0003") > -1) {
		setCookie = true;
	}
}

if (navigator.cookieEnabled && setCookie) {
	var date = new Date();
	date.setTime(date.getTime()+(365*24*60*60*1000));
	var cookieExpiry = date.toGMTString();

	$(document).ready(function() {
		$("#audience-filter").show();
		$("#audience").change(function() {
			document.cookie = "audience=" + $("#audience").val() + "; expires=" + cookieExpiry + ";domain=.manchester.ac.uk; path=/";
//alert(location.search);
			if (location.search.indexOf("audience") > -1) {
				location.assign(location.pathname);
			} else {
				location.reload();
			}
		});

		if (hostname !== "sitemanager.manchester.ac.uk") {
		//$("#audience-filter-buttons").show();
		$("#audience-filter-buttons a").click(function(e) {
			e.preventDefault();
			document.cookie = "audience=" + $(this).data("audience") + "; expires=" + cookieExpiry + ";domain=.manchester.ac.uk; path=/";
			//alert($(this).data("audience"));
//alert(location.search);
			if (location.search.indexOf("audience") > -1) {
				location.assign(location.pathname);
			} else {
				location.reload();
			}
		});

		}
	});
}