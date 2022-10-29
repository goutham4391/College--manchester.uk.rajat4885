$(document).ready(function() {
	"use strict";

	$(".masthead-image.video img").hover(
		function() {
			$("#banner-play-button-hover").addClass("hover");
		}, function() {
			$("#banner-play-button-hover").removeClass("hover");
	}).click(function() {
		$("#banner-play-button-hover").removeClass("hover");
		$("#banner-play-button").click();
	});

	$(".masthead-image.video .rb-banner").hover(
		function() {
			if ($(window).width() >= 700) {
				$("#banner-play-button-hover").addClass("hover");
			}
		}, function() {
			if ($(window).width() >= 700) {
				$("#banner-play-button-hover").removeClass("hover");
			}
	}).click(function() {
		if ($(window).width() >= 700) {
			$("#banner-play-button-hover").removeClass("hover");
			$("#banner-play-button").click();
		}
	});

	if ($("#banner-play-button").length === 1) {
		var mastheadImage = $(".masthead-image");
		mastheadImage.data("state", "normal");

		var youtubeImage = new Image();

		youtubeImage.onload = function () {
			// The user can access YouTube
			$("#banner-play-button").show();
		};
/*
		youtubeImage.onerror = function () {
			// The user can't access YouTube
		};
*/
		var $bannerVideo = $("#banner-video");
		var vpVideoUrl = $bannerVideo.data("vp-video-url");
		var ytVideoUrl = $bannerVideo.data("yt-video-url");
		var videoTitle = $bannerVideo.data("video-title");
		var videoUrl;

		if (vpVideoUrl !== "") {
			videoUrl = vpVideoUrl;
			$("#banner-play-button").show();
		} else if (ytVideoUrl !== "") {
			videoUrl = ytVideoUrl;

			var d = new Date();
			youtubeImage.src = "//youtube.com/favicon.ico?ms=" + d.getTime();
		}

		$("#banner-play-button").click(function() {
			if (mastheadImage.data("state") === "normal") {
				mastheadImage.data("state", "video");

//				if ($(window).width() >= 700) {
					mastheadImage.toggleClass("slide-off");
//				}

				if ($(window).width() / $(window).height() <= 1.777778 || $(window).width() > 1160) {
					$("html, body").animate({scrollTop: mastheadImage.offset().top - 20}, 1000);
				} else {
					$("html, body").animate({scrollTop: mastheadImage.offset().top}, 1000);
				}

				setTimeout(function() {
					//if ($(window).width() >= 700) {
						mastheadImage.toggleClass("bkgnd-black");
					//}
	
					setTimeout(function() {
						mastheadImage.toggleClass("fade-image");

						setTimeout(function() {
							mastheadImage.toggleClass("resize");

							setTimeout(function() {
								if (window.jwplayer) {
									var jwPlayerVideo = jwplayer("banner-video").setup({
										//"id": "bannerVideo",
										width: "100%",
										aspectratio: "16:9",
										"stretching": "fill",
										"autostart": "true",
										file: videoUrl,
										title: "BANNER: " + videoTitle,
										displaytitle: "false",
										sharing: {
											heading: "Share video"
										}
									});
/*
									jwplayer("banner-video").onReady(function() {
										//console.log("banner-video ready");
										setTimeout(function() {
											jwplayer("banner-video").play();
										}, 500);
									});
*/
									jwplayer("banner-video").on("complete", function() {
										// Only close the banner video overlay when the video finishes if GTM tags aren't going to do it. Otherwise, we'll prevent the video completion event from firing.
										if (document.getElementById("banner-video").getAttribute("data-gtm-eventlisteners-added") !== "true" && document.getElementById("banner-video").getAttribute("data-gtm-ga4-eventlisteners-added") !== "true") {
											jwplayer("banner-video").remove();
											$("#banner-play-button").click();
										}
									});
									jwplayer("banner-video").addButton("//www.manchester.ac.uk/medialibrary/degreeprogrammes/breakthrough/beacon-mark/close-button-01.png", "Close video", function () {
										jwplayer("banner-video").remove();
										$("#banner-play-button").click();
									}, "Close");
								} else {
									//$.getScript("//jwpsrv.com/library/wrqx4EevEeOv_CIACqoGtw.js", function() {
									$.getScript("//content.jwplatform.com/libraries/GAxgn6Z5.js", function() {
										var jwPlayerVideo = jwplayer("banner-video").setup({
											//"id": "bannerVideo",
											width: "100%",
											aspectratio: "16:9",
											"stretching": "fill",
											"autostart": "true",
											file: videoUrl,
											title: "BANNER: " + videoTitle,
											displaytitle: "false",
											sharing: {
												heading: "Share video"
											}
										});
/*
										jwplayer("banner-video").onReady(function() {
											//console.log("banner-video ready");
											setTimeout(function() {
												jwplayer("banner-video").play();
											}, 500);
										});
*/
										jwplayer("banner-video").on("complete", function() {
											// Only close the banner video overlay when the video finishes if GTM tags aren't going to do it. Otherwise, we'll prevent the video completion event from firing.
											if (document.getElementById("banner-video").getAttribute("data-gtm-eventlisteners-added") !== "true" && document.getElementById("banner-video").getAttribute("data-gtm-ga4-eventlisteners-added") !== "true") {
												jwplayer("banner-video").remove();
												$("#banner-play-button").click();
											}
										});
										jwplayer("banner-video").addButton("//www.manchester.ac.uk/medialibrary/degreeprogrammes/breakthrough/beacon-mark/close-button-01.png", "Close video", function () {
											jwplayer("banner-video").remove();
											$("#banner-play-button").click();
										}, "Close");
									});
								}
							}, 500);
						}, 500);
					}, 100);
				}, 100);
			} else if (mastheadImage.data("state") === "video") {
				mastheadImage.toggleClass("resize");
				mastheadImage.data("state", "closing");

				setTimeout(function() {
					mastheadImage.toggleClass("fade-image");
	
					setTimeout(function() {
						//if ($(window).width() >= 700) {
							mastheadImage.toggleClass("bkgnd-black");
						//}

						setTimeout(function() {
							//if ($(window).width() >= 700) {
								mastheadImage.toggleClass("slide-off");
								mastheadImage.data("state", "normal");
							//}
						}, 100);
					}, 100);
				}, 500);
			}
		});
	}
});