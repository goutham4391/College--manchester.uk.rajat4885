/*------------------------------------------------*/
/* Reset the global cache for ajax loaded scripts */
/*------------------------------------------------*/
$.ajaxSetup({
	cache: true
});
	
/* Global DOM elements */
var html;
var body;
var bodyWidth;
var sideMenuShowHide = $(".primaryLeftNav a.showHideIcon");
var hideMenuTimer;
var didScroll = false;
var scrollTimer = false;

/* Global Vars */
var accordionOffsetTop = 0;
var showFullScreenContent = false;
var carouselInitialised = false;
var screenResizerTimer;
var ua = navigator.userAgent;
var firefox41Plus = false;
var hostname = window.location.hostname;
var breadcrumbTop;
var $window;
var shareToolbar;
var shareTooltipDesktop;
var jwPlayerLibraryUrl = "https://content.jwplatform.com/libraries/oCVSW4JO.js";
var jqueryUiLibraryUrl = "https://assets.manchester.ac.uk/corporate/js/libs/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js";
//var jqueryUiLibraryUrl = "https://www.manchester.ac.uk/medialibrary/degreeprogrammes/jquery-upgrade/jquery-ui-1.13.0.custom/jquery-ui.min.js";
//var jqueryUiLibraryUrl = "https://assets.manchester.ac.uk/corporate/js/libs/jquery-ui-1.13.0.custom/js/jquery-ui.min.js";

if (ua.indexOf("Firefox") > 0) {
	var firefoxVersion = parseFloat(ua.slice(ua.indexOf("Firefox") + 8));

	if (firefoxVersion >= 41) {
		firefox41Plus = true;
	}
}

//---------------------------------
//Equal Height for any class passed
//---------------------------------
$.fn.equalizeHeights = function() {
	"use strict";

	return this.height(Math.max.apply(this, $(this).map(function (i, e) {
		return $(e).height();
	}).get()));
};
//-------------------------------------
//END Equal Height for any class passed
//-------------------------------------

//Get all ATTRs for DOM element
$.fn.getAttributes = function() {
	"use strict";

	var attributes = {}; 

	if (!this.length) {
		return this;
	}

	$.each(this[0].attributes, function(index, attr) {
		attributes[attr.name] = attr.value;
	});

	return attributes;
};

document.addEventListener("DOMContentLoaded", function() {
	//var lazyloadImages = document.querySelectorAll("img.lazy2");
	let lazyloadImages = document.querySelectorAll(".lazy2:not(.noLazy)[data-src]");

	if ("IntersectionObserver" in window) {
		let imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					let lazyImage = entry.target;
					lazyImage.src = lazyImage.dataset.src;
					lazyImage.classList.remove("lazy2");
					imageObserver.unobserve(lazyImage);
					lazyImage.removeAttribute("data-src");
				}
			});
		}, {rootMargin: "200px"});

		lazyloadImages.forEach(function(lazyImage) {
			imageObserver.observe(lazyImage);
		});
	} else {
		// NodeList.forEach polyfill for IE11:
		if (window.NodeList && !NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;

		lazyloadImages.forEach(function(lazyImage) {
			lazyImage.src = lazyImage.dataset.src;
		});
	}
});

