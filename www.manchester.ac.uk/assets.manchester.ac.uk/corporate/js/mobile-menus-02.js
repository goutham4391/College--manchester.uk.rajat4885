/* GLOBAL VARS */
var viewportHeight;
var viewportWidth;

var oldIE;

var html;
var body;

var resetMenu;
var resetSharingMenu;

var onlyOneBranch;

var mobileIcon;
var sharingIcon;
var menuShowHide;
var sharingMenuShowHide;
var contentContainer;
var movableOject;
var movableObject2;

/* Mobile menu animate fallback */
var moveOpen = { "right": "0px" };
var moveClose = { "right": "-1000px" };

var documentClickFlag = false;
var submenuClickFlag = false;
var preventClickFlag = false;
var mobileMenuOpen = false;
var sharingMenuOpen = false;

/* GLOBAL FUNCTIONS */
function closeMobileMenu() {
	"use strict";

	$(mobileIcon).removeClass("active");
	$(".closeOverlay").removeClass("moveOver");

	/* Move the object using the most appropriate method */
	if (Modernizr.csstransitions) {
		$(movableOject).removeClass("moveOver").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
			resetMobileMenu();
		});
	} else {
		$(movableOject).animate(moveClose, function() {
			resetMobileMenu();
		});
	}

	/* enable scrolling on document */
	/* setTimeout for Firefox bug */
	setTimeout(function() {
		$(html).removeClass("noScroll");
		$(body).removeClass("noScroll");
	},25);

	setTimeout(function() {
		mobileMenuOpen = false;
		$(":input").prop("disabled", false);
	},1000);
}

function closeSharingMenu() {
	"use strict";

	$(sharingIcon).removeClass("active");
	$(".closeOverlay").removeClass("moveOver");

	/* Move the object using the most appropriate method */
	if (Modernizr.csstransitions) {
		$(movableObject2).removeClass("moveOver").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
			resetSharingMenu();
		});
	} else {
		$(movableObject2).animate(moveClose, function() {
			resetSharingMenu();
		});
	}

	/* enable scrolling on document */
	/* setTimeout for Firefox bug */
	setTimeout(function() {
		$(html).removeClass("noScroll");
		$(body).removeClass("noScroll");
	},25);

	setTimeout(function() {
		sharingMenuOpen = false;
		$(":input").prop("disabled", false);
	},1000);
}

/* Reset ALL branches to closed when menu is closed */
function resetMobileMenu() {
	"use strict";

	if (resetMenu) {
		var openLI = $("#mobile-menu-container li.open");

		$(openLI).removeClass("open");
		$(openLI).find("a.showHideIcon").text("+").removeClass("active");

		var branch = getBranch(openLI);
		closeBranch(branch);  //close all the child branches
		refreshMenuSize();  //recalc iScroll limits
	}
}		

function resetSharingMenu() {
	"use strict";

	if (resetSharingMenu) {
		var openLI = $("#sharing-menu-container li.open");

		$(openLI).removeClass("open");
		$(openLI).find("a.showHideIcon").text("+").removeClass("active");

		var branch = getBranch(openLI);
		closeBranch(branch);  //close all the child branches
		refreshMenuSize();  //recalc iScroll limits
	}
}		

/* iScroll plugin recalc menu height */
function refreshMenuSize() {
	"use strict";

	if (!oldIE) {
		//only do this if it's IE9+
		refreshMenu();  //recalc iScroll limits
	}
}

/* Collapse menu functions */
function getBranch(elem) {
	//LI parent of clicked A is passed
	"use strict";

	var thisChildLists = $(elem).find("ul");  //get all child UL's in every sub level in this LI branch
	var thisChildLinks = thisChildLists.find("a.showHideIcon");  //get all A's in every sub level that can be expanded
	var thisChildLinksActive = thisChildLists.find("li.activeMenuLink");  //get the current active link

	return {"thisChildLists": thisChildLists, "thisChildLinks": thisChildLinks, "thisChildLinksActive":thisChildLinksActive};
}

function closeBranch(branch) {
	"use strict";

	$(branch.thisChildLists).hide();  //Hide all the UL's at every sub level
	$(branch.thisChildLinks).parent().removeClass("open");  //remove "open" class from all open LI's
	$(branch.thisChildLinks).text("+").removeClass("active");  //reset "-" back to "+" for all expand A's in this branch

	/* - This removes the active class from the menu when collapsing branches
	$(branch.thisChildLinksActive).removeClass("activeMenuLink")
	*/
}

