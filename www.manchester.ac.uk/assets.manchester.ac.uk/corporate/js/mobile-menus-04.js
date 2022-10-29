/* GLOBAL VARS */
var viewportHeight;
var viewportWidth;

var oldIE;

var html;
var body;

var resetMenu;
var resetMenuSharing;

var mobileMenuOpen = false;
var sharingMenuOpen = false;

var onlyOneBranch;

var mobileIcon;
var sharingIcon;
var contentContainer;
var movableOject;
var movableObject2;

/* Mobile menu animate fallback */
var moveOpen = { "right": "0px" };
var moveClose = { "right": "-1000px" };

var documentClickFlag = false;
var submenuClickFlag = false;
var preventClickFlag = false;

var firstFocusableEl;
var lastFocusableEl;

// GLOBAL FUNCTIONS
function menuEventListener(e) {
	"use strict";

	var KEYCODE_TAB = 9;
	var isTabPressed = (e.key === "Tab" || e.keyCode === KEYCODE_TAB);

	if (!isTabPressed) {
		return;
	}

	if (e.shiftKey) {
		// shift + tab
		if (document.activeElement === firstFocusableEl) {
			lastFocusableEl.focus();
			e.preventDefault();
		}
	} else {
		// tab
		if (document.activeElement === lastFocusableEl) {
			firstFocusableEl.focus();
			e.preventDefault();
		}
	}
}

function addFocusTrap(element, focusElement = null) {
	var focusableEls = element.querySelectorAll("a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type='text']:not([disabled]), input[type='radio']:not([disabled]), input[type='checkbox']:not([disabled]), select:not([disabled])");
	firstFocusableEl = focusableEls[0];

	if (focusElement != null) {
		document.querySelector(focusElement + " a").focus();
	} else {
		firstFocusableEl.focus();
	}

	lastFocusableEl = focusableEls[focusableEls.length - 1];

	element.addEventListener("keydown", menuEventListener);
}

function removeFocusTrap(element) {
	"use strict";

	element.removeEventListener("keydown", menuEventListener);
}

function closeMobileMenu(focusMenuButton = false) {
	$("#mobile-menu-container a, #mobile-menu-container button").attr("tabindex", "-1");
	$(mobileIcon).removeClass("active").attr("aria-expanded", "false");
	$(".closeOverlay").removeClass("moveOver");

	// Move the object using the most appropriate method
	if (Modernizr.csstransitions) {
		$(movableOject).removeClass("moveOver").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
			resetMobileMenu();
		});
	} else {
		$(movableOject).animate(moveClose, function() {
			resetMobileMenu();
		});
	}

	mobileMenuOpen = false;

	// enable scrolling on document
	// setTimeout for Firefox bug
	setTimeout(function() {
		$(html).removeClass("noScroll");
		$(body).removeClass("noScroll");
	},25);

	setTimeout(function() {
		$(".menu-search-icons > button").prop("disabled", false);
		if ($(".secondMenuBar").hasClass("slideSecondMenu")) $(".secondMenuBar button").prop("disabled", false);
		if (focusMenuButton && $("#mobile-menu-container").attr("data-openedby") == "top") $(".headerContent .mobile-menu-icon").trigger("focus");
	},100);

	setTimeout(function() {
		$(":input").not("button.mobile-menu-icon").not("button.search-icon").not("button.share-icon").not("button.closeMenuLink").not("button.closeSharingMenuLink").not(".secondMenuBar button").prop("disabled", false);
	},500);

	// Remove focus trap for mobile menu
	const mobileMenu = document.querySelector("#mobile-menu-container > ul");
	removeFocusTrap(mobileMenu);
}