$(document).ready(function() {
	"use strict";

	/*----------------------------------------------------------------------------------------------*/
	/*		CUSTOM SCRIPT																			*/
	/*----------------------------------------------------------------------------------------------*/

	html = $("html");
	body = $("body");
	$window = $(window);

	$(".currentsection").parents("li").last().addClass("currentmainbranch");

	/*-----------*/
	/* MEGA MENU */
	/*-----------*/
	$(".megaMenu").hoverIntent({
		over: showMegaMenu,
		out: hideMegaMenu,
		timeout: 400,
		selector: "li.menuItem"
	});
	/*---------------*/
	/* END MEGA MENU */
	/*---------------*/

	/*-------------------------------*/
	/* 2 touch process for mega menu */
	/*-------------------------------*/
	$(".touch .menuItem a.megaLink, .touchevents .menuItem a.megaLink").on("touchstart", function(e) {
		//e.stopPropogation;
		var $this = $(this);
		
		if (!$this.parent().hasClass("active")) {
			$(".touch .menuItem, .touchevents .menuItem").removeClass("active");
			$(".megaContent").removeAttr("style");

			$this.parent().addClass("active");
			$this.next(".megaContent").addClass("active");
			return false;
		} else {
			return true;
		}
	});

	body.on("touchstart", function(e) {
		//if parent of this click is NOT clickout AND this click is NOT clickout then hide stuff
		if (!$(e.target).parents().is(".clickOut")) {
			$(".touch .menuItem, .touchevents .menuItem").removeClass("active");
			$(".megaContent").removeClass("active").removeAttr("style");
		}
	});
	/*-----------------------------------*/
	/* END 2 touch process for mega menu */
	/*-----------------------------------*/

	/*----------------------------------*/
	/* Auto expand menu - Memory effect */
	/*----------------------------------*/
		
	/* Initialise if menu shows persistent active state */
	var memoryEffect = true;
	
	/* Show menu expanded to show active state */
	if ($('.primaryLeftNav li.activeMenuLink').length && memoryEffect) {
		$('li.activeMenuLink').parents('ul').each(function() {
			var $this = $(this);
			$this.show();
			$this.parent().addClass('open');
		});
	}
	/*--------------------------------------*/
	/* END Auto expand menu - Memory effect */
	/*--------------------------------------*/
		
	/*-------------------------------*/
	/* Show / Hide Sub Nav (DESKTOP) */
	/*-------------------------------*/

	/* Initialise collapse menu */
	var collapseSideAll = true;  //false = collapse this branch | true = collapse every open branch

	/* Collapse menu functions */
	$(sideMenuShowHide).on("click", function(e) {
		var $this = $(this);
		e.preventDefault();

		if (!$this.parent().parent().hasClass('open')) {
			/* OPEN STUFF */
			if (collapseSideAll) {
				var prevLI = $this.parent().parent().siblings('li.open');  //get the siblings branch that is open

				$(prevLI).find('ul').slideUp(200).promise().done(function() {
					//find ALL the UL's in the open branch and close them
					$(prevLI).removeClass('open');

					var branch = getSideBranch(prevLI);
					closeSideBranch(branch);  //close all the child branches
				});
			}

			$this.parent().parent().addClass('open'); //adds "open" to the LI
			$this.parent().parent().find('ul').first().slideDown(200); 
		} else {
			/* CLOSE STUFF */
			var branch = getSideBranch( $this.parent().parent() );

			$this.parent().parent().removeClass('open'); 
			$this.parent().parent().find('ul').first().slideUp(200, function() {
				closeSideBranch(branch);
			}); 
		}
	});
	/*-----------------------------------*/
	/* END Show / Hide Sub Nav (DESKTOP) */
	/*-----------------------------------*/	

	/*------------------*/
	/* Tabs / Accordion */
	/*------------------*/
		
	/* Tabs */
	$(".tabTitles li a.tabLink").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);

		$(".tabTitles li").removeClass("activeTabLink");
		$this.parent().addClass("activeTabLink");

		var thisIndex = $this.parent().index();

		$(".tabPanelContainer .tabPanel").addClass("jsHide");
		$(".tabPanelContainer .tabPanel:eq("+thisIndex+")").removeClass("jsHide");

		//***lazyload removal***
		forceLazyLoad(thisIndex);
	});

	if (window.location.hash.substr(1,5) == "d.en.") {
		var hash = window.location.hash.substr(1).replace("d.en.", "");

		if ($("#d\\.en\\." + hash).hasClass("internalTitle")) {
			$("#d\\.en\\." + hash + " a.accordionLink").addClass("activeAccordionLink");
			$("#d\\.en\\." + hash).next().slideDown().addClass("activeAccordionPanel");

			if ($("#d\\.en\\." + hash).next().find(".video, .audio").length > 0) {
				//console.log("#d\\.en\\." + hash.replace("d.en.", "") + "-tabPanelWrapper");
				if (window.jwplayer) {
					initialiseVideos("#d\\.en\\." + hash.replace("d.en.", "") + "-tabPanelWrapper");
					initialiseAudio("#d\\.en\\." + hash.replace("d.en.", "") + "-tabPanelWrapper");
				} else {
					$.getScript(jwPlayerLibraryUrl, function() {
						initialiseVideos("#d\\.en\\." + hash.replace("d.en.", "") + "-tabPanelWrapper");
						initialiseAudio("#d\\.en\\." + hash.replace("d.en.", "") + "-tabPanelWrapper");
					});
				}
			}

			//***lazyload removal***
			var thisIndex = $("#d\\.en\\." + hash).parent().index();
			forceLazyLoad(thisIndex);
		}
	}

	/* Accordion */
	$("h2.internalTitle a.accordionLink").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);

		/* If we're NOT clicking the already active title */
		if (!$this.hasClass("activeAccordionLink")) {
			$this.addClass("activeAccordionLink");
			$this.parent().next().slideDown().addClass("activeAccordionPanel");

			if ($this.parent().next().find(".video, .audio").length > 0) {
				if (window.jwplayer) {
					initialiseVideos("#d\\.en\\." + $this.parent().attr("id").replace("d.en.", "") + "-tabPanelWrapper");
					initialiseAudio("#d\\.en\\." + $this.parent().attr("id").replace("d.en.", "") + "-tabPanelWrapper");
				} else {
					$.getScript(jwPlayerLibraryUrl, function() {
						initialiseVideos("#d\\.en\\." + $this.parent().attr("id").replace("d.en.", "") + "-tabPanelWrapper");
						initialiseAudio("#d\\.en\\." + $this.parent().attr("id").replace("d.en.", "") + "-tabPanelWrapper");
					});
				}
			}

			//***lazyload removal***
			// Lazy load images in this accordion item.
			$("#d\\.en\\." + $this.parent().attr("id").replace("d.en.", "")).parent().find("img").lazyload();

			// Equalise the heights of colour promo boxes within rows.
			if ($(".inner .clearfix .sixcol.colourPromo").length > 1) {
				$(".inner .clearfix").has(".sixcol.colourPromo").each(function() {
					equaliseHeightRows(".sixcol.colourPromo", this);
				});
			}

			if ($(".inner .clearfix .fourcol.colourPromo").length > 1) {
				$(".inner .clearfix").has(".fourcol.colourPromo").each(function() {
					equaliseHeightRows(".fourcol.colourPromo", this);
				});
			}

			if (bodyWidth >= 960) {
				if ($("div.tabPanelWrapper.activeAccordionPanel ul.gridList.displayAsGrid").not(".noEqualise").length > 0) {
					$("div.tabPanelWrapper.activeAccordionPanel ul.gridList.displayAsGrid").not(".noEqualise").each(function() {
						equaliseHeightRows("div.tabPanelWrapper.activeAccordionPanel ul.gridList.displayAsGrid li", this);
					});
				}
			} else {
				$("ul.gridList.displayAsGrid li").removeAttr("style");
			}
		} else {
			$this.removeClass("activeAccordionLink");
			$this.parent().next().slideUp().removeClass("activeAccordionPanel");
		}
	});
	/*----------------------*/
	/* END Tabs / Accordion */
	/*----------------------*/
	
	/*----------------------------------------------------------------------------------------------*/
	/*		FORM SCRIPT																				*/
	/*----------------------------------------------------------------------------------------------*/

	/*------------------*/
	/* Fake Placeholder */
	/*------------------*/
	if (!Modernizr.placeholder) {
		$("input:not('.noIEPlaceholder'), textarea").each(function() { // loop through all inputs & textareas
			var $this = $(this);
			var thisPlaceholderText = $this.attr("placeholder"); // get the placeholder text

			if ($this.val() === "" && thisPlaceholderText !== "") {
				// if the current "value" attribute is empty AND placeholder text isn't empty

				$this.val(thisPlaceholderText); // set the "value" attibute to the placeholder text
				$this.addClass("placeholderTextColor"); // set the text to the fake color (placeholder colour)

				$this.on("focus", function() {
					if ($this.val() === thisPlaceholderText) {
						// if the "value" attribute is equal to the placeholder value, i.e. empty

						$this.val(""); // clear the "value" attribute
						$this.addClass("formFocusTextColor"); // change the colour to the proper input colour
					}
				});

				$this.on("keyup", function() {
					if ($this.val() !== "" && $this.val() !== thisPlaceholderText) {
						$this.removeClass("placeholderTextColor");
					}
				});

				$this.on("blur", function() {
					if ($this.val() === "") {
						// if the "value" attribute is empty, (no text was entered)

						$this.removeClass("formFocusTextColor").addClass("placeholderTextColor"); // remove the colour to the proper input colour, reverts back to placeholder colour
						$this.val(thisPlaceholderText); // set the "value" attibute to the placeholder text
					}
				});
			}
		});
	}
	/*----------------------*/
	/* END Fake Placeholder */
	/*----------------------*/

	/*-------------------*/
	/* Postcode validate */
	/*-------------------*/
	$(".postcodeCheck").on("blur", function() {
		var $this = $(this);

		if ($this.val() !== "") {
			var myregex = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;

			var matches = myregex.exec($this.val());

			if (matches) {
				$(".crossIcon").remove();
				$this.after("<div class=\"tickIcon\" />");
				$this.addClass("doubleIconPadding");
			} else {
				$(".tickIcon").remove();
				$this.after("<div class=\"crossIcon\" />");
				$this.addClass("doubleIconPadding");
			}
		} else {
			$(".crossIcon").remove();
			$(".tickIcon").remove();
			$this.removeClass("doubleIconPadding");
		}
	});
	/*-----------------------*/
	/* END Postcode validate */
	/*-----------------------*/

	/*-----------------------*/
	/* Email format validate */
	/*-----------------------*/
	$(".emailCheck").on("blur", function() {
		var $this = $(this);

		if ($this.val() !== "") {
			var myregex = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

			var matches = myregex.exec($this.val());

			if (matches) {
				$(".crossIcon").remove();
				$this.after("<div class=\"tickIcon\" />");
				$this.addClass("doubleIconPadding");
			} else {
				$(".tickIcon").remove();
				$this.after("<div class=\"crossIcon\" />");
				$this.addClass("doubleIconPadding");
			}
		} else {
			$(".crossIcon").remove();
			$(".tickIcon").remove();
			$this.removeClass("doubleIconPadding");
		}
	});
	/*---------------------------*/
	/* END Email format validate */
	/*---------------------------*/

	/*--------------*/
	/* Numbers only */
	/*--------------*/
	var inputObject = $(".numberCheck");

	// Restrict the INPUT to numbers only
	$(inputObject).on("keydown", function(event) {
		checkKeycode(event);
	});

	/*------------------*/
	/* END Numbers only */
	/*------------------*/

	/*----------------------------------------*/
	/* Dropdown: show/hide hidden form fields */
	/*----------------------------------------*/
	$(".titleSelect").on("change", function() {
		var $this = $(this);
		var changeTo = $this.val();
		var extraRow = $this.parent().find(".extraRow");

		if (changeTo === "other" || changeTo === "Other") {
			extraRow.slideDown().removeClass("hidden");
		} else {
			extraRow.slideUp().addClass("hidden");
		}
	});
	/*--------------------------------------------*/
	/* END Dropdown: show/hide hidden form fields */
	/*--------------------------------------------*/
		
		
	/*------------------------------------------------------------------------------*/
	/* Character Counter - http://hycus.com/2011/03/25/simple-jquery-character-count
	/*------------------------------------------------------------------------------*/
	$(".commentsCount").on("keyup", function() {
		var $this = $(this);
		var maxchar = 500;
		var count = $this.val().length;
		var remainingchar = maxchar - count;

		if (remainingchar < 0) {
			$("#counterNumber").html("0");
			$this.val($this.val().slice(0, 500));
		} else {
			$("#counterNumber").html(remainingchar);
		}
	});
	/*----------------------------------------------------------------------------------*/
	/* END Character Counter - http://hycus.com/2011/03/25/simple-jquery-character-count
	/*----------------------------------------------------------------------------------*/

	/*----------------*/
	/* Add Clear Icon */
	/*----------------*/
	$(".gt-ie7 input:text, .gt-ie7 input[type='email'], .gt-ie7 input:password, .gt-ie7 input.numberCheck, .gt-ie7 input.emailCheck, .gt-ie7 textarea").not(".noClear").each(function() {
		var $this = $(this);
		$this.wrap("<div class=\"inputWrapper\" />");
		$this.after("<div class=\"clearIcon\" />");
		$this.addClass("clearIconPadding");
	});
	/*--------------------*/
	/* END Add Clear Icon */
	/*--------------------*/

	/*-------------------*/
	/* Add Password Icon */
	/*-------------------*/
	$(".gt-ie7 input:password").not(".noClear").each(function() {
		var $this = $(this);
		$this.after("<div class=\"passwordIcon\" />");
		$this.addClass("doubleIconPadding");
	});
	/*-----------------------*/
	/* END Add Password Icon */
	/*-----------------------*/

	/*------------------------*/
	/* Show / Hide clear icon */
	/*------------------------*/
	// var clearInputTimer; - if no errors, delete this

	/* FOCUS */
	inputFocus();

	/* BLUR */
	inputBlur();
	/*----------------------------*/
	/* END Show / Hide clear icon */
	/*----------------------------*/

	/*--------------------*/
	/* Password show/hide */
	/*--------------------*/

	//Create a new HTML string for our password input box

	$(".passwordIcon").on("click", function() {
		//DOM Element - password input
		var $this = $(this);
		var passwordInputBox = $this.prev("input");

		// Get password input attributes
		var attrList = $(passwordInputBox).getAttributes();

		// Upate the VALUE ATTR with what has been typed
		$(attrList).attr("value", $(passwordInputBox).val());

		var passwordInputClone;

		if (!$this.hasClass("passwordIcon-show")) {
			// is checkbox checked
			$this.addClass("passwordIcon-show");
			$(attrList).attr("type", "text"); // Change TYPE to TEXT
			passwordInputClone = createNewPasswordInput(attrList); // Create new INPUT box with changed type & value attributes
		} else {
			$this.removeClass("passwordIcon-show");
			$(attrList).attr("type", "password"); // Change TYPE to TEXT
			passwordInputClone = createNewPasswordInput(attrList); // Create new INPUT box with changed type & value attributes
		}

		$(passwordInputBox).replaceWith(passwordInputClone);

		inputFocus();
		inputBlur();
		listenForEscKey();
	});
	/*------------------------*/
	/* END Password show/hide */
	/*------------------------*/

	/*-------------------------------------------*/
	/* Clear the input field with the clear icon */
	/*-------------------------------------------*/
	$(".clearIcon").on("click", function() {
		var $this = $(this);

		$this.siblings("input").val("");
		$this.siblings("textarea").val("");
		$("#counterNumber").text("500");
		$this.hide();
		$this.siblings(".passwordIcon").removeClass("movePasswordIcon");
		$(".crossIcon").remove();
		$(".tickIcon").remove();
		$this.removeClass("doubleIconPadding");
	});
	/*-----------------------------------------------*/
	/* END Clear the input field with the clear icon */
	/*-----------------------------------------------*/

	/*----------------------------------------*/
	/* Clear the input field with the Esc key */
	/*----------------------------------------*/
	listenForEscKey();
	/*--------------------------------------------*/
	/* END Clear the input field with the Esc key */
	/*--------------------------------------------*/

	/*----------------------------------------------------------------------------------------------*/
	/*		PLUGIN SCRIPT																			*/
	/*----------------------------------------------------------------------------------------------*/
	$(".studyEq").on("load", function() {
		bodyWidths();
	});

	/*------------------*/
	/* Lazy load images */
	/*------------------*/

	//***lazyload removal***
	$("img.lazy:not('img.noLazy')").show().lazyload({
		effect: "fadeIn"
//			failure_limit: 2,

//			threshold: 400

//			skip_invisible: false
	});

	$("img.lazynews").lazyload({
		effect: "fadeIn",
		threshold: 50,
		failure_limit: 5
//			skip_invisible: false,
//			container: $("#carousel")
	});

	/*----------------------*/
	/* END Lazy load images */
	/*----------------------*/

	$(".embed-container iframe, .videowrapper iframe").removeAttr("width height frameborder");
	$(".embed-container-wakelet iframe").removeAttr("width height scrolling");
	$(".embed-container.videoportal iframe").attr("allowfullscreen", "");

	$("p iframe[src*='youtube.com'], p iframe[src*='youtube-nocookie.com']").each(function() {
		$(this).unwrap().wrap('<div class="videobox2 mobile fullwidth"></div>');
	});

	//***lazyload removal***
	$(".poster").lazyload();

	if ($("div.video, div.audio").not("#course-profile .video, body.umw .video").length > 0) {
		if (window.jwplayer) {
			initialiseVideos();
			initialiseAudio();
		} else {
			$.getScript(jwPlayerLibraryUrl, function() {
				initialiseVideos();
				initialiseAudio();
			});
		}
	}

	if ($(".autocomplete").length > 0) {
		$.getScript(jqueryUiLibraryUrl, function() {
			$(".gsa-autocomplete").each(function() {
				var $this = $(this);
				var site = $this.find(".site").val();
				var client = $this.find(".client").val();

				$(".q", this).autocomplete({
					source: function(request, response) {
						$.ajax({
							url: "/search/suggest/?q=" + request.term + "&site=" + site + "&client=" + client,
							dataType: "json",
							success: function(data) {
								response($.map(data.results, function(item) {
									return {
										label: item.name,
										value: item.name
									};
								}));
							}
						});
					},
					minLength: 2,
					select: function(event, ui) {
						$(this).val(ui.item.value);
						$(this).closest("form").submit();
					},
					open: function() {
						$(this).addClass("ui-autocomplete-loading");
					},
					close: function() {
						$(this).removeClass("ui-autocomplete-loading");
					}
				});
			});

			$(".coursefinder-autocomplete").each(function() {
				var studyLevel = $(this).attr("data-studylevel");
				var xmlLocation;
				var courseBaseUrl;

				switch (studyLevel) {
					case "UG":
						var year = $(this).attr("data-year");
						courseBaseUrl = "/study/undergraduate/courses/" + year + "/";
						xmlLocation = "/study/undergraduate/courses/" + year + "/finder-xml/";
						break;
					case "PGT":
						courseBaseUrl = "/study/masters/courses/list/";
						xmlLocation = "/study/masters/courses/list/finder-xml/";
						break;
					case "PGR":
						courseBaseUrl = "/study/postgraduate-research/programmes/list/";
						xmlLocation = "/study/postgraduate-research/programmes/list/finder-xml/";
						break;
					case "DL":
						courseBaseUrl = "/study/online-blended-learning/what-you-can-study/courses/";
						xmlLocation = "/study/online-blended-learning/what-you-can-study/courses/finder-xml/";
						break;
				}

				if (studyLevel === "all" || studyLevel === "UG-multi") {
					$("#studyLevel").on("change", function() {
						var studyLevel = $(this).val();
						var studyLevelAttr = $(this).find(":selected").attr("data-studylevel");
						if (studyLevelAttr !== "" && studyLevelAttr !== undefined) studyLevel = studyLevelAttr;

						switch (studyLevel) {
							case "UG":
								var year = $(this).find(":selected").attr("data-year");
								courseBaseUrl = "/study/undergraduate/courses/" + year + "/";
								xmlLocation = "/study/undergraduate/courses/" + year + "/finder-xml/";
								break;
							case "PGT":
								courseBaseUrl = "/study/masters/courses/list/";
								xmlLocation = "/study/masters/courses/list/finder-xml/";
								break;
							case "PGR":
								courseBaseUrl = "/study/postgraduate-research/programmes/list/";
								xmlLocation = "/study/postgraduate-research/programmes/list/finder-xml/";
								break;
							case "DL":
								courseBaseUrl = "/study/online-blended-learning/what-you-can-study/courses/";
								xmlLocation = "/study/online-blended-learning/what-you-can-study/courses/finder-xml/";
								break;
						}

						$.ajax({
							url: xmlLocation,
							dataType: "xml",
							success: function(xmlResponse) {
								var data = $("c", xmlResponse).map(function() {
									return {
										name: $("n", this).text(),
										keywords: $("k", this).text(),
										value: $("n", this).text(),
										code: $("i", this).text()
									};
								}).get();

								$("#courseKeywords").autocomplete({
//										source: data,
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
												matches.push(obj);
											}
										}

										response(matches);
									},
//										appendTo: "#courseFinder .inputWrapper",
									position: { my: "left top", at: "left bottom" },
									minLength: 2,
									delay: 0,
									select: function(event, ui) {
										$(this).blur();
										var courseUrl = courseBaseUrl + ui.item.code + "/";
										window.location = courseUrl;
									}
								});
							}
						});
					}).trigger("change");
				} else {
					$.ajax({
						url: xmlLocation,
						dataType: "xml",
						success: function(xmlResponse) {
							var data = $("c", xmlResponse).map(function() {
								return {
									name: $("n", this).text(),
									keywords: $("k", this).text(),
									value: $("n", this).text(),
									code: $("i", this).text()
								};
							}).get();

							$("#courseKeywords").autocomplete({
//									source: data,
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
											matches.push(obj);
										}
									}

									response(matches);
								},
//									appendTo: "#courseFinder .inputWrapper",
								position: { my: "left top", at: "left bottom" },
								minLength: 2,
								delay: 0,
								select: function(event, ui) {
									$(this).blur();
									var courseUrl = courseBaseUrl + ui.item.code + "/";
									window.location = courseUrl;
								}
							});
						}
					});
				}
			});
		});
	}

	$("#courseFinderForm").on("submit", function(e) {
		var courseKeywords = $("#courseKeywords").val();

		if (courseKeywords === "" || courseKeywords === "Enter keywords") {
			$("#courseSearchErrorMessage").text("Please enter course keywords.");
			$("#courseKeywords").trigger("focus");
			return false;
		} else {
			var studyLevel = $("#studyLevel").val();
			var coursePageUrl;

			switch(studyLevel) {
				case "PGT":
					coursePageUrl = "/study/masters/courses/list/";
					break;
				case "PGR":
					coursePageUrl = "/study/postgraduate-research/programmes/list/";
					break;
				case "DL":
					coursePageUrl = "/study/online-blended-learning/what-you-can-study/courses/";
					break;
				default:
					var year = $("#studyLevel option:selected").attr("data-year");
					coursePageUrl = "/study/undergraduate/courses/" + year + "/";
			}

			coursePageUrl += "?k=" + courseKeywords;

			document.location = coursePageUrl;
		}
	});

	if (hostname === "www.manchester.ac.uk" || hostname === "manchester.ac.uk") {
		$("#webFilter").prop("checked", true);
	}

	$("input[name='searchFilter']").on("change", function() {
		var searchFilterValue = $(this).val();

		if (hostname === "www.manchester.ac.uk" || hostname === "manchester.ac.uk") {
			if (searchFilterValue === "staff") {
				$("#searchBox").attr("placeholder", "Search for staff").autocomplete({ disabled: true });
			} else {
				$("#searchBox").attr("placeholder", "Search the website").autocomplete({ disabled: false });
			}
		} else {
			if (searchFilterValue === "microsite") {
				$("#searchBox").attr("placeholder", "Search this site").autocomplete({ disabled: true });
			} else if (searchFilterValue === "staff") {
				$("#searchBox").attr("placeholder", "Search for staff").autocomplete({ disabled: true });
			} else {
				$("#searchBox").attr("placeholder", "Search StaffNet").autocomplete({ disabled: true });
			}
		}
	});

	$("a.showAllUnits").on("click", function() {
//		var thisId = $(this).prop("id");
//		var headingId = thisId.replace("show", "");
		var $this = $(this);

		$this.parent().parent().parent().parent().find("tr.hidedefault").show();
		$this.parent().parent().parent().hide();

		return false;
	});

	$("a.t4Edit-page, a.newWindow").attr("target", "_blank");

	$(".pageSelector").hide();

	if (typeof(Storage) !== "undefined" && html.hasClass("localstorage")) {
		if (!localStorage.showShareTooltip) {
			localStorage.showShareTooltip = false;
			$("<div class=\"share-tooltip desktop\"><div class=\"arrow\"></div><p><img src=\"https://assets.manchester.ac.uk/corporate/images/design/icon-close.svg\" alt=\"Close this message\" class=\"close\" />Share this page</p></div>").hide().appendTo("#breadcrumb-share-container").fadeIn("slow");
		}
	}

	if ((body.hasClass("inner") || body.hasClass("landing")) && $(".share-toolbar").length > 0) {
		var documentClick;
		var shareToolbarButtonClickEnabled = true;
		var shareToolbarUl = $(".share-toolbar ul");
		shareTooltipDesktop = $(".share-tooltip.desktop");
		breadcrumbTop = $(".breadcrumbNav").offset().top;
		shareToolbar = $(".share-toolbar");

		if ($("html").hasClass("touchevents")) {
			$(".share-toolbar ul, .share-toolbar ul li").on("touchend", function(e) {
				e.stopPropagation();
			});

			$(".share-toolbar div").on("click touchend", function(e) {
				e.stopPropagation();
				e.preventDefault();

				if (e.type === "touchend") {
					if (shareToolbarUl.hasClass("open")) {
						shareToolbarUl.slideUp().removeClass("open");
					} else {
						shareToolbarUl.slideDown().addClass("open");
					}
				} else if (shareToolbarButtonClickEnabled === true && e.type === "click") {
					if (shareToolbarUl.hasClass("open")) {
					} else {
						shareToolbarUl.slideDown().addClass("open");
					}
				}

				if (shareTooltipDesktop.length) {
					shareTooltipDesktop.remove();
				}

				return false;
			});

			$(document).on("touchstart", function() {
				documentClick = true;
			});

			$(document).on("touchmove", function() {
				documentClick = false;
			});

			$(document).on("touchend", function() {
				if (documentClick && shareToolbarUl.hasClass("open")) {
					shareToolbarUl.slideUp().removeClass("open");
					shareToolbarButtonClickEnabled = false;
					setTimeout(function() {
						shareToolbarButtonClickEnabled = true;
					}, 500);
				}
			});
		} else {
			$(".share-toolbar ul, .share-toolbar ul li").on("click", function(e) {
				e.stopPropagation();
			});

			//$(".share-toolbar div a").on("click", function(e) {
			$(".share-toolbar button").on("click", function(e) {
				e.stopPropagation();
				e.preventDefault();

				if (shareToolbarUl.hasClass("open")) {
					shareToolbarUl.slideUp().removeClass("open");
				} else {
					shareToolbarUl.slideDown().addClass("open");
				}

				if (shareTooltipDesktop.length) {
					shareTooltipDesktop.remove();
				}
			});

			$(document).on("click", function() {
				if (shareToolbarUl.hasClass("open")) {
					shareToolbarUl.slideUp().removeClass("open");
				}
			});
		}
	}

	$(".share-toolbar ul a, #sharing-menu-container .sectionMenu a").on("click", function(e) {
		e.stopPropagation();

		var width = 575,
			height = 400,
			left = ($(window).width() - width) / 2,
			top = ($(window).height() - height) / 2,
			url = this.href,
			opts = "status=1" + ",width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;

		window.open(url, "share", opts);
		return false;
	});

	$(".share-tooltip").on("click", function() {
		$(this).remove();
	});

	if ($(".breadcrumbNav").css("display") === "none") {
		breadcrumbTop = 0;
	}

	if ((body.hasClass("inner") || body.hasClass("landing")) && $(".share-toolbar").length && !$(".share-toolbar").hasClass("no-slideout")) {
		$window.on("scroll", function() {
			if (!didScroll) {
				scrollTimer = setInterval(function() {
					if (didScroll) {
						didScroll = false;
						clearTimeout(scrollTimer);

						if (breadcrumbTop > 0 && $window.scrollTop() > breadcrumbTop) {
							shareToolbar.addClass("slideout");
//							$shareTooltip.hide();
							shareTooltipDesktop.addClass("slideout");
						} else {
							shareToolbar.removeClass("slideout");
//							$shareTooltip.show();
							shareTooltipDesktop.removeClass("slideout");
						}
					}
				}, 200);
			}

			didScroll = true;
		});
	}

	$(".icon-tabs").each(function() {
		var tabsScroll;
		var totalWidth = 0;
		var tabsContainerWidth = 0;

		$("li", this).each(function(index) {
			tabsContainerWidth += parseInt($(this).width(), 10) + 20;
		});

		$(".tabs-container", this).css("width", tabsContainerWidth  + "px");

		var tabsContainerWrapper = $(".tabs-container-wrapper", this);
		var tabsContainerWrapperId = $(tabsContainerWrapper).attr("id");

		tabsScroll = new IScroll("#" + tabsContainerWrapperId, {
		//tabsScroll = new IScroll(".tabs-container-wrapper", {
			scrollX: true,
			scrollY: false,
			eventPassthrough: true,
			disablePointer: true, // important to disable the pointer events that causes the issues
			disableTouch: false, // false if you want the slider to be usable with touch devices
			disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
			//probeType: 1,
			tap: true,
			click: true
		});

		if (tabsContainerWrapper.width() < tabsContainerWidth) {
			tabsContainerWrapper.addClass("scroll-right");
		}

		//tabsScroll.on("scroll", function() {
		tabsScroll.on("scrollEnd", function() {
			if (this.x < 0) {
				tabsContainerWrapper.addClass("scroll-left");
			} else {
				tabsContainerWrapper.removeClass("scroll-left");
			}

			if (tabsContainerWrapper.width() - this.x < tabsContainerWidth) {
				tabsContainerWrapper.addClass("scroll-right");
			} else {
				tabsContainerWrapper.removeClass("scroll-right");
			}
		});

		$(".tabs-container .tab", this).on("click", function(event) {
			var $this = $(this);
			var thisId = $this.prop("id");
			event.preventDefault();
			$this.parent().parent().find("li").removeClass("current");
			$this.parent().addClass("current");
			$this.closest(".icon-tabs").find(".tab-content.current").removeClass("current");
			$this.closest(".icon-tabs").find("#" + thisId.replace("-link", "")).addClass("current");
			tabsScroll.scrollToElement(this, 500, true, 0);
		});
	});
});

