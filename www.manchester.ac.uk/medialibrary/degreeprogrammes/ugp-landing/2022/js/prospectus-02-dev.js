$(document).ready(function() {
	"use strict";

	$(".breadcrumbNav a.on-page").on("click tap", function(e) {
		var $this = $(this);
		var destinationId = $this.attr("href").substr(1).replace("d.en.", "");
		e.preventDefault();

		const targetElement = document.getElementById("d.en." + destinationId);
		targetElement.focus({ preventScroll: true });

		$("html, body").animate({
			scrollTop: $("#d\\.en\\." + destinationId).offset().top
		}, 500, function() {});
	});
/*
	$(".prospectus-cg-form input, .prospectus-cg-form select").each(function() {
		if ($(this).val() !== "") {
			$(this).addClass("filled").parents(".form-group").addClass("focused");
		}
	});
*/
	$(".prospectus-cg-form input, .prospectus-cg-form select").on("focus", function() {
		$(this).parents(".form-group").addClass("focused");
	});

	$(".prospectus-cg-form input, .prospectus-cg-form select").on("blur", function() {
		var $this = $(this);
		var inputValue = $this.val();

		if (inputValue == "") {
			$this.removeClass("filled");
			$this.parents(".form-group").removeClass("focused");
		} else {
			$this.addClass("filled");
		}
	});

	$(".course-search input").each(function() {
		var $this = $(this);
		if ($this.val() !== "") $this.addClass("filled").parents(".field-container").addClass("focused");
	});

	$(".course-search input").on("keyup", function() {
		$(this).removeClass("error");
	});

	$(".course-search input").on("focus", function() {
		$(this).parents(".field-container").addClass("focused");
	});

	$(".course-search input").on("blur", function() {
		var $this = $(this);
		var inputValue = $this.val();

		if (inputValue == "") {
			$this.removeClass("filled").addClass("error");
			$this.parents(".field-container").removeClass("focused");
		} else {
			$this.addClass("filled");
		}
	});

	$(".course-search").on("submit", function() {
		var $this = $(this);
		var $keywords = $this.find("input[name='k']");

		if ($keywords.val() == "") {
			//$this.find("p.error").show();
			$keywords.addClass("error").focus();
			//$keywords.attr("aria-describedby", $keywords.prop("id") + "-error");
			return false;
		}
	});
});

$(window).on("load", function() {
	"use strict";

	$(".prospectus-cg-form .form-group input, .prospectus-cg-form .form-group select").each(function() {
		var $this = $(this);

		if ($this.val() !== "") {
			$this.addClass("filled").parents(".form-group").addClass("focused");
		}
	});

	$(".course-search input").each(function() {
		var $this = $(this);

		if ($this.val() !== "") {
			$this.addClass("filled").parents(".field-container").addClass("focused");
		}
	});
});