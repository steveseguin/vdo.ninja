$("body").append('<style id="lightbox-animations" type="text/css"></style>');
$(".column").on('click', function() {
	if ($(this).hasClass("skip-animation")){
		return;
	}

	const bounding_box = $(this).get(0).getBoundingClientRect();
	$(this).css({ top: `${bounding_box.top}px`, left: `${bounding_box.left - 20}px` });
	$(this).addClass('in-animation').removeClass('pointer');
	$("#empty-container").remove();
	$('<div id="empty-container" class="column"></div>').insertAfter(this);
	
	const styles = `
		@keyframes outlightbox {
			0% {
				height: 100%;
				width: 100%;
				top: 0px;
				left: 0px;
			}

			50% {
				height: 200px;
				top: ${bounding_box.y}px;
			}

			100% {
				height: 200px;
				width: ${bounding_box.width}px;
				top: ${bounding_box.y}px;
				left: ${bounding_box.x}px;
			}
		}
	`;

	$("#lightbox-animations").empty();
	$("#lightbox-animations").get(0).sheet.insertRule(styles, 0);
	$("body").css('overflow', 'hidden');
});

$(".close").on('click', function(e) {
	$(this).hide();
	$(".container-inner").hide();
	$("body").css('overflow', 'auto');

	const bounding_box = $(this).parent().get(0).getBoundingClientRect();
	$(this).parent().css({ top: `${bounding_box.top}px`, left: `${bounding_box.left}px` });
	$(this).parent().addClass('out-animation');
	cleanupMediaTracks(); 
	e.stopPropagation();
});

$(".column").on('animationend', function(e){
	if (e.originalEvent.animationName === 'inlightbox') {
		$(this).children(".close").show();
		$(this).children(".container-inner").show();
	}
	else if (e.originalEvent.animationName === 'outlightbox') {
		$(this).removeClass('in-animation').removeClass('out-animation').removeClass('columnfade').addClass('pointer');
		$("#empty-container").remove();
		$("#lightbox-animations").get(0).sheet.deleteRule(0);
	}
});


$('#audioSource').on('mousedown touchend focusin focusout', (_e) => {
		const state = $('#multiselect-trigger').data('state') || 0;
		if (state === 0) {
			$('#multiselect-trigger').data('state', '1').addClass('open').removeClass('closed');
			$('#multiselect-trigger').find('.chevron').removeClass('bottom');
			$('#multiselect-trigger').parent().find('.multiselect-contents').show();
			$('#multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();
			$('#multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();
		}
});

$('#audioSource3').on('mousedown touchend focusin focusout', (_e) => {
		const state = $('#multiselect-trigger3').attr('data-state') || 0;
		if (state === 0) {
			$('#multiselect-trigger3').attr('data-state', '1').addClass('open').removeClass('closed');
			$('#multiselect-trigger3').find('.chevron').removeClass('bottom');
			$('#multiselect-trigger3').parent().find('.multiselect-contents').show();
			$('#multiselect-trigger3').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();
			$('#multiselect-trigger3').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();
		}
});
 
$('#multiselect-trigger').on('mousedown touchend focusin focusout', function(e) {
    const state = $(this).data('state') || 0;
    if( state === 0 ) {
        // open the dropdown
        $(this).data('state', '1').addClass('open').removeClass('closed');
        $(this).find('.chevron').removeClass('bottom');
        $(this).parent().find('.multiselect-contents').show();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').show();
    } else {
        // close the dropdown
        $(this).data('state', '0').addClass('closed').removeClass('open');
        $(this).find('.chevron').addClass('bottom');
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').not(":checked").parent().hide();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').hide();
    } 
    e.preventDefault();
});
// multiselect dropdowns
$('#multiselect-trigger3').on('mousedown touchend focusin focusout', function(e) {
    const state = $(this).attr('data-state') || 0;
	
    if(state === 0) {
        // open the dropdown
		errorlog(`STATE: ${state}`);
        $(this).attr('data-state', '1').addClass('open').removeClass('closed');
        $(this).find('.chevron').removeClass('bottom');
        $(this).parent().find('.multiselect-contents').show();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').show();
    } else {
        // close the dropdown
        $(this).attr('data-state', '0').addClass('closed').removeClass('open');
        $(this).find('.chevron').addClass('bottom');
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').not(":checked").parent().hide();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').hide();
    } 
    e.preventDefault();
});