$(window).on("load", function() {
	"use strict";

	$("html, body").trigger("scroll");

//	var timeout = setTimeout(function() { $("img.lazy2").trigger("sporty") }, 5000);

	bodyWidths();
	$('.eqHeights').equalizeHeights();
	
	accordionOffset();
	/*---------------------------------------*/
	/* END Get the offset of accordion panel */
	/*---------------------------------------*/

	/*----------------------------------------*/
	/* Equalise Tab Widths - Table based tabs */
	/*----------------------------------------*/
	carouselTabWidth();
	/*--------------------------------------------*/
	/* END Equalise Tab Widths - Table based tabs */
	/*--------------------------------------------*/

	/*-------------------*/
	/* Masthead Carousel */
	/*-------------------*/
	if ($(".masthead-container").length) {
		// Call the masthead height script on load
		setCarouselHeight();
	}

	$(".masthead-pagination").on("click", "a", function(e) {
		e.preventDefault();
		var $this = $(this);

		$this.parent().addClass("active").siblings().removeClass("active");

		var whichLink = $this.parent().index();
		var panelToShow = $(".masthead-slide:eq(" + whichLink + ")");

		if (!$(panelToShow).hasClass("active")) {
			$(panelToShow).hide().addClass("working").fadeIn(function() {
				$(".masthead-slide").removeClass("active");
				$(this).addClass("active").removeClass("working");
			});
		}
	});
	/*-----------------------*/
	/* END Masthead Carousel */
	/*-----------------------*/

	/*-----------------*/
	/* Window Resizing */
	/*-----------------*/
	$(window).on("resize", function() {
		clearTimeout(screenResizerTimer);

		screenResizerTimer = setTimeout(function() {
			bodyWidths();

			accordionOffset();

			if ((body.hasClass("inner") || body.hasClass("landing")) && $(".share-toolbar").length > 0 && (hostname === "www.manchester.ac.uk" || hostname === "manchester.ac.uk" || hostname === "mhn.cmsstage.manchester.ac.uk")) {
				breadcrumbTop = $(".breadcrumbNav").offset().top;

				if ($(".breadcrumbNav").css("display") === "none") {
					breadcrumbTop = 0;
				}

				if (breadcrumbTop > 0 && $window.scrollTop() > breadcrumbTop) {
					shareToolbar.addClass("slideout");
//					$shareTooltip.hide();
					shareTooltipDesktop.addClass("slideout");
				} else {
					shareToolbar.removeClass("slideout");
//					$shareTooltip.show();
					shareTooltipDesktop.removeClass("slideout");
				}
			}

			// setCourseFinderHeight()

			if ($(".masthead-container").length) {
				setCarouselHeight();
			}
		}, 500);
	});

	if ($("ul.gridList.displayAsGrid").length > 0) {
		$(window).on("scroll", function() {
			clearTimeout(screenResizerTimer);

			screenResizerTimer = setTimeout(function() {
				bodyWidths();
			}, 200);
		});
	}
	/*---------------------*/
	/* END Window Resizing */
	/*---------------------*/
});

