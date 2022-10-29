var videoResizerTimer;
var videoFullScreenTimer;
var videoFullScreenSwitch = false;
var bodyWidth;
var screenResizerTimerCards;

function resizeCards() {
	bodyWidth = viewportSize.getWidth();

	$(".card-inner").removeAttr("style");

	if (bodyWidth >= 300) {
		var cardInnerMaxHeight = 0;

		$(".card-inner").each(function() {
			var $this = $(this);
			if ($this.height() > cardInnerMaxHeight) cardInnerMaxHeight = $this.height();
		});

		$(".card-inner").height(cardInnerMaxHeight);
	}
}

$(document).ready(function() {
	"use strict";

	var html = $("html");
	var $window = $(window);
	var stickyNavWideSelector = ".sticky-nav.wide";

	if ($(".sticky-nav.wide").hasClass("sticky-clone")) stickyNavWideSelector = ".sticky-nav.clone";

	$(".sticky-nav-wrapper a, .sticky-nav-wrapper button, .sticky-nav-wrapper div.jwplayer").not(".sticky-nav.wide a").on("focusin", function() {
		var $this = $(this);
		var $offset = $this.offset();
		var $stickyNavHeight = $(stickyNavWideSelector).height();

		setTimeout(function() {
			if ($offset.top - $(window).scrollTop() < $stickyNavHeight) {
				$([document.documentElement, document.body]).animate({
					scrollTop: $this.offset().top - $stickyNavHeight - 20
				}, 100);
			}						
		}, 100);
	});

	if (window.location.hash.substr(1,5) == "d.en.") {
		var hash = window.location.hash.substr(1).replace("d.en.", "");

		if ($("#d\\.en\\." + hash).hasClass("accordion-item")) {
			$("#d\\.en\\." + hash).addClass("open");
			$("#d\\.en\\." + hash).find("button").attr("aria-expanded", "true");
			$("#d\\.en\\." + hash).find(".accordion-item-content").removeAttr("hidden");
		}
	}

	var $stickyEl = $(".sticky-nav.wide");
	var $contentEl = $(".sticky-nav-wrapper");
	var $stickyElClone;
	var elTop;

	if ($stickyEl.length > 0) {
		// Default or custom sticky nav for desktop?
		if ($stickyEl.hasClass("sticky-clone") || html.hasClass("no-csspositionsticky")) {
			// Custom sticky nav for desktop.
			$stickyElClone = $stickyEl.clone().removeClass("original").addClass("clone");
			$contentEl.prepend($stickyElClone);

			if ("IntersectionObserver" in window) {
				let options = {
					rootMargin: "0px 0px 1000px 0px"
				}

				let observer = new IntersectionObserver(function(entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							$stickyElClone.removeClass("visible");
						} else {
							$stickyElClone.addClass("visible");
						}
					});
				}, options);

				const target = document.querySelector(".sticky-nav.wide.original");
				observer.observe(target);
			} else {
				elTop = $stickyEl.offset().top;

				if ($stickyEl.hasClass("bottom-edge")) elTop += $stickyEl.height();

				$window.scroll(function() {
					$stickyElClone.toggleClass("visible", $window.scrollTop() > elTop);
				});
			}
		}
	}

	$(".sticky-nav a:not(.off-page)").on("click tap", function(e) {
		var $this = $(this);
		var destinationId = $this.attr("href").substr(1).replace("d.en.", "");
		e.preventDefault();

		var anchorScrollOffset = 10;

		if ($this.closest(".sticky-nav").hasClass("wide")) {
			anchorScrollOffset += $(stickyNavWideSelector).height() + 9;
		} else {
			$(".sticky-nav.narrow button").attr("aria-expanded", false);
			$this.closest("ul").prop("hidden", true);
		}

		const targetElement = document.getElementById("d.en." + destinationId);
		targetElement.focus({ preventScroll: true });

		if ($(targetElement).hasClass("banner-bg")) anchorScrollOffset = 0;

		$("html, body").animate({
			scrollTop: $("#d\\.en\\." + destinationId).offset().top - anchorScrollOffset
		}, 500, function() {});
	});

	$(".sticky-nav.narrow button").on("click", function() {
		var $this = $(this);
		var $menu = $(".sticky-nav.narrow ul");

		if ($this.attr("aria-expanded") === "true") {
			$this.attr("aria-expanded", false);
			$menu.prop("hidden", true);
		} else {
			$this.attr("aria-expanded", true);			
			$menu.prop("hidden", false);
		}
	});

	$(".accordion-item h2 button, .accordion-item h3 button, .accordion-item h4 button, .accordion-item h5 button").on("click tap", function() {
		var $this = $(this);
		var targetAccordionItemId = $this.attr("aria-controls");

		if ($("#" + targetAccordionItemId).attr("hidden") == "hidden") {
			$this.parent().parent().addClass("open");
			$this.attr("aria-expanded", "true");
			$("#" + targetAccordionItemId).removeAttr("hidden").find("img").lazyload();
		} else {
			$this.parent().parent().removeClass("open");
			$this.attr("aria-expanded", "false");
			$("#" + targetAccordionItemId).attr("hidden", "hidden");
		}
	});

	$.getScript("https://cdn.jwplayer.com/libraries/rJOniDVM.js", function() {
		$(".video2.single").each(function() {
			var $this = $(this);
			$this.find(".loading").show();
			var containerId = $this.prop("id");
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
				"tracks": tracks,
				"skin": { name: "uom" }
			});

			jwplayer(containerId).on("play", function() {
				$("#" + containerId).siblings().fadeOut();
				$("#" + containerId).parent().removeClass("jw-remove-overlays");
				$("#" + containerId).find(".jw-controls .jw-display-container").show();
				$("#" + containerId).find(".jw-display-controls").css("visibility", "visible");
			});

			jwplayer(containerId).on("ready", function() {
				var $container = $("#" + containerId);

				$container.parent().find(".video-overlay").css("visibility", "visible");

				/* Accessibility fixes for JW Player elements with repeated IDs */
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

			if ($("#" + containerId).parent().hasClass("mobile169")) {
				jwplayer(containerId).on("resize", function() {
					if (videoFullScreenSwitch === false) {
						clearTimeout(videoResizerTimer);

						videoResizerTimer = setTimeout(function() {
							bodyWidth = viewportSize.getWidth();

							if (bodyWidth < 800) {
								jwplayer(containerId).setConfig({ "aspectratio": "16:9", "stretching": "uniform" });
							} else {
								jwplayer(containerId).setConfig({ "aspectratio": aspectRatio, "stretching": "fill" });
							}
						}, 500);						
					}
				});
			}

			if (stretching != "uniform") {
				jwplayer(containerId).on("fullscreen", function(object) {
					videoFullScreenSwitch = true;
					clearTimeout(videoFullScreenTimer);

					videoFullScreenTimer = setTimeout(function() {
						videoFullScreenSwitch = false;
					}, 500);

					var bodyWidth = viewportSize.getWidth();
					if (object.fullscreen) {
						jwplayer(containerId).setConfig({ "stretching": "uniform" });
					} else {
						if ($("#" + containerId).parent().hasClass("mobile169") && bodyWidth < 800) {
							jwplayer(containerId).setConfig({ "stretching": "uniform" });
						} else {
							jwplayer(containerId).setConfig({ "stretching": "fill" });
						}
					}
				});
			}
		});
	});

	$(".video-overlay").each(function() {
		var $this = $(this);

		$this.on("click tap", function() {
			jwplayer($this.find("button").data("videoid")).play();
		});
	});

	$(".play-button button").each(function() {
		var $this = $(this);

		$this.on("click tap", function(event) {
			event.stopPropagation();
			jwplayer($this.data("videoid")).play();
		});
	});

	var $cell = $(".grid-expanding-cards .card");
	$(".grid-expanding-cards .card a").attr("tabindex", "-1");

	// Open and close card when user clicks on card.
	$cell.find(".js-expander").on("click", function() {
		var $this = $(this);
		var targetExpanderId = $this.attr("aria-controls");
		var $thisCell = $(this).closest(".card");

		if ($thisCell.hasClass("is-collapsed")) {
			// Close expanded card if necessary.
			$cell.not($thisCell).removeClass("is-expanded").addClass("is-collapsed");
			$cell.not($thisCell).find("a").attr("tabindex", "-1");
			$cell.not($thisCell).find("button").attr("aria-expanded", "false");
			$cell.not($thisCell).find(".card-expander").attr("hidden", "hidden");

			$thisCell.removeClass("is-collapsed").addClass("is-expanded");
			$("#" + targetExpanderId).removeAttr("hidden");
			$this.attr("aria-expanded", "true");
			$thisCell.find("a").attr("tabindex", "0");

			if (Math.abs($this.offset().top - $(window).scrollTop()) > 10) {
				setTimeout(function() {
					$([document.documentElement, document.body]).animate({
						scrollTop: $this.offset().top - 9
					}, 500);
				}, 250);
			}
		} else {
			$thisCell.removeClass("is-expanded").addClass("is-collapsed");
			$("#" + targetExpanderId).attr("hidden", "hidden");
			$this.attr("aria-expanded", "false");
			$thisCell.find("a").attr("tabindex", "-1");
		}
	});

	// Close card when user clicks on cross.
	$cell.find(".js-collapser").on("click", function() {
		var $thisCell = $(this).closest(".card");

		$thisCell.removeClass("is-expanded").addClass("is-collapsed");
		$thisCell.find(".card-expander").attr("hidden", "hidden");
		$thisCell.find("button").attr("aria-expanded", "false");
		$thisCell.find("a").attr("tabindex", "-1");
	});

	$(window).on("resize", function() {
		clearTimeout(screenResizerTimerCards);

		screenResizerTimerCards = setTimeout(function() {
			resizeCards();
		}, 100);
	});
});

$(window).on("load", function() {
	"use strict";

	var stickyNavWideSelector = ".sticky-nav.wide";

	if ($(".sticky-nav.wide").hasClass("sticky-clone")) stickyNavWideSelector = ".sticky-nav.clone";

	if (window.location.hash.substr(1,5) == "d.en.") {
		var destinationId = window.location.hash.substr(1).replace("d.en.", "");
		var anchorScrollOffset = 10;

		if ($(".sticky-nav:visible").hasClass("wide")) {
			anchorScrollOffset += $(stickyNavWideSelector).height() + 9;
		}

		$("html, body").animate({
			scrollTop: $("#d\\.en\\." + destinationId).offset().top - anchorScrollOffset
		}, 500, function() {});
	}

	resizeCards();
});