document.addEventListener("click", function(e) {
	"use strict";

	if ($(e.target).parents("#mobile-menu-container").length === 0 && mobileMenuOpen) {
        e.preventDefault();
        e.stopPropagation();
        return false;
	}
});

document.addEventListener("click", function(e) {
	"use strict";

	if ($(e.target).parents("#sharing-menu-container").length === 0 && sharingMenuOpen) {
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
	resetMenu = false; 		//true = all open branches will be reset | false = menu will open in same state as it was closed
	onlyOneBranch = true;	//true = allow only one branch open | false = allow multiple branches open

	mobileIcon = $(".mobile-menu-icon");
	menuShowHide = $("#mobile-menu-container a.showHideIcon");
	contentContainer = $(".pageWrapper");
	movableOject = $("#mobile-menu-container");

	sharingIcon = $(".share-icon");
	sharingMenuShowHide = $("#sharing-menu-container a.showHideIcon");
	movableObject2 = $("#sharing-menu-container");

	viewportWidth = viewportSize.getWidth();  //get the true viewport height

	/*-----------------*/
	/* Side slide menu */
	/*-----------------*/			
	$(".closeMenuLink, .closeOverlay").on("click tap", function(e) {
		e.preventDefault();
		closeMobileMenu();
		return false;
	});

	$(".closeSharingMenuLink, .closeOverlay").on("click tap", function(e) {
		e.preventDefault();
		closeSharingMenu();
		return false;
	});

	$(mobileIcon).click(function(e) {
		e.preventDefault();

		if (!$(this).hasClass("active") && !mobileMenuOpen) {
			$(":input").prop("disabled", true);

			$(this).addClass("active");

			/* Move the content over using the most appropriate method */
			if (Modernizr.csstransitions) {
				$(movableOject).addClass("moveOver");
			} else {
				$(movableOject).animate(moveOpen, 100);
			}

			// If not on the home page then scroll the menu accordingly.
			if ($("#mobile-menu-container .breadcrumbItem").length > 0 && $("#mobile-menu-container").hasClass("initial")) {
				if ($("#mobile-menu-container span").length > 0) {
					// If the current page does not have a sub-menu then scroll the menu so that the current page is vertically centred.
					myScroll.scrollToElement(document.querySelector("#mobile-menu-container span"), 500, true, true);
				} else {
					// If the current page has a sub-menu <ul> then scroll the menu so that the current page is at the top.
					myScroll.scrollToElement(document.querySelector("#mobile-menu-container .sectionHeader"), 500);
				}
			}

			/* Prevent scrolling */
			/* setTimeout to fix FF bug where change in overflow of parent prevents child transition animation */
			setTimeout(function() {
				$(html).addClass("noScroll");
				$(body).addClass("noScroll");
				$(".closeOverlay").addClass("moveOver");
				$(".closeOverlay").css({"width": viewportWidth - 270});
			},25);

			mobileMenuOpen = true;
		} else {
			closeMobileMenu();
		}

		return false;
	});

	$(sharingIcon).click(function(e) {
		e.preventDefault();

		if (!$(this).hasClass("active") && !sharingMenuOpen) {
			$(":input").prop("disabled", true);

			$(this).addClass("active");

			/* Move the content over using the most appropriate method */
			if (Modernizr.csstransitions) {
				$(movableObject2).addClass("moveOver");
			} else {
				$(movableObject2).animate(moveOpen, 100);
			}

			/* Prevent scrolling */
			/* setTimeout to fix FF bug where change in overflow of parent prevents child transition animation */
			setTimeout(function() {
				$(html).addClass("noScroll");
				$(body).addClass("noScroll");
				$(".closeOverlay").addClass("moveOver");
				$(".closeOverlay").css({"width": viewportWidth - 270});
			},25);

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
		closeMobileMenu();
		closeSharingMenu();
	});

	$(window).on("resize", function() {
		viewportWidth = viewportSize.getWidth();  //get the true viewport height
		$(".closeOverlay").css({"width": viewportWidth - 270});
	});

	if ($("#mobile-menu-container .thisPage").length === 1) {
		$("#mobile-menu-container .thisPage").parents("li").andSelf().each(function() {
			$(this).children("a.showHideIcon").text("-").addClass("active");
			$(this).addClass("open").find("ul:eq(0)").show();
		});

		refreshMenuSize();
	}

	$("#mobile-menu-container, #sharing-menu-container").addClass("initial");
});