/*------------*/
/* Body width */
/*------------*/
function bodyWidths() {
	"use strict";

	bodyWidth = viewportSize.getWidth();  //get the true viewport width

	/*--------------*/
	/*		600		*/
	/*--------------*/
	if (bodyWidth >= 600) {
		if ($(".carousel").length && !carouselInitialised) {
			initCarousel();
		}
	} else {
		if ($(".carousel").length) {
			$(".carousel").trigger("destroy"); // Destroy the carousel.
			$(".carousel").removeAttr("style"); // Remove attributes that destroy method doesn't.
			$(".slide").removeAttr("style");
			carouselInitialised = false;
		}
	}

	/*--------------*/
	/*		960		*/
	/*--------------*/
	if (bodyWidth >= 960) {
		if ($(".home .row.study .colourPromo").length > 1) {
			equaliseHeightRows(".colourPromo", $(".row.study"));
		}

		if ($("ul.gridList.displayAsGrid").not(".noEqualise").length > 0) {
			$("ul.gridList.displayAsGrid").not(".noEqualise").each(function() {
				equaliseHeightRows("ul.gridList.displayAsGrid li", this);
			});
		}
	} else {
		if ($(".home .row.study .colourPromo").length > 1) {
			$(".row.study .colourPromo").removeAttr("style");
		}

		$("ul.gridList.displayAsGrid li").removeAttr("style");
	}

	// Equalise the heights of colour promo boxes within rows.
	if ($(".inner .clearfix .sixcol.colourPromo").length > 1) {
		$(".inner .clearfix").has(".sixcol.colourPromo").each(function() {
			equaliseHeightRows(".sixcol.colourPromo", this);
		});
	}

	if ($(".inner .clearfix .fourcol.colourPromo").length > 1) {
		$(".inner .clearfix").has(".fourcol.colourPromo").each(function() {
			equaliseHeightRows(".fourcol.colourPromo", this);
		});
	}
}
/*----------------*/
/* END Body width */
/*----------------*/