function closeSharingMenu(focusMenuButton = false) {
	$("#sharing-menu-container a, #sharing-menu-container button").attr("tabindex", "-1");
	$(sharingIcon).removeClass("active").attr("aria-expanded", "false");
	$(".closeOverlay").removeClass("moveOver");

	// Move the object using the most appropriate method
	if (Modernizr.csstransitions) {
		$(movableObject2).removeClass("moveOver").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
			resetSharingMenu();
		});
	} else {
		$(movableObject2).animate(moveClose, function() {
			resetSharingMenu();
		});
	}

	sharingMenuOpen = false;

	// enable scrolling on document
	// setTimeout for Firefox bug
	setTimeout(function() {
		$(html).removeClass("noScroll");
		$(body).removeClass("noScroll");
	},25);

	setTimeout(function() {
		$(".menu-search-icons > button").prop("disabled", false);
		if ($(".secondMenuBar").hasClass("slideSecondMenu")) $(".secondMenuBar button").prop("disabled", false);
		if (focusMenuButton && $("#sharing-menu-container").attr("data-openedby") == "top") $(".headerContent .share-icon").trigger("focus");
	},100);

	setTimeout(function() {
		$(":input").not("button.mobile-menu-icon").not("button.search-icon").not("button.share-icon").not("button.closeMenuLink").not("button.closeSharingMenuLink").not(".secondMenuBar button").prop("disabled", false);
	},500);

	// Remove focus trap for sharing menu
	const sharingMenu = document.querySelector("#sharing-menu-container > ul");
	removeFocusTrap(sharingMenu);
}

// Reset ALL branches to closed when menu is closed
function resetMobileMenu() {
	"use strict";

	if (resetMenu) {
		var openLI = $("#mobile-menu-container li.open");

		$(openLI).removeClass("open");
		$(openLI).find("a.showHideIcon").text("+").removeClass("active");

		var branch = getBranch(openLI);
		closeBranch(branch); // close all the child branches
		refreshMenuSize(); // recalc iScroll limits
	}
}		

function resetSharingMenu() {
	"use strict";

	if (resetMenuSharing) {
		var openLI = $("#sharing-menu-container li.open");

		$(openLI).removeClass("open");
		$(openLI).find("a.showHideIcon").text("+").removeClass("active");

		var branch = getBranch(openLI);
		closeBranch(branch); //close all the child branches
		refreshMenuSize(); //recalc iScroll limits
	}
}		

// iScroll plugin recalc menu height
function refreshMenuSize() {
	"use strict";

	if (!oldIE) {
		//only do this if it's IE9+
		refreshMenu();  //recalc iScroll limits
	}
}

// Collapse menu functions
function getBranch(elem) {
	// LI parent of clicked A is passed
	"use strict";

	var thisChildLists = $(elem).find("ul"); // get all child UL's in every sub level in this LI branch
	var thisChildLinks = thisChildLists.find("a.showHideIcon"); // get all A's in every sub level that can be expanded
	var thisChildLinksActive = thisChildLists.find("li.activeMenuLink"); // get the current active link

	return {"thisChildLists": thisChildLists, "thisChildLinks": thisChildLinks, "thisChildLinksActive":thisChildLinksActive};
}

function closeBranch(branch) {
	"use strict";

	$(branch.thisChildLists).hide(); // Hide all the UL's at every sub level
	$(branch.thisChildLinks).parent().removeClass("open"); // remove "open" class from all open LI's
	$(branch.thisChildLinks).text("+").removeClass("active"); // reset "-" back to "+" for all expand A's in this branch

	/* - This removes the active class from the menu when collapsing branches
	$(branch.thisChildLinksActive).removeClass("activeMenuLink")
	*/
}

document.addEventListener("click", function(e) {
	"use strict";

	if (($(e.target).parents("#mobile-menu-container").length === 0 && mobileMenuOpen) || ($(e.target).parents("#sharing-menu-container").length === 0 && sharingMenuOpen)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
	}
});

