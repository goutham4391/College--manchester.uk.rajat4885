function truncateString(str, len) {
	if (str.length <= len) {
		return str;
	}

	return str.slice(0, len) + "...";
}

$(document).ready(function() {
	$("#sticky-nav-wide ul.oh-lp-fixed-nav_section-links a, a.in-page").on("click tap", function(e) {
		e.preventDefault();
		$("html, body").animate({
			scrollTop: $($(this).attr("href")).offset().top - 110
		}, 500);
	});

	$("#sticky-nav-narrow ul.oh-lp-fixed-nav_section-links a").on("click tap", function(e) {
		e.preventDefault();

		$("#button-container button").attr("aria-expanded", false);
		$("#mobile-menu-list").prop("hidden", true);

		$("html, body").animate({
			scrollTop: $($(this).attr("href")).offset().top - 40
		}, 500);
	});

	$("#button-container button").on("click", function() {
		var $this = $(this);
		var $menu = $("#mobile-menu-list");

		if ($this.attr("aria-expanded") === "true") {
			$this.attr("aria-expanded", false);
			$menu.prop("hidden", true);
		} else {
			$this.attr("aria-expanded", true);			
			$menu.prop("hidden", false);
		}
	});

	$.getScript("https://cdn.jwplayer.com/libraries/rJOniDVM.js", function() {
		$(".video2.single").each(function() {
			var $this = $(this);
			$this.find(".loading").show();
			var containerId = $this.prop("id");
			//var videoId = $this.attr("data-videoid");
			var videoUrl = $this.attr("data-videourl");
			var posterUrl = $this.attr("data-posterurl");
			var subtitlesUrl = $this.attr("data-subtitlesurl");
			var videoTitle = $this.attr("data-videotitle");
			var aspectRatio = $this.attr("data-aspectratio");
			var stretching = $this.attr("data-stretching");
			var tracks = [];

			if (subtitlesUrl != "") {
				tracks.push({
					"kind": "captions",
					"file": subtitlesUrl,
					"label": "English",
					"default": true
				});
			}

			if (aspectRatio == "") aspectRatio = "16:9";
			if (stretching == "") stretching = "uniform"; // the other value we might use is 'fill'

			jwplayer(containerId).setup({
				"width": "100%",
				"aspectratio": aspectRatio,
				"stretching": stretching,
				"image": posterUrl,
				"file": videoUrl,
				"title": videoTitle,
				"tracks": tracks
			});

			jwplayer(containerId).on("play", function() {
				//alert("video play");
				//$(".video-message-copy").fadeOut();
				//$(".jw-controls .jw-display-container").show();
				//$(".jw-display-controls").css("visibility", "visible");
				$("#" + containerId).parent().find(".video-message-copy-outer").fadeOut();
				$("#" + containerId).find(".jw-controls .jw-display-container").show();
				$("#" + containerId).find(".jw-display-controls").css("visibility", "visible");
			});

			if (stretching != "uniform") {
				jwplayer(containerId).on("fullscreen", function(object) {
					if (object.fullscreen) {
						//alert("stretching uniform");
						jwplayer(containerId).setConfig({ "stretching": "uniform" });
					} else {
						//alert("stretching fill");
						jwplayer(containerId).setConfig({ "stretching": "fill" });
					}
				});
			}
		});
	});

	$(".play-video").each(function() {
		var $this = $(this);

		$this.on("click tap", function() {
			$this.closest(".video-message-copy-outer").fadeOut();
			jwplayer($this.data("videoid")).play();
		});
	});

	$("#course-subject").on("submit", function() {
	//$("#subject-go").on("click", function() {
		if ($("#subjectUri").val() == "") {
			//alert("no subject selected");
			$("#subject-error").show();
			return false;
		}
	});

	//$.getScript("//assets.manchester.ac.uk/corporate/js/libs/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js", function() {
	$.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js", function() {
		$.ajax({
			url: "https://www.manchester.ac.uk/medialibrary/degreeprogrammes/dorcc/offer-holder/subjects-nav/data.min.xml?v=" + Date.now(),
			dataType: "xml",
			success: function(xmlResponse) {
				var data = $("c", xmlResponse).map(function() {
					return {
						//name: $("name", this).text(),
						//keywords: $("keywords", this).text(),
						//subjectName: $("subjectName", this).text(),
						//subjectUri: $("subjectUri", this).text(),
						//value: $("name", this).text() + " | " + $("subjectName", this).text()
						name: $("n", this).text(),
						keywords: $("k", this).text(),
						subjectName: $("sn", this).text(),
						subjectUri: $("su", this).text(),
						value: $("n", this).text() + " | " + $("sn", this).text()
					};
				}).get();

				$("#course-keywords").autocomplete({
					source: function(request, response) {
						function hasMatch(s) {
							return s.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
						}

						var i, l, obj, matches = [];

						if (request.term === "") {
							response([]);
							return;
						}

						for (i = 0, l = data.length; i < l; i++) {
							obj = data[i];
							if (hasMatch(obj.name) || hasMatch(obj.keywords)) {
							//if (hasMatch(obj.name)) {
								matches.push(obj);
							}
						}

						response(matches);
					},
					position: { my: "left top", at: "left bottom+5" },
					minLength: 2,
					delay: 0,
					select: function(event, ui) {
						$(this).blur();
						if ($("body").hasClass("default")) {
							//$(this).val(truncateString(ui.item.name, 30) + " | " + truncateString(ui.item.subjectName, 20));
							$(this).val(truncateString(ui.item.name, 30) + " | " + ui.item.subjectName, 20);
						} else {
							$(this).val(ui.item.name);
						}
						//$("#subjectName").val(ui.item.subjectName);
						//$("#subjectNameSelect option").filter(function() { return $.trim( $(this).text() ) == ui.item.subjectName; }).attr("selected", true);
						$("#subject-name-select option[value=" + ui.item.subjectUri + "]").attr("selected", "selected");
						$("#subjectUri").val(ui.item.subjectUri);
						$("#subject-name-select").change();
						$("#subject-text").text(ui.item.subjectName);
						$("#subject-text-para").removeAttr("hidden");
						//console.log(ui.item.name + " | " + ui.item.subjectName);
						//var courseUrl = courseBaseUrl + ui.item.code + "/";
						//window.location = courseUrl;
						return false;
					}
				})
				.autocomplete( "instance" )._renderItem = function( ul, item ) {
					return $( "<li>" )
					.append( "<span class=\"course-name\">" + item.name + "</span><span class=\"subject-name\">" + item.subjectName + "</span>" )
					.appendTo( ul );
				};
			}
		});
	});
});

$(window).on("load", function() {
	"use strict";

	// Check on page load if the hidden subject dropdown is already populated (eg by user pressing the back button), and if so, display the name of the subject.
	//alert($("#subject-name-select option:selected").val());
	if ($("#subject-name-select option:selected").val() !== "") {
		$("#subject-text").text($("#subject-name-select option:selected").text());
		$("#subjectUri").val($("#subject-name-select option:selected").val());
		$("#subject-text-para").removeAttr("hidden");
	}
});