/*--------------------------*/
/* Equalise heights in rows */

/*--------------------------*/
function equaliseHeightRows(objsToEqualise) {
	"use strict";

	$(objsToEqualise).height('auto');
	var currentTallest = 0,
		currentRowStart = 0,
		rowDivs = [],
		$el,
		topPosition = 0,
		currentDiv;

	$(objsToEqualise).each(function() {
		$el = $(this);
		topPosition = $el.position().top;

		if (currentRowStart !== topPosition) {
			/* we just came to a new row.  Set all the heights on the completed row */
			for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
				rowDivs[currentDiv].height(currentTallest);
			}

			/* set the variables for the new row */
			rowDivs.length = 0; // empty the array
			currentRowStart = topPosition;
			currentTallest = $el.height();
			rowDivs.push($el);
		} else {
			/* another div on the current row.  Add it to the list and check if it's taller */
			rowDivs.push($el);
			currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
		}

		/* do the last row */
		for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
			rowDivs[currentDiv].height(currentTallest);
		}
	});
}
/*------------------------------*/
/* END Equalise heights in rows */
/*------------------------------*/

/*----------*/
/* Carousel */
/*----------*/
function initCarousel() {
	"use strict";

	if ($(".carousel").length) {
		//if it exists and hasn't been initialised
		$(".carousel").each(function() {
			var thisCarousel = $(this);

			thisCarousel.carouFredSel(
			{
				responsive:	true,
				auto: false,
				items: {
					start: -1,
					width: 350,
					visible:{
						min: 2,
						max: 10
					}
				},
				scroll: {
					items: 1,
					onBefore : function(oldItems, newItems) {
						$(window).trigger("scroll");
					}
				},
				prev: {
//					button: ".prev",
					button: thisCarousel.closest(".carousel-wrapper").find(".carousel-prev"),
					key: "left"
				},
				next: {
//					button: ".next",
//					button: $(this).parent().find(".carousel-next"),
					button: thisCarousel.closest(".carousel-wrapper").find(".carousel-next"),
					key: "right"
				}
			});
//			}).prev();
//			}).next();

//			$('#carousel').trigger('prev');

			thisCarousel.swipe(
			{
				swipeLeft: function(event, direction, distance, duration, fingerCount) {
					thisCarousel.trigger('next');
				},
				swipeRight: function(event, direction, distance, duration, fingerCount) {
					thisCarousel.trigger('prev');
				},
				tap: function(event, target) {
					$(target).parent().trigger('click');
				},

				allowPageScroll: 'vertical',
				excludedElements: "button, input, select, textarea, .noSwipe"
			});
		});

		carouselInitialised = true;
	}
}
/*--------------*/
/* END Carousel */
/*--------------*/