$(document).ready(function() {
	"use strict";

	if ($("html").hasClass("lt-ie9")) {
		oldIE = true;
	}

	html = $("html");
	body = $("body");

	/* Mobile Menu vars */
	resetMenu = false;		// true = all open branches will be reset | false = menu will open in same state as it was closed
	onlyOneBranch = true;	// true = allow only one branch open | false = allow multiple branches open

	mobileIcon = $(".mobile-menu-icon");
	//menuShowHide = $("#mobile-menu-container a.showHideIcon");
	contentContainer = $(".pageWrapper");
	movableOject = $("#mobile-menu-container");

	sharingIcon = $(".share-icon");
	movableObject2 = $("#sharing-menu-container");

	viewportWidth = viewportSize.getWidth(); // get the true viewport height

	/*------------------------------------*/
	/* Scroll - show secondary menu icon  */
	/*------------------------------------*/

	var currentScroll = 0;
	var previousScroll = 0;
	var scrollThreshold = 500;
	var android3Plus = false;

	// Check for specific threshold of Android
	if (ua.indexOf("Android") >= 0) {
		var androidversion = parseFloat(ua.slice(ua.indexOf("Android") + 8)); 

		if (androidversion > 3) {
			android3Plus = true;
		}
	}

	// JS Detect mobile platforms
	var isMobile = {
		BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
		iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
		Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
		Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
		any: function() { return (isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};
	// END JS Detect mobile platforms
			
	$(window).on("scroll", function() {
		currentScroll = $(this).scrollTop();

		if (isMobile.any() || android3Plus) {
			if (currentScroll > scrollThreshold) {
				// threshold has been reached - can we show the menu?

				if (currentScroll > previousScroll) {
					// we are scrolling down, HIDE the menu
					$(".secondMenuBar").removeClass("slideSecondMenu").find("button").prop("disabled", true);
				} else {
					//we are scrolling up, SHOW the menu
					$(".secondMenuBar").addClass("slideSecondMenu").find("button").prop("disabled", false);
				}

				previousScroll = currentScroll;
			} else {
				// we are lower than threshold, HIDE the menu
				$(".secondMenuBar").removeClass("slideSecondMenu").find("button").prop("disabled", true);
			}
		}
	});
	/*---------------------------------------*/
	/* END Scroll - show secondary menu icon */
	/*---------------------------------------*/

	/*-----------------*/
	/* Side slide menu */
	/*-----------------*/			
	$(".closeMenuLink").on("click tap", function() {
		closeMobileMenu();
	});

	$(".closeMenuLink").on("keydown", function(e) {
		if (e.keyCode == 13 || e.keyCode == 32) closeMobileMenu(true);
	});

	$(".closeSharingMenuLink").on("click tap", function() {
		closeSharingMenu();
	});

	$(".closeSharingMenuLink").on("keydown", function(e) {
		if (e.keyCode == 13 || e.keyCode == 32) closeSharingMenu(true);
	});

	$(".closeOverlay").on("click tap", function(e) {
		e.preventDefault();
		if (mobileMenuOpen) closeMobileMenu();
		if (sharingMenuOpen) closeSharingMenu();
		return false;
	});

	/*--------------*/
	/* SEARCH PANEL */
	/*--------------*/
	$(".search-icon").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);

		if (mobileMenuOpen) closeMobileMenu();
		if (sharingMenuOpen) closeSharingMenu();

		if ($this.attr("aria-expanded") == "false") {
			$(".search-options").slideDown(function() {
				$(".searchInputWrapper2 #searchBox").trigger("focus");
				$this.attr("aria-expanded", "true");
			});
		} else {
			$(".search-options").slideUp(function() {
				$this.attr("aria-expanded", "false");
			});
		}
	});
	/*------------------*/
	/* END SEARCH PANEL */
	/*------------------*/

	$(mobileIcon).on("click keydown", function(e) {
		let eventType = e.type;
		let focusElement = null;

		if (eventType == "keydown" && e.keyCode != 13 && e.keyCode != 32) return;

		e.preventDefault();

		if (!$(this).hasClass("active") && !mobileMenuOpen) {
			$("#mobile-menu-container a, #mobile-menu-container button").attr("tabindex", "0");
			$(":input").not("button.closeMenuLink").not("button.closeSharingMenuLink").prop("disabled", true);

			$(this).addClass("active").attr("aria-expanded", "true");
			$("#mobile-menu-container").attr("data-openedby", $(this).attr("data-position"));

			refreshMenu();

			// Move the content over using the most appropriate method
			if (Modernizr.csstransitions) {
				$(movableOject).addClass("moveOver");
			} else {
				$(movableOject).animate(moveOpen, 100);
			}

			if (eventType == "click") {
				// If not on the home page then scroll the menu accordingly.
				if ($("#mobile-menu-container .breadcrumbItem").length > 0 && $("#mobile-menu-container").hasClass("initial")) {
					if ($("#mobile-menu-container span").length > 0) {
						// If the current page does not have a sub-menu then scroll the menu so that the current page is vertically centred.
						setTimeout(function() {
							myScroll.scrollToElement(document.querySelector("#mobile-menu-container span"), 500, true, true);
						},25);
					} else {
						// If the current page has a sub-menu <ul> then scroll the menu so that the current page is at the top.
						setTimeout(function() {
							myScroll.scrollToElement(document.querySelector("#mobile-menu-container .sectionHeader"), 500);
						},25);
					}
				}
			} else {
				if ($("#mobile-menu-container .breadcrumbItem").length > 0 && $("#mobile-menu-container").hasClass("initial")) {
					myScroll.scrollToElement(document.querySelector("#mobile-menu-container"));
				}
			}

			// Prevent scrolling
			// setTimeout to fix FF bug where change in overflow of parent prevents child transition animation
			setTimeout(function() {
				$(html).addClass("noScroll");
				$(body).addClass("noScroll");
				$(".closeOverlay").addClass("moveOver");
				$(".closeOverlay").css({"width": viewportWidth - 270});
			},25);

			// Trap focus within the mobile menu when it's open
			const mobileMenu = document.querySelector("#mobile-menu-container > ul");
			addFocusTrap(mobileMenu, focusElement);

			mobileMenuOpen = true;
		} else {
			closeMobileMenu();
		}

		return false;
	});

	$(sharingIcon).on("click", function(e) {
		e.preventDefault();

		if (!$(this).hasClass("active") && !sharingMenuOpen) {
			$("#sharing-menu-container a, #sharing-menu-container button").attr("tabindex", "0");
			$(":input").not("button.closeMenuLink").not("button.closeSharingMenuLink").prop("disabled", true);
			$(this).addClass("active").attr("aria-expanded", "true");
			$("#sharing-menu-container").attr("data-openedby", $(this).attr("data-position"));

			// Move the content over using the most appropriate method
			if (Modernizr.csstransitions) {
				$(movableObject2).addClass("moveOver");
			} else {
				$(movableObject2).animate(moveOpen, 100);
			}

			// Prevent scrolling
			// setTimeout to fix FF bug where change in overflow of parent prevents child transition animation
			setTimeout(function() {
				$(html).addClass("noScroll");
				$(body).addClass("noScroll");
				$(".closeOverlay").addClass("moveOver");
				$(".closeOverlay").css({"width": viewportWidth - 270});
			},25);

			// Trap focus within the sharing menu when it's open
			const sharingMenu = document.querySelector("#sharing-menu-container > ul");
			addFocusTrap(sharingMenu);

			sharingMenuOpen = true;
		} else {
			closeSharingMenu();
		}

		return false;
	});
	/*---------------------*/
	/* END Side slide menu */
	/*---------------------*/
});

$(window).on("load", function() {
	"use strict";

	$(window).on("orientationchange", function() {
		if ($("#mobile-menu-container").hasClass("moveOver")) closeMobileMenu();
		if ($("#sharing-menu-container").hasClass("moveOver")) closeSharingMenu();
	});

	$(window).on("resize", function() {
		viewportWidth = viewportSize.getWidth(); // get the true viewport height
		$(".closeOverlay").css({"width": viewportWidth - 270});
	});

	$("#mobile-menu-container a, #mobile-menu-container button, #sharing-menu-container a, #sharing-menu-container button").attr("tabindex", "-1");
	$("#mobile-menu-container, #sharing-menu-container").addClass("initial");
});