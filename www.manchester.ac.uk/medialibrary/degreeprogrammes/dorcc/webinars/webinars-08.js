$(document).ready(function() {
	"use strict";

	if (window.location.hash.substr(1,5) == "d.en.") {
		var hash = window.location.hash.substr(1).replace("d.en.", "");
		
		if ($("#d\\.en\\." + hash).hasClass("webinars-container")) {
			$("#d\\.en\\." + hash).addClass("open");
			$("#d\\.en\\." + hash + " > h2, #d\\.en\\." + hash + " > h3").addClass("highlighted-webinars-heading");

			if ($("#d\\.en\\." + hash + " h2 button").length == 1) {
				$("#d\\.en\\." + hash + " h2 button").attr("aria-expanded", "true");
				$("#" + $("#d\\.en\\." + hash + " h2 button").attr("aria-controls")).removeAttr("hidden").find("img").lazyload();
			} else if ($("#d\\.en\\." + hash + " h3 button").length == 1) {
				$("#d\\.en\\." + hash + " h3 button").attr("aria-expanded", "true");
				$("#" + $("#d\\.en\\." + hash + " h3 button").attr("aria-controls")).removeAttr("hidden").find("img").lazyload();
			}
		} else if ($("#d\\.en\\." + hash).hasClass("webinar")) {
			var $selectedWebinar = $("#d\\.en\\." + hash);
			$selectedWebinar.addClass("highlighted-webinar");
			var selectedWebinarParentAttr = $selectedWebinar.parent().attr("aria-labelledby")

			// Check if we need to open an accordion item.
			if (typeof selectedWebinarParentAttr !== typeof undefined && selectedWebinarParentAttr !== false) {
				$("#" + selectedWebinarParentAttr).attr("aria-expanded", "true");
				$selectedWebinar.parent().removeAttr("hidden").find("img").lazyload();
				$selectedWebinar.parent().parent().addClass("open");
			}
		}
	}

	$("<p id=\"webinars-count\">Showing <strong id=\"webinar-count-number\">" + $(".webinars-container li").length + "</strong> webinar<span id=\"webinar-count-number-plural\">s</span>:</p>").insertAfter(".webinars-filters");

	$(".webinars-filters button").on("click tap", function() {
		$(".webinars-filters #filter-loading").show(0).delay(500).hide(0);
		var $this = $(this);
		var filterValue = $this.data("tag");
		var totalNumberShownWebinars = 0;
		//alert(filterValue);

		$(".webinars-filters button.selected").removeClass("selected").attr("aria-pressed", "false");
		$this.addClass("selected").attr("aria-pressed", "true");

		$(".webinars-container li").addClass("hidden");
		$(".webinars-container li[data-tags*='" + filterValue + "']").removeClass("hidden");

		$(".webinars-container").each(function() {
			// Count the number of shown list items in each container. If none remain, hide container.
			$this = $(this);
			var numberShownWebinars = $("li:not(.hidden)", $this).length;
			totalNumberShownWebinars = totalNumberShownWebinars + numberShownWebinars;
			//alert(numberShownWebinars);

			if (numberShownWebinars == 0) {
				$this.hide();
			} else {
				$this.show().find("img").lazyload();
			}
		});

		$("#webinar-count-number").text(totalNumberShownWebinars);
		if (totalNumberShownWebinars == 1) {
			$("#webinar-count-number-plural").attr("hidden", "hidden");
		} else {
			$("#webinar-count-number-plural").removeAttr("hidden");
		}
	});

	$(".webinars-container.accordion h2 button, .webinars-container.accordion h3 button").on("click tap", function() {
		var $this = $(this);
		var targetWebinarListId = $this.attr("aria-controls");

		if ($("#" + targetWebinarListId).attr("hidden") == "hidden") {
			$this.parent().parent().addClass("open");
			$this.attr("aria-expanded", "true");
			$("#" + targetWebinarListId).removeAttr("hidden").find("img").lazyload();
		} else {
			$this.parent().parent().removeClass("open");
			$this.attr("aria-expanded", "false");
			$("#" + targetWebinarListId).attr("hidden", "hidden");
		}
	});

	$(".watch-previous").on("click tap", function() {
		var $this = $(this);
		var targetVideoContainerId = $this.attr("aria-controls");

		//$this.toggleClass("open").parent().parent().next().fadeToggle();

		//alert($("#" + targetVideoContainerId).attr("hidden"));
		if ($("#" + targetVideoContainerId).attr("hidden") == "hidden") {
			$this.toggleClass("open").attr("aria-expanded", "true");
			$("#" + targetVideoContainerId).removeAttr("hidden").css("display", "block");
		} else {
			$this.toggleClass("open").attr("aria-expanded", "false");
			$("#" + targetVideoContainerId).attr("hidden", "hidden").removeAttr("style");
		}
	});

	if ($("div.video2").length > 0) {
		$.getScript("https://cdn.jwplayer.com/libraries/rJOniDVM.js", function() {
			$(".video2.single").each(function() {
				var $this = $(this);
				$this.find(".loading").show();
				var containerId = $this.prop("id");
				//var videoId = $this.attr("data-videoid");
				var videoUrl = $this.attr("data-videourl");
				var poster = $this.attr("data-poster");
				var videoTitle = $this.attr("data-videotitle");
				var subtitles1File = $this.attr("data-subtitlestrack1file");
				var subtitles1Label = $this.attr("data-subtitlestrack1label");
				var subtitles2File = $this.attr("data-subtitlestrack2file");
				var subtitles2Label = $this.attr("data-subtitlestrack2label");
				var subtitles3File = $this.attr("data-subtitlestrack3file");
				var subtitles3Label = $this.attr("data-subtitlestrack3label");
				var tracks = [];

				if (subtitles1File != "" && subtitles1Label != "") {
					tracks.push({
						"kind": "captions",
						"file": subtitles1File,
						"label": subtitles1Label,
						"default": true
					});
				}

				if (subtitles2File != "" && subtitles2Label != "") {
					tracks.push({
						"kind": "captions",
						"file": subtitles2File,
						"label": subtitles2Label
					});
				}

				if (subtitles3File != "" && subtitles3Label != "") {
					tracks.push({
						"kind": "captions",
						"file": subtitles3File,
						"label": subtitles3Label
					});
				}

				var jwPlayerInstance = jwplayer(containerId).setup({
				//jwplayer(containerId).setup({
					width: "100%",
					//id: containerId,
					aspectratio: "16:9",
		//			"stretching": "fill",
					"image": poster,
					"file": videoUrl,
					"title": videoTitle,
					"tracks": tracks
				});

				/* Accessibility fixes for JW Player elements with repeated IDs */
				jwPlayerInstance.on("ready", function() {
					var $container = $("#" + containerId);

					var $shortcutTooltipsExplanationId = $container.attr("aria-describedby");
					$container.attr("aria-describedby", $shortcutTooltipsExplanationId + "-" + containerId);
					$container.find("#jw-shortcuts-tooltip-explanation").attr("id", $shortcutTooltipsExplanationId + "-" + containerId);

					var $submenuButtonSettings = $container.find(".jw-settings-submenu-button.jw-icon-settings");
					var $submenuButtonSettingsAriaControls = $submenuButtonSettings.attr("aria-controls");
					$submenuButtonSettings.attr("aria-controls", $submenuButtonSettingsAriaControls + "-" + containerId);
					$container.find("#" + $submenuButtonSettingsAriaControls).attr("id", $submenuButtonSettingsAriaControls + "-" + containerId);

					var $submenuButtonCaptions = $container.find(".jw-settings-submenu-button.jw-icon-cc");
					var $submenuButtonCaptionsAriaControls = $submenuButtonCaptions.attr("aria-controls");
					$submenuButtonCaptions.attr("aria-controls", $submenuButtonCaptionsAriaControls + "-" + containerId);
					$container.find(".jw-submenu-captions").attr("aria-controls", $submenuButtonCaptionsAriaControls + "-" + containerId);
					$container.find("#" + $submenuButtonCaptionsAriaControls).attr("id", $submenuButtonCaptionsAriaControls + "-" + containerId);

					$container.find("#jw-settings-submenu-captionsSettings").attr("id", "jw-settings-submenu-captionsSettings-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-color']").attr("aria-controls", "jw-settings-submenu-color-" + containerId);
					$container.find("#jw-settings-submenu-color").attr("id", "jw-settings-submenu-color-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-fontOpacity']").attr("aria-controls", "jw-settings-submenu-fontOpacity-" + containerId);
					$container.find("#jw-settings-submenu-fontOpacity").attr("id", "jw-settings-submenu-fontOpacity-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-userFontScale']").attr("aria-controls", "jw-settings-submenu-userFontScale-" + containerId);
					$container.find("#jw-settings-submenu-userFontScale").attr("id", "jw-settings-submenu-userFontScale-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-fontFamily']").attr("aria-controls", "jw-settings-submenu-fontFamily-" + containerId);
					$container.find("#jw-settings-submenu-fontFamily").attr("id", "jw-settings-submenu-fontFamily-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-edgeStyle']").attr("aria-controls", "jw-settings-submenu-edgeStyle-" + containerId);
					$container.find("#jw-settings-submenu-edgeStyle").attr("id", "jw-settings-submenu-edgeStyle-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-backgroundColor']").attr("aria-controls", "jw-settings-submenu-backgroundColor-" + containerId);
					$container.find("#jw-settings-submenu-backgroundColor").attr("id", "jw-settings-submenu-backgroundColor-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-backgroundOpacity']").attr("aria-controls", "jw-settings-submenu-backgroundOpacity-" + containerId);
					$container.find("#jw-settings-submenu-backgroundOpacity").attr("id", "jw-settings-submenu-backgroundOpacity-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-windowColor']").attr("aria-controls", "jw-settings-submenu-windowColor-" + containerId);
					$container.find("#jw-settings-submenu-windowColor").attr("id", "jw-settings-submenu-windowColor-" + containerId);

					$container.find("button[aria-controls='jw-settings-submenu-windowOpacity']").attr("aria-controls", "jw-settings-submenu-windowOpacity-" + containerId);
					$container.find("#jw-settings-submenu-windowOpacity").attr("id", "jw-settings-submenu-windowOpacity-" + containerId);
				});
			});
		});
	}
});