function setCarouselHeight() {
	"use strict";

	var slideHeight = $('.masthead-slide').height();
	$('.masthead-container').height(slideHeight);
}

/*-----------------------------------*/
/* Get the offset of accordion panel */
/*-----------------------------------*/
function accordionOffset() {
	"use strict";

	if ($('.tabAccordionContainer').length) {
		var accordionOffset = $('.tabAccordionContainer').offset();
		accordionOffsetTop = parseInt(accordionOffset.top);
	}
}


function carouselTabWidth() {
	"use strict";

	if ($('table.masthead-pagination').length) {
		var td = $('table.masthead-pagination td');
		var tdWidth = 100 / td.length;

		$(td).css({'width':''+tdWidth+'%'});
	}
}

/*------------------------------------------------------*/
/* Custom lazy load										*/
/* Find all lazy load images, swap src, make opacity 0	*/
/* Animate fade in										*/
/*------------------------------------------------------*/

//***lazyload removal***
function forceLazyLoad(position) {
	"use strict";

	$(".tabPanelContainer .tabPanel:eq(" + position + ") img.noLazy").each(function() {
		var $this = $(this);
		if (!$this.hasClass("loaded")) {
			$this.addClass("loaded");
			var origImg = $this.attr("data-original");

			$this.css({"opacity":"0"}).attr("src", origImg);

			$this.animate({"opacity":"1"});
		}
	});
}
/*----------------------*/
/* END Custom lazy load */
/*----------------------*/

