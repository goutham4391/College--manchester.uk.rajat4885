$(document).ready(function() {
	"use strict";

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

		$(".tabs-container .tab", this).click(function(event) {
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