function listenForEscKey() {
	"use strict";

	$("input:text, input.password, input.numberCheck, input.emailCheck, textarea").on("keydown", function(event) {
		if (event.keyCode === 27) {
			$(this).val('');
		}
	});
}

function createNewPasswordInput(attrList) {
	"use strict";

	var htmlString = "<input ";

	$.each(attrList, function(key, value) { 
		htmlString += key + "=\"" + value + "\" ";
	});

	htmlString += ">";
	return htmlString;
}

function inputFocus() {
	"use strict";

	$(".gt-ie7 input:text, .gt-ie7 input:password, .gt-ie7 input.numberCheck, .gt-ie7 input.emailCheck, .gt-ie7 textarea").on("focus", function() {
		var $this = $(this);
		$this.siblings(".clearIcon").show();
		$this.siblings(".passwordIcon").addClass("movePasswordIcon");
	});
}

function inputBlur() {
	"use strict";

	$(".gt-ie7 input:text, .gt-ie7 input:password, .gt-ie7 input.numberCheck, .gt-ie7 input.emailCheck, .gt-ie7 textarea").on("blur", function() {
		var $this = $(this);
		if ($this.val() === "") {
			$this.siblings(".clearIcon").hide();
			$this.siblings(".passwordIcon").removeClass("movePasswordIcon");
		}
	});
}

function checkKeycode(event) {
	"use strict";

	/*TRIGGER LIST*/
	if ((!event.shiftKey && !event.ctrlKey && !event.altKey) &&  ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
		return;
	} else if (event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 35 || event.keyCode === 36 || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 46) {
		/*IGNORE LIST - If its one of these keys, just ignore it*/
		return;
	} else if (event.keyCode === 27) {
		//RESET THE INPUT TO BLANK
		$(inputObject).val('');
	} else {
		/*PREVENT LIST - else, its not ignorable, or a number, therefore we don't want it*/
		event.preventDefault();
	}
}

function getSideBranch(elem) {
	//LI parent of clicked A is passed
	"use strict";

	var thisChildLists = $(elem).find('ul');  //get all child UL's in every sub level in this LI branch
	var thisChildLinks = thisChildLists.find('a.showHideIcon');  //get all A's in every sub level that can be expanded
	var thisChildLinksActive = thisChildLists.find('li.activeMenuLink');  //get all A's in every sub level that can be expanded

	return {'thisChildLists': thisChildLists, 'thisChildLinks': thisChildLinks, 'thisChildLinksActive':thisChildLinksActive};
}

function closeSideBranch(branch) {
	"use strict";

	$(branch.thisChildLists).hide();  //Hide all the UL's at every sub level
	$(branch.thisChildLinks).parent().parent().removeClass('open');  //remove "open" class from all open LI's
}

function showMegaMenu() {
	//"use strict";

	$(this).addClass("hover");
}

function hideMegaMenu() {
	//"use strict";

	$(this).removeClass("hover");
}

function initialiseVideos(container) {
	container = container || ".mainContentContainer";
	var videoNotSelector;

	if (container == ".mainContentContainer") {
		videoNotSelector = "#course-profile .video, .tabPanelWrapper .video";
	} else {
		videoNotSelector = "#course-profile .video";
	}

	$(container + " .video.single").not(videoNotSelector).each(function() {
		var $this = $(this);
		$this.find(".loading").show();
		var containerId = $this.prop("id");
		var videoSource = $this.attr("data-videosource");
		var videoId = $this.attr("data-videoid");
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

		var width;
		var height;
		var primaryVideoType = "html5";
		var jwPlayerInstance;

		if ($("html").hasClass("ie7")) {
			width = 640;
			height = 360;
		} else {
			width = "100%";
			height = 0;
		}

		if (videoSource === "YouTube") {
			jwPlayerInstance = jwplayer(containerId).setup({
				"id": containerId,
				width: width,
				aspectratio: "16:9",
//				"stretching": "fill",
				"image": poster,
				file: "http://www.youtube.com/watch?v=" + videoId,
				title: videoTitle,
				sharing: {
					heading: "Share video"
				}
			});

			jwPlayerInstance.on("ready", function() {
				$("#" + containerId).addClass("youtube");
			});
		} else if (videoSource === "Video Portal") {
			jwPlayerInstance = jwplayer(containerId).setup({
				"id": containerId,
				width: width,
				aspectratio: "16:9",
//				"stretching": "fill",
				"image": poster,
				file: videoUrl,
				title: videoTitle,
				sharing: {
					heading: "Share video"
				},
				"tracks": tracks
			});

			jwPlayerInstance.on("ready", function() {
				$("#" + containerId).addClass("videoportal");
			});
		} else {
			if (firefox41Plus) {
				primaryVideoType = "flash";
			}

			jwPlayerInstance = jwplayer(containerId).setup({
				"id": containerId,
				width: width,
				aspectratio: "16:9",
//				"stretching": "uniform",
//				"stretching": "none",
//				"stretching": "exactfit",
//				"stretching": "fill",
				"image": poster,
				file: "http://helix.stream.manchester.ac.uk/flash/" + videoId + "_hi.mp4",
				primary: primaryVideoType,
				preload: "metadata",
				sharing: {
					heading: "Share video"
				}
			});
		}
	});

	$(container + " .video.playlist").not(videoNotSelector).each(function() {
		var $this = $(this);
		$this.find(".loading").show();
		$this.next(".videoPlaylistNavWrapper").show();
		var playlistId = $this.attr("data-playlistid");
		var playlistContainsUniversityVideo = $this.attr("data-containsuniversityvideo");
		var aspectRatio = $this.attr("data-aspectratio");
		var stretching = $this.attr("data-stretching");
		var primaryVideoType = "html5";

		if (firefox41Plus && playlistContainsUniversityVideo === "true") {
			primaryVideoType = "flash";
		}

		var jwPlayerInstance = jwplayer(this).setup({
			playlist: window["videoPlaylist" + playlistId],
			visualplaylist: false,
			width: "100%",
			aspectratio: aspectRatio,
//			stretching: stretching,
			primary: primaryVideoType,
			preload: "metadata",
//			controls: false,
//			displaytitle: true,
//			displaydescription: true,
			sharing: {
				heading: "Share video"
			}
		});

		var playlistScroll;

		jwPlayerInstance.on("ready", function() {
			var playlist = jwPlayerInstance.getPlaylist();
			var playlistHtml = "";

			for (var index = 0; index < playlist.length; index++) {
				playlistHtml += "<li";

				playlistHtml += "><a href=\"#\" onclick=\"return false\" data-playlistid=\"" + playlistId + "\" data-index=\"" + index + "\"><img src=\"" + playlist[index].image + "\" alt=\"\" /><div><p class=\"title\">" + playlist[index].title + "</p>";

				if (playlist[index].description !== undefined) {
					playlistHtml += "<p class=\"description\">" + playlist[index].description + "</p>";
				}

				playlistHtml += "</div></a></li>";
			}

			$("#videoPlaylist" + playlistId + "Nav").append(playlistHtml);

			// Insert a little delay in introducing iScroll to allow the browser to finish updating the DOM. This only seems to be necessary for Firefox, but it won't negatively affect the experience in any browser.
			setTimeout(function() {
				playlistScroll = new IScroll("#videoPlaylist" + playlistId + "NavWrapper", {
					scrollbars: true,
					interactiveScrollbars: true,
					mouseWheel: true,
					tap: true
				});
			}, 300);

			$("#videoPlaylist" + playlistId + "NavWrapper a").on("tap", function(event) {
				var $this = $(this);
//				event.preventDefault();
				playThis("videoPlaylist" + $this.attr("data-playlistid"), $this.attr("data-index"));
//				playlistScroll.scrollToElement(this, 500);
			});
		});

		jwPlayerInstance.on("playlistItem", function(playlistItem) {
			if (playlistItem.item.file.indexOf("youtube") === -1) {
				$(".jwplayer").removeClass("youtube");
			} else {
				$(".jwplayer").addClass("youtube");
			}

			$("#videoPlaylist" + playlistId + "Nav li").removeClass("current");
			$("#videoPlaylist" + playlistId + "Nav li").eq(jwPlayerInstance.getPlaylistIndex()).addClass("current");
			playlistScroll.refresh();
			playlistScroll.scrollToElement(document.querySelector("#videoPlaylist" + playlistId + "Nav li:nth-child(" + (jwPlayerInstance.getPlaylistIndex() + 1) + ")"), 1000);
		});
	});
}

function playThis(videoPlayerId, videoIndex) {
	var jwPlayerInstance = jwplayer(videoPlayerId);
	jwPlayerInstance.playlistItem(parseInt(videoIndex));
}

function initialiseAudio(container) {
	container = container || ".mainContentContainer";
	var audioNotSelector;

	if (container == ".mainContentContainer") {
		audioNotSelector = "#course-profile .audio, .tabPanelWrapper .audio";
	} else {
		audioNotSelector = "#course-profile .audio";
	}

	$(container + " .audio").not(audioNotSelector).each(function() {
		var $this = $(this);
		$this.find(".loading").show();
		var containerId = $this.prop("id");
		var audioUrl = $this.attr("data-audiourl");
		var audioTitle = $this.attr("data-audiotitle");
		var jwPlayerInstance = jwplayer(containerId).setup({
			"id": containerId,
			width: "100%",
			height: 40,
			aspectratio: "",
			file: audioUrl,
			title: audioTitle
		});

		jwPlayerInstance.on("ready", function() {
			$("#" + containerId).addClass("videoportal");
		});			
	});
}